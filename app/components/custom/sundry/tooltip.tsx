import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "#/components/ui/tooltip";

interface CustomTooltipProps {
  description: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

export function CustomTooltip({ description, children, side = "top", align = "center" }: CustomTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} align={align}>
        <p className="text-sm">{description}</p>
      </TooltipContent>
    </Tooltip>
  );
}
