import './style.scss';
import { ChangeEvent, InputHTMLAttributes, Ref, ReactNode } from 'react';

interface TextProps {
  id: string;
  className?: string;
  type: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode'];
  label: string;
  value?: string;
  readOnly?: boolean;
  required?: boolean;
  helperText?: string;
  autoComplete?: string;
  maxLength?: number;
  ref?: Ref<HTMLInputElement>;
  children?: ReactNode;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
}

export function TextField({ 
    id, 
    className, 
    type, 
    inputMode, 
    label, 
    value, 
    readOnly, 
    required, 
    helperText, 
    autoComplete, 
    maxLength, 
    ref, 
    children, 
    onChange, 
    onClick 
  }: TextProps) {
  return (
    <div className={`input-field ${className}`}>
      <div className="form-text">
        <input 
          id={id} 
          type={type} 
          inputMode={inputMode} 
          value={value} 
          autoComplete={autoComplete} 
          maxLength={maxLength} 
          readOnly={readOnly} 
          required={required} 
          ref={ref} 
          onChange={onChange} 
          onClick={onClick} 
          placeholder="" 
        />
        <label htmlFor={id}>
          {label}
          {required && <em>*</em>}
        </label>
        {children}
      </div>
      <div className="helper-text">{helperText}</div>
    </div>
  )
}

interface TextareaProps {
  id: string;
  className?: string;
  label: string;
  value?: string;
  readOnly?: boolean;
  required?: boolean;
  helperText?: string;
  maxLength?: number;
  rows?: number;
  ref?: Ref<HTMLTextAreaElement>;
  children?: ReactNode;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onClick?: () => void;
}

export function TextareaField({ 
    id, 
    className, 
    label, 
    value, 
    readOnly, 
    required, 
    helperText, 
    rows,
    ref, 
    children, 
    onChange, 
    onClick 
  }: TextareaProps) {
  return (
    <div className={`input-field ${className}`}>
      <div className="form-text">
        <textarea 
          id={id} 
          value={value} 
          readOnly={readOnly} 
          required={required} 
          rows={rows}
          ref={ref}
          onChange={onChange} 
          onClick={onClick} 
          placeholder="" 
        />
        <label htmlFor={id}>
          {label}
          {required && <em>*</em>}
        </label>
        {children}
      </div>
      <div className="helper-text">{helperText}</div>
    </div>
  )
}