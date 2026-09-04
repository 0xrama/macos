import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AboutThisMacProps {
  onClose: () => void;
}

export default function AboutThisMac({ onClose }: AboutThisMacProps) {
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, onClose, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="fixed inset-0 z-50 flex-center"
        onClick={onClose}
      >
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="w-72 rounded-glass-lg overflow-hidden bg-white/80 dark:bg-gray-900/80 text-center"
          style={{
            backdropFilter: "blur(40px) saturate(180%)",
            WebkitBackdropFilter: "blur(40px) saturate(180%)",
            border: "0.5px solid rgba(255, 255, 255, 0.4)",
            boxShadow:
              "inset 0 1px 0.5px rgba(255,255,255,0.55), 0 22px 70px 4px rgba(0, 0, 0, 0.2)"
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* macOS Logo */}
          <div className="pt-6 pb-3">
            <img
              src="img/ui/apple-logo.svg"
              alt="Apple Logo"
              className="w-20 h-24 mx-auto dark:invert"
              onError={(e) => {
                // Fallback to icon if image doesn't exist
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <span className="i-ri:apple-fill text-6xl text-c-black hidden first:block" />
          </div>

          {/* macOS Name */}
          <div className="px-6 pb-2">
            <h1 className="text-xl font-medium text-c-black">macOS Tahoe</h1>
            <p className="text-[11px] text-c-500 mt-0.5">Version 26.0</p>
          </div>

          {/* Divider */}
          <div className="mx-6 h-px bg-gray-300/50 dark:bg-gray-600/50 my-2" />

          {/* Mac Info */}
          <div className="px-6 py-3 text-[11px] text-c-black leading-relaxed">
            <p className="font-semibold">MacBook Pro</p>
            <p className="text-c-500 mt-1">
              Apple M4 Pro
              <br />
              24 GB Memory
              <br />
              macOS Tahoe 26.0
            </p>
          </div>

          {/* Divider */}
          <div className="mx-6 h-px bg-gray-300/50 dark:bg-gray-600/50 my-1" />

          {/* Serial Number & Links */}
          <div className="px-6 py-3 text-[11px] text-c-500">
            <p>Serial Number: XXXXXXXXXXXX</p>
          </div>

          {/* Buttons */}
          <div className="px-4 pb-4 pt-1 hstack justify-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-medium rounded-md
                bg-blue-500 hover:bg-blue-600 active:bg-blue-700
                text-white transition-colors duration-100"
            >
              OK
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
