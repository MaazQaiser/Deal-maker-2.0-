"use client";

import type { IncludedProductMeta } from "@/constants/presentation-content";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

type ProductTrainingDrawerProps = {
  product: IncludedProductMeta | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProductTrainingDrawer({
  product,
  open,
  onOpenChange,
}: ProductTrainingDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent side="right" className="flex w-full max-w-md flex-col">
        {product ? (
          <>
            <DrawerHeader>
              <DrawerTitle>{product.name}</DrawerTitle>
              <DrawerDescription>{product.tagline}</DrawerDescription>
            </DrawerHeader>
            <div className="flex-1 space-y-6 overflow-y-auto px-6 pb-6 scrollbar-thin">
              <section className="space-y-3">
                <h3 className="text-sm font-semibold">Talking Points</h3>
                <ul className="space-y-2">
                  {product.talkingPoints.map((point) => (
                    <li
                      key={point}
                      className="rounded-[12px] bg-muted/50 px-3 py-2 text-sm"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-sm font-semibold">Benefits</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {product.benefits.map((benefit) => (
                    <li key={benefit} className="flex gap-2">
                      <span className="text-success">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-sm font-semibold">Common Objections</h3>
                <div className="space-y-3">
                  {product.objections.map((item) => (
                    <div
                      key={item.objection}
                      className="rounded-[16px] border border-border p-3"
                    >
                      <p className="text-sm font-medium">
                        &ldquo;{item.objection}&rdquo;
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {item.response}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <Button type="button" variant="outline" className="w-full">
                <FileText className="size-4" />
                {product.leafletLabel}
              </Button>
            </div>
          </>
        ) : null}
      </DrawerContent>
    </Drawer>
  );
}
