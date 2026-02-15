ALTER TABLE "blueprint_categories"
ADD COLUMN "weight_percentage" DOUBLE PRECISION;

CREATE INDEX "blueprint_categories_exam_id_category_name_idx"
ON "blueprint_categories"("exam_id", "category_name");
