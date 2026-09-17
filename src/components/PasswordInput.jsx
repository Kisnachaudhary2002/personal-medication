import React, { useState } from "react";

// Password field with an eye icon to toggle visibility.
const PasswordInput = ({ name, value, onChange, placeholder, required, minLength }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="password-input-wrap">
      <input
        type={visible ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
      />
      <button
        type="button"
        className="password-toggle-btn"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        tabIndex={-1}
      >
        {visible ? "🙈" : "👁️"}
      </button>
    </div>
  );
};

export default PasswordInput;
