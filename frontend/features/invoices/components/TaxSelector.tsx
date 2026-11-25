"use client";

import { useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { type TaxOrChargeOut } from "@/lib/actions/settings.actions";

interface TaxSelectorProps {
  taxes?: TaxOrChargeOut[];
  charges?: TaxOrChargeOut[];
}

const formatCurrency = (amount: number) =>
  `Rs ${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function TaxSelector({
  taxes = [],
  charges = [],
}: TaxSelectorProps) {
  const { watch, setValue } = useFormContext();

  const items = watch("items") || [];
  const selectedTaxIds: number[] = watch("selectedTaxIds") || [];
  const selectedChargeIds: number[] = watch("selectedChargeIds") || [];

  const subtotal = items.reduce((sum: number, item: any) => {
    const qty = parseFloat(item.qty) || 0;
    const rate = parseFloat(item.rate) || 0;
    return sum + qty * rate;
  }, 0);

  const calcRuleAmount = (rule: TaxOrChargeOut) => {
    const val = Number(rule.value) || 0;
    return rule.value_type === "percentage" ? (subtotal * val) / 100 : val;
  };

  const toggleId = (
    field: "selectedTaxIds" | "selectedChargeIds",
    currentIds: number[],
    id: number,
    checked: boolean
  ) => {
    const next = checked
      ? [...currentIds, id]
      : currentIds.filter((item) => item !== id);
    setValue(field, next, { shouldDirty: true });
  };

  const totalTaxes = taxes
    .filter((t) => selectedTaxIds.includes(t.id))
    .reduce((sum, t) => sum + calcRuleAmount(t), 0);

  const totalCharges = charges
    .filter((c) => selectedChargeIds.includes(c.id))
    .reduce((sum, c) => sum + calcRuleAmount(c), 0);

  const grandTotal = subtotal + totalTaxes + totalCharges;

  return (
    <div className="bg-[#1A1A1A] border border-border rounded-xl p-6 space-y-6">
      <div className="flex justify-between items-center text-sm font-medium text-foreground">
        <span>Subtotal</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">
          Select TAX & Charges
        </h4>

        {taxes.length === 0 && charges.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No taxes or charges configured in Settings.
          </p>
        ) : (
          <>
            {taxes.map((tax) => {
              const isChecked = selectedTaxIds.includes(tax.id);
              const label =
                tax.value_type === "percentage"
                  ? `${tax.name} (${tax.value}%)`
                  : `${tax.name} (Fixed)`;

              return (
                <div
                  key={`tax-${tax.id}`}
                  className="flex flex-row items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={(checked) =>
                        toggleId(
                          "selectedTaxIds",
                          selectedTaxIds,
                          tax.id,
                          Boolean(checked)
                        )
                      }
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <span className="text-sm text-muted-foreground">
                      {label}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(calcRuleAmount(tax))}
                  </span>
                </div>
              );
            })}

            {charges.map((charge) => {
              const isChecked = selectedChargeIds.includes(charge.id);
              const label =
                charge.value_type === "percentage"
                  ? `${charge.name} (${charge.value}%)`
                  : `${charge.name} (Fixed)`;

              return (
                <div
                  key={`charge-${charge.id}`}
                  className="flex flex-row items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={(checked) =>
                        toggleId(
                          "selectedChargeIds",
                          selectedChargeIds,
                          charge.id,
                          Boolean(checked)
                        )
                      }
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <span className="text-sm text-muted-foreground">
                      {label}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(calcRuleAmount(charge))}
                  </span>
                </div>
              );
            })}
          </>
        )}
      </div>

      <div className="pt-4 border-t border-border/50 flex justify-between items-center text-base font-medium text-foreground">
        <span>Grand Total</span>
        <span>{formatCurrency(grandTotal)}</span>
      </div>
    </div>
  );
}