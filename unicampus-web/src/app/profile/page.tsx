import ProfileAvatar from "@/components/common/ProfileAvatar";
import Link from "next/link";
import { themeTokens, SPOTLIGHT } from "@/lib/theme";
import SpotlightCard from "@/components/bits/SpotlightCard";
import ClickSpark from "@/components/bits/ClickSpark";
import DecryptedText from "@/components/bits/DecryptedText";

export default function ProfilePage() {
  return (
    <div className="w-full pb-10">
      {/* Profile Header Card */}
      <SpotlightCard 
        className={`${themeTokens.card3xl} p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 transition-colors`}
        spotlightColor={SPOTLIGHT.wash}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 md:gap-8">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-r from-blue-400 to-brand shrink-0">
            <ProfileAvatar 
              className="w-full h-full border-4 border-white dark:border-[#0D1117] bg-white dark:bg-[#161B22]" 
              iconClassName="w-14 h-14 sm:w-16 sm:h-16"
            />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-[#F0F6FC] mb-3 tracking-tight">Sakib Ahmed</h1>
            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm font-medium text-slate-500 dark:text-[#8D96A0]">
              <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-brand dark:text-indigo-300 rounded-lg font-bold border border-brand/20">
                6th Semester
              </span>
              <span>Computer Science & Engineering</span>
              <span>•</span>
              <span className="font-mono">
                Roll: <DecryptedText text="CSE-2024-042" speed={30} maxIterations={8} animateOn="view" />
              </span>
            </div>
          </div>
        </div>
        <div>
          <Link href="/settings">
            <ClickSpark sparkCount={8} sparkRadius={20}>
              <button className={`${themeTokens.btnPrimary} px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-sm cursor-pointer`}>
                <div className="w-2 h-2 rounded-full bg-white/50"></div>
                Edit Profile
              </button>
            </ClickSpark>
          </Link>
        </div>
      </SpotlightCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <SpotlightCard 
          className={`${themeTokens.card3xl} p-8 flex flex-col gap-6 transition-colors`}
          spotlightColor={SPOTLIGHT.wash}
        >
          <h2 className="text-xl font-bold text-slate-900 dark:text-[#F0F6FC]">Personal Information</h2>
          <div className={`flex flex-col divide-y ${themeTokens.border} text-sm`}>
            <div className="flex justify-between items-center py-2.5">
              <span className="text-slate-500 dark:text-[#6E747D] font-medium">Full Name</span>
              <span className="font-bold text-slate-800 dark:text-[#F0F6FC]">Sakib Ahmed</span>
            </div>
            <div className="flex justify-between items-center py-2.5">
              <span className="text-slate-500 dark:text-[#6E747D] font-medium">Gender</span>
              <span className="font-bold text-slate-800 dark:text-[#F0F6FC]">Male</span>
            </div>
            <div className="flex justify-between items-center py-2.5">
              <span className="text-slate-500 dark:text-[#6E747D] font-medium">Date of Birth</span>
              <span className="font-bold text-slate-800 dark:text-[#F0F6FC]">October 12, 2004</span>
            </div>
            <div className="flex justify-between items-center py-2.5">
              <span className="text-slate-500 dark:text-[#6E747D] font-medium">Blood Group</span>
              <span className="font-bold text-slate-800 dark:text-[#F0F6FC]">B+</span>
            </div>
            <div className="flex justify-between items-center py-2.5">
              <span className="text-slate-500 dark:text-[#6E747D] font-medium">Nationality</span>
              <span className="font-bold text-slate-800 dark:text-[#F0F6FC]">Bangladeshi</span>
            </div>
          </div>
        </SpotlightCard>

        {/* Academic Registry */}
        <SpotlightCard 
          className={`${themeTokens.card3xl} p-8 flex flex-col gap-6 transition-colors`}
          spotlightColor={SPOTLIGHT.wash}
        >
          <h2 className="text-xl font-bold text-slate-900 dark:text-[#F0F6FC]">Academic Registry</h2>
          <div className={`flex flex-col divide-y ${themeTokens.border} text-sm`}>
            <div className="flex justify-between items-center py-2.5">
              <span className="text-slate-500 dark:text-[#6E747D] font-medium">Institution</span>
              <span className="font-bold text-slate-800 dark:text-[#F0F6FC]">UniCampus University</span>
            </div>
            <div className="flex justify-between items-center py-2.5">
              <span className="text-slate-500 dark:text-[#6E747D] font-medium">Department</span>
              <span className="font-bold text-slate-800 dark:text-[#F0F6FC]">Computer Science & Engineering</span>
            </div>
            <div className="flex justify-between items-center py-2.5">
              <span className="text-slate-500 dark:text-[#6E747D] font-medium">Curriculum</span>
              <span className="font-bold text-slate-800 dark:text-[#F0F6FC]">B.Sc. in CSE</span>
            </div>
            <div className="flex justify-between items-center py-2.5">
              <span className="text-slate-500 dark:text-[#6E747D] font-medium">Current Batch</span>
              <span className="font-bold text-slate-800 dark:text-[#F0F6FC]">CSE 54th Intake</span>
            </div>
            <div className="flex justify-between items-center py-2.5">
              <span className="text-slate-500 dark:text-[#6E747D] font-medium">Advisor</span>
              <span className="font-bold text-slate-800 dark:text-[#F0F6FC]">Dr. M. Rahman</span>
            </div>
            <div className="flex justify-between items-center py-2.5">
              <span className="text-slate-500 dark:text-[#6E747D] font-medium">Status</span>
              <span className="font-bold text-slate-800 dark:text-[#F0F6FC]">Regular Enroll</span>
            </div>
          </div>
        </SpotlightCard>

        {/* Contact Information */}
        <SpotlightCard 
          className={`${themeTokens.card3xl} p-8 flex flex-col gap-6 transition-colors`}
          spotlightColor={SPOTLIGHT.wash}
        >
          <h2 className="text-xl font-bold text-slate-900 dark:text-[#F0F6FC]">Contact Information</h2>
          <div className={`flex flex-col divide-y ${themeTokens.border} text-sm`}>
            <div className="flex justify-between items-center py-2.5">
              <span className="text-slate-500 dark:text-[#6E747D] font-medium">Email Address</span>
              <span className="font-bold text-slate-800 dark:text-[#F0F6FC]">sakib.cse@unicampus.edu</span>
            </div>
            <div className="flex justify-between items-center py-2.5">
              <span className="text-slate-500 dark:text-[#6E747D] font-medium">Phone Number</span>
              <span className="font-bold text-slate-800 dark:text-[#F0F6FC]">+880 1712-345678</span>
            </div>
            <div className="flex justify-between items-center py-2.5">
              <span className="text-slate-500 dark:text-[#6E747D] font-medium">Emergency Contact</span>
              <span className="font-bold text-slate-800 dark:text-[#F0F6FC]">+880 1515-987654</span>
            </div>
            <div className="flex justify-between items-center py-2.5">
              <span className="text-slate-500 dark:text-[#6E747D] font-medium">Present Address</span>
              <span className="font-bold text-slate-800 dark:text-[#F0F6FC]">Bashundhara R/A, Dhaka</span>
            </div>
          </div>
        </SpotlightCard>

        {/* Campus Activities */}
        <SpotlightCard 
          className={`${themeTokens.card3xl} p-8 flex flex-col gap-6 transition-colors`}
          spotlightColor={SPOTLIGHT.wash}
        >
          <h2 className="text-xl font-bold text-slate-900 dark:text-[#F0F6FC]">Campus Activities</h2>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500 dark:text-emerald-400 flex items-center justify-center text-xl shrink-0 border border-emerald-500/20">
                ★
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-[#F0F6FC] text-sm">UniCampus Robotics Club</h3>
                <p className="text-xs text-slate-500 dark:text-[#6E747D] mt-1 font-medium">General Member • Joined 2nd Semester</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-brand dark:text-indigo-400 flex items-center justify-center text-xl font-bold shrink-0 border border-brand/20">
                #
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-[#F0F6FC] text-sm">Competitive Programming Wing</h3>
                <p className="text-xs text-slate-500 dark:text-[#6E747D] mt-1 font-medium">Lead Coordinator • CSE Dept Association</p>
              </div>
            </div>
          </div>
        </SpotlightCard>

      </div>
    </div>
  );
}
