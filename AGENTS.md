# AGENTS.md

## Reglas estrictas del proyecto

1. **Copyright NEC**
   - NO copiar texto del NEC ni subir PDFs del NEC.
   - Solo guardar referencias estructuradas (artículo/sección/tabla) y explicaciones propias.

2. **Versionado por edición NEC**
   - Separar datasets por `nec_edition` (2014, 2020, etc.).
   - No mezclar ediciones en el mismo registro lógico.

3. **Metadatos obligatorios por pregunta**
   Toda pregunta debe incluir estos tags:
   - `exam_id`
   - `blueprint_category`
   - `nec_edition`
   - `nec_article`
   - `nec_section`
   - `difficulty`
   - `question_type`
   - `source_type`
   - `confidence`

4. **Forum signals**
   - Guardar señales de foro solo como: tema + patrón + referencia sugerida.
   - No guardar preguntas literales extraídas de foros.

5. **Datos no oficiales**
   - Todo dato no oficial debe iniciar con `confidence <= 0.6` hasta validación.
