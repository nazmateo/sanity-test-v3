import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../../lib/cn";

export type GroupProps = HTMLAttributes<HTMLDivElement>;

export const Group = forwardRef<HTMLDivElement, GroupProps>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn(className)} {...props} />;
});

Group.displayName = "Group";
