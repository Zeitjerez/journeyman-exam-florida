import { describe, expect, it } from 'vitest';
import { distributeQuestionsByBlueprint } from '@journeyman/db/utils/weightDistributor';

describe('distributeQuestionsByBlueprint', () => {
  it('distributes equally when no weights are present', () => {
    const categories = [
      { id: 1, examId: 1, categoryCode: 'BC01', categoryName: 'A', weightPercentage: null },
      { id: 2, examId: 1, categoryCode: 'BC02', categoryName: 'B', weightPercentage: null },
      { id: 3, examId: 1, categoryCode: 'BC03', categoryName: 'C', weightPercentage: null },
    ];

    const result = distributeQuestionsByBlueprint(10, categories);
    const total = result.reduce((acc, item) => acc + item.assignedCount, 0);

    expect(total).toBe(10);
    expect(result.map((item) => item.assignedCount).sort((a, b) => a - b)).toEqual([3, 3, 4]);
  });

  it('distributes proportionally when weights are present', () => {
    const categories = [
      { id: 1, examId: 1, categoryCode: 'BC01', categoryName: 'A', weightPercentage: 50 },
      { id: 2, examId: 1, categoryCode: 'BC02', categoryName: 'B', weightPercentage: 30 },
      { id: 3, examId: 1, categoryCode: 'BC03', categoryName: 'C', weightPercentage: 20 },
    ];

    const result = distributeQuestionsByBlueprint(70, categories);
    expect(result.map((item) => item.assignedCount)).toEqual([35, 21, 14]);
  });
});
