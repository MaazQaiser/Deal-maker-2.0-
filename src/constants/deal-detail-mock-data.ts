import { dealHistoryRecords } from "@/constants/deal-history-mock-data";
import {
  existingCustomers,
  stockVehicles,
} from "@/constants/deal-mock-data";
import { buildDealActivities } from "@/lib/deal-detail/build-activities";
import type { DealFinancePlan } from "@/store/dealStore";
import type { DealDetailBundle, DealLifecycleStage } from "@/types/deal-detail";
import type { DealRecord, PartExchangeRecord, VehicleRecord } from "@/types/deal";
import type { ProcessChecklist } from "@/types/process-checklist";
import type { TestDriveNotes } from "@/types/test-drive";

const completeChecklist: ProcessChecklist = {
  customerWelcomed: true,
  teaCoffeeOffered: true,
  customerSeated: true,
  drivingLicenceReceived: true,
  pxKeysReceived: true,
  salesManagerIntroductionCompleted: true,
};

const checklistWithoutPx: ProcessChecklist = {
  customerWelcomed: true,
  teaCoffeeOffered: true,
  customerSeated: true,
  drivingLicenceReceived: true,
  pxKeysReceived: false,
  salesManagerIntroductionCompleted: true,
};

const standardTestDriveNotes: TestDriveNotes = {
  buyingMotives: ["moreSpace", "safety", "upgradeCurrentVehicle"],
  likesCurrentVehicle: "Reliable and comfortable for daily commuting.",
  dislikesCurrentVehicle: "Boot too small, fuel costs increasing.",
  importantFeatures: ["monthlyPayment", "reliability", "bootSpace"],
  freeNotes:
    "Customer enjoyed the test drive. Partner prefers lighter exterior colours.",
};

const detailVehicles: Record<string, VehicleRecord> = {
  "DB-1048": stockVehicles[0],
  "DB-1047": stockVehicles[1],
  "DB-1046": {
    id: "veh-detail-1046",
    make: "Volkswagen",
    model: "Golf",
    variant: "GTD",
    registration: "VW23 GTD",
    year: 2023,
    mileage: 9200,
    colour: "Pure White",
    retailPrice: 24995,
    vehicleCost: 21500,
  },
  "DB-1045": {
    id: "veh-detail-1045",
    make: "Mercedes-Benz",
    model: "A-Class",
    variant: "A180 AMG Line",
    registration: "MB22 AMG",
    year: 2022,
    mileage: 16800,
    colour: "Cosmos Black",
    retailPrice: 21495,
    vehicleCost: 18600,
  },
  "DB-1044": {
    id: "veh-detail-1044",
    make: "Land Rover",
    model: "Range Rover Evoque",
    variant: "HSE",
    registration: "LR21 HSE",
    year: 2021,
    mileage: 28400,
    colour: "Fuji White",
    retailPrice: 32995,
    vehicleCost: 28900,
  },
  "DB-1043": {
    id: "veh-detail-1043",
    make: "Ford",
    model: "Focus",
    variant: "ST",
    registration: "FD23 STX",
    year: 2023,
    mileage: 11200,
    colour: "Frozen White",
    retailPrice: 26995,
    vehicleCost: 23400,
  },
  "DB-1042": {
    id: "veh-detail-1042",
    make: "BMW",
    model: "1 Series",
    variant: "118i Sport",
    registration: "BM22 118",
    year: 2022,
    mileage: 22100,
    colour: "Storm Bay",
    retailPrice: 17995,
    vehicleCost: 15400,
  },
  "DB-1041": {
    id: "veh-detail-1041",
    make: "Audi",
    model: "Q3",
    variant: "Black Edition",
    registration: "AU23 Q3B",
    year: 2023,
    mileage: 7800,
    colour: "Mythos Black",
    retailPrice: 28995,
    vehicleCost: 25100,
  },
  "DB-1040": {
    id: "veh-detail-1040",
    make: "MINI",
    model: "Cooper",
    variant: "Cooper S",
    registration: "MN22 COS",
    year: 2022,
    mileage: 19500,
    colour: "Chili Red",
    retailPrice: 19995,
    vehicleCost: 17200,
  },
  "DB-1039": {
    id: "veh-detail-1039",
    make: "Tesla",
    model: "Model 3",
    variant: "Long Range",
    registration: "TS21 MD3",
    year: 2021,
    mileage: 31200,
    colour: "Pearl White",
    retailPrice: 27995,
    vehicleCost: 24800,
  },
};

const pxSarah: PartExchangeRecord = {
  registration: "XY22 ABC",
  make: "Ford",
  model: "Focus",
  year: 2022,
  mileage: 32100,
  valuation: 4000,
  existingFinance: true,
  outstandingFinance: 1500,
  settlementFigure: 1500,
  financeCompany: "santander",
  financeEndDate: "2027-06-30",
  equity: 2500,
};

const pxDavid: PartExchangeRecord = {
  registration: "MN19 DEF",
  make: "Vauxhall",
  model: "Corsa",
  year: 2019,
  mileage: 45800,
  valuation: 3500,
  existingFinance: true,
  outstandingFinance: 1200,
  settlementFigure: 1200,
  financeCompany: "close-brothers",
  financeEndDate: "2026-12-15",
  equity: 2300,
};

function historyRow(id: string) {
  const row = dealHistoryRecords.find((r) => r.id === id);
  if (!row) throw new Error(`Missing history row for ${id}`);
  return row;
}

function buildBundle(
  id: string,
  deal: Omit<DealRecord, "id" | "status" | "createdAt"> & {
    status: DealRecord["status"];
    createdAt?: Date;
  },
  options: {
    financePlan?: DealFinancePlan;
    lifecycleStage: DealLifecycleStage;
    lastUpdated?: Date;
  },
): DealDetailBundle {
  const row = historyRow(id);
  const lastUpdated = options.lastUpdated ?? row.lastUpdated;
  const createdAt =
    deal.createdAt ?? new Date(lastUpdated.getTime() - 2 * 60 * 60_000);
  const fullDeal: DealRecord = {
    ...deal,
    id,
    createdAt,
  };

  return {
    deal: fullDeal,
    financePlan: options.financePlan,
    lifecycleStage: options.lifecycleStage,
    lastUpdated,
    activities: buildDealActivities({
      deal: fullDeal,
      financePlan: options.financePlan,
      lastUpdated,
      lifecycleStage: options.lifecycleStage,
    }),
  };
}

const mockBundles: DealDetailBundle[] = [
  buildBundle(
    "DB-1048",
    {
      status: "won",
      customer: {
        firstName: existingCustomers[0].firstName,
        lastName: existingCustomers[0].lastName,
        mobile: existingCustomers[0].mobile,
        email: existingCustomers[0].email,
        address: existingCustomers[0].address,
        postcode: existingCustomers[0].postcode,
      },
      vehicle: detailVehicles["DB-1048"],
      partExchange: pxSarah,
      salesperson: "Emma Wilson",
      branch: "manchester",
      dealSource: "walk-in",
      purchaseTimeline: "today",
      maximumDeposit: 500,
      customerBudget: 450,
      notes: "Customer ready to proceed. Strong interest in HP with PX equity.",
      processChecklist: completeChecklist,
      testDriveNotes: standardTestDriveNotes,
      trialClose: {
        rating: 10,
        lovedMost: "Ride quality, space, and how quiet it is on the motorway.",
        makeItTen: "",
        concernType: null,
        whatWasntRight: "",
        wrongVehicleReasons: [],
      },
    },
    {
      lifecycleStage: "outcome",
      financePlan: {
        deposit: 500,
        term: 48,
        selectedFinance: "hp",
        hpVariant: "b",
        balloon: 0,
        apr: 14.9,
        pxValue: 4000,
        settlementFigure: 1500,
        gfvPercent: 0,
      },
    },
  ),

  buildBundle(
    "DB-1047",
    {
      status: "presented",
      customer: {
        firstName: existingCustomers[1].firstName,
        lastName: existingCustomers[1].lastName,
        mobile: existingCustomers[1].mobile,
        email: existingCustomers[1].email,
        address: existingCustomers[1].address,
        postcode: existingCustomers[1].postcode,
      },
      vehicle: detailVehicles["DB-1047"],
      salesperson: "James Brown",
      branch: "leeds",
      dealSource: "autotrader",
      purchaseTimeline: "within-7-days",
      maximumDeposit: 2000,
      customerBudget: 320,
      notes: "Comparing PCP vs HP. Partner decision expected this week.",
      processChecklist: checklistWithoutPx,
      testDriveNotes: {
        ...standardTestDriveNotes,
        buyingMotives: ["commuting", "betterFuelEconomy"],
      },
      trialClose: {
        rating: 9,
        lovedMost: "Interior quality and smooth gearbox.",
        makeItTen: "",
        concernType: null,
        whatWasntRight: "",
        wrongVehicleReasons: [],
      },
    },
    {
      lifecycleStage: "presented",
      financePlan: {
        deposit: 2000,
        term: 48,
        selectedFinance: "pcp",
        hpVariant: "b",
        balloon: 9800,
        apr: 8.9,
        pxValue: 0,
        settlementFigure: 0,
        gfvPercent: 43,
      },
    },
  ),

  buildBundle(
    "DB-1046",
    {
      status: "draft",
      customer: {
        firstName: "Olivia",
        lastName: "Smith",
        mobile: "07700911223",
        email: "olivia.smith@email.com",
        address: "5 Maple Close, Chorlton",
        postcode: "M21 9TT",
      },
      vehicle: detailVehicles["DB-1046"],
      salesperson: "Emma Wilson",
      branch: "manchester",
      dealSource: "oakwood-website",
      purchaseTimeline: "within-30-days",
      maximumDeposit: 8200,
      customerBudget: 520,
      notes: "Interested in 0% finance. Awaiting partner test drive.",
      processChecklist: checklistWithoutPx,
      testDriveNotes: {
        ...standardTestDriveNotes,
        buyingMotives: ["betterFuelEconomy", "performance"],
        importantFeatures: ["fuelEconomy", "performance", "technology"],
      },
      trialClose: {
        rating: 8,
        lovedMost: "Acceleration and tech package.",
        makeItTen: "Lower monthly payment would make it a definite yes.",
        concernType: "minor",
        whatWasntRight: "",
        wrongVehicleReasons: [],
      },
    },
    {
      lifecycleStage: "trial-close-complete",
    },
  ),

  buildBundle(
    "DB-1045",
    {
      status: "won",
      customer: {
        firstName: "David",
        lastName: "Miller",
        mobile: "07700933445",
        email: "david.miller@email.com",
        address: "19 Harbor Road, Harborne",
        postcode: "B17 0SJ",
      },
      vehicle: detailVehicles["DB-1045"],
      partExchange: pxDavid,
      salesperson: "Tom Harris",
      branch: "birmingham",
      dealSource: "referral",
      purchaseTimeline: "today",
      maximumDeposit: 1000,
      customerBudget: 400,
      notes: "Referred by existing customer. PX equity key to deal.",
      processChecklist: completeChecklist,
      testDriveNotes: standardTestDriveNotes,
      trialClose: {
        rating: 9,
        lovedMost: "Premium feel and low running costs.",
        makeItTen: "",
        concernType: null,
        whatWasntRight: "",
        wrongVehicleReasons: [],
      },
    },
    {
      lifecycleStage: "outcome",
      financePlan: {
        deposit: 1000,
        term: 48,
        selectedFinance: "hp",
        hpVariant: "b",
        balloon: 0,
        apr: 14.9,
        pxValue: 3500,
        settlementFigure: 1200,
        gfvPercent: 0,
      },
    },
  ),

  buildBundle(
    "DB-1044",
    {
      status: "lost",
      customer: {
        firstName: "Chloe",
        lastName: "White",
        mobile: "07700955667",
        email: "chloe.white@email.com",
        address: "3 Riverside Walk, Leeds",
        postcode: "LS1 4DY",
      },
      vehicle: detailVehicles["DB-1044"],
      salesperson: "James Brown",
      branch: "leeds",
      dealSource: "facebook",
      purchaseTimeline: "researching",
      maximumDeposit: 3500,
      customerBudget: 480,
      notes: "Monthly payment too high. May return when budget increases.",
      processChecklist: checklistWithoutPx,
      testDriveNotes: {
        ...standardTestDriveNotes,
        buyingMotives: ["upgradeCurrentVehicle", "moreSpace"],
      },
      trialClose: {
        rating: 6,
        lovedMost: "",
        makeItTen: "",
        concernType: null,
        whatWasntRight:
          "Monthly payments are above budget and the boot is smaller than expected.",
        wrongVehicleReasons: ["monthlyPaymentsTooHigh", "wrongSize"],
      },
    },
    {
      lifecycleStage: "outcome",
      financePlan: {
        deposit: 3500,
        term: 48,
        selectedFinance: "pcp",
        hpVariant: "b",
        balloon: 14200,
        apr: 8.9,
        pxValue: 0,
        settlementFigure: 0,
        gfvPercent: 43,
      },
    },
  ),

  buildBundle(
    "DB-1043",
    {
      status: "finance-pending",
      customer: {
        firstName: "Liam",
        lastName: "Taylor",
        mobile: "07700977889",
        email: "liam.taylor@email.com",
        address: "44 Brook Street, Manchester",
        postcode: "M1 3BB",
      },
      vehicle: detailVehicles["DB-1043"],
      salesperson: "Emma Wilson",
      branch: "manchester",
      dealSource: "google",
      purchaseTimeline: "within-7-days",
      maximumDeposit: 7900,
      customerBudget: 480,
      notes: "0% application submitted. Awaiting lender response.",
      processChecklist: checklistWithoutPx,
      testDriveNotes: {
        ...standardTestDriveNotes,
        buyingMotives: ["performance", "upgradeCurrentVehicle"],
      },
      trialClose: {
        rating: 9,
        lovedMost: "Handling and performance on the ST.",
        makeItTen: "",
        concernType: null,
        whatWasntRight: "",
        wrongVehicleReasons: [],
      },
    },
    {
      lifecycleStage: "outcome",
      financePlan: {
        deposit: 7900,
        term: 18,
        selectedFinance: "zero",
        hpVariant: "b",
        balloon: 0,
        apr: 0,
        pxValue: 0,
        settlementFigure: 0,
        gfvPercent: 0,
      },
    },
  ),

  buildBundle(
    "DB-1042",
    {
      status: "presented",
      customer: {
        firstName: "Sophia",
        lastName: "Davis",
        mobile: "07700999001",
        email: "sophia.davis@email.com",
        address: "12 Victoria Road, Birmingham",
        postcode: "B13 9QH",
      },
      vehicle: detailVehicles["DB-1042"],
      salesperson: "Tom Harris",
      branch: "birmingham",
      dealSource: "returning-customer",
      purchaseTimeline: "within-7-days",
      maximumDeposit: 500,
      customerBudget: 330,
      notes: "Minor objection on colour — considering alternatives in stock.",
      processChecklist: checklistWithoutPx,
      testDriveNotes: standardTestDriveNotes,
      trialClose: {
        rating: 8,
        lovedMost: "Compact size and easy parking.",
        makeItTen: "Would prefer a lighter exterior colour.",
        concernType: "minor",
        whatWasntRight: "",
        wrongVehicleReasons: [],
      },
    },
    {
      lifecycleStage: "finance-configured",
      financePlan: {
        deposit: 500,
        term: 48,
        selectedFinance: "hp",
        hpVariant: "b",
        balloon: 0,
        apr: 14.9,
        pxValue: 0,
        settlementFigure: 0,
        gfvPercent: 0,
      },
    },
  ),

  buildBundle(
    "DB-1041",
    {
      status: "draft",
      customer: {
        firstName: "Ethan",
        lastName: "Wilson",
        mobile: "07700911234",
        email: "ethan.wilson@email.com",
        address: "7 Park Avenue, Headingley",
        postcode: "LS6 1PQ",
      },
      vehicle: detailVehicles["DB-1041"],
      salesperson: "James Brown",
      branch: "leeds",
      dealSource: "autotrader",
      purchaseTimeline: "researching",
      maximumDeposit: 2500,
      customerBudget: 400,
      notes: "Early enquiry — vehicle selected, awaiting test drive booking.",
    },
    {
      lifecycleStage: "created",
    },
  ),

  buildBundle(
    "DB-1040",
    {
      status: "won",
      customer: {
        firstName: "Amelia",
        lastName: "Moore",
        mobile: "07700922345",
        email: "amelia.moore@email.com",
        address: "28 Elm Grove, Didsbury",
        postcode: "M20 2HL",
      },
      vehicle: detailVehicles["DB-1040"],
      salesperson: "Emma Wilson",
      branch: "manchester",
      dealSource: "walk-in",
      purchaseTimeline: "today",
      maximumDeposit: 6500,
      customerBudget: 410,
      notes: "Enthusiastic buyer. 0% finance secured.",
      processChecklist: checklistWithoutPx,
      testDriveNotes: {
        ...standardTestDriveNotes,
        buyingMotives: ["performance", "commuting"],
      },
      trialClose: {
        rating: 10,
        lovedMost: "Fun to drive and distinctive styling.",
        makeItTen: "",
        concernType: null,
        whatWasntRight: "",
        wrongVehicleReasons: [],
      },
    },
    {
      lifecycleStage: "outcome",
      financePlan: {
        deposit: 6500,
        term: 18,
        selectedFinance: "zero",
        hpVariant: "b",
        balloon: 0,
        apr: 0,
        pxValue: 0,
        settlementFigure: 0,
        gfvPercent: 0,
      },
    },
  ),

  buildBundle(
    "DB-1039",
    {
      status: "finance-pending",
      customer: {
        firstName: "Noah",
        lastName: "Anderson",
        mobile: "07700933456",
        email: "noah.anderson@email.com",
        address: "9 Canal Street, Birmingham",
        postcode: "B1 2SL",
      },
      vehicle: detailVehicles["DB-1039"],
      salesperson: "Tom Harris",
      branch: "birmingham",
      dealSource: "oakwood-website",
      purchaseTimeline: "within-30-days",
      maximumDeposit: 4000,
      customerBudget: 540,
      notes: "PCP application with Tesla — awaiting finance approval.",
      processChecklist: checklistWithoutPx,
      testDriveNotes: {
        ...standardTestDriveNotes,
        buyingMotives: ["betterFuelEconomy", "businessUse"],
        importantFeatures: ["technology", "fuelEconomy", "performance"],
      },
      trialClose: {
        rating: 9,
        lovedMost: "Instant acceleration and tech interface.",
        makeItTen: "",
        concernType: null,
        whatWasntRight: "",
        wrongVehicleReasons: [],
      },
    },
    {
      lifecycleStage: "outcome",
      financePlan: {
        deposit: 4000,
        term: 48,
        selectedFinance: "pcp",
        hpVariant: "b",
        balloon: 12000,
        apr: 8.9,
        pxValue: 0,
        settlementFigure: 0,
        gfvPercent: 43,
      },
    },
  ),
];

export const mockDealDetails: Record<string, DealDetailBundle> =
  Object.fromEntries(mockBundles.map((bundle) => [bundle.deal.id, bundle]));

export function getMockDealDetail(id: string): DealDetailBundle | undefined {
  return mockDealDetails[id];
}
