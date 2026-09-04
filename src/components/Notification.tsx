import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { startViewTransition, shouldAnimate } from "~/utils/viewTransition";
import { useStore } from "~/stores";

export interface NotificationProps {
  id: string;
  title: string;
  message: string;
  icon?: string;
  emoji?: string;
  onClose?: () => void;
  index?: number;
  type?: "default" | "success" | "info" | "warning";
}

const Notification: React.FC<NotificationProps> = ({
  id,
  title,
  message,
  icon = "img/icons/launchpad.png",
  emoji,
  onClose,
  index = 0,
  type = "default"
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isEntering, setIsEntering] = useState(true);
  const dark = useStore((state) => state.dark);
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsEntering(false), 350);
    return () => clearTimeout(timer);
  }, []);

  const getProgressBarColor = () => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "info":
        return "bg-blue-500";
      case "warning":
        return "bg-yellow-500";
      default:
        return "bg-blue-500";
    }
  };

  const handleClose = () => {
    if (shouldAnimate() && nodeRef.current) {
      nodeRef.current.style.setProperty("view-transition-name", `notification-${id}`);
      startViewTransition(() => {
        setIsVisible(false);
        onClose?.();
      });
      setTimeout(() => {
        nodeRef.current?.style.removeProperty("view-transition-name");
      }, 350);
    } else {
      setIsVisible(false);
      onClose?.();
    }
  };

  const enterClass = isEntering
    ? "opacity-0 translate-x-[100%]"
    : "opacity-100 translate-x-0";
  const border = dark
    ? "0.5px solid rgba(255, 255, 255, 0.08)"
    : "0.5px solid rgba(0, 0, 0, 0.04)";
  const boxShadow = dark
    ? "0 4px 24px rgba(0, 0, 0, 0.2), 0 8px 40px rgba(0, 0, 0, 0.15)"
    : "0 4px 24px rgba(0, 0, 0, 0.05), 0 8px 40px rgba(0, 0, 0, 0.06)";
  const notificationStyle: React.CSSProperties = {
    backdropFilter: "blur(20px) saturate(180%)",
    top: `${2.5 + (index as number) * 0.1}rem`,
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    border,
    boxShadow
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div
          ref={nodeRef}
          className={`
            fixed right-4 w-[340px] rounded-2xl overflow-hidden
            ${dark ? "bg-gray-900/70 text-white" : "bg-white/72 text-gray-900"}
            transition-all duration-300 ease-out
            ${enterClass}
          `}
          style={notificationStyle}
        >
          <div className="p-4">
            <div className="flex items-start space-x-3">
              {emoji ? (
                <div className="w-10 h-10 flex items-center justify-center text-2xl bg-gray-100 dark:bg-gray-700 rounded-md">
                  {emoji}
                </div>
              ) : (
                <img src={icon} alt="" className="w-10 h-10 rounded-md" />
              )}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-900"}`}
                >
                  {title}
                </p>
                <p className={`mt-1 text-sm ${dark ? "text-gray-300" : "text-gray-600"}`}>
                  {message}
                </p>
              </div>
              <button
                onClick={handleClose}
                className={`
                  p-1 rounded-full transition-all duration-150
                  ${dark ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50" : "text-gray-400 hover:text-gray-600 hover:bg-gray-200/50"}
                `}
              >
                <span className="i-fa-solid:times text-xs" />
              </button>
            </div>
          </div>
          <div className={`h-0.5 ${getProgressBarColor()} opacity-80`} />
        </div>
      )}
    </AnimatePresence>
  );
};

export default Notification;

export const NotificationContainer: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  return (
    <div className="fixed top-0 right-0 z-50 p-4">
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { index } as any);
        }
        return child;
      })}
    </div>
  );
};
