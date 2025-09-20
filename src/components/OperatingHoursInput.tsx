import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DayHours {
  isOpen: boolean;
  opens: string;
  closes: string;
}

interface OperatingHoursInputProps {
  value?: string;
  onChange: (value: string) => void;
}

const daysOfWeek = [
  { key: 'seg', name: 'Segunda-feira' },
  { key: 'ter', name: 'Terça-feira' },
  { key: 'qua', name: 'Quarta-feira' },
  { key: 'qui', name: 'Quinta-feira' },
  { key: 'sex', name: 'Sexta-feira' },
  { key: 'sab', name: 'Sábado' },
  { key: 'dom', name: 'Domingo' },
];

const initialHoursState = daysOfWeek.reduce((acc, day) => {
  acc[day.key] = { isOpen: false, opens: '09:00', closes: '18:00' };
  return acc;
}, {} as Record<string, DayHours>);

export const OperatingHoursInput = ({ value, onChange }: OperatingHoursInputProps) => {
  const [hours, setHours] = useState(initialHoursState);

  useEffect(() => {
    if (value) {
      const newHours = { ...initialHoursState };
      const lines = value.split('\n');
      lines.forEach(line => {
        const dayMatch = daysOfWeek.find(d => line.startsWith(d.name));
        if (dayMatch) {
          const timeMatch = line.match(/(\d{2}:\d{2}) - (\d{2}:\d{2})/);
          if (timeMatch) {
            newHours[dayMatch.key] = {
              isOpen: true,
              opens: timeMatch[1],
              closes: timeMatch[2],
            };
          }
        }
      });
      setHours(newHours);
    }
  }, [value]);

  useEffect(() => {
    const formattedString = daysOfWeek
      .map(day => {
        const dayData = hours[day.key];
        if (dayData.isOpen) {
          return `${day.name}: ${dayData.opens} - ${dayData.closes}`;
        }
        return null;
      })
      .filter(Boolean)
      .join('\n');
    onChange(formattedString);
  }, [hours, onChange]);

  const handleDayChange = (dayKey: string, field: keyof DayHours, fieldValue: string | boolean) => {
    setHours(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        [field]: fieldValue,
      },
    }));
  };

  return (
    <div className="space-y-4">
      {daysOfWeek.map(day => (
        <div key={day.key} className="grid grid-cols-4 items-center gap-4 p-2 border rounded-md">
          <div className="col-span-1 flex items-center space-x-2">
            <Checkbox
              id={`check-${day.key}`}
              checked={hours[day.key].isOpen}
              onCheckedChange={(checked) => handleDayChange(day.key, 'isOpen', !!checked)}
            />
            <Label htmlFor={`check-${day.key}`} className="font-medium">{day.name}</Label>
          </div>
          <div className="col-span-3 flex items-center gap-2">
            <Input
              type="time"
              value={hours[day.key].opens}
              onChange={(e) => handleDayChange(day.key, 'opens', e.target.value)}
              disabled={!hours[day.key].isOpen}
            />
            <span>-</span>
            <Input
              type="time"
              value={hours[day.key].closes}
              onChange={(e) => handleDayChange(day.key, 'closes', e.target.value)}
              disabled={!hours[day.key].isOpen}
            />
          </div>
        </div>
      ))}
    </div>
  );
};