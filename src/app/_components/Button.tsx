import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../_utils/cn/cn"; // OR add your own class merge util

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  className?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(
          "mt-6 w-full bg-(--secondary) text-white py-3 rounded-md font-semibold text-lg uppercase",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export default Button;
