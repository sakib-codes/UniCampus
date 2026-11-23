"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, UserRoleType, AdminRoleLevel } from '@/types/admin';
import { INITIAL_PROFILES } from '@/lib/mockData';
import { adminService } from '@/lib/services/adminService';
import { supabaseSyncBridge } from '@/lib/supabase/syncBridge';

interface AdminAuthContextType {
  currentUser: Profile | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isDeptAdmin: boolean;
  adminDepartmentId: string | null;
  adminDepartmentName: string | null;
  activeScopeDeptId: string; // 'all' or a specific dept id e.g. 'dept-cse'
  setActiveScopeDeptId: (deptId: string) => void;
  effectiveDeptId: string; // 'all' or department id currently in focus
  isApproved: boolean;
  isSuspended: boolean;
  accountStatus: 'active' | 'pending' | 'suspended' | 'rejected';
  hasExplicitSession: boolean;
  isDemoMode: boolean;
  canManageUser: (target: Profile) => boolean;
  isLoaded: boolean;
  switchUserRole: (
    role: UserRoleType, 
    approved?: boolean, 
    adminRole?: AdminRoleLevel, 
    deptId?: string
  ) => void;
  loginAsStudent: () => void;
  loginAsFaculty: () => void;
  loginAsAdmin: () => void;
  loginAsDeptAdmin: (deptId: string) => void;
  loginWithSupabaseProfile: (profile: Profile) => void;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'unicampus_auth_current_user';
const SCOPE_STORAGE_KEY = 'unicampus_admin_scope_dept';
const AUTH_SCHEMA_VERSION_KEY = 'unicampus_auth_schema_version';
const AUTH_SCHEMA_VERSION = 'v3-live';

function syncSessionCookies(user: Profile | null) {
  if (typeof document === 'undefined') return;
  if (user) {
    document.cookie = `uc_session=1; Path=/; SameSite=Lax; Max-Age=604800`;
    document.cookie = `uc_role=${encodeURIComponent(user.role)}; Path=/; SameSite=Lax; Max-Age=604800`;
  } else {
    document.cookie = `uc_session=; Path=/; SameSite=Lax; Max-Age=0`;
    document.cookie = `uc_role=; Path=/; SameSite=Lax; Max-Age=0`;
  }
}

function findStudentProfile(): Profile {
  return (
    INITIAL_PROFILES.find((p) => p.id === 'user-stud-1') ||
    INITIAL_PROFILES.find((p) => p.role === 'student') ||
    INITIAL_PROFILES[0]
  );
}

function findFacultyProfile(): Profile {
  return (
    INITIAL_PROFILES.find((p) => p.id === 'user-teach-1') ||
    INITIAL_PROFILES.find((p) => p.role === 'teacher') ||
    INITIAL_PROFILES[0]
  );
}

function findSuperAdminProfile(): Profile {
  return (
    INITIAL_PROFILES.find((p) => p.id === 'user-admin-1') ||
    INITIAL_PROFILES.find((p) => p.role === 'admin' && p.admin_role === 'super_admin') ||
    INITIAL_PROFILES[0]
  );
}

function findDeptAdminTemplate(): Profile {
  return (
    INITIAL_PROFILES.find((p) => p.role === 'admin' && p.admin_role === 'dept_admin') ||
    findSuperAdminProfile()
  );
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasExplicitSession, setHasExplicitSession] = useState(false);
  const [activeScopeDeptId, setActiveScopeDeptIdState] = useState<string>('all');
  
  // Start clean with no fake dummy user when live Supabase is connected
  const [currentUser, setCurrentUser] = useState<Profile | null>(() =>
    supabaseSyncBridge.isLive() ? null : findStudentProfile()
  );

  const isDemoMode = !supabaseSyncBridge.isLive();

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (typeof window === 'undefined') {
        if (!cancelled) setIsLoaded(true);
        return;
      }

      const storedScope = localStorage.getItem(SCOPE_STORAGE_KEY);
      if (storedScope) {
        setActiveScopeDeptIdState(storedScope);
      }

      // Live Supabase mode: NEVER trust raw localStorage role JSON before verifying session
      if (supabaseSyncBridge.isLive()) {
        void supabaseSyncBridge
          .getCurrentSessionProfile()
          .then((liveProfile) => {
            if (cancelled) return;
            if (liveProfile) {
              setCurrentUser(liveProfile);
              setHasExplicitSession(true);
              localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(liveProfile));
              syncSessionCookies(liveProfile);
            } else {
              localStorage.removeItem(AUTH_STORAGE_KEY);
              syncSessionCookies(null);
              setCurrentUser(null);
              setHasExplicitSession(false);
            }
          })
          .catch(() => {
            if (cancelled) return;
            localStorage.removeItem(AUTH_STORAGE_KEY);
            setCurrentUser(null);
            setHasExplicitSession(false);
          })
          .finally(() => {
            if (!cancelled) setIsLoaded(true);
          });
        return;
      }

      // Demo / Mock mode
      const storedVersion = localStorage.getItem(AUTH_SCHEMA_VERSION_KEY);
      if (storedVersion !== AUTH_SCHEMA_VERSION) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(SCOPE_STORAGE_KEY);
        localStorage.setItem(AUTH_SCHEMA_VERSION_KEY, AUTH_SCHEMA_VERSION);
        setCurrentUser(findStudentProfile());
        setActiveScopeDeptIdState('all');
        setHasExplicitSession(false);
        setIsLoaded(true);
      } else {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setCurrentUser(parsed);
            setHasExplicitSession(true);
          } catch (e) {
            console.error('Failed to parse stored auth user', e);
            setHasExplicitSession(false);
          }
        } else {
          setHasExplicitSession(false);
        }
        setIsLoaded(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Listen for profiles-updated events and sync currentUser
  useEffect(() => {
    const handleProfilesUpdated = () => {
      try {
        const profiles = adminService.getProfiles();
        setCurrentUser((prev) => {
          if (!prev) return prev;
          const fresh = profiles.find((p) => p.id === prev.id || p.email === prev.email);
          if (fresh) {
            if (typeof window !== 'undefined') {
              localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(fresh));
            }
            return fresh;
          }
          return prev;
        });
      } catch (e) {
        console.error('Failed to sync user with updated profiles', e);
      }
    };

    window.addEventListener('unicampus:profiles-updated', handleProfilesUpdated);
    return () => {
      window.removeEventListener('unicampus:profiles-updated', handleProfilesUpdated);
    };
  }, []);

  const saveUser = (user: Profile | null) => {
    setCurrentUser(user);
    syncSessionCookies(user);
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        setHasExplicitSession(true);
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setHasExplicitSession(false);
      }
    } else {
      setHasExplicitSession(Boolean(user));
    }
  };

  const setActiveScopeDeptId = (deptId: string) => {
    setActiveScopeDeptIdState(deptId);
    if (typeof window !== 'undefined') {
      localStorage.setItem(SCOPE_STORAGE_KEY, deptId);
    }
  };

  const switchUserRole = (
    role: UserRoleType, 
    approved: boolean = true, 
    adminRole?: AdminRoleLevel, 
    deptId?: string
  ) => {
    if (role === 'admin') {
      if (adminRole === 'dept_admin' && deptId) {
        const deptAdmin = INITIAL_PROFILES.find(
          (p) => p.role === 'admin' && p.admin_role === 'dept_admin' && p.department_id === deptId
        ) || {
          ...findDeptAdminTemplate(),
          id: `user-admin-${deptId}`,
          full_name: `${deptId.toUpperCase().replace('DEPT-', '')} Dept Admin`,
          email: `${deptId.replace('dept-', '')}.admin@unicampus.edu`,
          role: 'admin' as const,
          admin_role: 'dept_admin' as const,
          department_id: deptId,
          department_name: deptId.toUpperCase(),
          is_approved: approved,
        };
        saveUser(deptAdmin);
        setActiveScopeDeptId(deptId);
      } else {
        // Super Admin
        const superAdmin = { ...findSuperAdminProfile(), is_approved: approved };
        saveUser(superAdmin);
      }
    } else if (role === 'teacher') {
      const teacher = { ...findFacultyProfile(), is_approved: approved };
      saveUser(teacher);
    } else {
      const student = { ...findStudentProfile(), is_approved: approved };
      saveUser(student);
    }
  };

  const loginAsStudent = () => {
    saveUser(findStudentProfile());
  };

  const loginAsFaculty = () => {
    saveUser(findFacultyProfile());
  };

  const loginAsAdmin = () => {
    saveUser(findSuperAdminProfile());
    setActiveScopeDeptId('all');
  };

  const loginAsDeptAdmin = (deptId: string) => {
    const deptAdmin = INITIAL_PROFILES.find(
      (p) => p.role === 'admin' && p.admin_role === 'dept_admin' && p.department_id === deptId
    );
    if (deptAdmin) {
      saveUser(deptAdmin);
      setActiveScopeDeptId(deptId);
    } else {
      switchUserRole('admin', true, 'dept_admin', deptId);
    }
  };

  const loginWithSupabaseProfile = (profile: Profile) => {
    saveUser(profile);
    if (profile.role === 'admin' && profile.admin_role === 'dept_admin' && profile.department_id) {
      setActiveScopeDeptId(profile.department_id);
    } else if (profile.role === 'admin') {
      setActiveScopeDeptId('all');
    }
  };

  const logout = () => {
    saveUser(null);
    void supabaseSyncBridge.signOut();
  };

  const isAdmin = currentUser?.role === 'admin';
  const isSuperAdmin = isAdmin && (currentUser?.admin_role === 'super_admin' || !currentUser?.admin_role);
  const isDeptAdmin = isAdmin && currentUser?.admin_role === 'dept_admin';
  const adminDepartmentId = isDeptAdmin ? (currentUser?.department_id || null) : null;
  const adminDepartmentName = isDeptAdmin ? (currentUser?.department_name || null) : null;
  
  // Effective department scope:
  // For Dept Admin, ALWAYS their assigned department
  // For Super Admin, whatever activeScopeDeptId is selected ('all' or specific)
  const effectiveDeptId = isDeptAdmin ? (currentUser?.department_id || 'all') : activeScopeDeptId;

  const accountStatus: 'active' | 'pending' | 'suspended' | 'rejected' =
    currentUser?.account_status || (currentUser?.is_approved ? 'active' : 'pending');
  const isSuspended = accountStatus === 'suspended';
  const isApproved = Boolean(
    currentUser?.is_approved && !isSuspended && accountStatus !== 'pending' && accountStatus !== 'rejected'
  );

  const canManageUser = (target: Profile): boolean => {
    if (!currentUser || currentUser.role !== 'admin') return false;
    if (isSuperAdmin) {
      return true;
    }
    if (isDeptAdmin) {
      if (target.role === 'admin') return false;
      return target.department_id === currentUser.department_id;
    }
    return false;
  };

  return (
    <AdminAuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        isSuperAdmin,
        isDeptAdmin,
        adminDepartmentId,
        adminDepartmentName,
        activeScopeDeptId,
        setActiveScopeDeptId,
        effectiveDeptId,
        isApproved,
        isSuspended,
        accountStatus,
        hasExplicitSession,
        isDemoMode,
        canManageUser,
        isLoaded,
        switchUserRole,
        loginAsStudent,
        loginAsFaculty,
        loginAsAdmin,
        loginAsDeptAdmin,
        loginWithSupabaseProfile,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
