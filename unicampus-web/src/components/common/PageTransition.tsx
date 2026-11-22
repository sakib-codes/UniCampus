"use client";

import { motion } from "framer-motion";
import React from "react";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{
        type: "spring",
        stiffness: 380,
        damping: 30,
        mass: 0.75,
      }}
      className={`w-full motion-reduce:transition-none motion-reduce:!opacity-100 motion-reduce:!transform-none ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;
