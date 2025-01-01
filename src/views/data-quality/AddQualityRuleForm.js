import { TextField } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

const AddQualityRuleForm = () => {
    const { dataQuality } = useSelector((state) => state.selectedvalue);

    return (
        <div>
            <TextField
                label="Quality Data"
                value={dataQuality || "No Data Available"}
                InputProps={{
                    readOnly: true
                }}
                variant="outlined"
                fullWidth
            />
        </div>
    );
};

export default AddQualityRuleForm;
