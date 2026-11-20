"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Award,
  BookOpen,
  Calendar,
  Camera,
  Check,
  CheckSquare,
  Clock,
  Compass,
  Copy,
  Edit3,
  ExternalLink,
  Eye,
  FileText,
  FolderGit2,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { ACTIVE_TERM, CANONICAL_FACULTY } from "@/lib/canonicalCampus";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Toast } from "@/components/ui/Toast";
import { cn } from "@/components/ui/cn";

type AvailabilityStatus = "In Office" | "In Class" | "Advising" | "Online" | "Away";

const AVAILABILITY_OPTIONS: {
  value: AvailabilityStatus;
  dotClass: string;
  badgeClass: string;
}[] = [
  {
    value: "In Office",
    dotClass: "bg-success",
    badgeClass: "bg-success-light text-success border-success/20",
  },
  {
    value: "In Class",
    dotClass: "bg-brand",
    badgeClass: "bg-brand-soft text-brand border-brand/20",
  },
  {
    value: "Advising",
    dotClass: "bg-warning",
    badgeClass: "bg-warning-light text-warning border-warning/20",
  },
  {
    value: "Online",
    dotClass: "bg-success",
    badgeClass: "bg-success-light text-success border-success/20",
  },
  {
    value: "Away",
    dotClass: "bg-fg-subtle",
    badgeClass: "bg-surface-2 text-fg-muted border-line",
  },
];

const FACULTY_COURSES = [
  {
    code: "CSE-3101",
    title: "Design & Analysis of Algorithms",
    section: "Section A • 6th Sem",
    credits: "3.0 Cr",
    students: 62,
  },
  {
    code: "CSE-4109",
    title: "Distributed Systems & Cloud Computing",
    section: "Section B • 8th Sem",
    credits: "3.0 Cr",
    students: 58,
  },
  {
    code: "CSE-3102",
    title: "Algorithms Sessional Lab",
    section: "Section A • 6th Sem",
    credits: "1.5 Cr",
    students: 54,
  },
];

const EDUCATION_HISTORY = [
  {
    degree: "Ph.D. in Computer Science",
    institution: "Bangladesh University of Engineering and Technology (BUET)",
    year: "2020",
  },
  {
    degree: "M.Sc. in Computer Science & Engineering",
    institution: "University of Dhaka",
    year: "2015",
  },
  {
    degree: "Visiting Research Fellow — Distributed Graph Algorithms",
    institution: "National University of Singapore (NUS)",
    year: "2019",
  },
];

const ACADEMIC_LINKS = [
  { label: "Google Scholar", href: "https://scholar.google.com" },
  { label: "ORCID", href: "https://orcid.org" },
  { label: "ResearchGate", href: "https://www.researchgate.net" },
  { label: "Faculty CV", href: "#faculty-cv" },
];

const INITIAL_OFFICE_SLOTS = [
  { day: "Monday", time: "04:15 PM – 05:30 PM", mode: "Walk-in & Booking", room: "Room 508" },
  { day: "Wednesday", time: "02:30 PM – 04:00 PM", mode: "Thesis Advising", room: "Room 508" },
  { day: "Thursday", time: "11:00 AM – 12:30 PM", mode: "Online / Zoom", room: "Virtual Office" },
];

export default function TeacherProfilePage() {
  const [availability, setAvailability] = useState<AvailabilityStatus>("In Office");
  const [bio, setBio] = useState(
    "Associate Professor in the Department of Computer Science & Engineering specializing in combinatorial optimization, network flow algorithms, and fault-tolerant distributed systems. Lead coordinator for the Undergraduate Algorithms & Competitive Programming Lab."
  );
  const [researchInterests, setResearchInterests] = useState<string[]>([
    "Algorithm Design",
    "Network Flow",
    "Distributed Systems",
    "Graph Theory",
    "Cloud Consensus",
  ]);
  const [phone, setPhone] = useState<string>(CANONICAL_FACULTY.phone);
  const [officeRoom, setOfficeRoom] = useState<string>(CANONICAL_FACULTY.office);
  const [officeHoursText, setOfficeHoursText] = useState<string>(
    CANONICAL_FACULTY.officeHours
  );

  // Copy feedback state
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Edit Modal state
  const [editOpen, setEditOpen] = useState(false);
  const [draftBio, setDraftBio] = useState(bio);
  const [draftInterests, setDraftInterests] = useState(researchInterests.join(", "));
  const [draftPhone, setDraftPhone] = useState(phone);
  const [draftOffice, setDraftOffice] = useState(officeRoom);
  const [draftHours, setDraftHours] = useState(officeHoursText);

  // Toast state
  const [toast, setToast] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });

  const activeStatusConfig =
    AVAILABILITY_OPTIONS.find((opt) => opt.value === availability) ??
    AVAILABILITY_OPTIONS[0];

  const handleCopy = (fieldKey: string, value: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(value).catch(() => {});
    }
    setCopiedField(fieldKey);
    setTimeout(() => {
      setCopiedField((prev) => (prev === fieldKey ? null : prev));
    }, 1800);
  };

  const openEditModal = () => {
    setDraftBio(bio);
    setDraftInterests(researchInterests.join(", "));
    setDraftPhone(phone);
    setDraftOffice(officeRoom);
    setDraftHours(officeHoursText);
    setEditOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setBio(draftBio.trim() || bio);
    const parsedInterests = draftInterests
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (parsedInterests.length > 0) {
      setResearchInterests(parsedInterests);
    }
    setPhone(draftPhone.trim() || phone);
    setOfficeRoom(draftOffice.trim() || officeRoom);
    setOfficeHoursText(draftHours.trim() || officeHoursText);
    setEditOpen(false);
    setToast({ open: true, message: "Faculty profile updated successfully." });
  };

  const handleAvailabilityChange = (nextStatus: AvailabilityStatus) => {
    setAvailability(nextStatus);
    setToast({ open: true, message: `Live status updated to "${nextStatus}".` });
  };

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-line text-fg placeholder:text-fg-muted text-sm font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:border-brand";

  return (
    <div className="w-full space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-fg tracking-tight">
            Faculty Profile
          </h1>
          <p className="text-xs sm:text-sm text-fg-muted mt-1 font-sans">
            {ACTIVE_TERM} • Manage your academic profile, live availability, and teaching portfolio
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/teachers/1"
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-xl bg-surface hover:bg-surface-2 text-fg border border-line text-xs sm:text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <Eye className="w-4 h-4 text-fg-muted" />
            <span>Preview Student View</span>
          </Link>
          <Button variant="primary" size="md" onClick={openEditModal}>
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </Button>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Identity Card */}
        <div className="lg:col-span-4 rounded-2xl bg-surface border border-line p-6 space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <Avatar
                name="Asif Rahman"
                alt={CANONICAL_FACULTY.name}
                size="2xl"
                className="bg-brand-soft text-brand border-brand/20"
              />
              <button
                type="button"
                aria-label="Change profile photo"
                onClick={() =>
                  setToast({
                    open: true,
                    message: "Photo upload dialog is managed via Institutional ID Portal.",
                  })
                }
                className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-surface border border-line text-fg-muted hover:text-fg hover:bg-surface-2 flex items-center justify-center shadow-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <h2 className="text-lg font-semibold text-fg mt-4">
              {CANONICAL_FACULTY.name}
            </h2>
            <p className="text-sm text-fg-muted mt-0.5">
              {CANONICAL_FACULTY.designation}
            </p>
            <p className="text-xs text-fg-muted mt-0.5">
              {CANONICAL_FACULTY.departmentName}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-sans tabular-nums font-medium bg-surface-2 text-fg border border-line">
                {CANONICAL_FACULTY.facultyCode}
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
                  activeStatusConfig.badgeClass
                )}
              >
                <span
                  className={cn(
                    "w-2 h-2 rounded-full",
                    activeStatusConfig.dotClass
                  )}
                  aria-hidden="true"
                />
                {availability}
              </span>
            </div>
          </div>

          {/* Live Availability Switcher */}
          <div className="pt-5 border-t border-line space-y-2.5">
            <label
              htmlFor="faculty-availability-select"
              className="block text-xs font-medium text-fg-muted"
            >
              Live Availability Status
            </label>
            <select
              id="faculty-availability-select"
              value={availability}
              onChange={(e) =>
                handleAvailabilityChange(e.target.value as AvailabilityStatus)
              }
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-canvas border border-line text-fg text-sm font-sans font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:border-brand"
            >
              {AVAILABILITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.value}
                </option>
              ))}
            </select>
            <p className="text-xs text-fg-muted">
              Visible to students on the Faculty Directory and advising requests.
            </p>
          </div>

          {/* Contact & Office Details */}
          <div className="pt-5 border-t border-line space-y-3">
            <h3 className="text-xs font-semibold text-fg uppercase tracking-wider">
              Contact &amp; Office
            </h3>

            {[
              {
                key: "phone",
                label: "Direct Phone",
                value: phone,
                icon: Phone,
              },
              {
                key: "email",
                label: "Institutional Email",
                value: CANONICAL_FACULTY.email,
                icon: Mail,
              },
              {
                key: "office",
                label: "Office Location",
                value: officeRoom,
                icon: MapPin,
              },
            ].map((item) => {
              const Icon = item.icon;
              const isCopied = copiedField === item.key;
              return (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-2.5 p-2.5 rounded-xl bg-canvas border border-line"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-surface-2 border border-line flex items-center justify-center text-fg-muted shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-fg-muted leading-none">
                        {item.label}
                      </p>
                      <p className="text-xs font-medium text-fg truncate mt-1 tabular-nums">
                        {item.value}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(item.key, item.value)}
                    aria-label={`Copy ${item.label}`}
                    className="min-h-[36px] px-2.5 py-1.5 rounded-lg text-xs font-medium text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors inline-flex items-center gap-1 shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-success" />
                        <span className="text-success">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="sr-only">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column Cards */}
        <div className="lg:col-span-8 space-y-5">
          {/* Academic Profile, Biography & Research Links */}
          <div className="rounded-2xl bg-surface border border-line p-6 space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand" />
                <h2 className="text-base font-semibold text-fg">
                  Academic Profile &amp; Biography
                </h2>
              </div>
              <Button variant="ghost" size="sm" onClick={openEditModal}>
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Bio</span>
              </Button>
            </div>

            <p className="text-sm text-fg leading-relaxed font-sans">{bio}</p>

            {/* Educational Background */}
            <div className="pt-4 border-t border-line space-y-3">
              <h3 className="text-xs font-semibold text-fg-muted uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-brand" />
                <span>Education &amp; Fellowships</span>
              </h3>
              <div className="space-y-2.5">
                {EDUCATION_HISTORY.map((edu, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs sm:text-sm"
                  >
                    <div>
                      <p className="font-medium text-fg">{edu.degree}</p>
                      <p className="text-xs text-fg-muted">{edu.institution}</p>
                    </div>
                    <span className="text-xs text-fg-muted tabular-nums shrink-0">
                      {edu.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Research Interests */}
            <div className="pt-4 border-t border-line space-y-2.5">
              <h3 className="text-xs font-semibold text-fg-muted uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-brand" />
                <span>Research Interests</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {researchInterests.map((tag) => (
                  <Badge key={tag} variant="brand">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* External Academic Profile Links */}
            <div className="pt-4 border-t border-line space-y-2.5">
              <h3 className="text-xs font-semibold text-fg-muted uppercase tracking-wider">
                Academic Profiles &amp; CV
              </h3>
              <div className="flex flex-wrap gap-2">
                {ACADEMIC_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      link.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 rounded-xl bg-canvas border border-line text-xs font-medium text-fg hover:border-brand/40 hover:text-brand transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    <FileText className="w-3.5 h-3.5 text-fg-muted" />
                    <span>{link.label}</span>
                    <ExternalLink className="w-3 h-3 text-fg-subtle" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Courses Taught (Actionable) */}
          <div className="rounded-2xl bg-surface border border-line p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-semibold text-fg">
                  Courses Taught
                </h2>
                <p className="text-xs text-fg-muted mt-0.5 tabular-nums">
                  {ACTIVE_TERM} • 3 Courses • 7.5 Credits • 174 Enrolled Students
                </p>
              </div>
              <Link
                href="/teacher/routine"
                className="text-xs font-medium text-brand hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>View Weekly Routine</span>
              </Link>
            </div>

            <div className="divide-y divide-line border border-line rounded-xl overflow-hidden bg-canvas">
              {FACULTY_COURSES.map((course) => (
                <div
                  key={course.code}
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-brand-soft text-brand border border-brand/20">
                        {course.code}
                      </span>
                      <span className="text-sm font-semibold text-fg truncate">
                        {course.title}
                      </span>
                    </div>
                    <p className="text-xs text-fg-muted tabular-nums">
                      {course.section} • {course.credits} • {course.students} Students
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <Link
                      href="/teacher/attendance"
                      className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1.5 rounded-lg bg-surface border border-line text-xs font-medium text-fg hover:border-brand/40 hover:text-brand transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    >
                      <CheckSquare className="w-3.5 h-3.5 text-fg-muted" />
                      <span>Attendance</span>
                    </Link>
                    <Link
                      href="/teacher/grades"
                      className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1.5 rounded-lg bg-surface border border-line text-xs font-medium text-fg hover:border-brand/40 hover:text-brand transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-fg-muted" />
                      <span>Gradebook</span>
                    </Link>
                    <Link
                      href="/teacher/materials"
                      className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1.5 rounded-lg bg-surface border border-line text-xs font-medium text-fg hover:border-brand/40 hover:text-brand transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    >
                      <FolderGit2 className="w-3.5 h-3.5 text-fg-muted" />
                      <span>Materials</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Office & Advising Hours */}
          <div className="rounded-2xl bg-surface border border-line p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-fg flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand" />
                  <span>Office &amp; Advising Hours</span>
                </h2>
                <p className="text-xs text-fg-muted mt-0.5">
                  Primary slot: <span className="text-fg font-medium tabular-nums">{officeHoursText}</span>
                </p>
              </div>
              <Button variant="secondary" size="sm" onClick={openEditModal}>
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Hours</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {INITIAL_OFFICE_SLOTS.map((slot) => (
                <div
                  key={slot.day}
                  className="p-3.5 rounded-xl bg-canvas border border-line space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-fg">
                      {slot.day}
                    </span>
                    <Badge variant="neutral" className="text-[11px]">
                      {slot.room === "Room 508" ? officeRoom : slot.room}
                    </Badge>
                  </div>
                  <p className="text-xs font-medium text-fg tabular-nums">
                    {slot.time}
                  </p>
                  <p className="text-[11px] text-fg-muted">{slot.mode}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        size="lg"
        title="Edit Faculty Profile"
        description="Update your public academic biography, research interests, and office details."
        footer={
          <div className="flex items-center justify-end gap-2.5 w-full">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setEditOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              form="edit-faculty-profile-form"
            >
              Save Changes
            </Button>
          </div>
        }
      >
        <form
          id="edit-faculty-profile-form"
          onSubmit={handleSaveProfile}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <label
              htmlFor="profile-bio"
              className="block text-xs font-medium text-fg"
            >
              Academic Biography
            </label>
            <textarea
              id="profile-bio"
              rows={4}
              value={draftBio}
              onChange={(e) => setDraftBio(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="profile-interests"
              className="block text-xs font-medium text-fg"
            >
              Research Interests (comma-separated)
            </label>
            <input
              id="profile-interests"
              type="text"
              value={draftInterests}
              onChange={(e) => setDraftInterests(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="profile-phone"
                className="block text-xs font-medium text-fg"
              >
                Direct Phone
              </label>
              <input
                id="profile-phone"
                type="tel"
                value={draftPhone}
                onChange={(e) => setDraftPhone(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="profile-office"
                className="block text-xs font-medium text-fg"
              >
                Office Room
              </label>
              <input
                id="profile-office"
                type="text"
                value={draftOffice}
                onChange={(e) => setDraftOffice(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="profile-hours"
              className="block text-xs font-medium text-fg"
            >
              Primary Office &amp; Advising Hours
            </label>
            <input
              id="profile-hours"
              type="text"
              value={draftHours}
              onChange={(e) => setDraftHours(e.target.value)}
              className={inputClass}
            />
          </div>
        </form>
      </Modal>

      {/* Feedback Toast */}
      <Toast
        open={toast.open}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        tone="success"
        message={toast.message}
        durationMs={3000}
      />
    </div>
  );
}

