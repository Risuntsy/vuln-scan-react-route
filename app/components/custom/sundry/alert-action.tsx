import React from "react";
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
} from "#/components/ui/alert-dialog";
import { cn } from "#/lib/utils";

interface AlertActionProps {
  itemContent: React.ReactNode;
  onAction: () => void;
  onCancel?: () => void;
  confirmTitle?: string;
  confirmDescription?: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export function AlertAction({
  itemContent,
  onAction,
  onCancel,
  confirmTitle = "确认操作",
  confirmDescription = "您确定要执行此操作吗？",
  confirmText = "确认",
  cancelText = "取消",
  isDestructive = false
}: AlertActionProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{itemContent}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{confirmTitle}</AlertDialogTitle>
          <AlertDialogDescription>{confirmDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            className={cn(isDestructive && "bg-destructive hover:bg-destructive/90")}
            onClick={onAction}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
