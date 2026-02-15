# Journeyman Exam Florida (Miami-Dade)

Monorepo base para construir una plataforma de estudio de **Journeyman Electrician** enfocada en Miami-Dade usando referencias NEC (sin texto literal del NEC).

## Alcance actual
- Jurisdicción objetivo: **Miami-Dade**
- Examen objetivo: **Journeyman Electrician 2020**
- Código de referencia: **NEC 2020**

## Requisitos
- Node.js 20+
- Docker + Docker Compose

## Cómo correr (desarrollo)
```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

## Comandos útiles
```bash
npm run db:migrate   # aplica migraciones Prisma
npm run db:seed      # carga seed inicial
npm run lint         # lint de apps/web
npm run typecheck    # typecheck de apps/web
npm run test         # tests de validación (vitest)
```

## Importar forum signals (admin local)
1. Abrir `/admin/import` en local.
2. Subir CSV con el esquema descrito en `docs/forum_signals_schema.md`.
3. El importador valida:
   - `nec_edition = 2020`
   - `confidence` entre `0` y `1`
   - `blueprint_category` existente
4. Inserta datos en `sources` y `forum_signals`.

> Las rutas `/admin` se bloquean automáticamente si `NODE_ENV=production`.


## Question Factory v1
- Biblioteca de 50 plantillas en `packages/db/templates/`.
- Generador ponderado por blueprint: `generateQuestions({ examId, count, byBlueprintWeight: true })`.
- Preguntas originales con explicación propia y referencias NEC (sin texto literal NEC).

## Blueprint Weight Engine
- El sistema distribuye preguntas por categoría usando `weight_percentage` cuando existe en `blueprint_categories`.
- Si no hay pesos confirmados, distribuye de manera equitativa entre categorías.
- La suma final siempre coincide exactamente con el total solicitado (ej. 70 preguntas).
- Cuando se confirmen cifras oficiales del blueprint, solo debemos actualizar `weight_percentage`/`question_count_target` en DB.

## Estructura del monorepo
- `apps/web`: Next.js App Router + TypeScript + Tailwind.
- `packages/db`: Prisma schema, migraciones, seed y template library.
- `docker/docker-compose.yml`: Postgres local.
- `docs/`: objetivo del examen, política de datos, taxonomía y esquema CSV.
- `db/`: SQL base histórico (schema/seed inicial).

## Reglas de contribución
- No incluir texto literal del NEC ni subir PDFs del NEC.
- Solo guardar referencias estructuradas (artículo/sección/tabla) y explicaciones propias.
- Separar datasets por `nec_edition` y no mezclar ediciones.

## Roadmap corto
- **v0:** blueprint + seeds iniciales
- **v1:** templates de preguntas
- **v2:** forum signals estructurados
- **v3:** app de estudio/práctica
