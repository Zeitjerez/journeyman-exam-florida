# Forum Signals CSV Schema

Este importador guarda **señales** de estudio (tema/patrón/referencia sugerida), no preguntas literales.

## Columnas requeridas
- `source_url`
- `source_name`
- `note`
- `blueprint_category` (ej. `BC03`)
- `nec_edition` (por ahora debe ser `2020`)
- `nec_article`
- `nec_section`
- `pattern`
- `confidence` (0 a 1)

## Ejemplo CSV
```csv
source_url,source_name,note,blueprint_category,nec_edition,nec_article,nec_section,pattern,confidence
https://example.com/thread-1,forum-a,high repetition topic,BC03,2020,300,,conduit fill,0.55
https://example.com/thread-2,forum-b,practice cluster,BC02,2020,240,4,overcurrent sizing pattern,0.6
https://example.com/thread-3,forum-c,common confusion,BC09,2020,430,52,motor FLC lookup path,0.5
```

## Restricciones
- No incluir texto literal del NEC.
- No incluir en `pattern` preguntas completas ni enunciados literales de foros.
- Para datos no oficiales, usar `confidence <= 0.6` hasta validación.
