"use client";

import { motion } from "framer-motion";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function BlurText({
  text,
  className = "",
  delay = 0.04,
}: BlurTextProps) {
  const words = text.split(" ");

  return (
    <>
      <span className="sr-only">{text}</span>
      <span className={`inline-flex flex-wrap ${className}`} aria-hidden="true">
        {words.map((word, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, filter: "blur(8px)", y: 8 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{
              duration: 0.45,
              delay: index * delay,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mr-[0.25em] inline-block"
          >
            {word}
          </motion.span>
        ))}
      </span>
    </>
  );
}

