import React from "react";
import { cn } from "../_utils/cn/cn";
import { Slot } from "@radix-ui/react-slot";


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "pink" | "default";
  className?: string;
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild = false, variant = "default", ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    const backgroundStyle =
      variant === "pink"
        ? { backgroundColor: "var(--secondary)" }
        : {
            background: "linear-gradient(135deg, var(--primary), var(--secondary))",
          };

    return (
      <Comp
        ref={ref}
        className={cn(
          "relative group overflow-hidden px-6 py-3 md:px-8 md:py-4 uppercase w-full rounded-full font-extrabold text-white text-sm md:text-base whitespace-nowrap tracking-tight shadow-lg shadow-blue-500/10 transition-all hover:-translate-y-0.5 active:scale-95",
          className
        )}
        style={backgroundStyle}
        {...props}
      />
    );
  }
);

export default Button
