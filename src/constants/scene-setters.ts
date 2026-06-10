export type SceneSetterId =
  | "arrival"
  | "checklist"
  | "test-drive"
  | "trial-close"
  | "presentation"
  | "finance-fit"
  | "complete";

export const SCENE_SETTERS: Record<
  SceneSetterId,
  { title: string; body: string }
> = {
  arrival: {
    title: "Welcome",
    body: "Let's capture who you are, what you're trading in, and which vehicle you'd like to look at. No budget or commitments yet — just the basics.",
  },
  checklist: {
    title: "Before the test drive",
    body: "We'll quickly run through a few compliance items so you're ready to get behind the wheel safely.",
  },
  "test-drive": {
    title: "During the test drive",
    body: "Use this screen to capture what matters to the customer — their motivations, priorities, and impressions from the drive.",
  },
  "trial-close": {
    title: "Trial close",
    body: "Before we show the package, let's get a score out of 10. This helps us know whether to proceed to presentation or explore alternatives.",
  },
  presentation: {
    title: "Your 0% package",
    body: "Here's what your finance includes — warranty, servicing, MOT, and protection — all wrapped in our 0% offer.",
  },
  "finance-fit": {
    title: "Finance fit",
    body: "Now let's find a payment that works for you. Tell us what monthly and deposit feel comfortable, and we'll suggest the best option.",
  },
  complete: {
    title: "Deal summary & signature",
    body: "Review everything we've agreed — vehicle, finance, and included products — then sign to confirm your deposit.",
  },
};
