export type QuestionTemplateV1 = {
  id: string;
  blueprintCategory: string;
  questionType: 'lookup' | 'calc' | 'scenario';
  difficulty: 1 | 2 | 3 | 4 | 5;
  necRefs: string[];
  stemBuilder: (index: number, categoryName: string) => string;
  distractorsBuilder: (article: string) => string[];
};

function buildTemplate(id: string, blueprintCategory: string, questionType: QuestionTemplateV1['questionType'], difficulty: QuestionTemplateV1['difficulty'], necRefs: string[]): QuestionTemplateV1 {
  return {
    id,
    blueprintCategory,
    questionType,
    difficulty,
    necRefs,
    stemBuilder: (index, categoryName) =>
      `Q${index}: In ${categoryName}, choose the best reference path for this ${questionType} practice scenario.`,
    distractorsBuilder: (article) => [`nearest-code-family-not-${article}`, 'common-misread-reference', 'legacy-edition-mismatch'],
  };
}

const wiringMethods = Array.from({ length: 20 }).map((_, i) =>
  buildTemplate(`WM-${i + 1}`, 'BC03', i % 2 === 0 ? 'lookup' : 'scenario', ((i % 5) + 1) as 1 | 2 | 3 | 4 | 5, ['300:', '310:', '314:']),
);

const wiringProtection = Array.from({ length: 15 }).map((_, i) =>
  buildTemplate(`WP-${i + 1}`, 'BC02', i % 3 === 0 ? 'calc' : 'lookup', (((i + 1) % 5) + 1) as 1 | 2 | 3 | 4 | 5, ['210:', '220:', '240:', '250:']),
);

const mixed = [
  ...Array.from({ length: 5 }).map((_, i) => buildTemplate(`EQ-${i + 1}`, 'BC04', 'scenario', 3, ['404:', '406:', '408:'])),
  ...Array.from({ length: 5 }).map((_, i) => buildTemplate(`MTR-${i + 1}`, 'BC09', 'calc', 4, ['430:', '440:'])),
  ...Array.from({ length: 5 }).map((_, i) => buildTemplate(`SP-${i + 1}`, 'BC05', 'lookup', 2, ['225:', '500:'])),
];

export const templateLibrary: QuestionTemplateV1[] = [...wiringMethods, ...wiringProtection, ...mixed];
