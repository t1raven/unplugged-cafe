import './style.scss';
import { ChangeEvent, InputHTMLAttributes } from 'react';

interface Props {
  id: string;
  className?: string;
  type: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode'];
  label: string;
  value: string;
  readOnly?: boolean;
  required?: boolean;
  helperText?: string;
  autoComplete?: string;
  maxLength?: number;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
}

export default function InputField({ id, className, type, inputMode, label, value, readOnly, required, helperText, autoComplete, maxLength, onChange, onClick }: Props) {
  return (
    <div className={`input-field ${className}`}>
      <div>
        <input id={id} type={type} inputMode={inputMode} value={value} autoComplete={autoComplete} maxLength={maxLength} readOnly={readOnly} required={required} onChange={onChange} onClick={onClick} placeholder="" />
        <label htmlFor={id}>
          {label}
          {/* required && <em>*</em> */}
        </label>
      </div>
      <span className="helper-text">{helperText}</span>
    </div>
  )
}