"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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

// Form Validation Schema
const clientSchema = z.object({
  companyName: z.string().min(1, "Company Name is required"),
  contactPerson: z.string().optional(),
  position: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  contactNumber: z.string().optional(),
  streetAddress: z.string().optional(),
  city: z.string().optional(),
  stateProvince: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
});

type ClientFormValues = z.infer<typeof clientSchema>;

export default function AddClientDialog() {
  const [open, setOpen] = useState(false);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
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
    },
  });

  const onSubmit = (data: ClientFormValues) => {
    console.log("New Client Data:", data);
    // API Call goes here...
    
    setOpen(false);
    form.reset();
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      form.reset(); // Reset form when dialog closes
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button className="bg-primary hover:bg-primary-hover text-primary-foreground px-6 h-11 rounded-md text-sm font-medium" />
        }
      >
        <Plus className="w-4 h-4 mr-2" />
        Add New Client
      </DialogTrigger>
      
      {/* 
        p-0 removes default shadcn padding so we can control header/body/footer borders exactly like the design. 
        sm:max-w-[600px] controls the exact width of the modal.
      */}
      <DialogContent className="sm:max-w-[600px] bg-card border-border p-0 overflow-hidden gap-0">
        <DialogHeader className="px-6 py-4 border-b border-border/50">
          <DialogTitle className="text-lg font-medium text-foreground">
            Add New Client
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
            
            {/* Scrollable Form Body */}
            <div className="px-6 py-6 space-y-8 max-h-[70vh] overflow-y-auto">
              
              {/* Primary Details Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground">Primary Details</h3>
                
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-muted-foreground font-normal">Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Kandy Wholesale" className="h-9.5 px-3 bg-input" {...field} />
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
                        <FormLabel className="text-muted-foreground font-normal">Contact Person</FormLabel>
                        <FormControl>
                          <Input placeholder="Sycilia Dias" className="h-9.5 px-3 bg-input" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-muted-foreground font-normal">Position</FormLabel>
                        <FormControl>
                          <Input placeholder="Manager" className="h-9.5 px-3 bg-input" {...field} />
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
                        <FormLabel className="text-muted-foreground font-normal">Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Email Address" className="h-9.5 px-3 bg-input" {...field} />
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
                        <FormLabel className="text-muted-foreground font-normal">Contact Number</FormLabel>
                        <FormControl>
                          <Input placeholder="011-XXXXXXX" className="h-9.5 px-3 bg-input" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Billing Address Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground">Billing Address</h3>
                
                <FormField
                  control={form.control}
                  name="streetAddress"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-muted-foreground font-normal">Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Street Address..." className="h-9.5 px-3 bg-input" {...field} />
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
                        <FormLabel className="text-muted-foreground font-normal">City</FormLabel>
                        <FormControl>
                          <Input placeholder="City" className="h-9.5 px-3 bg-input" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stateProvince"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-muted-foreground font-normal">State/Province</FormLabel>
                        <FormControl>
                          <Input placeholder="State/Province" className="h-9.5 px-3 bg-input" {...field} />
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
                        <FormLabel className="text-muted-foreground font-normal">Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="11500" className="h-9.5 px-3 bg-input" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-muted-foreground font-normal">Country</FormLabel>
                        <FormControl>
                          <Input placeholder="Sri Lanka" className="h-9.5 px-3 bg-input" {...field} />
                        </FormControl>
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
                onClick={() => handleOpenChange(false)}
                className="text-foreground hover:bg-secondary hover:text-foreground"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary-hover text-primary-foreground font-medium"
              >
                Save Client
              </Button>
            </div>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}