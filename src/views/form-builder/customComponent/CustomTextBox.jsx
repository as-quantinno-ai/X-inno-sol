import * as React from "react";
import PropTypes from "prop-types";
import { useState } from "react";

const CustomTextBox = ({ field, defaultValue, defauldValue, display }) => {
    // const isEmail = field.description === "Email";
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //eslint-disable-next-line no-unused-vars
    const [borderColor, setBorderColor] = useState("");
    const [inputValue, setInputValue] = useState((defaultValue && defaultValue[field.field_name]) || defauldValue || "");

    const styles = {
        fieldStyle: {
            fontSize: "0.875rem",
            fontWeight: 400,
            lineHeight: "1.4375em",
            fontFamily: "Roboto",
            color: "#616161",
            boxSizing: "border-box",
            position: "relative",
            cursor: "text",
            display: "inline-flex",
            alignItems: "center",
            paddingLeft: "16px",
            borderRadius: "6px",
            width: "100%",
            padding: "16px",
            border: "1px solid",
            height: "400px",
            transition: "border-color 0.3s ease"
        }
    };

    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    return (
        <div
            style={{ gridColumn: `span ${field.space}`, borderColor, display, visibility: field.visibility ? field.visibility : "visible" }}
        >
            <div>{field.description}</div>
            <textarea
                rows={20}
                name={field.field_name}
                id={field.field_name}
                placeholder={field?.field_name?.replace(/_/g, " ")?.toUpperCase()}
                value={inputValue}
                onChange={handleChange}
                style={{ ...styles.fieldStyle }}
            />
        </div>
    );
};

CustomTextBox.propTypes = {
    field: PropTypes.object,
    // func: PropTypes.func,
    defaultValue: PropTypes.string,
    defauldValue: PropTypes.string,
    // parquetDataTypesForFields: PropTypes.object,
    // setRef: PropTypes.func,
    display: PropTypes.string
};
export default CustomTextBox;
