import { cn } from "#/lib/utils";

interface ChatMessageProps {
  content: string;
  isAI: boolean;
}

export function ChatMessage({ content, isAI }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex w-full",
        isAI ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-2",
          isAI
            ? "bg-muted"
            : "bg-primary text-primary-foreground"
        )}
      >
        <p className="text-sm">{content}</p>
      </div>
    </div>
  );
} 