import { useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormItem, FormControl } from "@/components/ui/form";

export default function TaxSelector() {
  const { control } = useFormContext();

  return (
    <div className="bg-[#1A1A1A] border border-border rounded-xl p-6 space-y-6">
      
      <div className="flex justify-between items-center text-sm font-medium text-foreground">
        <span>Subtotal</span>
        <span>Rs 150,000.00</span>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Select TAX & Charges</h4>
        
        <FormField
          control={control}
          name="vatEnabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-3">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                </FormControl>
                <span className="text-sm text-muted-foreground">VAT(15%)</span>
              </div>
              <span className="text-sm text-muted-foreground">Rs 22,000.00</span>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="ssclEnabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-3">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                </FormControl>
                <span className="text-sm text-muted-foreground">SSCL(15%)</span>
              </div>
              <span className="text-sm text-muted-foreground">Rs 22,000.00</span>
            </FormItem>
          )}
        />
      </div>

      <div className="pt-4 border-t border-border/50 flex justify-between items-center text-base font-medium text-foreground">
        <span>Grand Total</span>
        <span>Rs 172,000.00</span>
      </div>

    </div>
  );
}