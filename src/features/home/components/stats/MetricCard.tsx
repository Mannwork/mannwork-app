import React from 'react';
import { Text, View } from 'react-native';

export interface MetricCardProps {
  value: number | string | boolean | string[] | { month: string; value: number }[] | undefined;
  label: string;
  isMoney?: boolean;
  isPercent?: boolean;
  fullWidth?: boolean;
  highlight?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  value, 
  label, 
  isMoney = false, 
  isPercent = false, 
  fullWidth = false, 
  highlight = false 
}) => {
  let displayValue: string;
  
  // Manejar diferentes tipos de valor
  if (value === undefined || value === null) {
    displayValue = 'N/A';
  } else if (isMoney) {
    displayValue = `$${value}`;
  } else if (isPercent) {
    displayValue = `${value}%`;
  } else if (Array.isArray(value)) {
    // Para arrays, mostrar el conteo de elementos
    displayValue = String(value.length);
  } else if (typeof value === 'boolean') {
    displayValue = value ? 'Sí' : 'No';
  } else {
    displayValue = String(value);
  }
  
  return (
    <View 
      className={`
        ${highlight ? 'bg-green-mannwork' : 'bg-green-mannwork-light'} 
        rounded-2xl border-2 
        ${highlight ? 'border-white' : 'border-green-mannwork'} 
        mb-4 p-4 shadow-md items-center justify-center 
        ${fullWidth ? 'w-full' : 'w-[48%]'}
      `}
    >
      <Text 
        className={`
          text-3xl font-extrabold 
          ${highlight ? 'text-white' : 'text-green-mannwork'} 
          mb-1
        `}
      >
        {displayValue}
      </Text>
      <Text 
        className={`
          text-sm font-semibold 
          ${highlight ? 'text-white' : 'text-gray-700'} 
          text-center
        `}
      >
        {label}
      </Text>
    </View>
  );
};

export default MetricCard;
