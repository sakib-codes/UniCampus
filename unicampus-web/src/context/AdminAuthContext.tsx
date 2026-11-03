"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, UserRoleType, AdminRoleLevel } from '@/types/admin';
import { INITIAL_PROFILES } from '@/lib/mockData';

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
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'unicampus_auth_current_user';
const SCOPE_STORAGE_KEY = 'unicampus_admin_scope_dept';

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeScopeDeptId, setActiveScopeDeptIdState] = useState<string>('all');
  
  // Default to Student profile (Sakib Ahmed) for security & student panel privacy
  const [currentUser, setCurrentUser] = useState<Profile | null>(() => {
    return INITIAL_PROFILES.find(p => p.role === 'student') || INITIAL_PROFILES[0];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCurrentUser(parsed);
        } catch (e) {
          console.error('Failed to parse stored auth user', e);
        }
      }

      const storedScope = localStorage.getItem(SCOPE_STORAGE_KEY);
      if (storedScope) {
        setActiveScopeDeptIdState(storedScope);
      }
    }
    setIsLoaded(true);
  }, []);

  const saveUser = (user: Profile | null) => {
    setCurrentUser(user);
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
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
          ...INITIAL_PROFILES[1], // fallback template
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
        const superAdmin = { ...INITIAL_PROFILES[0], is_approved: approved };
        saveUser(superAdmin);
      }
    } else if (role === 'teacher') {
      const teacher = { ...INITIAL_PROFILES[4], is_approved: approved }; // Dr. Asif Rahman
      saveUser(teacher);
    } else {
      const student = { ...INITIAL_PROFILES.find(p => p.role === 'student') || INITIAL_PROFILES[INITIAL_PROFILES.length - 1], is_approved: approved };
      saveUser(student);
    }
  };

  const loginAsStudent = () => {
    const student = INITIAL_PROFILES.find(p => p.role === 'student') || INITIAL_PROFILES[7];
    saveUser(student);
  };

  const loginAsFaculty = () => {
    const teacher = INITIAL_PROFILES.find(p => p.role === 'teacher') || INITIAL_PROFILES[4];
    saveUser(teacher);
  };

  const loginAsAdmin = () => {
    saveUser(INITIAL_PROFILES[0]);
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

  const logout = () => {
    saveUser(null);
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
  const isApproved = !!currentUser?.is_approved;

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
        isLoaded,
        switchUserRole,
        loginAsStudent,
        loginAsFaculty,
        loginAsAdmin,
        loginAsDeptAdmin,
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
