#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");
const SRC_ROOT = path.join(PROJECT_ROOT, "src");

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run");
const VERBOSE = args.has("--verbose");

const EXCLUDED_REL_PATHS = new Set([
  "src/app/globals.css",
  "src/lib/theme.ts",
  "src/components/common/SubtleAuroraBackground.tsx",
  "src/components/bits/Aurora.tsx",
  "src/components/bits/ClickSpark.tsx",
  "src/components/bits/PixelCard.tsx",
  "src/components/bits/StarBorder.tsx",
  "src/components/bits/TiltedCard.tsx",
]);

const FG_HEXES = new Set([
  "#F0F6FC",
  "#C9D1D9",
  "#111827",
  "#0A192F",
  "#1E252D",
  "#1E293B",
]);

const FG_MUTED_HEXES = new Set([
  "#8D96A0",
  "#6E747D",
  "#6E7681",
  "#64748B",
  "#94A3B8",
  "#334155",
  "#475569",
]);

const SURFACE_HEXES = new Set([
  "#0D1117",
  "#0B1220",
  "#0D131F",
  "#070A12",
]);

const SURFACE2_HEXES = new Set([
  "#161B22",
  "#1C2128",
  "#1A2234",
  "#1A202C",
  "#E2E7EE",
  "#F2F2F8",
]);

const CANVAS_HEXES = new Set([
  "#010409",
  "#060A14",
  "#F0F4FA",
  "#F5F5FA",
]);

const BRAND_HEXES = new Set([
  "#2563EB",
  "#1D5BD8",
  "#6B66FF",
  "#60A5FA",
  "#3B82F6",
  "#58A6FF",
  "#8A86FF",
  "#C3C1FF",
  "#605BFF",
  "#7C78FF",
]);

const BRAND_HOVER_HEXES = new Set([
  "#1548B0",
  "#1D4ED8",
  "#5752E5",
  "#5852FF",
  "#4E49EB",
  "#918EFF",
]);

const SUCCESS_HEXES = new Set(["#3FB950", "#10B981", "#12A150", "#34D399"]);
const WARNING_HEXES = new Set(["#D29922", "#F59E0B", "#D97706", "#FBBF24"]);
const DANGER_HEXES = new Set(["#F85149", "#F43F5E", "#EF4444", "#E5484D", "#F87171"]);

function mapHexToSemantic(prop, rawHex, variantPrefix) {
  const hex = rawHex.toUpperCase();

  if (FG_HEXES.has(hex)) return "fg";
  if (FG_MUTED_HEXES.has(hex)) return "fg-muted";

  if (hex === "#30363D" || hex === "#21262D") {
    if (prop === "border" || prop === "divide" || prop === "ring" || prop === "stroke") {
      return "line";
    }
    if (hex === "#30363D" && (prop === "bg" || prop === "text")) {
      return "line";
    }
    if (hex === "#21262D" && (prop === "bg" || prop === "from" || prop === "to" || prop === "via")) {
      return "surface-2";
    }
  }

  if (SURFACE2_HEXES.has(hex)) return "surface-2";
  if (SURFACE_HEXES.has(hex)) return "surface";

  if (CANVAS_HEXES.has(hex)) {
    if (hex === "#010409" && prop === "text") return "fg";
    return "canvas";
  }

  if (BRAND_HOVER_HEXES.has(hex)) {
    return variantPrefix.includes("hover:") ? "brand-hover" : "brand";
  }
  if (BRAND_HEXES.has(hex)) return "brand";

  if (SUCCESS_HEXES.has(hex)) return "success";
  if (WARNING_HEXES.has(hex)) return "warning";
  if (DANGER_HEXES.has(hex)) return "danger";

  return null;
}

function removeClassToken(line, tokenRegexSource) {
  let count = 0;
  let result = line;

  // 1. Token followed by horizontal whitespace inside a class string/template
  const beforeSpaceRe = new RegExp(
    `(?<=["'\`\\s])(?:${tokenRegexSource})[ \\t]+`,
    "g"
  );
  result = result.replace(beforeSpaceRe, () => {
    count++;
    return "";
  });

  // 2. Horizontal whitespace + token right before closing quote/backtick/end-of-class
  const afterSpaceRe = new RegExp(
    `[ \\t]+(?:${tokenRegexSource})(?=["'\`])`,
    "g"
  );
  result = result.replace(afterSpaceRe, () => {
    count++;
    return "";
  });

  // 3. Standalone token as the entire quoted string
  const soloRe = new RegExp(
    `(?<=["'\`])(?:${tokenRegexSource})(?=["'\`])`,
    "g"
  );
  result = result.replace(soloRe, () => {
    count++;
    return "";
  });

  return { line: result, count };
}

function isLivePulseAllowed(relPath, lines, idx) {
  const line = lines[idx];
  if (/skeleton/i.test(relPath) || /skeleton/i.test(line)) {
    return true;
  }

  const windowNear = lines
    .slice(Math.max(0, idx - 3), Math.min(lines.length, idx + 4))
    .join("\n");

  if (relPath === "src/components/attendance/AttendanceScannerModal.tsx") {
    return (
      windowNear.includes("Live Session") ||
      windowNear.includes("Scanning for classroom QR")
    );
  }

  if (relPath === "src/components/common/LectureScheduleCard.tsx") {
    return windowNear.includes("isOngoing");
  }

  if (relPath === "src/app/routine/page.tsx") {
    return (
      windowNear.includes("In Progress") ||
      windowNear.includes("statusText") ||
      windowNear.includes("isActiveSlot")
    );
  }

  if (relPath === "src/app/messages/page.tsx") {
    const windowWide = lines
      .slice(Math.max(0, idx - 12), Math.min(lines.length, idx + 10))
      .join("\n");
    return (
      windowNear.includes("playingVoiceId") ||
      windowWide.includes("isRecordingVoice") ||
      windowWide.includes("Messenger {activeCallType") ||
      windowWide.includes("Connected • VoIP")
    );
  }

  return false;
}

const HEX_CLASS_RE =
  /(?<![a-zA-Z0-9_-])((?:[a-z0-9-]+:)*)(bg|text|border|ring|from|to|via|divide|placeholder|fill|stroke|shadow|accent)-\[(#[0-9A-Fa-f]{6})\](?:\/([0-9a-zA-Z\[\].]+))?(?![a-zA-Z0-9_/-])/g;

const MICRO_TEXT_RE =
  /(?<![a-zA-Z0-9_-])((?:[a-z0-9-]+:)*)text-\[(?:8|9|10|11)(?:\.\d+)?px\](?![a-zA-Z0-9_-])/g;

function transformFile(relPath, content) {
  const lines = content.split("\n");
  const stats = {
    hex: 0,
    microText: 0,
    fontManrope: 0,
    uppercaseTracking: 0,
    decorativePulse: 0,
  };
  const diffs = [];

  const updatedLines = lines.map((origLine, idx) => {
    let line = origLine;

    // 1. Hardcoded Tailwind hex classes -> Option A semantic tokens
    line = line.replace(
      HEX_CLASS_RE,
      (full, variantPrefix, prop, hex, opacity) => {
        const semantic = mapHexToSemantic(prop, hex, variantPrefix || "");
        if (!semantic) return full;
        stats.hex++;
        const suffix = opacity ? `/${opacity}` : "";
        return `${variantPrefix || ""}${prop}-${semantic}${suffix}`;
      }
    );

    // 2. Micro text text-[8..11.5px] -> text-xs (13px)
    line = line.replace(MICRO_TEXT_RE, (_full, variantPrefix) => {
      stats.microText++;
      return `${variantPrefix || ""}text-xs`;
    });

    // 3. Remove unused font-manrope inside class strings
    if (line.includes("font-manrope") && /["'`]/.test(line)) {
      const res = removeClassToken(line, "font-manrope");
      line = res.line;
      stats.fontManrope += res.count;
    }

    // 4. Remove uppercase & tracking-wider/widest (and tracking-wide when paired with uppercase) on UI labels
    if (
      /className|["'`]/.test(line) &&
      /\b(?:uppercase|tracking-(?:wider|widest))\b/.test(line)
    ) {
      const hasUppercase = /\buppercase\b/.test(line);
      const tokenPattern = hasUppercase
        ? "uppercase|tracking-(?:wider|widest|wide)"
        : "tracking-(?:wider|widest)";
      const res = removeClassToken(line, tokenPattern);
      line = res.line;
      stats.uppercaseTracking += res.count;
    }

    // 5. Remove decorative animate-ping / animate-pulse (preserving live indicators & skeletons)
    if (/\banimate-(?:ping|pulse)\b/.test(line) && /["'`]/.test(line)) {
      if (!isLivePulseAllowed(relPath, lines, idx)) {
        const res = removeClassToken(
          line,
          "(?:[a-z0-9-]+:)*animate-(?:ping|pulse)"
        );
        line = res.line;
        stats.decorativePulse += res.count;
      }
    }

    if (line !== origLine) {
      diffs.push({ lineNumber: idx + 1, before: origLine, after: line });
    }
    return line;
  });

  return {
    changed: diffs.length > 0,
    nextContent: updatedLines.join("\n"),
    stats,
    diffs,
  };
}

function collectFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const absPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(absPath, out);
    } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
      const relPath = path.relative(PROJECT_ROOT, absPath).replace(/\\/g, "/");
      if (!EXCLUDED_REL_PATHS.has(relPath)) {
        out.push({ absPath, relPath });
      }
    }
  }
  return out;
}

function main() {
  if (!fs.existsSync(SRC_ROOT)) {
    console.error(`Error: src directory not found at ${SRC_ROOT}`);
    process.exit(1);
  }

  const files = collectFiles(SRC_ROOT).sort((a, b) =>
    a.relPath.localeCompare(b.relPath)
  );

  const totals = {
    filesScanned: files.length,
    filesModified: 0,
    hex: 0,
    microText: 0,
    fontManrope: 0,
    uppercaseTracking: 0,
    decorativePulse: 0,
  };

  for (const { absPath, relPath } of files) {
    const original = fs.readFileSync(absPath, "utf8");
    const result = transformFile(relPath, original);
    if (!result.changed) continue;

    totals.filesModified++;
    totals.hex += result.stats.hex;
    totals.microText += result.stats.microText;
    totals.fontManrope += result.stats.fontManrope;
    totals.uppercaseTracking += result.stats.uppercaseTracking;
    totals.decorativePulse += result.stats.decorativePulse;

    if (DRY_RUN) {
      console.log(
        `[DRY-RUN] ${relPath} (${result.diffs.length} lines: hex=${result.stats.hex}, micro=${result.stats.microText}, manrope=${result.stats.fontManrope}, upper=${result.stats.uppercaseTracking}, pulse=${result.stats.decorativePulse})`
      );
      const previewLimit = VERBOSE ? result.diffs.length : 4;
      for (const d of result.diffs.slice(0, previewLimit)) {
        console.log(`  L${d.lineNumber} - ${d.before.trim()}`);
        console.log(`  L${d.lineNumber} + ${d.after.trim()}`);
      }
      if (!VERBOSE && result.diffs.length > previewLimit) {
        console.log(`  ... +${result.diffs.length - previewLimit} more lines`);
      }
    } else {
      fs.writeFileSync(absPath, result.nextContent, "utf8");
    }
  }

  console.log("\n=== Codemod Summary ===");
  console.log(`Mode:              ${DRY_RUN ? "DRY-RUN (no files written)" : "APPLIED"}`);
  console.log(`Files scanned:     ${totals.filesScanned}`);
  console.log(`Files modified:    ${totals.filesModified}`);
  console.log(`Hex tokens:        ${totals.hex}`);
  console.log(`Micro text:        ${totals.microText}`);
  console.log(`font-manrope:      ${totals.fontManrope}`);
  console.log(`Uppercase/track:   ${totals.uppercaseTracking}`);
  console.log(`Decorative pulse:  ${totals.decorativePulse}`);
}

main();
