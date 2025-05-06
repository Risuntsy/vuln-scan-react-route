;

import { cn } from "#/lib/utils";
import { Info, AlertCircle, Search, X, CheckSquare } from "lucide-react";
import { FormItem, Label, SelectGroup, Switch } from "#/components";
import {
  Alert,
  AlertDescription,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "#/components";
import { SelectLabel } from "@radix-ui/react-select";

export const CustomFormSection = ({ children, ...props }: { children: React.ReactNode; props?: any }) => (
  <div className={`space-y-2 mt-4 ${props}`}>{children}</div>
);

export const CustomFormLabel = ({
  name,
  children,
  required = false
}: {
  name: string;
  children: React.ReactNode;
  required?: boolean;
}) => (
  <Label htmlFor={name} className="font-medium">
    {children} {required && <span className="text-red-500">*</span>}
  </Label>
);

export const CustomFormGrid = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  props?: any;
}) => (
  <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", className)} {...props}>
    {children}
  </div>
);

export const CustomFormField = ({
  children,
  className,
  required,
  label,
  name
}: {
  required?: boolean;
  className?: string;
  label: string;
  name: string;
  children: React.ReactNode;
}) => (
  <div className={cn("space-y-2", className)}>
    <CustomFormLabel name={name} required={required}>
      {label}
    </CustomFormLabel>
    <FormItem>{children}</FormItem>
  </div>
);

export const CustomWarningAlert = ({ icon, children }: { icon: string; children: React.ReactNode }) => (
  <Alert className="mb-2 text-sm bg-amber-50 border-amber-200">
    {icon === "info" ? (
      <Info className="h-4 w-4 mr-2 flex-shrink-0" />
    ) : (
      <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
    )}
    <AlertDescription>{children}</AlertDescription>
  </Alert>
);

export const CustomSwitchOption = ({
  name,
  label,
  checked,
  onChange
}: {
  name?: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => (
  <div className="flex items-center space-x-2">
    <Switch name={name} checked={checked} onCheckedChange={onChange} />
    <Label htmlFor={name} className="cursor-pointer">
      {label}
    </Label>
  </div>
);

export const CustomDivider = ({ className = "my-6" }: { className?: string }) => (
  <div className={`border-t border-gray-200 ${className}`} />
);

export const CustomImagePreview = ({
  url,
  placeholder,
  height = "h-20"
}: {
  url: string;
  placeholder: string;
  height?: string;
}) => (
  <div className={`${height} border rounded-md flex items-center justify-center bg-muted/20`}>
    {url ? (
      <img src={url} alt="Preview" className="max-h-full max-w-full object-contain" />
    ) : (
      <span className="text-sm text-muted-foreground">{placeholder}</span>
    )}
  </div>
);

interface CustomRadioGroupProps<T extends string> {
  id: string;
  options: { label: string; value: T }[];
  defaultValue?: T;
  checked: T;
  onChange: (value: T) => void;
  vertical?: boolean;
}

export function CustomRadioGroup<T extends string>({
  id,
  options,
  defaultValue,
  checked,
  onChange,
  vertical
}: CustomRadioGroupProps<T>) {
  return (
    <RadioGroup
      id={id}
      defaultValue={defaultValue}
      onValueChange={onChange}
      value={checked}
      className={cn(vertical ? "flex-col" : "", "flex")}
    >
      {options.map(option => (
        <div className="flex items-center space-x-2" key={option.value}>
          <RadioGroupItem value={option.value} id={option.value} />
          <Label htmlFor={option.value} className="cursor-pointer">
            {option.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}

interface CustomSelectProps {
  name: string;
  options: { label: string; value: string }[];
  value: string;
  placeholder: string;
  title: string;
  onChange: (value: string) => void;
  defaultValue?: string;
}

export function CustomSelect({ name, options, value, placeholder, title, onChange, defaultValue }: CustomSelectProps) {
  return (
    <FormItem>
      <Select name={name} value={value} onValueChange={onChange} defaultValue={defaultValue}>
        <SelectTrigger id={name}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{title}</SelectLabel>
            {options.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </FormItem>
  );
}
