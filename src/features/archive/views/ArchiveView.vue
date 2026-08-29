<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  entityTypeLabel,
  formatScore,
  groundingLabel,
  hopLabel,
  planKindLabel,
  type DocumentRow,
  type Evidence,
  type GraphSnapshot,
  type QueryResult,
} from '@/features/archive/malha/types'
import { ARCHIVE_PROMPTS, archiveClient, DEFAULT_WORKSPACE_SLUG } from '@/features/archive/api'
import AppButton from '@/shared/ui/AppButton.vue'
import ErrorBanner from '@/shared/ui/ErrorBanner.vue'

type TabId = 'consulta' | 'arquivo' | 'grafo'
type SynthesisTone = 'refused' | 'conflict' | 'ok'

const { t } = useI18n()

const tab = ref<TabId>('consulta')
const workspaceId = ref('')
const workspaceName = ref('')
const question = ref<string>(ARCHIVE_PROMPTS[0])
const hops = ref(1)
const result = ref<QueryResult | null>(null)
const selected = ref<Evidence | null>(null)
const documents = ref<DocumentRow[]>([])
const graph = ref<GraphSnapshot | null>(null)
const busy = ref(false)
const notice = ref<string | null>(null)
const bootError = ref<string | null>(null)

const tabs: TabId[] = ['consulta', 'arquivo', 'grafo']

const synthesisTone = computed((): SynthesisTone => {
  if (!result.value) return 'ok'
  if (result.value.answer.refused) return 'refused'
  if (result.value.verification.status === 'conflict') return 'conflict'
  return 'ok'
})

const graphLayout = computed(() => {
  const entities = graph.value?.entities.slice(0, 36) ?? []
  const width = 720
  const height = 420
  const cx = width / 2
  const cy = height / 2
  const radius = 170
  const nodes = entities.map((entity, index) => {
    const angle = (index / Math.max(entities.length, 1)) * Math.PI * 2 - Math.PI / 2
    return {
      ...entity,
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
    }
  })
  const byId = new Map(nodes.map((node) => [node.id, node]))
  const edges = (graph.value?.relations ?? [])
    .map((rel) => {
      const src = byId.get(rel.src)
      const dst = byId.get(rel.dst)
      if (!src || !dst) return null
      return { ...rel, src, dst }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
  return { nodes, edges, width, height }
})

async function bootstrap() {
  try {
    const list = await archiveClient.listWorkspaces()
    const preferred = list.find((item) => item.slug === DEFAULT_WORKSPACE_SLUG) ?? list[0]
    if (!preferred) {
      bootError.value = t('archive.errors.noWorkspace')
      return
    }
    workspaceId.value = preferred.slug
    workspaceName.value = preferred.name
  } catch (error) {
    bootError.value =
      error instanceof Error ? error.message : t('archive.errors.unavailable')
  }
}

async function refreshArchive(id: string) {
  try {
    documents.value = await archiveClient.listDocuments(id)
    if (tab.value === 'grafo') {
      graph.value = await archiveClient.fetchGraph(id)
    }
  } catch (error) {
    notice.value = error instanceof Error ? error.message : t('archive.errors.loadFailed')
  }
}

async function runQuery() {
  if (!workspaceId.value || !question.value.trim()) return
  busy.value = true
  notice.value = null
  try {
    const next = await archiveClient.queryWorkspace(
      workspaceId.value,
      question.value.trim(),
      hops.value,
    )
    result.value = next
    selected.value = next.evidence[0] ?? null
  } catch (error) {
    notice.value = error instanceof Error ? error.message : t('archive.errors.queryFailed')
  } finally {
    busy.value = false
  }
}

async function mark(label: 'useful' | 'wrong') {
  if (!workspaceId.value || !selected.value || !result.value) return
  await archiveClient.sendFeedback(
    workspaceId.value,
    selected.value.chunk_id,
    label,
    result.value.query_id,
  )
  notice.value =
    label === 'useful' ? t('archive.feedback.useful') : t('archive.feedback.wrong')
}

async function onUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file || !workspaceId.value) return
  busy.value = true
  try {
    await archiveClient.ingestFile(workspaceId.value, file)
    await refreshArchive(workspaceId.value)
    notice.value = t('archive.ingested', { name: file.name })
  } catch (error) {
    notice.value = error instanceof Error ? error.message : t('archive.errors.ingestFailed')
  } finally {
    busy.value = false
    input.value = ''
  }
}

async function onSeed() {
  if (!workspaceId.value) return
  busy.value = true
  try {
    await archiveClient.seedWorkspace(workspaceId.value)
    await refreshArchive(workspaceId.value)
    notice.value = t('archive.seeded')
  } finally {
    busy.value = false
  }
}

function selectEvidence(item: Evidence) {
  selected.value = item
}

function setTab(id: TabId) {
  tab.value = id
}

onMounted(() => {
  void bootstrap()
})

watch([workspaceId, tab], ([id]) => {
  if (id) void refreshArchive(id)
})
</script>

<template>
  <section v-if="bootError" class="archive-page">
    <header class="archive-page__head">
      <p class="archive-page__eyebrow">{{ t('archive.eyebrow') }}</p>
      <h1>{{ t('archive.title') }}</h1>
      <p class="archive-page__lead">{{ t('archive.lead') }}</p>
    </header>
    <ErrorBanner :message="bootError" />
    <p class="archive-page__hint">{{ t('archive.hint') }}</p>
  </section>

  <section v-else class="archive-page">
    <header class="archive-page__head">
      <p class="archive-page__eyebrow">{{ t('archive.eyebrow') }}</p>
      <h1>{{ t('archive.title') }}</h1>
      <p class="archive-page__lead">{{ t('archive.lead') }}</p>
      <div class="archive-page__meta">
        <span>{{ workspaceName }}</span>
        <span>{{ t('archive.documents', { count: documents.length }) }}</span>
      </div>
    </header>

    <nav class="archive-tabs" :aria-label="t('archive.sections')">
      <button
        v-for="id in tabs"
        :key="id"
        type="button"
        class="archive-tabs__btn"
        :class="{ 'archive-tabs__btn--active': tab === id }"
        @click="setTab(id)"
      >
        {{ t(`archive.tabs.${id}`) }}
      </button>
    </nav>

    <p v-if="notice" class="archive-notice">{{ notice }}</p>

    <div v-if="tab === 'consulta'" class="archive-split">
      <div class="archive-panel">
        <form class="archive-form" @submit.prevent="runQuery">
          <label for="archive-question">{{ t('archive.questionLabel') }}</label>
          <textarea id="archive-question" v-model="question" rows="3" />
          <div class="archive-form__tools">
            <label>
              <span>{{ t('archive.hops') }}</span>
              <input v-model.number="hops" type="number" min="0" max="3" />
            </label>
            <AppButton type="submit" :disabled="busy">
              {{ busy ? t('common.loading') : t('archive.submit') }}
            </AppButton>
          </div>
          <div class="archive-prompts">
            <button
              v-for="item in ARCHIVE_PROMPTS"
              :key="item"
              type="button"
              class="archive-prompts__chip"
              @click="question = item"
            >
              {{ item }}
            </button>
          </div>
        </form>

        <article v-if="result" class="archive-synthesis" :class="`archive-synthesis--${synthesisTone}`">
          <div class="archive-synthesis__head">
            <h2>{{ t(`archive.synthesis.${synthesisTone === 'ok' ? 'ok' : synthesisTone}`) }}</h2>
            <span class="archive-seal" :class="`archive-seal--${result.verification.status}`">
              {{ groundingLabel(result.verification.status) }}
            </span>
          </div>
          <ol v-if="result.plan.length > 0" class="archive-plan">
            <li v-for="step in result.plan" :key="step.id">
              <span>{{ planKindLabel(step.kind) }}</span>
              {{ step.objective }}
            </li>
          </ol>
          <p class="archive-synthesis__body">{{ result.answer.text }}</p>
          <p v-if="result.answer.refusal_reason" class="archive-synthesis__reason">
            {{ result.answer.refusal_reason }}
          </p>
          <ul v-if="result.verification.contradictions.length > 0" class="archive-conflicts">
            <li v-for="item in result.verification.contradictions" :key="`${item.left_chunk_id}-${item.right_chunk_id}`">
              <strong>{{ item.subject }}</strong>
              <span>{{ item.reason }}</span>
            </li>
          </ul>
        </article>
        <article v-else class="archive-synthesis archive-synthesis--idle">
          <h2>{{ t('archive.idleTitle') }}</h2>
          <p>{{ t('archive.idleBody') }}</p>
        </article>
      </div>

      <aside class="archive-evidence">
        <h2>{{ t('archive.evidenceTitle') }}</h2>
        <button
          v-for="(item, index) in result?.evidence ?? []"
          :key="item.chunk_id"
          type="button"
          class="archive-evidence__item"
          :class="{ 'archive-evidence__item--active': selected?.chunk_id === item.chunk_id }"
          @click="selectEvidence(item)"
        >
          <span class="archive-evidence__index">{{ String(index + 1).padStart(2, '0') }}</span>
          <span class="archive-evidence__title">{{ item.document_title }}</span>
          <span class="archive-evidence__score">
            {{
              t('archive.evidenceMeta', {
                score: formatScore(item.score),
                hop: hopLabel(item.hop),
                cited: result?.answer.cited_chunk_ids.includes(item.chunk_id) ? t('archive.cited') : '',
              })
            }}
          </span>
        </button>
        <div v-if="selected" class="archive-excerpt">
          <p class="archive-excerpt__source">
            {{ selected.source_path }} · {{ t('archive.ordinal', { n: selected.ordinal }) }}
          </p>
          <blockquote>{{ selected.excerpt }}</blockquote>
          <div class="archive-excerpt__marks">
            <AppButton variant="secondary" @click="mark('useful')">{{ t('archive.markUseful') }}</AppButton>
            <AppButton variant="secondary" @click="mark('wrong')">{{ t('archive.markWrong') }}</AppButton>
          </div>
        </div>
        <p v-else class="archive-empty">{{ t('archive.noEvidenceSelected') }}</p>
      </aside>
    </div>

    <section v-else-if="tab === 'arquivo'" class="archive-files">
      <div class="archive-files__tools">
        <label class="archive-files__upload">
          <span>{{ t('archive.uploadLabel') }}</span>
          <input
            type="file"
            accept=".pdf,.md,.markdown,.txt"
            :disabled="busy"
            @change="onUpload"
          />
        </label>
        <AppButton variant="secondary" :disabled="busy" @click="onSeed">
          {{ t('archive.seedCorpus') }}
        </AppButton>
      </div>
      <div class="archive-table-wrap">
        <table class="archive-table">
          <thead>
            <tr>
              <th>{{ t('archive.table.title') }}</th>
              <th>{{ t('archive.table.source') }}</th>
              <th>{{ t('archive.table.chunks') }}</th>
              <th>{{ t('archive.table.ingested') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="doc in documents" :key="doc.id">
              <td>{{ doc.title }}</td>
              <td class="archive-table__mono">{{ doc.source_path }}</td>
              <td>{{ doc.chunks }}</td>
              <td class="archive-table__mono">{{ doc.ingested_at }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section v-else-if="tab === 'grafo'" class="archive-graph">
      <p v-if="!graph" class="archive-empty">{{ t('archive.graphEmpty') }}</p>
      <template v-else>
        <svg
          class="archive-graph__svg"
          :viewBox="`0 0 ${graphLayout.width} ${graphLayout.height}`"
          role="img"
          :aria-label="t('archive.graphAria')"
        >
          <line
            v-for="edge in graphLayout.edges"
            :key="edge.id"
            :x1="edge.src.x"
            :y1="edge.src.y"
            :x2="edge.dst.x"
            :y2="edge.dst.y"
          />
          <g
            v-for="node in graphLayout.nodes"
            :key="node.id"
            :transform="`translate(${node.x}, ${node.y})`"
          >
            <circle r="6" />
            <text y="-10">{{ node.name.slice(0, 24) }}</text>
          </g>
        </svg>
        <ul class="archive-graph__legend">
          <li v-for="entity in graph.entities.slice(0, 10)" :key="entity.id">
            <strong>{{ entity.name }}</strong>
            <span>{{ entityTypeLabel(entity.type) }}</span>
          </li>
        </ul>
      </template>
    </section>
  </section>
</template>

<style scoped>
@import './archive.css';
</style>
