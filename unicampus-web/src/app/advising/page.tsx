"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, X, BookOpen } from "lucide-react";
import { Toast } from "@/components/ui/Toast";
import { AdvisingHeader } from "@/components/advising/AdvisingHeader";
import { CourseOfferingCard } from "@/components/advising/CourseOfferingCard";
import { SelectedCoursesBasket } from "@/components/advising/SelectedCoursesBasket";
import { AdvisingConfirmModal } from "@/components/advising/AdvisingConfirmModal";
import { AdvisingSlipModal } from "@/components/advising/AdvisingSlipModal";
import { 
  ADVISING_OFFERINGS, 
  detectScheduleClashes, 
  type SelectedRegistrationItem 
} from "@/components/advising/advisingData";

const STORAGE_KEY = "unicampus:course-advising";

const INITIAL_SELECTED: SelectedRegistrationItem[] = [
  { courseCode: "CSE-4101", sectionId: "cse-4101-sec-a", addedAt: new Date().toISOString() },
  { courseCode: "CSE-4102", sectionId: "cse-4102-sec-a", addedAt: new Date().toISOString() },
  { courseCode: "CSE-4109", sectionId: "cse-4109-sec-a", addedAt: new Date().toISOString() },
  { courseCode: "CSE-4111", sectionId: "cse-4111-sec-a", addedAt: new Date().toISOString() },
];

export default function AdvisingPage() {
  const [selectedItems, setSelectedItems] = useState<SelectedRegistrationItem[]>(INITIAL_SELECTED);
  const [status, setStatus] = useState<"draft" | "submitted" | "approved">("draft");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [slipOpen, setSlipOpen] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });

  // Hydrate stored registration plan on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        queueMicrotask(() => {
          if (Array.isArray(parsed.items)) setSelectedItems(parsed.items);
          if (parsed.status) setStatus(parsed.status);
        });
      }
    } catch {
      // Fallback to initial
    }
  }, []);

  // Sync back to storage on changes
  const saveState = (items: SelectedRegistrationItem[], newStatus: "draft" | "submitted" | "approved") => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ items, status: newStatus })
      );
    } catch {
      // Storage unavailable fallback
    }
  };

  // Clash calculation
  const clashes = useMemo(() => {
    return detectScheduleClashes(selectedItems, ADVISING_OFFERINGS);
  }, [selectedItems]);

  // Course filtering
  const filteredCourses = useMemo(() => {
    return ADVISING_OFFERINGS.filter((course) => {
      // Category filter
      if (categoryFilter !== "all" && course.category !== categoryFilter) {
        return false;
      }

      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const codeMatch = course.code.toLowerCase().includes(q);
      const titleMatch = course.title.toLowerCase().includes(q);
      const instructorMatch = course.sections.some((s) =>
        s.instructor.toLowerCase().includes(q)
      );

      return codeMatch || titleMatch || instructorMatch;
    });
  }, [searchQuery, categoryFilter]);

  // Handlers
  const handleToggleAdd = (courseCode: string, defaultSectionId: string) => {
    if (status !== "draft") return;

    setSelectedItems((prev) => {
      const exists = prev.some((item) => item.courseCode === courseCode);
      let updated: SelectedRegistrationItem[];
      if (exists) {
        updated = prev.filter((item) => item.courseCode !== courseCode);
        setToast({ open: true, message: `Removed ${courseCode} from registration basket.` });
      } else {
        updated = [
          ...prev,
          { courseCode, sectionId: defaultSectionId, addedAt: new Date().toISOString() },
        ];
        setToast({ open: true, message: `Added ${courseCode} to registration basket.` });
      }
      saveState(updated, status);
      return updated;
    });
  };

  const handleSelectSection = (courseCode: string, sectionId: string) => {
    if (status !== "draft") return;

    setSelectedItems((prev) => {
      const exists = prev.some((item) => item.courseCode === courseCode);
      let updated: SelectedRegistrationItem[];
      if (exists) {
        updated = prev.map((item) =>
          item.courseCode === courseCode ? { ...item, sectionId } : item
        );
      } else {
        updated = [
          ...prev,
          { courseCode, sectionId, addedAt: new Date().toISOString() },
        ];
      }
      saveState(updated, status);
      return updated;
    });
  };

  const handleRemoveItem = (courseCode: string) => {
    if (status !== "draft") return;
    setSelectedItems((prev) => {
      const updated = prev.filter((item) => item.courseCode !== courseCode);
      saveState(updated, status);
      return updated;
    });
    setToast({ open: true, message: `Removed ${courseCode} from basket.` });
  };

  const handleSubmitPlan = () => {
    setStatus("submitted");
    saveState(selectedItems, "submitted");
    setToast({
      open: true,
      message: "Registration plan submitted to Advisor Dr. Asif Rahman for authorization.",
    });
  };

  const handleWithdrawPlan = () => {
    setStatus("draft");
    saveState(selectedItems, "draft");
    setToast({
      open: true,
      message: "Registration plan unlocked. You can now modify courses and sections.",
    });
  };

  const categories = [
    { id: "all", label: "All Eligible", count: ADVISING_OFFERINGS.length },
    { id: "Core Requirement", label: "Core Requirements", count: 3 },
    { id: "Major Elective", label: "Major Electives", count: 3 },
    { id: "Open Elective", label: "Open Electives", count: 1 },
  ];

  return (
    <div className="w-full space-y-6 pb-16">
      {/* 1. Advising Page Header */}
      <AdvisingHeader status={status} />

      {/* 2. Main 2-Column Advising Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Offerings Catalog */}
        <div className="lg:col-span-8 space-y-4">
          {/* Filter & Search Bar */}
          <section className="p-4 rounded-2xl bg-surface border border-line flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-0">
              <Search
                className="w-4 h-4 text-fg-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="text"
                aria-label="Search courses by code, title, or instructor"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by course code, title, or instructor..."
                className="w-full min-h-[44px] pl-10 pr-10 rounded-xl bg-surface-2 border border-line text-xs sm:text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all duration-150"
              />
              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-fg-muted hover:text-fg rounded-md cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Segmented Tabs */}
            <div className="flex items-center overflow-x-auto p-1 rounded-xl bg-surface-2 border border-line gap-1 shrink-0 [scrollbar-width:none]">
              {categories.map((cat) => {
                const isActive = categoryFilter === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? "bg-brand text-on-brand"
                        : "text-fg-muted hover:text-fg hover:bg-surface"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive
                          ? "bg-on-brand/20 text-on-brand"
                          : "bg-surface text-fg-muted border border-line"
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Offerings List */}
          <div className="space-y-4">
            {filteredCourses.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-surface border border-line text-fg-muted space-y-2">
                <BookOpen className="w-8 h-8 text-fg-subtle mx-auto mb-2" />
                <h4 className="font-semibold text-sm text-fg">No matching courses found</h4>
                <p className="text-xs">Try adjusting your search keywords or active category filter.</p>
              </div>
            ) : (
              filteredCourses.map((course) => {
                const selectedItem = selectedItems.find(
                  (i) => i.courseCode === course.code
                );
                const isSelected = Boolean(selectedItem);

                return (
                  <CourseOfferingCard
                    key={course.code}
                    course={course}
                    isSelected={isSelected}
                    selectedSectionId={selectedItem?.sectionId}
                    onSelectSection={handleSelectSection}
                    onToggleAdd={handleToggleAdd}
                    disabled={status !== "draft"}
                  />
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Selected Courses Basket Rail */}
        <div className="lg:col-span-4">
          <SelectedCoursesBasket
            selectedItems={selectedItems}
            offerings={ADVISING_OFFERINGS}
            clashes={clashes}
            status={status}
            onRemoveItem={handleRemoveItem}
            onSubmit={() => setConfirmOpen(true)}
            onWithdraw={handleWithdrawPlan}
            onOpenSlip={() => setSlipOpen(true)}
          />
        </div>
      </div>

      {/* Confirmation Modal */}
      <AdvisingConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleSubmitPlan}
        selectedItems={selectedItems}
        offerings={ADVISING_OFFERINGS}
      />

      {/* Official Printable Advising Slip Modal */}
      <AdvisingSlipModal
        open={slipOpen}
        onClose={() => setSlipOpen(false)}
        selectedItems={selectedItems}
        offerings={ADVISING_OFFERINGS}
        status={status}
      />

      {/* Toast Notification */}
      <Toast
        open={toast.open}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}
