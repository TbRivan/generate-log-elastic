import DatePicker from "react-datepicker";

function DateInput({ value, onChange }) {
  return (
    <DatePicker
      className="input date-input"
      selected={value}
      onChange={onChange}
    />
  );
}

export default DateInput;
