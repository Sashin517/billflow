"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Pencil } from "lucide-react";
import { profileSchema, type ProfileFormValues } from "@/lib/validations/settings";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  saveBusinessProfile,
  deleteTaxRule,
  deleteChargeRule,
} from "@/lib/actions/settings.actions";

interface BusinessProfileFormProps {
  initialData?: Partial<ProfileFormValues> | null;
}

const emptyDefaults: ProfileFormValues = {
  propertyName: "",
  streetAddress: "",
  city: "",
  stateProvince: "",
  postalCode: "",
  country: "",
  phones: [{ number: "", type: "Mobile", customLabel: "" }],
  email: "",
  website: "",
  taxNumber: "",
  taxes: [{ name: "VAT", value: "18", isPercentage: true }],
  charges: [{ name: "Service Charge", value: "2000.00", isPercentage: false }],
};

export default function BusinessProfileForm({
  initialData,
}: BusinessProfileFormProps) {
  const hasExistingProfile = Boolean(initialData?.propertyName);
  const [isEditing, setIsEditing] = useState(!hasExistingProfile);
  const [isPending, startTransition] = useTransition();

  const [savedSnapshot, setSavedSnapshot] = useState<ProfileFormValues>({
    ...emptyDefaults,
    propertyName: initialData?.propertyName ?? "",
    streetAddress: initialData?.streetAddress ?? "",
    city: initialData?.city ?? "",
    stateProvince: initialData?.stateProvince ?? "",
    postalCode: initialData?.postalCode ?? "",
    country: initialData?.country ?? "",
    phones: initialData?.phones?.length
      ? initialData.phones
      : [{ number: "", type: "Mobile", customLabel: "" }],
    email: initialData?.email ?? "",
    website: initialData?.website ?? "",
    taxNumber: initialData?.taxNumber ?? "",
    taxes: initialData?.taxes?.length
      ? initialData.taxes
      : [{ name: "VAT", value: "18", isPercentage: true }],
    charges: initialData?.charges?.length
      ? initialData.charges
      : [{ name: "Service Charge", value: "2000.00", isPercentage: false }],
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: savedSnapshot,
  });

  const { fields: phoneFields, append: appendPhone, remove: removePhone } = useFieldArray({
    control: form.control,
    name: "phones",
  });

  const { fields: taxFields, append: appendTax, remove: removeTax } = useFieldArray({
    control: form.control,
    name: "taxes",
  });

  const { fields: chargeFields, append: appendCharge, remove: removeCharge } = useFieldArray({
    control: form.control,
    name: "charges",
  });

  const { isDirty } = form.formState;

  function onSubmit(data: ProfileFormValues) {
    startTransition(async () => {
      const result = await saveBusinessProfile(data);

      if (!result.success) {
        toast.error(result.error || "Failed to save business profile.");
        return;
      }

      setSavedSnapshot(data);
      form.reset(data);
      setIsEditing(false);
      toast.success("Business profile saved successfully.");
    });
  }

  return (
    <div className="bg-card border border-border rounded-xl p-8 max-w-5xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <fieldset
            disabled={!isEditing || isPending}
            className="space-y-8 disabled:opacity-85"
          >
            {/* Business Details Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-foreground">Business Details</h3>

              <FormField
                control={form.control}
                name="propertyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Property Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Hotel Group" className="h-9.5 px-3 bg-input md:w-1/2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address Section */}
            <div className="space-y-6">
              <h3 className="text-base font-medium text-muted-foreground">Address</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="streetAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Enterprise Way..." className="h-9.5 px-3 bg-input" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">City</FormLabel>
                      <FormControl>
                        <Input placeholder="Nugegoda" className="h-9.5 px-3 bg-input" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stateProvince"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">State/Province</FormLabel>
                      <FormControl>
                        <Input placeholder="State/Province" className="h-9.5 px-3 bg-input" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="11202" className="h-9.5 px-3 bg-input" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">Country</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!isEditing || isPending}
                      >
                        <FormControl>
                          <SelectTrigger className="h-9.5 px-3 bg-input">
                            <SelectValue placeholder="Select Country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem className="px-4 py-3" value="LK">Sri Lanka</SelectItem>
                          <SelectItem className="px-4 py-3" value="US">United States</SelectItem>
                          <SelectItem className="px-4 py-3" value="UK">United Kingdom</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Contact Numbers Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <h3 className="text-base font-medium text-muted-foreground">Contact Numbers</h3>
              </div>

              {isEditing && (
                <button
                  type="button"
                  onClick={() => appendPhone({ number: "", type: "Mobile", customLabel: "" })}
                  className="flex items-center text-primary hover:text-primary-hover text-sm font-medium transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Number
                </button>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {phoneFields.map((field, index) => (
                  <div key={field.id} className="space-y-2">
                    <FormLabel className="text-muted-foreground">Phone Number {index + 1}</FormLabel>
                    <div className="flex gap-2">
                      <div className="flex-1 flex gap-2">
                        <FormField
                          control={form.control}
                          name={`phones.${index}.number`}
                          render={({ field }) => (
                            <Input placeholder="011-XXXXXXX" className="h-9.5 px-3 bg-input flex-1" {...field} />
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`phones.${index}.type`}
                          render={({ field: selectField }) => (
                            <Select
                              onValueChange={selectField.onChange}
                              value={selectField.value}
                              disabled={!isEditing || isPending}
                            >
                              <SelectTrigger className="h-9.5 px-3 bg-input w-[110px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem className="px-4 py-3" value="Mobile">Mobile</SelectItem>
                                <SelectItem className="px-4 py-3" value="Work">Work</SelectItem>
                                <SelectItem className="px-4 py-3" value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>

                      {form.watch(`phones.${index}.type`) === "Other" && (
                        <FormField
                          control={form.control}
                          name={`phones.${index}.customLabel`}
                          render={({ field }) => (
                            <Input placeholder="Hot-line" className="h-9.5 px-3 bg-input w-[120px]" {...field} />
                          )}
                        />
                      )}

                      {/* ONLY show delete button if it's not the first item */}
                      {isEditing && index > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removePhone(index)}
                          className="bg-secondary border-border shrink-0 hover:bg-destructive/20 hover:text-destructive hover:border-destructive transition-colors h-9.5"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Web & Tax Section */}
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. hotel@mail.com" className="h-9.5 px-3 bg-input" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Website (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. namehotel.lk" className="h-9.5 px-3 bg-input" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="taxNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">TAX NUMBER</FormLabel>
                    <FormControl>
                      <Input placeholder="98-7654813" className="h-9.5 px-3 bg-input" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Separator className="bg-border" />

            {/* Tax & Service Charges Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-foreground">Tax & Service Charges</h3>

              {isEditing && (
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => appendTax({ name: "", value: "", isPercentage: true })}
                    className="flex items-center text-primary hover:text-primary-hover text-sm font-medium w-fit"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Another Tax
                  </button>
                  <button
                    type="button"
                    onClick={() => appendCharge({ name: "", value: "", isPercentage: false })}
                    className="flex items-center text-primary hover:text-primary-hover text-sm font-medium w-fit"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Another Charge
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-12 gap-y-6">
                {/* Render Taxes */}
                {taxFields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-end">
                    <FormField
                      control={form.control}
                      name={`taxes.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="text-muted-foreground">Tax Name {index + 1}</FormLabel>
                          <FormControl>
                            <Input placeholder="VAT" className="bg-input h-9.5 px-3" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`taxes.${index}.value`}
                      render={({ field }) => (
                        <FormItem className="flex-[0.8]">
                          <FormLabel className="text-muted-foreground">Value</FormLabel>
                          <FormControl>
                            <div className="flex h-9.5 w-full overflow-hidden rounded-md border border-input bg-input focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50">
                              {/* Added py-4.5 here to force the container to expand properly */}
                              <span className="flex shrink-0 items-center justify-center border-r border-input bg-secondary px-4 text-sm text-muted-foreground">
                                {form.watch(`taxes.${index}.isPercentage`) ? "%" : "Rs."}
                              </span>
                              <input
                                {...field}
                                className="h-full w-full bg-transparent px-3 text-base outline-none md:text-sm"
                                placeholder="18"
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`taxes.${index}.isPercentage`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-center">
                          <FormLabel className="text-muted-foreground">Percentage/Fixed</FormLabel>
                          <FormControl>
                            {/* h-9.5 exactly matches the computed height of your padded inputs */}
                            <div className="flex h-9.5 items-center justify-center w-full">
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={!isEditing || isPending}
                                className="data-[state=checked]:bg-primary"
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* ONLY show delete button if it's not the first item */}
                    {isEditing && index > 0 && (
                      <div className="flex h-9.5 items-center justify-center">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeTax(index)}
                          className="bg-secondary border-border shrink-0 hover:bg-destructive/20 hover:text-destructive hover:border-destructive transition-colors h-9.5"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}

                {/* Render Charges */}
                {chargeFields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-end">
                    <FormField
                      control={form.control}
                      name={`charges.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="text-muted-foreground">Charge Name {index + 1}</FormLabel>
                          <FormControl>
                            <Input placeholder="Service Charge" className="bg-input h-9.5 px-3" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`charges.${index}.value`}
                      render={({ field }) => (
                        <FormItem className="flex-[0.8]">
                          <FormLabel className="text-muted-foreground">Value</FormLabel>
                          <FormControl>
                            <div className="flex h-9.5 w-full overflow-hidden rounded-md border border-input bg-input focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50">
                              <span className="flex shrink-0 items-center justify-center border-r border-input bg-secondary px-4 text-sm text-muted-foreground">
                                {form.watch(`charges.${index}.isPercentage`) ? "%" : "Rs."}
                              </span>
                              <input
                                {...field}
                                className="h-full w-full bg-transparent px-3 text-base outline-none md:text-sm"
                                placeholder="2000.00"
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`charges.${index}.isPercentage`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-center">
                          <FormLabel className="text-muted-foreground">Percentage/Fixed</FormLabel>
                          <FormControl>
                            <div className="flex h-9.5 items-center justify-center w-full">
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={!isEditing || isPending}
                                className="data-[state=checked]:bg-primary"
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {isEditing && index > 0 && (
                      <div className="flex h-9.5 items-center justify-center">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeCharge(index)}
                          className="bg-secondary border-border shrink-0 hover:bg-destructive/20 hover:text-destructive hover:border-destructive transition-colors h-9.5"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </fieldset>

          <Separator className="bg-border" />

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            {!isEditing ? (
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-full px-6 h-10 bg-primary hover:bg-primary-hover text-primary-foreground"
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Button>
            ) : (
              <>
                {hasExistingProfile && (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isPending}
                    onClick={() => {
                      form.reset(savedSnapshot);
                      setIsEditing(false);
                    }}
                    className="rounded-full px-6 h-10 bg-transparent hover:bg-secondary"
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={isPending || (hasExistingProfile && !isDirty)}
                  className="rounded-full px-6 h-10 bg-primary hover:bg-primary-hover text-primary-foreground"
                >
                  {isPending ? "Saving..." : "Save"}
                </Button>
              </>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}