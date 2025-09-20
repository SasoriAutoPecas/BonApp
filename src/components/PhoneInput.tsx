import * as React from 'react';
import { Input } from '@/components/ui/input';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const PhoneInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ onChange, ...props }, ref) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 11) {
        value = value.substring(0, 11);
      }
      
      let formattedValue = '';
      if (value.length > 0) {
        formattedValue = `(${value.substring(0, 2)}`;
      }
      if (value.length > 2) {
        formattedValue += `) ${value.substring(2, 7)}`;
      }
      if (value.length > 7) {
        formattedValue += `-${value.substring(7, 11)}`;
      }

      e.target.value = formattedValue;
      if (onChange) {
        onChange(e);
      }
    };

    return <Input {...props} ref={ref} onChange={handleInputChange} placeholder="(XX) XXXXX-XXXX" />;
  }
);

PhoneInput.displayName = 'PhoneInput';

export { PhoneInput };