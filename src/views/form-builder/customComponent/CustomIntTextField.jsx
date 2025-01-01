import React, { useState } from "react";
import { TextField } from "@mui/material";
import PropTypes from "prop-types";
const CustomIntTextField = ({ field, func, defaultValue, defauldValue, parquetDataTypesForFields, setRef, display }) => {
    let initialVal = "";

    if (defaultValue && defaultValue[field.field_name]) {
        initialVal = defaultValue[field.field_name];
    } else if (defauldValue) {
        initialVal = defauldValue;
    }

    const [displayValue, setDisplayValue] = useState(initialVal);

    const handleChange = (e) => {
        const val = e.target.value;
        setDisplayValue(val);
        func(e, field.role, field.merging);
    };

    return (
        <div style={{ gridColumn: `span ${field.space}`, display, visibility: field.visibility ? field.visibility : "visible" }}>
            <div>{field.description}</div>
            <TextField
                type="number"
                step={field.role === "integer" ? "1" : "0.01"}
                name={field.field_name}
                id={field.field_name}
                placeholder={field.field_name.replace(/_/g, " ").toUpperCase()}
                onChange={handleChange}
                // defaultValue={(defaultValue && defaultValue[field.field_name]) || defauldValue}
                value={displayValue}
                ref={(input) => setRef(input, field.field_name)}
                fullWidth
                disabled={field.disabled === "true"}
                required={field.required === "true"}
                inputProps={{
                    dtype: parquetDataTypesForFields[field.dtype],
                    ...(field.merging && { merging: field.merging })
                }}
            />
        </div>
    );
};

CustomIntTextField.propTypes = {
    field: PropTypes.object,
    func: PropTypes.func,
    defaultValue: PropTypes.object,
    defauldValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    parquetDataTypesForFields: PropTypes.object,
    setRef: PropTypes.func,
    display: PropTypes.string
};

export default CustomIntTextField;
