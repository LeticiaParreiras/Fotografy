import type { InputHTMLAttributes, ReactNode } from 'react'


export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
 label?: string;
 error?: string;
 endAdornment?: ReactNode;
}

export function Input({ label, error, endAdornment, className, ...rest }: InputProps) {
  return (
    <div className='my-4'>
    {label && <p className='block text-foreground mb-1 '>{label}</p>} 
    <div className={`bg-input flex items-center rounded-2xl p-4 border-1 border-border ${className ?? ''}`}>
      <input
        className="text-foreground placeholder:text-muted-foreground focus:bg-input focus:muted-primary w-full bg-transparent text-sm outline-none "
        autoFocus
        {...rest}
      />

      {endAdornment }

    </div>
      {error && <p className='text-red-500 text-s'>{error}</p>}
    
    </div>
  )
}