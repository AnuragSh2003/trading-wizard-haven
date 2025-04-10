
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

type ScreenerType = 
  | 'Trend' 
  | 'Momentum' 
  | 'Volatility' 
  | 'Volume' 
  | 'Custom';

interface ScreenerTypeSelectorProps {
  onScreenerTypeChange: (type: ScreenerType) => void;
}

export const ScreenerTypeSelector: React.FC<ScreenerTypeSelectorProps> = ({ 
  onScreenerTypeChange 
}) => {
  return (
    <Select onValueChange={(value: ScreenerType) => onScreenerTypeChange(value)}>
      <SelectTrigger>
        <SelectValue placeholder="Select Screener Type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Trend">Trend Indicators</SelectItem>
        <SelectItem value="Momentum">Momentum Indicators</SelectItem>
        <SelectItem value="Volatility">Volatility Indicators</SelectItem>
        <SelectItem value="Volume">Volume Indicators</SelectItem>
        <SelectItem value="Custom">Custom/Derived Indicators</SelectItem>
      </SelectContent>
    </Select>
  );
};
