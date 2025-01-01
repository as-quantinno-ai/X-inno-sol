import React from "react";
import PropTypes from "prop-types";
const CustomFileInput = ({ field, func, styles }) => (
    <div style={{ gridColumn: `span ${field.space}` }}>
        <div>{field.description}</div>
        <input
            type="file"
            name={field.field_name}
            id={field.field_name}
            placeholder={field.field_name.replace(/_/g, " ").toUpperCase()}
            onChange={(e) => func(e, field.role, field.merging)}
            style={{ ...styles.fieldStyle, width: "100%", marginTop: "5px" }}
            disabled={field.disabled === "true"}
            required={field.required === "true"}
        />
    </div>
);
CustomFileInput.propTypes = {
    field: PropTypes.object,
    func: PropTypes.func,
    styles: PropTypes.object
};

export default CustomFileInput;
