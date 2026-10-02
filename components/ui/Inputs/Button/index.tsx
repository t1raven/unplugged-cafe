import Link from 'next/link';
import './style.scss';

interface Props {
  type?: 'button' | 'submit' | 'reset';
  id?: string;
  className?: string;
  href?: string;
  target?: string;
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'disabled';
  style?: React.CSSProperties;
  opacity?: number;
  children?: React.ReactNode;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  disabled?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
  onChange?: (event: React.ChangeEvent<HTMLButtonElement>) => void;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export function Button({
  type = 'button',
  id,
  className,
  href,
  target,
  color = 'primary',
  variant = 'contained',
  size = 'medium',
  style,
  opacity,
  children,
  startIcon,
  endIcon,
  disabled,
  ref,
  onChange, 
  onClick 
}: Props) {
  const classes = `button-root button-${variant} button-size-${size} button-color-${color} ${className ?? ''}`.trim();

  const content = (
    <>
      {startIcon && (
        <i className="material-symbols-rounded button-icon" translate="no">
          {startIcon}
        </i>
      )}
      {children}
      {endIcon && (
        <i className="material-symbols-rounded button-icon" translate="no">
          {endIcon}
        </i>
      )}
    </>
  );

  const customStyles = {
    ...style,
    ...(opacity !== undefined ? { '--btn-opacity': opacity } : {}),
  } as React.CSSProperties;

  if (target && href) {
    return (
      <a
        id={id}
        href={href}
        className={classes}
        target={target}
        rel={target ? 'noopener noreferrer' : undefined}
        style={customStyles}
        aria-disabled={disabled}
      >
        {content}
      </a>
    );
  }

  if (href) {
    return (
      <Link
        id={id}
        href={href}
        className={classes}
        style={customStyles}
        aria-disabled={disabled}
      >
        {content}
      </Link>
    );
  }

  return (
    <button 
      id={id} 
      type={type} 
      className={classes} 
      style={customStyles}
      ref={ref} 
      onChange={onChange} 
      onClick={onClick} 
      disabled={disabled}
    >
      {content}
    </button>
  );
}