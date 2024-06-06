import React from "react";

const Input = ({ value, setChange, type = "text", id, inputClass = "", divClass = "", labelClass = "", label, title = "Enter the value", required = true, readOnly = false, autocomplete = "" }) => {
    return (
        <div className={`flex flex-col gap-y-1 ${divClass}`}>
            <label htmlFor={id} className={`text-sm ${labelClass}`}>
                {label}
            </label>
            <input
                value={value}
                onChange={setChange}
                type={type}
                id={id}
                name={id}
                placeholder={label}
                className={`outline-none py-2 ${inputClass}`}
                required={required}
                readOnly={readOnly}
                title={title}
                autoComplete={autocomplete}
            />
        </div>
    );
};

export default Input;
