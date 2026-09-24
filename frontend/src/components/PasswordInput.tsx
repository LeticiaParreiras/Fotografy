import { useState, type ChangeEvent } from 'react';
import { Eye, EyeClosed } from 'lucide-react';
import { Input, type InputProps } from '../shared/Input';
import { Button } from '../shared/Button';

interface PasswordInputProps extends Omit<InputProps, 'type' | 'endAdornment'> {
    showRequirements?: boolean;
}

const passwordChecks = [
    { label: '8-12 caracteres', test: (value: string) => value.length >= 8 && value.length <= 12 },
    { label: '1 maiúscula', test: (value: string) => /[A-Z]/.test(value) },
    { label: '1 minúscula', test: (value: string) => /[a-z]/.test(value) },
    { label: '1 número', test: (value: string) => /\d/.test(value) },
    { label: '1 símbolo', test: (value: string) => /[^A-Za-z0-9]/.test(value) },
];

export function PasswordInput({ showRequirements = false, onChange, value, ...props }: PasswordInputProps) {
    const [visible, setVisible] = useState(false);
    const [internalValue, setInternalValue] = useState('');
    const password = typeof value === 'string' ? value : internalValue;

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        setInternalValue(event.target.value);
        onChange?.(event);
    }

    return (
        <>
            <Input
                {...props}
                value={value}
                type={visible ? 'text' : 'password'}
                onChange={handleChange}
                endAdornment={
                    <Button
                        type="button"
                        variant="ghost"
                        id='no-padding'
                        icon={visible ? Eye : EyeClosed}
                        aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
                        onClick={() => setVisible((current) => !current)}
                    />
                }
            />
            {showRequirements && password.length > 0 && (
                <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
                    {passwordChecks.map((check) => (
                        <li key={check.label} className={check.test(password) ? 'text-primary' : 'text-foreground'}>
                            {check.test(password) ? '✓' : '·'} {check.label}
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}