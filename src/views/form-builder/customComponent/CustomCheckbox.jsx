import React from "react";
import PropTypes from "prop-types";
const CustomCheckbox = ({ field, func }) => {
    const handleCheckboxChange = (e) => {
        const isChecked = e.target.checked;
        // const value = e.target.value;
        func({ [field.field_name]: isChecked }, field.role, field.merging);
    };

    return (
        <div style={{ gridColumn: `span ${field.space}` }}>
            <div>{field.description}</div>
            <div>
                {field.values?.split(",").map((value, ind) => (
                    <div key={ind}>
                        <input
                            type="checkbox"
                            id={`${field.field_name.replace(/ /g, "")}_${ind}`}
                            name={field.field_name}
                            value={value}
                            onChange={handleCheckboxChange}
                            disabled={field.disabled === "true"}
                            required={field.required === "true"}
                        />
                        <label htmlFor={`${field.field_name.replace(/ /g, "")}_${ind}`}>{value}</label>
                    </div>
                ))}
            </div>
        </div>
    );
};

CustomCheckbox.propTypes = {
    field: PropTypes.object,
    func: PropTypes.func
};
export default CustomCheckbox;
