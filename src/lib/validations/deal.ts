import { z } from "zod";

const ukMobileRegex = /^(?:0|\+?44)\d{10,11}$/;

function normalizeUkMobile(value: string): string {
  return value.replace(/[\s\-()]/g, "");
}

export const dealCreationSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    mobile: z
      .string()
      .min(1, "Mobile number is required")
      .transform(normalizeUkMobile)
      .refine(
        (val) => ukMobileRegex.test(val),
        "Enter a valid UK mobile number"
      ),
    email: z
      .string()
      .email("Please enter a valid email address")
      .optional()
      .or(z.literal("")),
    address: z.string().optional(),
    postcode: z.string().optional(),
    isExistingCustomer: z.boolean(),
    existingCustomerId: z.string().optional(),

    vehicleId: z.string().min(1, "Please select a vehicle"),

    hasPartExchange: z.boolean(),
    pxRegistration: z.string().optional(),
    pxValuation: z.coerce.number().optional(),
    pxOutstandingFinance: z.coerce.number().optional(),
    pxSettlementRequired: z.enum(["yes", "no"]).optional(),

    salesperson: z.string().min(1, "Salesperson is required"),
    branch: z.string().min(1, "Branch is required"),
    dealSource: z.string().min(1, "Deal source is required"),
    purchaseTimeline: z.string().min(1, "Purchase timeline is required"),
    customerBudget: z.coerce.number().optional(),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.hasPartExchange) {
      if (!data.pxRegistration?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Part exchange registration is required",
          path: ["pxRegistration"],
        });
      }
      if (data.pxValuation === undefined || data.pxValuation < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter a valid part exchange valuation",
          path: ["pxValuation"],
        });
      }
      if (
        data.pxOutstandingFinance === undefined ||
        data.pxOutstandingFinance < 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter outstanding finance amount",
          path: ["pxOutstandingFinance"],
        });
      }
      if (!data.pxSettlementRequired) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Select whether settlement is required",
          path: ["pxSettlementRequired"],
        });
      }
    }
  });

export type DealCreationFormValues = z.infer<typeof dealCreationSchema>;
