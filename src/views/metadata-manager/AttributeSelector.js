import React, { useState, useEffect } from "react";
import { Grid, FormControl, InputLabel, MenuItem, Select, TextField, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import MainCard from "ui-component/cards/MainCard";
import PropTypes from "prop-types";
const AttributesFields = ({ key, item, onUpdate, attributeList, handleDelete }) => {
    const [selectedType, setSelectedType] = useState(item?.attributeType);
    const [attributeData, setAttributeData] = useState(item);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setAttributeData((prevData) => ({ ...prevData, [name]: value }));
        onUpdate({ ...attributeData, [event.target.name]: event.target.value }, attributeList);
    };

    const handleTypeChange = (event) => {
        setSelectedType(event.target.value);
        const newType = event.target.value;
        const { name, value } = event.target;
        let updatedCategory;

        if (newType === "string") {
            updatedCategory = "QUALITATIVE";
        } else if (newType === "timestamp" || newType === "datetime" || newType === "date") {
            updatedCategory = "";
        } else {
            updatedCategory = "QUANTITATIVE";
        }
        setAttributeData((prevData) => ({ ...prevData, [name]: value, attributeCategory: updatedCategory }));
        onUpdate({ ...attributeData, [event.target.name]: event.target.value, attributeCategory: updatedCategory }, attributeList);
    };
    useEffect(() => {
        onUpdate(attributeData, attributeList);
    }, [attributeData]);

    return (
        <Grid key={key} container spacing={2}>
            <Grid item xs={12} sm={4} md={4} lg={4}>
                <MainCard sx={{ height: 100, mb: 2 }}>
                    <TextField
                        name="attributeName"
                        fullWidth
                        sx={{ height: 20 }}
                        onChange={handleInputChange}
                        label="Attribute Name"
                        defaultValue={item?.attributeName}
                        id="attributename"
                    />
                </MainCard>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={4}>
                <MainCard sx={{ height: 100, mb: 2 }}>
                    {selectedType === "string" && (
                        <TextField
                            fullWidth
                            label="Attribute Category"
                            sx={{ height: 20 }}
                            defaultValue="QUALITATIVE"
                            id="category"
                            disabled
                        />
                    )}
                    {(selectedType === "integer" ||
                        selectedType === "float" ||
                        selectedType === "double" ||
                        selectedType === "decimal" ||
                        selectedType === "long") && (
                        <TextField
                            fullWidth
                            label="Attribute Category"
                            sx={{ height: 20 }}
                            defaultValue="QUANTITATIVE"
                            id="category"
                            disabled
                        />
                    )}
                    {!selectedType && <TextField fullWidth label="Attribute Category" sx={{ height: 20 }} defaultValue="" id="category" />}
                    {(selectedType === "timestamp" || selectedType === "date" || selectedType === "datetime") && (
                        <TextField fullWidth label="Attribute Category" sx={{ height: 20 }} defaultValue=" " id="category" disabled />
                    )}
                </MainCard>
            </Grid>
            <Grid item xs={12} sm={3} md={3} lg={3}>
                <MainCard sx={{ height: 100, mb: 2 }}>
                    <FormControl
                        sx={{ m: 1, minWidth: 120 }}
                        style={{
                            display: "block",
                            width: "100%",
                            marginTop: "0px",
                            marginBottom: "8px",
                            paddingLeft: "0px",
                            marginLeft: "0px"
                        }}
                    >
                        <InputLabel id="data-type-select">Select Type</InputLabel>
                        <Select
                            labelId="data-type-select"
                            id="data-type-select"
                            name="attributeType"
                            label="Select Data Type"
                            value={attributeData?.attributeType}
                            onChange={handleTypeChange}
                            displayEmpty
                            fullWidth
                        >
                            <MenuItem value="">------</MenuItem>
                            <MenuItem value="string">String</MenuItem>
                            <MenuItem value="integer">Integer</MenuItem>
                            <MenuItem value="float">Float</MenuItem>
                            <MenuItem value="double">Double</MenuItem>
                            <MenuItem value="decimal">Decimal</MenuItem>
                            <MenuItem value="long">Long</MenuItem>
                            <MenuItem value="timestamp">Timestamp</MenuItem>
                            <MenuItem value="date">Date</MenuItem>
                            <MenuItem value="datetime">DateTime</MenuItem>
                        </Select>
                    </FormControl>
                </MainCard>
            </Grid>
            <Tooltip title="delete">
                <IconButton onClick={() => handleDelete(item.attributeId, key)}>
                    <DeleteIcon color="error" />
                </IconButton>
            </Tooltip>
        </Grid>
    );
};

AttributesFields.propTypes = {
    key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    item: PropTypes.object,
    onUpdate: PropTypes.func,
    attributeList: PropTypes.array,
    handleDelete: PropTypes.func
};
export default AttributesFields;
