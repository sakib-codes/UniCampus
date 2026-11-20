"use client";

import { useState } from "react";
import { UserPlus, CheckCircle2, Copy, Check } from "lucide-react";
import { Modal, Button } from "@/components/ui";
import { ACTIVE_TERM } from "@/lib/canonicalCampus";

interface InvitePeerModalProps {
  open: boolean;
  onClose: () => void;
}

export function InvitePeerModal({ open, onClose }: InvitePeerModalProps) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteCopied, setInviteCopied] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText("https://unicampus.edu/join?cohort=cse-spring-2026");
    setInviteCopied(true);
    setTimeout(() => setInviteCopied(false), 2000);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setInviteSuccess(true);
    setTimeout(() => {
      setInviteSuccess(false);
      setInviteEmail("");
      onClose();
    }, 1800);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-soft text-brand flex items-center justify-center shrink-0">
            <UserPlus className="w-4 h-4" aria-hidden="true" />
          </div>
          <span>Invite Cohort Peer</span>
        </div>
      }
      description={`Semester ${ACTIVE_TERM} Directory`}
    >
      {inviteSuccess ? (
        <div className="p-6 rounded-2xl bg-success-light border border-success/25 text-center space-y-2">
          <CheckCircle2 className="w-10 h-10 text-success mx-auto" aria-hidden="true" />
          <h4 className="font-semibold text-sm text-success">
            Invitation Dispatched!
          </h4>
          <p className="text-xs text-fg-muted">
            We sent an official campus cohort invite to{" "}
            <span className="font-semibold text-fg">{inviteEmail}</span>.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSendInvite} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="invite-peer-email"
              className="block text-xs font-semibold text-fg"
            >
              Peer Institutional Email
            </label>
            <input
              id="invite-peer-email"
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="e.g. classmate@unicampus.edu"
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-surface-2 border border-line text-xs sm:text-sm text-fg placeholder:text-fg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:border-brand"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="invite-cohort-link"
              className="block text-xs font-semibold text-fg"
            >
              Direct Cohort Link
            </label>
            <div className="flex items-center gap-2">
              <input
                id="invite-cohort-link"
                type="text"
                readOnly
                value="https://unicampus.edu/join?cohort=cse-spring-2026"
                className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-surface-2 border border-line text-xs font-sans text-fg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              />
              <button
                type="button"
                onClick={handleCopyInviteLink}
                className="min-h-[44px] px-3 py-2 rounded-xl bg-surface-2 hover:bg-canvas border border-line text-xs font-semibold text-fg flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                {inviteCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-success" aria-hidden="true" />
                    <span className="text-success">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Send Invite
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
