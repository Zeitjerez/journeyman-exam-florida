-- Base schema v0 for Miami-Dade Journeyman Electrician 2020 prep data

CREATE TABLE IF NOT EXISTS exams (
  id SERIAL PRIMARY KEY,
  exam_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  jurisdiction TEXT NOT NULL,
  license_track TEXT NOT NULL,
  exam_year INTEGER,
  nec_edition INTEGER NOT NULL,
  open_book BOOLEAN NOT NULL DEFAULT TRUE,
  total_questions INTEGER,
  duration_minutes INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blueprint_categories (
  id SERIAL PRIMARY KEY,
  exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  category_code TEXT NOT NULL,
  category_name TEXT NOT NULL,
  weight_percentage DOUBLE PRECISION,
  question_count_target INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (exam_id, category_code)
);

CREATE TABLE IF NOT EXISTS nec_refs (
  id SERIAL PRIMARY KEY,
  nec_edition INTEGER NOT NULL,
  article TEXT NOT NULL,
  section TEXT,
  table_id TEXT,
  title_short TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (nec_edition, article, section, table_id)
);

CREATE TABLE IF NOT EXISTS sources (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  url TEXT,
  notes TEXT,
  confidence_default NUMERIC(3,2) NOT NULL CHECK (confidence_default >= 0 AND confidence_default <= 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS question_templates (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  question_type TEXT NOT NULL,
  prompt_template TEXT NOT NULL,
  answer_format TEXT,
  difficulty_default TEXT,
  source_id INTEGER REFERENCES sources(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  blueprint_category INTEGER NOT NULL REFERENCES blueprint_categories(id) ON DELETE RESTRICT,
  nec_edition INTEGER NOT NULL,
  nec_article TEXT NOT NULL,
  nec_section TEXT,
  difficulty TEXT NOT NULL,
  question_type TEXT NOT NULL,
  source_type TEXT NOT NULL,
  confidence NUMERIC(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  question_stem TEXT NOT NULL,
  expected_answer TEXT,
  explanation TEXT,
  template_id INTEGER REFERENCES question_templates(id) ON DELETE SET NULL,
  source_id INTEGER REFERENCES sources(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS forum_signals (
  id SERIAL PRIMARY KEY,
  exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  blueprint_category INTEGER REFERENCES blueprint_categories(id) ON DELETE SET NULL,
  nec_edition INTEGER NOT NULL,
  topic TEXT NOT NULL,
  pattern TEXT NOT NULL,
  suggested_nec_reference TEXT NOT NULL,
  source_id INTEGER REFERENCES sources(id) ON DELETE SET NULL,
  confidence NUMERIC(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes requested for retrieval by exam, NEC edition and category
CREATE INDEX IF NOT EXISTS idx_blueprint_categories_exam_id ON blueprint_categories (exam_id);
CREATE INDEX IF NOT EXISTS idx_blueprint_categories_exam_id_category_name ON blueprint_categories (exam_id, category_name);
CREATE INDEX IF NOT EXISTS idx_nec_refs_nec_edition ON nec_refs (nec_edition);
CREATE INDEX IF NOT EXISTS idx_questions_exam_id ON questions (exam_id);
CREATE INDEX IF NOT EXISTS idx_questions_nec_edition ON questions (nec_edition);
CREATE INDEX IF NOT EXISTS idx_questions_blueprint_category ON questions (blueprint_category);
CREATE INDEX IF NOT EXISTS idx_forum_signals_exam_id ON forum_signals (exam_id);
CREATE INDEX IF NOT EXISTS idx_forum_signals_nec_edition ON forum_signals (nec_edition);
CREATE INDEX IF NOT EXISTS idx_forum_signals_blueprint_category ON forum_signals (blueprint_category);
