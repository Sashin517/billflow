"use client";

import { useState, useTransition } from "react";
import { Pencil, Trash2, Mail, Phone, MessageSquare, Copy } from "lucide-react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { deleteClient } from "@/lib/actions/client.actions";

export type Client = {
  id?: number;
  company: string;
  contactName: string;
  email: string;
  phone: string;
  initial: string;
};

export default function ClientCard({
  client,
  onEdit,
}: {
  client: Client;
  onEdit?: (client: Client) => void;
}) {
  const [editConfirmOpen, setEditConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleting, startTransition] = useTransition();

  const handleDelete = () => {
    if (!client.id) {
      toast.error("Client ID is missing.");
      return;
    }

    startTransition(async () => {
      const res = await deleteClient(client.id!);
      if (!res.success) {
        toast.error(res.error || "Failed to delete client.");
        return;
      }

      toast.success(`Client '${client.company}' deleted.`);
      setDeleteConfirmOpen(false);
    });
  };

  return (
    <>
      <div className="bg-card border border-border rounded-xl flex flex-col overflow-hidden relative group">
        {/* Top Right Actions */}
        <div className="absolute top-5 right-5 flex items-center gap-3 z-10 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => setEditConfirmOpen(true)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Pencil className="w-[18px] h-[18px]" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteConfirmOpen(true)}
            className="text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="w-[18px] h-[18px]" />
          </button>
        </div>

        {/* Card Content */}
        <div className="p-6 pb-5 flex-1">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 rounded-full bg-[#FDECEE] text-[#D33C4A] font-medium flex items-center justify-center text-lg shrink-0">
              {client.initial}
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-base leading-tight mb-1">
                {client.company}
              </h3>
              <p className="text-sm text-muted-foreground">
                {client.contactName}
              </p>
            </div>
          </div>

          <div className="space-y-1 text-sm text-muted-foreground">
            <p>{client.email}</p>
            <p>{client.phone}</p>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/50 bg-card">
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Mail className="w-[18px] h-[18px]" />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Phone className="w-[18px] h-[18px]" />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <MessageSquare className="w-[18px] h-[18px]" />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Copy className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>

      {/* Edit Confirmation Dialog */}
      <ConfirmDialog
        open={editConfirmOpen}
        onOpenChange={setEditConfirmOpen}
        variant="edit"
        title={`Edit Client '${client.company}'?`}
        description="You are about to modify this client's billing details and contact information."
        onConfirm={() => {
          setEditConfirmOpen(false);
          onEdit?.(client);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        variant="delete"
        title={`Do You Want to Delete '${client.company}'?`}
        description="Are you sure you want to delete this client? This action cannot be undone."
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  );
}