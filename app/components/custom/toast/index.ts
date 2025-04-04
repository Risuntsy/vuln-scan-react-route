import { type ExternalToast, toast } from "sonner";

const toastConfig: ExternalToast = {
  position: "top-center"
};

export function successToast(message: React.ReactNode) {
  toast.success(message, toastConfig);
}

export function successToastWithTitle(title: string, message: React.ReactNode) {
  toast.success(message, {
    ...toastConfig,
    description: title
  });
}

export function errorToast(message: React.ReactNode) {
  toast.error(message, toastConfig);
}

export function errorToastWithTitle(title: string, message: React.ReactNode) {
  toast.error(message, {
    ...toastConfig,
    description: title
  });
}

export function infoToast(message: React.ReactNode) {
  toast.info(message, toastConfig);
}

export function infoToastWithTitle(title: string, message: React.ReactNode) {
  toast.info(message, {
    ...toastConfig,
    description: title
  });
}

export function warningToast(message: React.ReactNode) {
  toast.warning(message, toastConfig);
}

export function warningToastWithTitle(title: string, message: React.ReactNode) {
  toast.warning(message, {
    ...toastConfig,
    description: title
  });
}
