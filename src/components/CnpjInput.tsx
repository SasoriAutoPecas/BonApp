import * as React from 'react';
import { Input } from '@/components/ui/input';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const CnpjInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ onChange, ...props }, ref) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value.replace(/\D/g, '');
      
      if (value.length > 14) {
        value = value.substring(0, 14);
      }

      value = value.replace(/^(\d{2})(\d)/, '$1.$2');
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      value = value.replace(/\.(\d{3})\.(\d{3})(\d)/, '.$1.$2/$3');
      value = value.replace(/(\d{4})(\d)/, '$1-$2');

      e.target.value = value;
      if (onChange) {
        onChange(e);
      }
    };

    return <Input {...props} ref={ref} onChange={handleInputChange} placeholder="00.000.000/0000-00" maxLength={18} />;
  }
);

CnpjInput.displayName = 'CnpjInput';

export { CnpjInput };