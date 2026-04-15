import Label from './Label';
import Input from './Input';

export default function FormField({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  icon: Icon,
  helperText,
  fullWidth = true,
  ...props
}) {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && <Label required={required}>{label}</Label>}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)]">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <Input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          variant={error ? 'error' : 'default'}
          className={Icon ? 'pl-9' : ''}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {helperText && <p className="mt-1 text-xs text-[var(--text-faint)]">{helperText}</p>}
    </div>
  );
}
