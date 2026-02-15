import assert from "node:assert/strict";
import test from "node:test";

import { normalizeSection } from "./seed.ts";

test("normalizeSection returns empty string for missing section", () => {
  assert.equal(normalizeSection(null), "");
  assert.equal(normalizeSection(undefined), "");
});

test("normalizeSection preserves non-empty sections", () => {
  assert.equal(normalizeSection("90.2"), "90.2");
});
