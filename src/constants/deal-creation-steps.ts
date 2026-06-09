export type DealCreationStep = {
  step: number;
  title: string;
  subtitle: string;
  path: string;
};

export const dealCreationSteps: DealCreationStep[] = [
  {
    step: 1,
    title: "Customer & vehicle",
    subtitle: "Share the customer and vehicle details for this deal",
    path: "/deals/new",
  },
  {
    step: 2,
    title: "Process checklist",
    subtitle: "Complete the on-site checklist before the test drive",
    path: "/deals/new/step-2",
  },
  {
    step: 3,
    title: "Test drive notes",
    subtitle: "Capture buying motivations during the test drive",
    path: "/deals/new/step-3",
  },
  {
    step: 4,
    title: "Trial close",
    subtitle: "Score the vehicle before presentation",
    path: "/deals/new/step-4",
  },
];

export const dealCreationStepCount = dealCreationSteps.length;

export const testDriveSteps = dealCreationSteps.filter((step) => step.step >= 2);

export const testDriveStepCount = testDriveSteps.length;
