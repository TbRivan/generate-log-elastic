import React from "react";

function Select({ value, onChange, label, values }) {
  return (
    <select value={value} onChange={onChange}>
      <option value="">{label}</option>
      {values.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default Select;
