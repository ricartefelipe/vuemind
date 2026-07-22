# Trilha entrevista — plano curto (mesmo domínio)

**Domínio único:** carteira digital (login + saldo + lista + 1 ação).  
**Contrato:** reutilizar `docs/contracts/vuemind-wallet-openapi.yaml` (ou cópia).  
**Meta por stack:** app skeleton que você abre e demonstra em &lt; 5 min.

## Prioridade para hoje / próximos dias

| Ordem | Stack | Escopo mínimo | Por quê agora |
|------:|-------|---------------|---------------|
| 1 | **Vue** (este repo) | Completo o suficiente | Já é o demo principal |
| 2 | **Spring Boot** | API REST `/api/v1` (auth mock JWT, balance, transactions, pix) + Testcontainers opcional depois | Backend é o diferencial da vaga |
| 3 | **React 18** | Login + saldo + extrato + PIX (mesmo contrato) | Citado no CV |
| 4 | **Angular 17+** | Mesmo escopo do React (standalone + signals se der tempo) | Citado no CV |
| 5 | **WebFlux** | 1 serviço reativo (ex.: transfers) ou profile WebFlux no mesmo monólito de estudo | Pergunta explícita da recrutadora |
| 6 | **Ionic + Vue/Angular** | Shell mobile das mesmas telas | Mobile híbrido |
| 7 | **React Native** | Login + saldo + lista | Mobile nativo JS |
| 8 | **Flutter** | Login + saldo + lista | Mobile nativo Dart |

## Escopo “skeleton interview-ready” (por app)

Não construir produto completo. Em cada front:

1. Login (`demo@…` / `demo123`)
2. Dashboard com saldo
3. Lista (extrato **ou** favorecidos)
4. Uma mutação (PIX **ou** criar favorecido)
5. README de 20 linhas: como rodar + 5 bullets “o que dizer na entrevista”

Backend Spring (quando for):

1. `POST /auth/login`, `GET /wallet/balance`, `GET /wallet/transactions`, `POST /transfers/pix`
2. H2 ou Postgres via Docker Compose
3. Spring Security básico + um teste `@SpringBootTest` do PIX
4. Depois: WebFlux em um endpoint, Kafka/SQS só se sobrar tempo

## O que NÃO fazer antes da entrevista

- 9 guias longos por stack
- Deploy cloud completo
- Cobertura JaCoCo 90%
- Review loops / PRs elaborados

## Ordem de estudo verbal (se só der tempo de falar)

1. Vue (demo ao vivo)  
2. Spring + contrato OpenAPI  
3. Diferença React vs Angular (mesmo domínio)  
4. WebFlux: non-blocking, quando usar  
5. Containers: Docker Compose do Spring  
6. Mensageria: citar outbox/idempotência no PIX (mesmo sem Kafka rodando)
