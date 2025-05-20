import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel
} from "#/components";
import { cn } from "#/lib/utils";

interface AlertActionProps {
  children: React.ReactNode;
  onCancel?: () => void;
  onConfirm?: () => Promise<void>;
  confirmTitle?: string;
  confirmDescription?: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export function AlertAction({
  children,
  onCancel = () => {},
  confirmTitle = "确认操作",
  confirmDescription = "您确定要执行此操作吗？",
  confirmText = "确认",
  cancelText = "取消",
  isDestructive = false,
  onConfirm = async () => Promise.resolve()
}: AlertActionProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogTrigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{confirmTitle}</AlertDialogTitle>
          <AlertDialogDescription>{confirmDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              await onConfirm();
              setIsOpen(false);
            }}
            className={cn(isDestructive && "bg-destructive hover:bg-destructive/90")}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
