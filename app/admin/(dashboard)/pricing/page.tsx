"use client";

import PricingForm from "@/components/admin/PricingForm";

export default function PricingPage() {
  return (
    <div className="flex animate-in flex-col gap-6 fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Pricing</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Rates guests see in the booking widget.
        </p>
      </div>
      <PricingForm />
    </div>
  );
}
