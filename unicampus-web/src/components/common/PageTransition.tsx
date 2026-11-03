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
      initial={{ opacity: 0, y: 7 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -7 }}
      transition={{
        duration: 0.22,
        ease: [0.16, 1, 0.3, 1], // iOS/Apple native fluid deceleration curve
      }}
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;

