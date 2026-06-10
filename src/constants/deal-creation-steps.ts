export type DealCreationStep = {
  step: number;
  title: string;
  subtitle: string;
  path: string;
};

export const dealCreationSteps: DealCreationStep[] = [
  {
    step: 1,
    title: "Arrival & intake",
    subtitle: "Capture customer, part exchange, and vehicle — no budget yet",
    path: "/deals/new",
  },
  {
    step: 2,
    title: "Pre-test-drive checklist",
    subtitle: "Complete compliance items before the test drive",
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
