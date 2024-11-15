function TextAreaInput({ value, placeholder, onChange }) {
  return (
    <textarea
      className="input"
      type="text area"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}

export default TextAreaInput;
