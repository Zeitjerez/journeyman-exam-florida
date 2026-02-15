import { describe, expect, it } from 'vitest';
import { assertQuestionQualityGate, forumSignalImportSchema } from '../qualityGates';

describe('forumSignalImportSchema', () => {
  it('accepts valid row', () => {
    const parsed = forumSignalImportSchema.parse({
      source_url: 'https://example.com/thread',
      source_name: 'forum-x',
      note: 'observed pattern',
      blueprint_category: 'BC03',
      nec_edition: 2020,
      nec_article: '310',
      nec_section: '15',
      pattern: 'conduit fill',
      confidence: 0.6,
    });
    expect(parsed.nec_edition).toBe(2020);
  });

  it('rejects wrong nec edition', () => {
    expect(() =>
      forumSignalImportSchema.parse({
        source_url: 'https://example.com/thread',
        source_name: 'forum-x',
        note: '',
        blueprint_category: 'BC03',
        nec_edition: 2014,
        nec_article: '310',
        nec_section: '',
        pattern: 'box fill',
        confidence: 0.6,
      }),
    ).toThrow();
  });
});

describe('assertQuestionQualityGate', () => {
  it('requires at least one nec ref', () => {
    expect(() =>
      assertQuestionQualityGate({
        examId: 1,
        blueprintCategoryId: 1,
        necEdition: 2020,
        difficulty: '3',
        questionType: 'scenario',
        necRefs: [],
      }),
    ).toThrow();
  });
});
