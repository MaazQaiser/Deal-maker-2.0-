"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import type { FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Car, Search, User, Minus, Equal, X } from "lucide-react";
import { toast } from "sonner";
import {
  dealCreationSchema,
  type DealCreationFormValues,
} from "@/lib/validations/deal";
import {
  branches,
  leadSources,
  existingCustomers,
  lookupPartExchange,
  lookupVehicleByRegistration,
  purchaseTimelines,
  searchCustomers,
  searchStockVehicles,
  stockVehicles,
} from "@/constants/deal-mock-data";
import {
  pxKeyCountOptions,
  pxServiceHistoryTypes,
  pxServicedWhereOptions,
} from "@/constants/part-exchange-options";
import { routes } from "@/constants/routes";
import { formatGbp } from "@/lib/formatGbp";
import { useDealStore } from "@/store/dealStore";
import type { CustomerRecord, VehicleRecord } from "@/types/deal";
import { PageContainer } from "@/components/layouts/page-container";
import { PageHeader } from "@/components/layouts/page-header";
import { CarBrandLogo } from "@/components/deals/car-brand-logo";
import { DealCreationStepper } from "@/components/deals/deal-creation-stepper";
import { SceneSetterCard } from "@/components/deals/scene-setter-card";
import { dealCreationSteps } from "@/constants/deal-creation-steps";
import { dealCreationDefaultValues } from "@/lib/deal-creation-defaults";
import { FormField } from "@/components/forms/form-field";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/data-display/card";
import { KeyValueList } from "@/components/data-display/key-value-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";
import { PxRegistrationPlateField } from "@/components/deals/part-exchange/px-registration-plate-field";
import {
  PxValueDriversGrid,
  PxValueDriversGridLegend,
} from "@/components/deals/part-exchange/px-value-drivers-grid";
import { PxPhotoUpload } from "@/components/deals/part-exchange/px-photo-upload";
import { cn } from "@/lib/cn";

const dealPanelClass = "rounded-[24px] bg-card shadow-sm";
const dealNestedPanelClass = "rounded-[24px] bg-muted/50 p-4";
const pxOptionRowClass = "flex flex-row flex-wrap items-center gap-x-6 gap-y-2";

function InternalBadge() {
  return (
    <Badge variant="neutral" className="text-[10px] uppercase tracking-wide">
      Internal Only
    </Badge>
  );
}

function formatMotExpiry(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type YesNoValue = "yes" | "no";

function YesNoRadioGroup({
  value,
  onChange,
  yesId,
  noId,
}: {
  value?: YesNoValue;
  onChange: (value: YesNoValue) => void;
  yesId: string;
  noId: string;
}) {
  return (
    <RadioGroup
      value={value}
      onValueChange={(next) => onChange(next as YesNoValue)}
      className={pxOptionRowClass}
    >
      <div className="flex items-center gap-2">
        <RadioGroupItem value="yes" id={yesId} />
        <Label htmlFor={yesId} className="font-normal">
          Yes
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="no" id={noId} />
        <Label htmlFor={noId} className="font-normal">
          No
        </Label>
      </div>
    </RadioGroup>
  );
}

function CustomerSearchField({
  query,
  isOpen,
  onQueryChange,
  onFocus,
  onBlur,
  onSelect,
}: {
  query: string;
  isOpen: boolean;
  onQueryChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onSelect: (customer: CustomerRecord) => void;
}) {
  const results = useMemo(
    () => (query.trim() ? searchCustomers(query) : existingCustomers),
    [query]
  );

  return (
    <div className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="customerSearch"
          type="search"
          placeholder="Search existing customers by name, phone, or email"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          className="pl-9"
          autoComplete="off"
        />
      </div>

      {isOpen && (
        <div
          className={cn(
            dealPanelClass,
            "absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden"
          )}
        >
          {results.length === 0 ? (
            <p className="px-4 py-3 text-caption text-muted-foreground">
              No customers found
            </p>
          ) : (
            <ul role="listbox" className="max-h-60 overflow-y-auto py-1">
              {results.map((customer) => (
                <li key={customer.id}>
                  <button
                    type="button"
                    role="option"
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => onSelect(customer)}
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <User className="size-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">
                        {customer.firstName} {customer.lastName}
                      </p>
                      <p className="truncate text-caption text-muted-foreground">
                        {customer.mobile}
                        {customer.email ? ` · ${customer.email}` : ""}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function SelectedCustomerCard({
  customer,
  onChange,
}: {
  customer: CustomerRecord;
  onChange: () => void;
}) {
  return (
    <div className={cn(dealNestedPanelClass, "space-y-4")}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <User className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-heading-4">
              {customer.firstName} {customer.lastName}
            </p>
            <Badge variant="info" className="mt-1">
              Existing Customer
            </Badge>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onChange}
          className="shrink-0 text-muted-foreground"
        >
          <X className="size-4" />
          Change
        </Button>
      </div>

      <KeyValueList
        items={[
          { key: "Mobile", value: customer.mobile },
          ...(customer.email ? [{ key: "Email", value: customer.email }] : []),
          ...(customer.address
            ? [{ key: "Address", value: customer.address }]
            : []),
          ...(customer.postcode
            ? [{ key: "Postcode", value: customer.postcode }]
            : []),
        ]}
      />
    </div>
  );
}

function VehicleDetailsPanel({ vehicle }: { vehicle: VehicleRecord }) {
  const margin = vehicle.retailPrice - vehicle.vehicleCost;

  return (
    <div className={cn(dealNestedPanelClass, "space-y-4")}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <CarBrandLogo make={vehicle.make} />
          <p className="truncate text-sm font-medium">
            {vehicle.make} {vehicle.model} {vehicle.variant}
          </p>
        </div>
        <Badge variant="success">Selected</Badge>
      </div>
      <KeyValueList
        items={[
          { key: "Make", value: vehicle.make },
          { key: "Model", value: vehicle.model },
          { key: "Variant", value: vehicle.variant },
          { key: "Registration", value: vehicle.registration },
          { key: "Year", value: String(vehicle.year) },
          {
            key: "Mileage",
            value: `${vehicle.mileage.toLocaleString("en-GB")} miles`,
          },
          { key: "Colour", value: vehicle.colour },
        ]}
      />
      <div className="border-t border-border pt-4">
        <p className="mb-3 text-sm font-medium">Pricing</p>
        <dl className="space-y-0">
          <div className="flex items-center justify-between py-3">
            <dt className="text-caption font-medium">Retail Price</dt>
            <dd className="text-body">{formatGbp(vehicle.retailPrice)}</dd>
          </div>
          <div className="flex items-center justify-between border-t border-border py-3">
            <dt className="flex items-center gap-2 text-caption font-medium">
              Vehicle Cost <InternalBadge />
            </dt>
            <dd className="text-body">{formatGbp(vehicle.vehicleCost)}</dd>
          </div>
          <div className="flex items-center justify-between border-t border-border py-3">
            <dt className="flex items-center gap-2 text-caption font-medium">
              Vehicle Margin <InternalBadge />
            </dt>
            <dd className="text-body">{formatGbp(margin)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export function DealCreationScreen() {
  const router = useRouter();
  const creationDraft = useDealStore((s) => s.creationDraft);
  const saveCreationDraft = useDealStore((s) => s.saveCreationDraft);

  const [customerSearch, setCustomerSearch] = useState("");
  const [customerSearchOpen, setCustomerSearchOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerRecord | null>(null);
  const [regLookup, setRegLookup] = useState("");
  const [stockSearch, setStockSearch] = useState("");
  const [pxRegLookup, setPxRegLookup] = useState("");
  const [pxVehicle, setPxVehicle] = useState<
    ReturnType<typeof lookupPartExchange>
  >(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [pxLookupError, setPxLookupError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DealCreationFormValues>({
    resolver: zodResolver(dealCreationSchema),
    defaultValues: dealCreationDefaultValues,
  });

  useEffect(() => {
    if (!creationDraft) return;

    reset(creationDraft);

    if (creationDraft.existingCustomerId) {
      const customer = existingCustomers.find(
        (item) => item.id === creationDraft.existingCustomerId,
      );
      if (customer) setSelectedCustomer(customer);
    }

    if (creationDraft.pxRegistration) {
      setPxRegLookup(creationDraft.pxRegistration);
      setPxVehicle(lookupPartExchange(creationDraft.pxRegistration));
    }

    if (creationDraft.vehicleId) {
      const vehicle = stockVehicles.find(
        (item) => item.id === creationDraft.vehicleId,
      );
      if (vehicle) setRegLookup(vehicle.registration);
    }
  }, [creationDraft, reset]);

  const vehicleId = watch("vehicleId");
  const hasPartExchange = watch("hasPartExchange");
  const pxValuation = watch("pxValuation");
  const pxExistingFinance = watch("pxExistingFinance");
  const pxSettlementFigure = watch("pxSettlementFigure");
  const pxAccidentHistory = watch("pxAccidentHistory");

  const selectedVehicle = stockVehicles.find((v) => v.id === vehicleId);
  const stockResults = useMemo(
    () => searchStockVehicles(stockSearch),
    [stockSearch]
  );

  const equity = useMemo(() => {
    const val = Number(pxValuation) || 0;
    const settlement =
      pxExistingFinance === "yes" ? Number(pxSettlementFigure) || 0 : 0;
    return val - settlement;
  }, [pxValuation, pxExistingFinance, pxSettlementFigure]);

  const handleCustomerSelect = (customer: CustomerRecord) => {
    setSelectedCustomer(customer);
    setCustomerSearch("");
    setCustomerSearchOpen(false);
    setValue("isExistingCustomer", true);
    setValue("firstName", customer.firstName, { shouldValidate: true });
    setValue("lastName", customer.lastName, { shouldValidate: true });
    setValue("mobile", customer.mobile, { shouldValidate: true });
    setValue("email", customer.email ?? "");
    setValue("address", customer.address ?? "");
    setValue("postcode", customer.postcode ?? "");
    setValue("existingCustomerId", customer.id);
  };

  const handleClearCustomer = () => {
    setSelectedCustomer(null);
    setCustomerSearch("");
    setCustomerSearchOpen(false);
    setValue("isExistingCustomer", false);
    setValue("existingCustomerId", undefined);
    setValue("firstName", "");
    setValue("lastName", "");
    setValue("mobile", "");
    setValue("email", "");
    setValue("address", "");
    setValue("postcode", "");
  };

  const handleRegLookup = () => {
    setLookupError(null);
    const vehicle = lookupVehicleByRegistration(regLookup);
    if (vehicle) {
      setValue("vehicleId", vehicle.id, { shouldValidate: true });
    } else {
      setLookupError("No vehicle found for that registration");
      setValue("vehicleId", "");
    }
  };

  const handleStockSelect = (vehicle: VehicleRecord) => {
    setValue("vehicleId", vehicle.id, { shouldValidate: true });
    setStockSearch("");
  };

  const handlePxLookup = () => {
    setPxLookupError(null);
    const px = lookupPartExchange(pxRegLookup);
    if (px) {
      setPxVehicle(px);
      setValue("pxRegistration", px.registration, { shouldValidate: true });
      setValue("pxCurrentMileage", px.mileage);
      setValue("pxValuation", 4000);
      if (px.finance) {
        setValue("pxExistingFinance", "yes");
        setValue("pxLender", px.finance.lender);
        setValue("pxAgreementNumber", px.finance.agreementNumber);
        setValue("pxMonthlyPayment", px.finance.monthlyPayment);
        setValue("pxSettlementFigure", px.finance.settlementFigure);
        setValue("pxSettlementQuoteDate", px.finance.settlementQuoteDate);
      }
    } else {
      setPxVehicle(null);
      setValue("pxRegistration", pxRegLookup);
      setPxLookupError("No part exchange vehicle found for that registration");
    }
  };

  const clearPartExchangeFields = () => {
    setPxVehicle(null);
    setPxRegLookup("");
    setPxLookupError(null);
    setValue("pxRegistration", "");
    setValue("pxCurrentMileage", undefined);
    setValue("pxServiceHistoryType", undefined);
    setValue("pxServicedWhere", undefined);
    setValue("pxV5InSellersName", undefined);
    setValue("pxKeyCount", undefined);
    setValue("pxInsuranceWriteOff", undefined);
    setValue("pxAccidentHistory", undefined);
    setValue("pxAccidentDescription", "");
    setValue("pxValueDrivers", []);
    setValue("pxFeaturesNotes", "");
    setValue("pxConditionNotes", "");
    setValue("pxPhotos", []);
    setValue("pxValuation", undefined);
    setValue("pxExistingFinance", undefined);
    setValue("pxLender", undefined);
    setValue("pxAgreementNumber", undefined);
    setValue("pxMonthlyPayment", undefined);
    setValue("pxSettlementFigure", undefined);
    setValue("pxSettlementQuoteDate", undefined);
  };

  const onSubmit = async (data: DealCreationFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    saveCreationDraft(data);
    toast.success("Deal created", {
      description: "Step 1 saved. Continue to complete deal setup.",
    });
    router.push(routes.deals.new.step2);
  };

  const onInvalid = (formErrors: FieldErrors<DealCreationFormValues>) => {
    const firstKey = Object.keys(formErrors)[0] as keyof DealCreationFormValues | undefined;
    const firstError = firstKey ? formErrors[firstKey] : undefined;
    const message =
      typeof firstError?.message === "string"
        ? firstError.message
        : "Please complete required fields before continuing.";

    toast.error("Cannot continue yet", { description: message });

    if (!firstKey) return;

    const selector = `[name="${String(firstKey)}"], #${String(firstKey)}`;
    const target = document.querySelector(selector) as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
      | null;

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      target.focus();
    }
  };

  return (
    <PageContainer size="md" className="space-y-6 py-6 sm:space-y-8">
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6" noValidate>
        <PageHeader
          sticky
          title="Arrival & intake"
          titleClassName="text-page-title"
          description={dealCreationSteps[0].subtitle}
          footer={<DealCreationStepper currentStep={1} />}
          actions={
            <>
              <Button type="button" variant="outline" asChild>
                <Link href={routes.dashboard}>Cancel</Link>
              </Button>
              <Button type="submit" loading={isSubmitting}>
                Continue
              </Button>
            </>
          }
        />
        <SceneSetterCard scene="arrival" />
        {/* Section 1 — Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-5 text-primary" />
              Customer Information
            </CardTitle>
            <CardDescription>Identify the customer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedCustomer ? (
              <SelectedCustomerCard
                customer={selectedCustomer}
                onChange={handleClearCustomer}
              />
            ) : (
              <>
                <CustomerSearchField
                  query={customerSearch}
                  isOpen={customerSearchOpen}
                  onQueryChange={setCustomerSearch}
                  onFocus={() => setCustomerSearchOpen(true)}
                  onBlur={() => {
                    window.setTimeout(() => setCustomerSearchOpen(false), 150);
                  }}
                  onSelect={handleCustomerSelect}
                />

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-3 text-muted-foreground">
                      or add new customer
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    label="First Name"
                    htmlFor="firstName"
                    error={errors.firstName?.message}
                    required
                  >
                    <Input
                      id="firstName"
                      error={!!errors.firstName}
                      {...register("firstName")}
                    />
                  </FormField>
                  <FormField
                    label="Last Name"
                    htmlFor="lastName"
                    error={errors.lastName?.message}
                    required
                  >
                    <Input
                      id="lastName"
                      error={!!errors.lastName}
                      {...register("lastName")}
                    />
                  </FormField>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    label="Mobile Number"
                    htmlFor="mobile"
                    error={errors.mobile?.message}
                    hint="UK format, numbers only"
                    required
                  >
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="07700 900123"
                      error={!!errors.mobile}
                      {...register("mobile")}
                    />
                  </FormField>
                  <FormField
                    label="Email Address"
                    htmlFor="email"
                    error={errors.email?.message}
                  >
                    <Input
                      id="email"
                      type="email"
                      placeholder="customer@email.com"
                      error={!!errors.email}
                      {...register("email")}
                    />
                  </FormField>
                </div>

                <FormField label="Address" htmlFor="address">
                  <Textarea
                    id="address"
                    placeholder="Street address"
                    rows={2}
                    {...register("address")}
                  />
                </FormField>
              </>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              {!selectedCustomer && (
                <FormField label="Postcode" htmlFor="postcode">
                  <Input
                    id="postcode"
                    placeholder="M20 3JB"
                    {...register("postcode")}
                  />
                </FormField>
              )}

              <FormField
                label="Where did customer see the vehicle?"
                htmlFor="dealSource"
                error={errors.dealSource?.message}
                required
                className={selectedCustomer ? "sm:col-span-2" : undefined}
              >
                <Controller
                  name="dealSource"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="dealSource" error={!!errors.dealSource}>
                        <SelectValue placeholder="Select where customer saw the vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        {leadSources.map((source) => (
                          <SelectItem key={source.value} value={source.value}>
                            {source.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* Section 2 — Vehicle Being Sold */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="size-5 text-primary" />
              Vehicle Being Sold
            </CardTitle>
            <CardDescription>
              Identify the vehicle the customer wants to buy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="registration">
              <TabsList>
                <TabsTrigger value="registration">Registration Lookup</TabsTrigger>
                <TabsTrigger value="stock">Search Stock</TabsTrigger>
              </TabsList>

              <TabsContent value="registration" className="space-y-3">
                <FormField
                  label="Vehicle Registration"
                  htmlFor="regLookup"
                  hint="Example: AB12 XYZ"
                >
                  <div className="flex gap-2">
                    <Input
                      id="regLookup"
                      placeholder="AB12 XYZ"
                      value={regLookup}
                      onChange={(e) => setRegLookup(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleRegLookup())}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleRegLookup}
                    >
                      <Search className="size-4" />
                      Search
                    </Button>
                  </div>
                </FormField>
              </TabsContent>

              <TabsContent value="stock" className="space-y-3">
                <FormField label="Search Inventory" htmlFor="stockSearch">
                  <Input
                    id="stockSearch"
                    placeholder="BMW X3, Audi A4, VW Golf..."
                    value={stockSearch}
                    onChange={(e) => setStockSearch(e.target.value)}
                  />
                </FormField>
                {stockResults.length > 0 && (
                  <ul className={cn(dealPanelClass, "overflow-hidden")}>
                    {stockResults.map((vehicle) => (
                      <li key={vehicle.id}>
                        <button
                          type="button"
                          className={cn(
                            "flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-muted",
                            vehicleId === vehicle.id && "bg-muted"
                          )}
                          onClick={() => handleStockSelect(vehicle)}
                        >
                          <CarBrandLogo make={vehicle.make} />
                          <span className="min-w-0 flex-1 font-medium">
                            {vehicle.make} {vehicle.model} {vehicle.variant}
                          </span>
                          <span className="shrink-0 text-caption text-muted-foreground">
                            {vehicle.registration} · {formatGbp(vehicle.retailPrice)}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </TabsContent>
            </Tabs>

            {lookupError && !selectedVehicle && (
              <p className="text-caption text-danger">{lookupError}</p>
            )}
            {errors.vehicleId && (
              <p className="text-caption text-danger" role="alert">
                {errors.vehicleId.message}
              </p>
            )}

            {selectedVehicle && <VehicleDetailsPanel vehicle={selectedVehicle} />}
          </CardContent>
        </Card>

        {/* Section 3 — Part Exchange */}
        <Card>
          <CardHeader>
            <CardTitle>Part Exchange</CardTitle>
            <CardDescription>Customer trading in a vehicle (optional)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div
              className={cn(
                dealNestedPanelClass,
                "flex items-center justify-between",
              )}
            >
              <div>
                <Label htmlFor="hasPartExchange" className="text-sm font-medium">
                  Customer Has Part Exchange
                </Label>
                <p className="text-caption text-muted-foreground">
                  Enable to capture trade-in details
                </p>
              </div>
              <Controller
                name="hasPartExchange"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="hasPartExchange"
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      if (!checked) clearPartExchangeFields();
                    }}
                  />
                )}
              />
            </div>

            {hasPartExchange && (
              <div className={cn(dealNestedPanelClass, "space-y-6")}>
                <FormField
                  label="Registration"
                  htmlFor="pxRegLookup"
                  error={errors.pxRegistration?.message ?? pxLookupError ?? undefined}
                  hint="Try XY22 ABC or MN19 DEF to test lookup"
                  required
                >
                  <PxRegistrationPlateField
                    value={pxRegLookup}
                    onChange={setPxRegLookup}
                    onLookup={handlePxLookup}
                    error={!!errors.pxRegistration}
                    onKeyDown={(event) =>
                      event.key === "Enter" &&
                      (event.preventDefault(), handlePxLookup())
                    }
                  />
                </FormField>

                {pxVehicle && (
                  <KeyValueList
                    items={[
                      { key: "Make", value: pxVehicle.make },
                      { key: "Model", value: pxVehicle.model },
                      { key: "Year", value: String(pxVehicle.year) },
                      { key: "Colour", value: pxVehicle.colour },
                      { key: "Fuel", value: pxVehicle.fuel },
                      {
                        key: "MOT expires",
                        value: formatMotExpiry(pxVehicle.motExpires),
                      },
                    ]}
                  />
                )}

                <FormField
                  label="Current mileage"
                  htmlFor="pxCurrentMileage"
                  error={errors.pxCurrentMileage?.message}
                  required
                >
                  <Input
                    id="pxCurrentMileage"
                    type="number"
                    min={0}
                    error={!!errors.pxCurrentMileage}
                    {...register("pxCurrentMileage")}
                  />
                </FormField>

                <div className="divide-y divide-border border-t border-border">
                  <FormField
                    label="History type"
                    className="py-6"
                    error={errors.pxServiceHistoryType?.message}
                    required
                  >
                    <Controller
                      name="pxServiceHistoryType"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className={pxOptionRowClass}
                        >
                          {pxServiceHistoryTypes.map((option) => (
                            <div key={option.value} className="flex items-center gap-2">
                              <RadioGroupItem
                                value={option.value}
                                id={`px-service-${option.value}`}
                              />
                              <Label
                                htmlFor={`px-service-${option.value}`}
                                className="font-normal"
                              >
                                {option.label}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}
                    />
                  </FormField>

                  <FormField
                    label="Serviced where"
                    className="py-6"
                    error={errors.pxServicedWhere?.message}
                    required
                  >
                    <Controller
                      name="pxServicedWhere"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className={pxOptionRowClass}
                        >
                          {pxServicedWhereOptions.map((option) => (
                            <div key={option.value} className="flex items-center gap-2">
                              <RadioGroupItem
                                value={option.value}
                                id={`px-serviced-${option.value}`}
                              />
                              <Label
                                htmlFor={`px-serviced-${option.value}`}
                                className="font-normal"
                              >
                                {option.label}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}
                    />
                  </FormField>

                  <FormField
                    label="V5 in seller's name"
                    className="py-6"
                    error={errors.pxV5InSellersName?.message}
                    required
                  >
                    <Controller
                      name="pxV5InSellersName"
                      control={control}
                      render={({ field }) => (
                        <YesNoRadioGroup
                          value={field.value}
                          onChange={field.onChange}
                          yesId="px-v5-yes"
                          noId="px-v5-no"
                        />
                      )}
                    />
                  </FormField>

                  <FormField
                    label="Number of keys"
                    className="py-6"
                    error={errors.pxKeyCount?.message}
                    required
                  >
                    <Controller
                      name="pxKeyCount"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className={pxOptionRowClass}
                        >
                          {pxKeyCountOptions.map((option) => (
                            <div key={option.value} className="flex items-center gap-2">
                              <RadioGroupItem
                                value={option.value}
                                id={`px-keys-${option.value}`}
                              />
                              <Label
                                htmlFor={`px-keys-${option.value}`}
                                className="font-normal"
                              >
                                {option.label}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}
                    />
                  </FormField>

                  <FormField
                    label="Insurance write-off"
                    className="py-6"
                    error={errors.pxInsuranceWriteOff?.message}
                    required
                  >
                    <Controller
                      name="pxInsuranceWriteOff"
                      control={control}
                      render={({ field }) => (
                        <YesNoRadioGroup
                          value={field.value}
                          onChange={field.onChange}
                          yesId="px-writeoff-yes"
                          noId="px-writeoff-no"
                        />
                      )}
                    />
                  </FormField>

                  <FormField
                    label="Has the car ever been in an accident?"
                    className="py-6"
                    error={errors.pxAccidentHistory?.message}
                    required
                  >
                    <Controller
                      name="pxAccidentHistory"
                      control={control}
                      render={({ field }) => (
                        <YesNoRadioGroup
                          value={field.value}
                          onChange={field.onChange}
                          yesId="px-accident-yes"
                          noId="px-accident-no"
                        />
                      )}
                    />
                  </FormField>
                </div>

                {pxAccidentHistory === "yes" && (
                  <FormField
                    label="If yes — brief description"
                    htmlFor="pxAccidentDescription"
                    error={errors.pxAccidentDescription?.message}
                  >
                    <Input
                      id="pxAccidentDescription"
                      placeholder="Brief description of the accident"
                      error={!!errors.pxAccidentDescription}
                      {...register("pxAccidentDescription")}
                    />
                  </FormField>
                )}

                <div className="space-y-3">
                  <PxValueDriversGridLegend />
                  <Controller
                    name="pxValueDrivers"
                    control={control}
                    render={({ field }) => (
                      <PxValueDriversGrid
                        value={field.value ?? []}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <FormField label="Anything else worth noting?" htmlFor="pxFeaturesNotes">
                  <Input
                    id="pxFeaturesNotes"
                    placeholder="e.g. recent set of new tyres, upgraded sound system"
                    {...register("pxFeaturesNotes")}
                  />
                </FormField>

                <FormField
                  label="Anything I should know about?"
                  htmlFor="pxConditionNotes"
                  hint="Scratches, dents, warning lights, mechanical issues"
                >
                  <Textarea
                    id="pxConditionNotes"
                    placeholder="e.g. small dent on passenger door, alloy kerb on rear left"
                    rows={4}
                    {...register("pxConditionNotes")}
                  />
                </FormField>

                <Controller
                  name="pxPhotos"
                  control={control}
                  render={({ field }) => (
                    <PxPhotoUpload value={field.value ?? []} onChange={field.onChange} />
                  )}
                />

                <FormField
                  label="Existing Finance"
                  error={errors.pxExistingFinance?.message}
                  required
                >
                  <Controller
                    name="pxExistingFinance"
                    control={control}
                    render={({ field }) => (
                      <YesNoRadioGroup
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                          if (value === "no") {
                            setValue("pxLender", undefined);
                            setValue("pxAgreementNumber", undefined);
                            setValue("pxMonthlyPayment", undefined);
                            setValue("pxSettlementFigure", undefined);
                            setValue("pxSettlementQuoteDate", undefined);
                          }
                        }}
                        yesId="existing-finance-yes"
                        noId="existing-finance-no"
                      />
                    )}
                  />
                </FormField>

                {pxExistingFinance === "yes" && (
                  <div className="space-y-6 border-t border-border pt-6">
                    <FormField
                      label="Lender"
                      htmlFor="pxLender"
                      error={errors.pxLender?.message}
                      required
                    >
                      <Input
                        id="pxLender"
                        placeholder="e.g. Black Horse"
                        error={!!errors.pxLender}
                        {...register("pxLender")}
                      />
                    </FormField>

                    <FormField
                      label="Agreement number"
                      htmlFor="pxAgreementNumber"
                      error={errors.pxAgreementNumber?.message}
                      required
                    >
                      <Input
                        id="pxAgreementNumber"
                        placeholder="e.g. BH-2178442"
                        error={!!errors.pxAgreementNumber}
                        {...register("pxAgreementNumber")}
                      />
                    </FormField>

                    <FormField
                      label="Current monthly payment"
                      htmlFor="pxMonthlyPayment"
                      error={errors.pxMonthlyPayment?.message}
                      required
                    >
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          £
                        </span>
                        <Input
                          id="pxMonthlyPayment"
                          type="number"
                          min={0}
                          className="pl-7"
                          error={!!errors.pxMonthlyPayment}
                          {...register("pxMonthlyPayment")}
                        />
                      </div>
                    </FormField>

                    <FormField
                      label="Settlement figure"
                      htmlFor="pxSettlementFigure"
                      error={errors.pxSettlementFigure?.message}
                      required
                    >
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          £
                        </span>
                        <Input
                          id="pxSettlementFigure"
                          type="number"
                          min={0}
                          className="pl-7"
                          error={!!errors.pxSettlementFigure}
                          {...register("pxSettlementFigure")}
                        />
                      </div>
                    </FormField>

                    <FormField
                      label="Settlement quote date"
                      htmlFor="pxSettlementQuoteDate"
                      error={errors.pxSettlementQuoteDate?.message}
                      hint="If >30 days old, request a fresh quote"
                      required
                    >
                      <Input
                        id="pxSettlementQuoteDate"
                        type="date"
                        error={!!errors.pxSettlementQuoteDate}
                        {...register("pxSettlementQuoteDate")}
                      />
                    </FormField>
                  </div>
                )}

                <FormField
                  label="Estimated Value"
                  htmlFor="pxValuation"
                  error={errors.pxValuation?.message}
                  required
                >
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      £
                    </span>
                    <Input
                      id="pxValuation"
                      type="number"
                      min={0}
                      className="pl-7"
                      error={!!errors.pxValuation}
                      {...register("pxValuation")}
                    />
                  </div>
                </FormField>

                {(pxValuation !== undefined ||
                  (pxExistingFinance === "yes" && pxSettlementFigure !== undefined)) && (
                  <div className="rounded-[16px] bg-background/60 p-4">
                    <p className="mb-3 text-sm font-medium">Equity</p>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className="font-medium">
                        {formatGbp(Number(pxValuation) || 0)}
                      </span>
                      {pxExistingFinance === "yes" && (
                        <>
                          <Minus className="size-4 text-muted-foreground" />
                          <span className="font-medium">
                            {formatGbp(Number(pxSettlementFigure) || 0)}
                          </span>
                        </>
                      )}
                      <Equal className="size-4 text-muted-foreground" />
                      <span
                        className={cn(
                          "font-semibold",
                          equity >= 0 ? "text-success" : "text-danger",
                        )}
                      >
                        {formatGbp(equity)} Equity
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section 4 — Deal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Deal Information</CardTitle>
            <CardDescription>Metadata about this deal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              label="Salesperson"
              htmlFor="salesperson"
              error={errors.salesperson?.message}
              required
            >
              <Input
                id="salesperson"
                readOnly
                className="bg-muted"
                {...register("salesperson")}
              />
            </FormField>

            <FormField
              label="Branch"
              htmlFor="branch"
              error={errors.branch?.message}
              required
            >
              <Controller
                name="branch"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="branch" error={!!errors.branch}>
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((b) => (
                        <SelectItem key={b.value} value={b.value}>
                          {b.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            <FormField
              label="Expected Purchase Timeline"
              htmlFor="purchaseTimeline"
              error={errors.purchaseTimeline?.message}
              required
            >
              <Controller
                name="purchaseTimeline"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="purchaseTimeline"
                      error={!!errors.purchaseTimeline}
                    >
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      {purchaseTimelines.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
            <FormField
              label="Notes"
              htmlFor="notes"
              hint="Preferences, objections, or context for later"
            >
              <Textarea
                id="notes"
                placeholder="Interested in lowest monthly payment. Prefers automatic transmission."
                rows={4}
                className="min-h-[120px] resize-y"
                {...register("notes")}
              />
            </FormField>
          </CardContent>
        </Card>

      </form>
    </PageContainer>
  );
}
