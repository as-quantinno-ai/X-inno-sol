import React, { useState } from "react";
import { FormControl, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import PropTypes from "prop-types";
const CustomRadio = ({ field, func, selectedValue, setRadioVal, parquetDataTypesForFields, conditionsFunc }) => {
    const [localSelectedValue, setLocalSelectedValue] = useState(selectedValue);

    const handleRadioChange = (e) => {
        const value = e.target.value;

        setRadioVal(value);
        setLocalSelectedValue(value);
        func(value, field.dtype, field.merging);
        if (conditionsFunc) {
            conditionsFunc(e, field.field_name);
        }
    };

    return (
        <div style={{ gridColumn: `span ${field.space}` }}>
            <div>{field.description}</div>
            <div>
                <FormControl>
                    <RadioGroup
                        id={field.field_name.replace(/ /g, "")}
                        value={localSelectedValue}
                        onChange={handleRadioChange}
                        disabled={field.disabled === "true"}
                        required={field.required === "true"}
                        name={field.field_name.replace(/ /g, "")}
                    >
                        {field.values?.split(",").map((value, ind) => (
                            <FormControlLabel
                                key={ind}
                                value={value}
                                control={<Radio inputProps={{ dtype: parquetDataTypesForFields[field.dtype] }} />}
                                label={value}
                            />
                        ))}
                    </RadioGroup>
                </FormControl>
            </div>
        </div>
    );
};

CustomRadio.propTypes = {
    field: PropTypes.object,
    func: PropTypes.func,
    selectedValue: PropTypes.string,
    setRadioVal: PropTypes.func,
    parquetDataTypesForFields: PropTypes.object,
    conditionsFunc: PropTypes.func
};

export default CustomRadio;
