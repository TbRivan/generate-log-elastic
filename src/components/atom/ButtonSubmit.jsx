import React from "react";

function ButtonSubmit({ onClick, disabled, children, style }) {
  return (
    <button
      type="text"
      onClick={onClick}
      className="submit"
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
}

export default ButtonSubmit;
