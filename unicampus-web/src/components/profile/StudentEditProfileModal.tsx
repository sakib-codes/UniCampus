"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Camera, 
  Upload, 
  Trash2, 
  Phone, 
  MapPin, 
  Globe, 
  AlertCircle 
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.47 1.47 0 1 0 0-2.94 1.47 1.47 0 0 0 0 2.94M7.86 18.5v-8.37H5.07v8.37h2.79z" />
    </svg>
  );
}

export interface StudentProfileData {
  fullName: string;
  avatarUrl: string | null;
  bio: string;
  phone: string;
  emergencyPhone: string;
  presentAddress: string;
  bloodGroup: string;
  githubUrl: string;
  linkedinUrl: string;
  websiteUrl: string;
  skills: string[];
}

interface StudentEditProfileModalProps {
  open: boolean;
  onClose: () => void;
  initialData: StudentProfileData;
  onSave: (updatedData: StudentProfileData) => void;
}

export function StudentEditProfileModal({
  open,
  onClose,
  initialData,
  onSave,
}: StudentEditProfileModalProps) {
  const [formData, setFormData] = useState<StudentProfileData>(initialData);
  const [skillsInput, setSkillsInput] = useState<string>(
    initialData.skills.join(", ")
  );
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    initialData.avatarUrl
  );
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state whenever modal opens with fresh initialData
  useEffect(() => {
    if (open) {
      queueMicrotask(() => {
        setFormData(initialData);
        setSkillsInput(initialData.skills.join(", "));
        setAvatarPreview(initialData.avatarUrl);
        setErrorMessage(null);
      });
    }
  }, [open, initialData]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please upload an image file (PNG, JPG, or WEBP).");
      return;
    }
    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image size must be less than 5 MB.");
      return;
    }

    setErrorMessage(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setAvatarPreview(result);
      setFormData((prev) => ({ ...prev, avatarUrl: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemovePhoto = () => {
    setAvatarPreview(null);
    setFormData((prev) => ({ ...prev, avatarUrl: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedSkills = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const updated: StudentProfileData = {
      ...formData,
      avatarUrl: avatarPreview,
      skills: parsedSkills,
    };

    onSave(updated);
    onClose();
  };

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-line text-fg placeholder:text-fg-muted text-xs sm:text-sm font-sans focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-colors duration-150";

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title="Edit Student Profile"
      description="Update your personal details, campus bio, emergency contact, and profile avatar."
    >
      <form onSubmit={handleSubmit} className="space-y-6 pt-2 pb-1">
        {/* 1. Avatar Uploader Section */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-fg-muted">
            Profile Photo &amp; Avatar
          </label>

          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-surface-2 border border-line">
            <div className="relative group shrink-0">
              <Avatar
                src={avatarPreview}
                name={formData.fullName}
                size="2xl"
                className="w-24 h-24 rounded-2xl ring-4 ring-line shadow-sm"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Upload photo"
                className="absolute inset-0 rounded-2xl bg-black/40 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity cursor-pointer"
              >
                <Camera className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] font-medium">Change</span>
              </button>
            </div>

            <div className="flex-1 min-w-0 space-y-2.5 text-center sm:text-left w-full">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-3 sm:p-4 text-center transition-colors cursor-pointer ${
                  isDragging
                    ? "border-brand bg-brand-soft/30"
                    : "border-line hover:border-brand/50 hover:bg-surface/50"
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFile(e.target.files[0]);
                    }
                  }}
                />
                <div className="flex items-center justify-center gap-2 text-xs font-medium text-fg">
                  <Upload className="w-4 h-4 text-brand" />
                  <span>Drop your image here, or browse files</span>
                </div>
                <p className="text-[11px] text-fg-muted mt-1">
                  Supports PNG, JPG, or WEBP up to 5 MB
                </p>
              </div>

              {avatarPreview && (
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="inline-flex items-center gap-1.5 text-xs text-danger hover:underline cursor-pointer font-medium py-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove custom photo</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {errorMessage && (
            <div className="flex items-center gap-2 text-xs text-danger bg-danger-light p-2.5 rounded-xl border border-danger/25">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* 2. Personal Bio & Objective */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-fg-muted">
            Student Bio &amp; Academic Focus
          </label>
          <textarea
            rows={3}
            value={formData.bio}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, bio: e.target.value }))
            }
            placeholder="Share your academic interests, focus areas, or engineering goals..."
            className={`${inputClass} resize-none leading-relaxed`}
          />
        </div>

        {/* 3. Contact & Present Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-fg">
              Primary Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-fg-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="+880 1712-000000"
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-fg">
              Emergency Contact &amp; Relation
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-fg-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={formData.emergencyPhone}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    emergencyPhone: e.target.value,
                  }))
                }
                placeholder="+880 1819-000000 (Parent)"
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-fg">
              Present Living Address
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-fg-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={formData.presentAddress}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    presentAddress: e.target.value,
                  }))
                }
                placeholder="Area, Road/Block, City"
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-fg">
              Blood Group
            </label>
            <select
              value={formData.bloodGroup}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, bloodGroup: e.target.value }))
              }
              aria-label="Select blood group"
              className={`${inputClass} cursor-pointer`}
            >
              <option value="A+">A+ (A Positive)</option>
              <option value="A-">A- (A Negative)</option>
              <option value="B+">B+ (B Positive)</option>
              <option value="B-">B- (B Negative)</option>
              <option value="O+">O+ (O Positive)</option>
              <option value="O-">O- (O Negative)</option>
              <option value="AB+">AB+ (AB Positive)</option>
              <option value="AB-">AB- (AB Negative)</option>
            </select>
          </div>
        </div>

        {/* 4. Social & Portfolio Links */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-fg-muted">
            Online Presence &amp; Profiles
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <GithubIcon className="w-4 h-4 text-fg-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={formData.githubUrl}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    githubUrl: e.target.value,
                  }))
                }
                placeholder="github.com/username"
                className={`${inputClass} pl-10 text-xs`}
              />
            </div>

            <div className="relative">
              <LinkedinIcon className="w-4 h-4 text-fg-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={formData.linkedinUrl}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    linkedinUrl: e.target.value,
                  }))
                }
                placeholder="linkedin.com/in/username"
                className={`${inputClass} pl-10 text-xs`}
              />
            </div>

            <div className="relative">
              <Globe className="w-4 h-4 text-fg-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={formData.websiteUrl}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    websiteUrl: e.target.value,
                  }))
                }
                placeholder="portfolio-domain.dev"
                className={`${inputClass} pl-10 text-xs`}
              />
            </div>
          </div>
        </div>

        {/* 5. Skills & Focus Tags */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-fg-muted">
            Skills &amp; Technical Interests (Comma separated)
          </label>
          <input
            type="text"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            placeholder="e.g. Data Structures, React, Python, Distributed Systems, Docker"
            className={inputClass}
          />
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md">
            Save Profile Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
