-- Prisma initial migration
CREATE TABLE "exams" (
    "id" SERIAL NOT NULL,
    "exam_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "jurisdiction" TEXT NOT NULL,
    "license_track" TEXT NOT NULL,
    "exam_year" INTEGER,
    "nec_edition" INTEGER NOT NULL,
    "open_book" BOOLEAN NOT NULL DEFAULT true,
    "total_questions" INTEGER,
    "duration_minutes" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "exams_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "blueprint_categories" (
    "id" SERIAL NOT NULL,
    "exam_id" INTEGER NOT NULL,
    "category_code" TEXT NOT NULL,
    "category_name" TEXT NOT NULL,
    "question_count_target" INTEGER,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "blueprint_categories_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "nec_refs" (
    "id" SERIAL NOT NULL,
    "nec_edition" INTEGER NOT NULL,
    "article" TEXT NOT NULL,
    "section" TEXT,
    "table_id" TEXT,
    "title_short" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "nec_refs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "sources" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT,
    "notes" TEXT,
    "confidence_default" DECIMAL(3,2) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sources_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "question_templates" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "question_type" TEXT NOT NULL,
    "prompt_template" TEXT NOT NULL,
    "answer_format" TEXT,
    "difficulty_default" TEXT,
    "source_id" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "question_templates_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "questions" (
    "id" SERIAL NOT NULL,
    "exam_id" INTEGER NOT NULL,
    "blueprint_category" INTEGER NOT NULL,
    "nec_edition" INTEGER NOT NULL,
    "nec_article" TEXT NOT NULL,
    "nec_section" TEXT,
    "difficulty" TEXT NOT NULL,
    "question_type" TEXT NOT NULL,
    "source_type" TEXT NOT NULL,
    "confidence" DECIMAL(3,2) NOT NULL,
    "question_stem" TEXT NOT NULL,
    "expected_answer" TEXT,
    "explanation" TEXT,
    "template_id" INTEGER,
    "source_id" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "forum_signals" (
    "id" SERIAL NOT NULL,
    "exam_id" INTEGER NOT NULL,
    "blueprint_category" INTEGER,
    "nec_edition" INTEGER NOT NULL,
    "topic" TEXT NOT NULL,
    "pattern" TEXT NOT NULL,
    "suggested_nec_reference" TEXT NOT NULL,
    "source_id" INTEGER,
    "confidence" DECIMAL(3,2) NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "forum_signals_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "exams_exam_code_key" ON "exams"("exam_code");
CREATE UNIQUE INDEX "blueprint_categories_exam_id_category_code_key" ON "blueprint_categories"("exam_id", "category_code");
CREATE UNIQUE INDEX "nec_refs_nec_edition_article_section_table_id_key" ON "nec_refs"("nec_edition", "article", "section", "table_id");

CREATE INDEX "idx_blueprint_categories_exam_id" ON "blueprint_categories"("exam_id");
CREATE INDEX "idx_nec_refs_nec_edition" ON "nec_refs"("nec_edition");
CREATE INDEX "idx_questions_exam_id" ON "questions"("exam_id");
CREATE INDEX "idx_questions_nec_edition" ON "questions"("nec_edition");
CREATE INDEX "idx_questions_blueprint_category" ON "questions"("blueprint_category");
CREATE INDEX "idx_forum_signals_exam_id" ON "forum_signals"("exam_id");
CREATE INDEX "idx_forum_signals_nec_edition" ON "forum_signals"("nec_edition");
CREATE INDEX "idx_forum_signals_blueprint_category" ON "forum_signals"("blueprint_category");

ALTER TABLE "blueprint_categories" ADD CONSTRAINT "blueprint_categories_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "question_templates" ADD CONSTRAINT "question_templates_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "sources"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "questions" ADD CONSTRAINT "questions_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "questions" ADD CONSTRAINT "questions_blueprint_category_fkey" FOREIGN KEY ("blueprint_category") REFERENCES "blueprint_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "questions" ADD CONSTRAINT "questions_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "question_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "questions" ADD CONSTRAINT "questions_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "sources"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "forum_signals" ADD CONSTRAINT "forum_signals_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "forum_signals" ADD CONSTRAINT "forum_signals_blueprint_category_fkey" FOREIGN KEY ("blueprint_category") REFERENCES "blueprint_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "forum_signals" ADD CONSTRAINT "forum_signals_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "sources"("id") ON DELETE SET NULL ON UPDATE CASCADE;
