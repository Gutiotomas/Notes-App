export interface ButtonProps {
  text: string;
  onClick?: () => void;
  className: string;
  type?: "button" | "submit" | "reset";
}

export interface InputProps {
  label?: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  maxLength?: number;
  placeholder?: string;
  required?: boolean;
  checked?: boolean;
  id?: string;
}

export interface TextAreaProps {
  label?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  rows?: number;
  cols?: number;
}
