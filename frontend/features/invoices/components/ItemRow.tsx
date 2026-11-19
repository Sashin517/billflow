import { useFormContext } from "react-hook-form";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormControl } from "@/components/ui/form";

export default function ItemRow({ index, remove }: { index: number; remove: (index: number) => void }) {
  const { control, watch } = useFormContext();

  // 1. Calculate amount in real-time
  const qty = parseFloat(watch(`items.${index}.qty`)) || 0;
  const rate = parseFloat(watch(`items.${index}.rate`)) || 0;
  const amount = qty * rate;

  const formattedAmount = amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // 2. Dynamically shrink text size to prevent wrapping on large numbers
  let amountSizeClass = "text-sm";
  if (amount >= 10000000) {
    amountSizeClass = "text-[10px] tracking-tighter";
  } else if (amount >= 100000) {
    amountSizeClass = "text-xs tracking-tight";
  }

  return (
    <div className="grid grid-cols-12 gap-3 items-center">
      <div className="col-span-4">
        <FormField
          control={control}
          name={`items.${index}.name`}
          render={({ field }) => (
            <FormItem><FormControl><Input className="h-9.5 px-3 bg-input text-sm" {...field} /></FormControl></FormItem>
          )}
        />
      </div>
      <div className="col-span-2">
        <FormField
          control={control}
          name={`items.${index}.qty`}
          render={({ field }) => (
            <FormItem><FormControl><Input type="number" className="h-9.5 px-3 bg-input text-sm" {...field} /></FormControl></FormItem>
          )}
        />
      </div>
      <div className="col-span-2">
        <FormField
          control={control}
          name={`items.${index}.rate`}
          render={({ field }) => (
            <FormItem><FormControl><Input type="number" className="h-9.5 px-3 bg-input text-sm" {...field} /></FormControl></FormItem>
          )}
        />
      </div>
      
      {/* Dynamic Amount Container */}
      <div className="col-span-2 flex items-center justify-end gap-3 text-right text-foreground overflow-hidden">
        <span className={`whitespace-nowrap overflow-hidden text-ellipsis ${amountSizeClass}`}>
          Rs. {formattedAmount}
        </span>
      </div>
      
      <div className="col-span-2 flex justify-end">
        <button type="button" onClick={() => remove(index)} className="text-muted-foreground hover:text-destructive transition-colors">
          <Trash2 className="w-[18px] h-[18px]" />
        </button>
      </div>
    </div>
  );
}