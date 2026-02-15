export type BlueprintCategoryForDistribution = {
  id: number;
  examId: number;
  categoryCode: string;
  categoryName: string;
  weightPercentage: number | null;
};

export type BlueprintDistribution = {
  categoryId: number;
  categoryCode: string;
  categoryName: string;
  assignedCount: number;
};

function apportion(totalQuestions: number, weighted: Array<{ index: number; weight: number }>) {
  const totalWeight = weighted.reduce((acc, item) => acc + item.weight, 0);
  const quotas = weighted.map((item) => {
    const raw = totalWeight > 0 ? (totalQuestions * item.weight) / totalWeight : 0;
    return { index: item.index, base: Math.floor(raw), fraction: raw - Math.floor(raw) };
  });

  let assigned = quotas.reduce((acc, item) => acc + item.base, 0);
  const pending = totalQuestions - assigned;

  quotas
    .sort((a, b) => (b.fraction === a.fraction ? a.index - b.index : b.fraction - a.fraction))
    .slice(0, Math.max(0, pending))
    .forEach((item) => {
      item.base += 1;
      assigned += 1;
    });

  const result = new Array(weighted.length).fill(0);
  quotas.forEach((item) => {
    result[item.index] = item.base;
  });

  return result;
}

export function distributeQuestionsByBlueprint(
  totalQuestions: number,
  categories: BlueprintCategoryForDistribution[],
): BlueprintDistribution[] {
  if (!Number.isFinite(totalQuestions) || totalQuestions < 0) {
    throw new Error('totalQuestions must be a non-negative number');
  }

  if (categories.length === 0) {
    return [];
  }

  const hasWeights = categories.some((category) => category.weightPercentage !== null);
  const distribution = hasWeights
    ? apportion(
        totalQuestions,
        categories.map((category, index) => ({
          index,
          weight: Math.max(category.weightPercentage ?? 0, 0),
        })),
      )
    : apportion(
        totalQuestions,
        categories.map((_, index) => ({ index, weight: 1 })),
      );

  const totalAssigned = distribution.reduce((acc, value) => acc + value, 0);
  if (totalAssigned !== totalQuestions) {
    throw new Error('Distribution failed to preserve total question count');
  }

  return categories.map((category, index) => ({
    categoryId: category.id,
    categoryCode: category.categoryCode,
    categoryName: category.categoryName,
    assignedCount: distribution[index],
  }));
}
