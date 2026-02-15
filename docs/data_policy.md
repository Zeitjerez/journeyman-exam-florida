# Data Policy

## Criterios de calidad

- Cada registro debe incluir procedencia (`source_type`, `source_id` si aplica) y nivel de confianza.
- No se permite texto literal del NEC ni documentos protegidos por copyright.
- Las referencias NEC se guardan como metadatos (edición, artículo, sección, tabla, título corto propio).
- Todo contenido no oficial comienza con `confidence <= 0.6` hasta validación.
- Las preguntas deben respetar el esquema de tags obligatorios del proyecto.

## Versionado

- Versionar datasets por edición NEC (`nec_edition`).
- Mantener cambios de estructura en archivos SQL versionados.
- Nombrar semillas por versión (`seed_v0.sql`, `seed_v1.sql`, ...).
- Evitar mezclas de ediciones NEC en una misma colección sin segmentación explícita.
