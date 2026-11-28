"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  clientSchema,
  type ClientFormValues,
} from "@/lib/validations/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { toast } from "sonner";
import {
  createClient,
  updateClient,
  type ClientOut,
} from "@/lib/actions/client.actions";

interface AddClientDialogProps {
  initialClient?: ClientOut | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const emptyValues: ClientFormValues = {
  companyName: "",
  contactPerson: "",
  position: "",
  email: "",
  contactNumber: "",
  streetAddress: "",
  city: "",
  stateProvince: "",
  postalCode: "",
  country: "",
};

function mapClientToForm(client?: ClientOut | null): ClientFormValues {
  if (!client) return emptyValues;
  return {
    companyName: client.company_name || "",
    contactPerson: client.contact_person || "",
    position: client.position || "",
    email: client.email || "",
    contactNumber: client.contact_number || "",
    streetAddress: client.street_address || "",
    city: client.city || "",
    stateProvince: client.state_province || "",
    postalCode: client.postal_code || "",
    country: client.country || "",
  };
}

export default function AddClientDialog({
  initialClient,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: AddClientDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const isEditMode = Boolean(initialClient);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: mapClientToForm(initialClient),
  });

  useEffect(() => {
    if (open) {
      form.reset(mapClientToForm(initialClient));
    }
  }, [open, initialClient, form]);

  const [isPending, startTransition] = useTransition();

  const handleOpenChange = (newOpen: boolean) => {
    if (isControlled) {
      controlledOnOpenChange?.(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
    if (!newOpen) {
      form.reset(emptyValues);
    }
  };

  const onSubmit = (data: ClientFormValues) => {
    startTransition(async () => {
      const res =
        isEditMode && initialClient
          ? await updateClient(initialClient.id, data)
          : await createClient(data);

      if (!res.success) {
        toast.error(res.error || "Failed to save client.");
        return;
      }

      toast.success(
        isEditMode
          ? "Client updated successfully."
          : "Client added successfully."
      );
      handleOpenChange(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!isControlled && (
        <DialogTrigger
          render={
            <Button className="bg-primary hover:bg-primary-hover text-primary-foreground px-6 h-11 rounded-full text-sm font-medium" />
          }
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Client
        </DialogTrigger>
      )}

      {/* 
        p-0 removes default shadcn padding so we can control header/body/footer borders exactly like the design. 
        sm:max-w-[600px] controls the exact width of the modal.
      */}
      <DialogContent className="sm:max-w-[600px] bg-card border-border p-0 overflow-hidden gap-0">
        <DialogHeader className="px-6 py-4 border-b border-border/50">
          <DialogTitle className="text-lg font-medium text-foreground">
            {isEditMode ? "Edit Client" : "Add New Client"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
            {/* Scrollable Form Body */}
            <div className="px-6 py-6 space-y-8 max-h-[70vh] overflow-y-auto">
              {/* Primary Details Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground">
                  Primary Details
                </h3>

                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-muted-foreground font-normal">
                        Company Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Kandy Wholesale"
                          className="h-9.5 px-3 !bg-input"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="contactPerson"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-muted-foreground font-normal">
                          Contact Person
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Sycilia Dias"
                            className="h-9.5 px-3 !bg-input"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-muted-foreground font-normal">
                          Position
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Manager"
                            className="h-9.5 px-3 !bg-input"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-muted-foreground font-normal">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Email Address"
                            className="h-9.5 px-3 !bg-input"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-muted-foreground font-normal">
                          Contact Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="011-XXXXXXX"
                            className="h-9.5 px-3 !bg-input"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Billing Address Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground">
                  Billing Address
                </h3>

                <FormField
                  control={form.control}
                  name="streetAddress"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-muted-foreground font-normal">
                        Street Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Street Address..."
                          className="h-9.5 px-3 !bg-input"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-muted-foreground font-normal">
                          City
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="City"
                            className="h-9.5 px-3 !bg-input"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stateProvince"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-muted-foreground font-normal">
                          State/Province
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="State/Province"
                            className="h-9.5 px-3 !bg-input"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-muted-foreground font-normal">
                          Postal Code
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="11500"
                            className="h-9.5 px-3 !bg-input"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-muted-foreground font-normal">
                          Country
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full !h-9.5 px-3 !bg-input border-input text-sm">
                              <SelectValue placeholder="Select Country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem className="px-4 py-3" value="LK">
                              Sri Lanka
                            </SelectItem>
                            <SelectItem className="px-4 py-3" value="US">
                              United States
                            </SelectItem>
                            <SelectItem className="px-4 py-3" value="UK">
                              United Kingdom
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="px-6 py-4 border-t border-border/50 flex justify-end gap-3 bg-card">
              <Button
                type="button"
                variant="ghost"
                disabled={isPending}
                onClick={() => handleOpenChange(false)}
                className="text-foreground hover:bg-secondary hover:text-foreground rounded-full px-6 h-10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-primary hover:bg-primary-hover text-primary-foreground font-medium rounded-full px-6 h-10"
              >
                {isPending
                  ? "Saving..."
                  : isEditMode
                  ? "Update Client"
                  : "Save Client"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}