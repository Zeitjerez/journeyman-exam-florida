-- Seed v0: Miami-Dade Journeyman Electrician 2020 / NEC 2020

INSERT INTO exams (
  exam_code,
  name,
  jurisdiction,
  license_track,
  exam_year,
  nec_edition,
  open_book,
  total_questions,
  duration_minutes
)
VALUES (
  'miami_dade_journeyman_2020',
  'Miami-Dade Journeyman Electrician 2020',
  'Miami-Dade',
  'Journeyman Electrician',
  2020,
  2020,
  TRUE,
  70,
  180
)
ON CONFLICT (exam_code) DO NOTHING;

WITH target_exam AS (
  SELECT id FROM exams WHERE exam_code = 'miami_dade_journeyman_2020'
)
INSERT INTO blueprint_categories (exam_id, category_code, category_name, weight_percentage, question_count_target, notes)
SELECT te.id, bc.category_code, bc.category_name, NULL, NULL, 'Weight/count pendiente de validación oficial.'
FROM target_exam te
CROSS JOIN (
  VALUES
    ('BC01', 'Wiring Methods & Materials'),
    ('BC02', 'Wiring & Protection'),
    ('BC03', 'General Electrical Theory & Principles'),
    ('BC04', 'Equipment for General Use'),
    ('BC05', 'Plan Reading'),
    ('BC06', 'Communication Systems'),
    ('BC07', 'Motors & Controls'),
    ('BC08', 'Special Conditions'),
    ('BC09', 'Special Equipment'),
    ('BC10', 'Special Occupancies')
) AS bc(category_code, category_name)
ON CONFLICT (exam_id, category_code) DO NOTHING;

INSERT INTO nec_refs (nec_edition, article, section, table_id, title_short)
VALUES
  (2020, '90', NULL, NULL, 'Introduction and scope'),
  (2020, '100', NULL, NULL, 'Definitions'),
  (2020, '110', NULL, NULL, 'Requirements for electrical installations'),
  (2020, '200', NULL, NULL, 'Use and identification of grounded conductors'),
  (2020, '210', NULL, NULL, 'Branch circuits'),
  (2020, '215', NULL, NULL, 'Feeders'),
  (2020, '220', NULL, NULL, 'Branch-circuit, feeder, and service load calculations'),
  (2020, '225', NULL, NULL, 'Outside branch circuits and feeders'),
  (2020, '230', NULL, NULL, 'Services'),
  (2020, '240', NULL, NULL, 'Overcurrent protection'),
  (2020, '250', NULL, NULL, 'Grounding and bonding'),
  (2020, '300', NULL, NULL, 'Wiring methods'),
  (2020, '310', NULL, NULL, 'Conductors for general wiring'),
  (2020, '312', NULL, NULL, 'Cabinets, cutout boxes, and meter socket enclosures'),
  (2020, '314', NULL, NULL, 'Outlet, device, pull and junction boxes'),
  (2020, '320', NULL, NULL, 'Armored cable'),
  (2020, '330', NULL, NULL, 'Metal-clad cable'),
  (2020, '334', NULL, NULL, 'Nonmetallic-sheathed cable'),
  (2020, '342', NULL, NULL, 'Intermediate metal conduit'),
  (2020, '344', NULL, NULL, 'Rigid metal conduit'),
  (2020, '352', NULL, NULL, 'Rigid polyvinyl chloride conduit'),
  (2020, '358', NULL, NULL, 'Electrical metallic tubing'),
  (2020, '400', NULL, NULL, 'Flexible cords and cables'),
  (2020, '404', NULL, NULL, 'Switches'),
  (2020, '406', NULL, NULL, 'Receptacles, cord connectors, and attachment plugs'),
  (2020, '408', NULL, NULL, 'Switchboards and panelboards'),
  (2020, '410', NULL, NULL, 'Luminaires and lampholders'),
  (2020, '422', NULL, NULL, 'Appliances'),
  (2020, '430', NULL, NULL, 'Motors, motor circuits, and controllers'),
  (2020, '440', NULL, NULL, 'Air-conditioning and refrigerating equipment')
ON CONFLICT (nec_edition, article, section, table_id) DO NOTHING;
