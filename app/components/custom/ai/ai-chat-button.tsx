import { useState } from "react";
import { Button } from "#/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "#/components/ui/dialog";
import { MessageSquare } from "lucide-react";
import { ChatMessage } from "./chat-message";
import { Input } from "#/components/ui/input";

interface Message {
  content: string;
  isAI: boolean;
}

export function AIChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSend = () => {
    if (!input.trim() || isSubmitting) return;

    const userMessage: Message = { content: input, isAI: false };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSubmitting(true);

    // 模拟AI回复
    setTimeout(() => {
      const aiMessage: Message = {
        content: `我理解您的问题是关于 "${input}"。请允许我稍作思考，然后为您提供一个详细的回答。`,
        isAI: true,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>AI 助手</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              content={message.content}
              isAI={message.isAI}
            />
          ))}
          {isSubmitting && (
            <div className="text-center text-sm text-gray-500">
              AI正在思考中...
            </div>
          )}
        </div>
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={handleKeyPress}
              placeholder="输入您的问题..."
              className="flex-1"
              disabled={isSubmitting}
            />
            <Button onClick={handleSend} disabled={isSubmitting}>
              {isSubmitting ? "发送中..." : "发送"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
