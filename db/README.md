# DB Setup (Postgres + SQL)

## Requisitos
- PostgreSQL 14+ (o compatible)
- `psql` disponible en terminal

## 1) Crear base local

```bash
createdb journeyman_exam
```

## 2) Aplicar esquema

```bash
psql -d journeyman_exam -f db/schema.sql
```

## 3) Cargar seed v0

```bash
psql -d journeyman_exam -f db/seeds/seed_v0.sql
```

## 4) Verificación rápida

```bash
psql -d journeyman_exam -c "SELECT exam_code, name, nec_edition FROM exams;"
psql -d journeyman_exam -c "SELECT COUNT(*) AS categories FROM blueprint_categories;"
psql -d journeyman_exam -c "SELECT COUNT(*) AS nec_refs FROM nec_refs WHERE nec_edition = 2020;"
```

## Notas
- Este proyecto guarda solo **referencias NEC** y metadatos; no incluye texto literal del código.
- Si cambias estructura, crea una nueva seed/versionado en `db/seeds/`.
