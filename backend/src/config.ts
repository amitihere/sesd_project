type Config = {
  approval: {
    autoApproveBelow: number;
    managerApproveBelow: number;
  };
  expenseLimits: {
    food: { maxAmount: number };
    travel: { maxAmount: number };
    medical: { minDescriptionLength: number };
  };
};

export const config: Config = {
  approval: {
    autoApproveBelow: 1500,
    managerApproveBelow: 10000,
  },
  expenseLimits: {
    food: { maxAmount: 2000 },
    travel: { maxAmount: 10000 },
    medical: { minDescriptionLength: 10 },
  },
};