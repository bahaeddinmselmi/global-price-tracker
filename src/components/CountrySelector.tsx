import React from 'react';
import Select from 'react-select';
import { Country } from '../types';

interface CountrySelectorProps {
  countries: Country[];
  selectedCountries: Country[];
  onChange: (countries: Country[]) => void;
  isDisabled?: boolean;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  countries,
  selectedCountries,
  onChange,
  isDisabled = false
}) => {
  const options = countries.map((country) => ({
    value: country.id,
    label: (
      <div className="flex items-center">
        <img
          src={country.flag}
          alt={`${country.name} flag`}
          className="w-5 h-4 mr-2 object-cover"
        />
        <span>{country.name}</span>
      </div>
    ),
    country
  }));

  const handleChange = (selected: any) => {
    onChange(selected ? selected.map((option: any) => option.country) : []);
  };

  const selectedOptions = options.filter((option) =>
    selectedCountries.some((country) => country.id === option.value)
  );

  return (
    <div className="w-full">
      <Select
        isMulti
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        placeholder="Select countries..."
        isDisabled={isDisabled}
        className="country-select"
        classNamePrefix="country-select"
        styles={{
          control: (base) => ({
            ...base,
            borderRadius: '0.375rem',
            borderColor: '#D1D5DB',
            minHeight: '2.5rem',
            boxShadow: 'none',
            '&:hover': {
              borderColor: '#6B7280'
            }
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: '#EFF6FF',
            borderRadius: '0.25rem'
          }),
          multiValueLabel: (base) => ({
            ...base,
            fontSize: '0.875rem',
            color: '#1E40AF'
          }),
          multiValueRemove: (base) => ({
            ...base,
            color: '#6B7280',
            '&:hover': {
              backgroundColor: '#DBEAFE',
              color: '#1E3A8A'
            }
          })
        }}
      />
    </div>
  );
};

export default CountrySelector;