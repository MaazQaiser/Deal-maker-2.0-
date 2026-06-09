"use client";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  SalespersonControlsPanel,
  type SalespersonControlsPanelProps,
} from "@/components/deal-builder/salesperson-controls-panel";

type SalespersonControlsDrawerProps = SalespersonControlsPanelProps & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SalespersonControlsDrawer({
  open,
  onOpenChange,
  ...panelProps
}: SalespersonControlsDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent side="right" className="flex w-full max-w-md flex-col">
        <DrawerHeader className="sr-only">
          <DrawerTitle>Configure Deal</DrawerTitle>
          <DrawerDescription>
            Finance, products, and discounts — hidden from presentation view
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-hidden px-6 pb-6">
          <SalespersonControlsPanel
            {...panelProps}
            onClose={() => onOpenChange(false)}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
