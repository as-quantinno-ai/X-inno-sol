import { useEffect, useState } from "react";
import PropTypes from "prop-types";
const { TextField } = require("@mui/material");

const CustomTextField = ({ field, func, defaultValue, defauldValue, parquetDataTypesForFields, setRef, display }) => {
    const isEmail = field.description === "Email";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const [borderColor, setBorderColor] = useState("");
    const [inputValue, setInputValue] = useState((defaultValue && defaultValue[field.field_name]) || defauldValue || "");

    const validateEmail = (email) => {
        if (isEmail && !emailRegex.test(email)) {
            setBorderColor("red");
        } else {
            setBorderColor("");
        }
    };

    useEffect(() => {
        validateEmail(defauldValue);
    }, [defauldValue]);

    const handleChange = (e) => {
        func(e, "string");
        setInputValue(e.target.value);
        if (isEmail) {
            validateEmail(e.target.value);
        }
    };

    return (
        <div
            style={{ gridColumn: `span ${field.space}`, borderColor, display, visibility: field.visibility ? field.visibility : "visible" }}
        >
            <div>{field.description}</div>
            <TextField
                type={isEmail ? "email" : "text"} // Set type to 'email' if description is 'Email', otherwise set to 'text'
                name={field.field_name}
                id={field.field_name}
                placeholder={field?.field_name?.replace(/_/g, " ")?.toUpperCase()}
                onChange={handleChange}
                // defaultValue={(defaultValue && defaultValue[field.field_name]) || defauldValue}

                value={inputValue}
                fullWidth
                disabled={field.disabled === "true"}
                required={field.required === "true"}
                inputProps={{
                    dtype: parquetDataTypesForFields[field.dtype],
                    ...(field.merging && { merging: field.merging })
                }}
                ref={(input) => setRef(input, field.field_name)}
            />
        </div>
    );
};

CustomTextField.propTypes = {
    field: PropTypes.object,
    func: PropTypes.func,
    defaultValue: PropTypes.string,
    defauldValue: PropTypes.string,
    parquetDataTypesForFields: PropTypes.object,
    setRef: PropTypes.func,
    display: PropTypes.string
};
export default CustomTextField;
