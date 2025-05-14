import React from 'react';
import { cn } from '#/lib/utils';
import { Inbox } from 'lucide-react';

interface EmptyPlaceholderProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export function EmptyPlaceholder({
  icon = <Inbox className="h-12 w-12 text-muted-foreground" />,
  title,
  description,
  className
}: EmptyPlaceholderProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-8 rounded-md border border-dashed", className)}>
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  );
} 