import { z } from "zod";

const ukMobileRegex = /^(?:0|\+?44)\d{10,11}$/;

function normalizeUkMobile(value: string): string {
  return value.replace(/[\s\-()]/g, "");
}

const pxYesNoSchema = z.enum(["yes", "no"]);
const pxServiceHistorySchema = z.enum(["fsh", "psh", "none"]);
const pxServicedWhereSchema = z.enum(["main-dealer", "independent", "mixed"]);
const pxKeyCountSchema = z.enum(["1", "2", "3plus"]);

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
        "Enter a valid UK mobile number",
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
    pxCurrentMileage: z.coerce.number().optional(),
    pxServiceHistoryType: pxServiceHistorySchema.optional(),
    pxServicedWhere: pxServicedWhereSchema.optional(),
    pxV5InSellersName: pxYesNoSchema.optional(),
    pxKeyCount: pxKeyCountSchema.optional(),
    pxInsuranceWriteOff: pxYesNoSchema.optional(),
    pxAccidentHistory: pxYesNoSchema.optional(),
    pxAccidentDescription: z.string().optional(),
    pxValueDrivers: z.array(z.string()).optional(),
    pxFeaturesNotes: z.string().optional(),
    pxConditionNotes: z.string().optional(),
    pxPhotos: z.array(z.string()).optional(),
    pxValuation: z.coerce.number().optional(),
    pxExistingFinance: pxYesNoSchema.optional(),
    pxLender: z.string().optional(),
    pxAgreementNumber: z.string().optional(),
    pxMonthlyPayment: z.coerce.number().optional(),
    pxSettlementFigure: z.coerce.number().optional(),
    pxSettlementQuoteDate: z.string().optional(),

    salesperson: z.string().min(1, "Salesperson is required"),
    branch: z.string().min(1, "Branch is required"),
    dealSource: z.string().min(1, "Select where the customer saw the vehicle"),
    purchaseTimeline: z.string().min(1, "Purchase timeline is required"),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.hasPartExchange) return;

    if (!data.pxRegistration?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Part exchange registration is required",
        path: ["pxRegistration"],
      });
    }

    if (data.pxCurrentMileage === undefined || data.pxCurrentMileage < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter current mileage",
        path: ["pxCurrentMileage"],
      });
    }

    if (!data.pxServiceHistoryType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select service history type",
        path: ["pxServiceHistoryType"],
      });
    }

    if (!data.pxServicedWhere) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select where the vehicle was serviced",
        path: ["pxServicedWhere"],
      });
    }

    if (!data.pxV5InSellersName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select whether the V5 is in the seller's name",
        path: ["pxV5InSellersName"],
      });
    }

    if (!data.pxKeyCount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select number of keys",
        path: ["pxKeyCount"],
      });
    }

    if (!data.pxInsuranceWriteOff) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select whether the vehicle has an insurance write-off",
        path: ["pxInsuranceWriteOff"],
      });
    }

    if (!data.pxAccidentHistory) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select whether the vehicle has accident history",
        path: ["pxAccidentHistory"],
      });
    }

    if (
      data.pxAccidentHistory === "yes" &&
      !data.pxAccidentDescription?.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a brief accident description",
        path: ["pxAccidentDescription"],
      });
    }

    if (data.pxValuation === undefined || data.pxValuation < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a valid estimated value",
        path: ["pxValuation"],
      });
    }

    if (!data.pxExistingFinance) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select whether existing finance applies",
        path: ["pxExistingFinance"],
      });
    }

    if (data.pxExistingFinance === "yes") {
      if (!data.pxLender?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Lender is required when existing finance applies",
          path: ["pxLender"],
        });
      }
      if (!data.pxAgreementNumber?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Agreement number is required when existing finance applies",
          path: ["pxAgreementNumber"],
        });
      }
      if (data.pxMonthlyPayment === undefined || data.pxMonthlyPayment < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter current monthly payment",
          path: ["pxMonthlyPayment"],
        });
      }
      if (
        data.pxSettlementFigure === undefined ||
        data.pxSettlementFigure < 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter settlement figure",
          path: ["pxSettlementFigure"],
        });
      }
      if (!data.pxSettlementQuoteDate?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter settlement quote date",
          path: ["pxSettlementQuoteDate"],
        });
      }
    }
  });

export type DealCreationFormValues = z.infer<typeof dealCreationSchema>;
