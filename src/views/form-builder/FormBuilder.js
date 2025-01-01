import React, { useState, useEffect } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Grid, IconButton, Button } from "@mui/material";

import { openSnackbar } from "store/slices/snackbar";
import { gridSpacing } from "store/constant";
import MainCard from "views/new-app/components/basic/cards/MainCard";
import { postCustomForm } from "views/api-configuration/default";
import { useSelector, useDispatch } from "store";

// import PropTypes from "prop-types";
import {
    setFormFieldsDispatcher,
    reduxUpdateFormField,
    reduxAddFormField,
    reduxAddCondition,
    reduxUpdateCondition,
    resetFormField,
    removeFormField,
    moveDownField,
    moveUpField
} from "store/slices/custom-form";

import { Delete } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import api from "views/api-configuration/api";

function CustomForm() {
    const dispatch = useDispatch();
    const theme = useTheme();

    const { rawDataSources } = useSelector((state) => state.dataCollection);
    const { reduxFormFields } = useSelector((state) => state.form);
    const { selectedDataset } = useSelector((state) => state.userLogin);
    const updateFormField = (name, value, ind) => dispatch(reduxUpdateFormField(name, value, ind));

    const [formData, setFormData] = useState({
        datasetid: selectedDataset.datasetid,
        formfields: JSON.stringify(reduxFormFields),
        formid: 0,
        tableid: 0
    });

    const submitForm = (e) => {
        e.preventDefault();
        api.post(postCustomForm, formData)
            .then((res) => {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Your Form Created Successfully",
                        variant: "alert",
                        alert: {
                            color: "success"
                        },
                        close: false
                    })
                );
                return res;
            })
            .catch((err) => err);
    };

    const onFieldChange = (e) => {
        const data = formData;
        if (e.target.name === "catalog") {
            const val = e.target.value.split(",");
            data.datasetid = val[0];
            data.tableid = val[1];
            dispatch(setFormFieldsDispatcher(val[0], val[1]));
        } else {
            data[e.target.name] = e.target.value;
        }
        setFormData(data);
    };

    useEffect(() => {
        const data = { ...formData }; // make a copy of the state
        data.formfields = JSON.stringify(reduxFormFields);
        setFormData(data);
    }, [reduxFormFields]);

    // const [condition, setCondition] = useState({});
    const onCondtitionChange = (index1, index2, name, value) => {
        dispatch(reduxUpdateCondition(index1, index2, name, value));
    };

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
            background: theme.palette.mode === "dark" ? theme.palette.dark.main : theme.palette.primary.light,
            borderRadius: "6px",
            width: "100%",
            padding: "16px",
            border: "1px solid"
        },
        grid: {
            display: "grid",
            gridTemplateColumns: "auto auto auto auto",
            columnGap: "10px",
            rowGap: "10px"
        },
        button: {
            display: "inline-block",
            fontWeight: 400,
            textAlign: "center",
            whiteSpace: "nowrap",
            verticalAlign: "middle",
            userSelect: "none",
            border: "1px solid transparent",
            padding: "0.375rem 0.75rem",
            fontSize: "1rem",
            lineHeight: 1.5,
            borderRadius: "0.25rem",
            transition:
                "color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out",
            color: "#fff",
            backgroundColor: "#007bff",
            borderColor: "#007bff"
        }
    };

    return (
        <MainCard>
            <form onSubmit={submitForm}>
                <Grid container spacing={gridSpacing} style={{ marginTop: "2px" }}>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                        <input
                            name="formtitle"
                            onChange={onFieldChange}
                            className="custom-form-inps"
                            placeholder="Form Title"
                            style={styles.fieldStyle}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} style={{ textAlign: "right" }}>
                        <select name="catalog" id="catalog" onChange={onFieldChange} className="custom-form-inps" style={styles.fieldStyle}>
                            <option>-------------</option>
                            {rawDataSources.map((item, ind5) => (
                                <option key={ind5} value={[item.datasetid, item.tableid]}>
                                    {item.tablename}
                                </option>
                            ))}
                        </select>
                        <IconButton
                            aria-label="delete"
                            onClick={() => dispatch(resetFormField())}
                            style={{ fontSize: "12px", padding: "0px" }}
                        >
                            <RestartAltIcon />
                        </IconButton>
                    </Grid>
                </Grid>
                {reduxFormFields.map((item, ind) => (
                    <div
                        key={ind}
                        style={{
                            marginTop: "20px",
                            background: theme.palette.mode === "dark" ? theme.palette.dark.main : theme.palette.primary.light,
                            padding: "20px",
                            borderRadius: "10px"
                        }}
                    >
                        <h2>Field {ind + 1}</h2>
                        <div style={styles.grid}>
                            <div>
                                <span>Field Id</span>
                                <input
                                    type="text"
                                    onChange={(e) => updateFormField("id", e.target.value, ind)}
                                    value={ind}
                                    className="custom-form-inps"
                                    placeholder="id"
                                    style={styles.fieldStyle}
                                />
                            </div>
                            <div>
                                <span>Field Name / Field Label</span>
                                <input
                                    type="text"
                                    onChange={(e) => updateFormField("field_name", e.target.value, ind)}
                                    value={item.field_name ? item.field_name : null}
                                    placeholder="name"
                                    className="custom-form-inps"
                                    style={styles.fieldStyle}
                                />
                            </div>
                            <div>
                                <span>Field Width</span>
                                <input
                                    type="number"
                                    onChange={(e) => updateFormField("field_width", e.target.value, ind)}
                                    placeholder="width"
                                    className="custom-form-inps"
                                    style={styles.fieldStyle}
                                />
                            </div>
                            <div>
                                <span>Decimals</span>
                                <input
                                    type="number"
                                    onChange={(e) => updateFormField("decimals", e.target.value, ind)}
                                    placeholder="decimals"
                                    className="custom-form-inps"
                                    style={styles.fieldStyle}
                                />
                            </div>
                            <div>
                                <span>Missing Values</span>
                                <input
                                    type="text"
                                    onChange={(e) => updateFormField("missing", e.target.value, ind)}
                                    placeholder="missing"
                                    className="custom-form-inps"
                                    style={styles.fieldStyle}
                                />
                            </div>
                            <div>
                                <span>Columns</span>
                                <input
                                    type="number"
                                    onChange={(e) => updateFormField("columns", e.target.value, ind)}
                                    placeholder="columns"
                                    className="custom-form-inps"
                                    style={styles.fieldStyle}
                                />
                            </div>
                            <div>
                                <span>Align</span>
                                <select
                                    name="role"
                                    id="role"
                                    onChange={(e) => updateFormField("align", e.target.value, ind)}
                                    className="custom-form-inps"
                                    placeholder="align"
                                    value={item.role ? item.role : null}
                                    style={styles.fieldStyle}
                                >
                                    <option value="left">Left</option>
                                    <option value="center">Center</option>
                                    <option value="right">Right</option>
                                </select>
                            </div>
                            <div>
                                <span>Measure</span>
                                <input
                                    type="number"
                                    onChange={(e) => updateFormField("measure", e.target.value, ind)}
                                    placeholder="measure"
                                    className="custom-form-inps"
                                    style={styles.fieldStyle}
                                />
                            </div>
                            <div>
                                <span>Select Parent Field</span>
                                <select
                                    name="parent"
                                    id="parent"
                                    onChange={(e) => updateFormField("parent", e.target.value, ind)}
                                    placeholder="parent"
                                    className="custom-form-inps"
                                    style={styles.fieldStyle}
                                >
                                    <option value="none">----</option>
                                    {reduxFormFields.map((eachItem, ind4) => (
                                        <option key={ind4} value={eachItem.field_name}>
                                            {eachItem.field_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <span>Possible Values</span>
                                <input
                                    type="text"
                                    onChange={(e) => updateFormField("values", e.target.value, ind)}
                                    className="custom-form-inps"
                                    placeholder="values"
                                    style={styles.fieldStyle}
                                />
                            </div>
                            <div>
                                <span>Role</span>
                                <select
                                    name="role"
                                    id="role"
                                    onChange={(e) => updateFormField("role", e.target.value, ind)}
                                    className="custom-form-inps"
                                    placeholder="role"
                                    value={item.role ? item.role : null}
                                    style={styles.fieldStyle}
                                >
                                    <option value="none">----</option>
                                    <option value="string">Text</option>
                                    <option value="choices">Choices</option>
                                    <option value="multiple-choice-split">Multiple Choices Split</option>
                                    <option value="multiple-choice-consolidated">Multiple Choices Consolidated</option>
                                    <option value="integer">Integer</option>
                                    <option value="double">Double</option>
                                    <option value="file">File</option>
                                </select>
                            </div>
                            <div>
                                <span>Field Category</span>
                                <select
                                    name="category"
                                    id="category"
                                    onChange={(e) => updateFormField("category", e.target.value, ind)}
                                    className="custom-form-inps"
                                    placeholder="category"
                                    value={item.category ? item.category : null}
                                    style={styles.fieldStyle}
                                >
                                    <option value="none">----</option>
                                    <option value="QUALITATIVE">QUALITATIVE</option>
                                    <option value="QUANTITATIVE">QUANTITATIVE</option>
                                </select>
                            </div>
                            <div style={{ gridColumnStart: 1, gridColumnEnd: 4 }}>
                                <span>Field Description</span>
                                <textarea
                                    name="description"
                                    id="description"
                                    onChange={(e) => updateFormField("description", e.target.value, ind)}
                                    style={{ ...styles.fieldStyle }}
                                />
                            </div>
                            <div>
                                <IconButton aria-label="delete" onClick={() => dispatch(moveUpField(ind))} style={{ forntSize: "12px" }}>
                                    <ArrowUpwardIcon />
                                </IconButton>
                                <IconButton aria-label="delete" onClick={() => dispatch(moveDownField(ind))} style={{ forntSize: "12px" }}>
                                    <ArrowDownwardIcon />
                                </IconButton>
                                <IconButton
                                    aria-label="delete"
                                    onClick={() => dispatch(removeFormField(ind))}
                                    style={{ forntSize: "12px" }}
                                >
                                    <Delete />
                                </IconButton>
                            </div>
                            <div style={{ gridColumnStart: 1, gridColumnEnd: 5 }}>
                                <h4>Add Conditions</h4>
                            </div>
                            <div style={{ gridColumnStart: 1, gridColumnEnd: 5 }}>
                                {item.conditions.map((condition, ind2) => (
                                    <div style={styles.grid} key={ind2}>
                                        <div>
                                            <span>Select Relation</span>
                                            <select
                                                id="condition"
                                                name="condition"
                                                onChange={(e) => onCondtitionChange(ind, ind2, "operator", e.target.value)}
                                                className="custom-form-inps"
                                                placeholder="parent"
                                                style={styles.fieldStyle}
                                            >
                                                <option value="none">----</option>
                                                <option value="eq">Equal ( = )</option>
                                                <option value="neq">Not Equal ( != )</option>
                                                <option value="geq">Greater Equal ( &gt;= )</option>
                                                <option value="leq">Lesser Equal ( &lt;= )</option>
                                                <option value="gt">Greater Than ( &gt; )</option>
                                                <option value="lt">Lesser Than ( &lt; )</option>
                                                <option value="and">And ( &amp;&amp; )</option>
                                                <option value="or">Or ( || )</option>
                                                <option value="not">Not ( ! )</option>
                                            </select>
                                        </div>
                                        <div>
                                            <span>Parent Field Value</span>
                                            <select
                                                id="parValue"
                                                name="parValue"
                                                onChange={(e) => onCondtitionChange(ind, ind2, "parValue", e.target.value)}
                                                className="custom-form-inps"
                                                placeholder="Parent Value"
                                                style={styles.fieldStyle}
                                            >
                                                <option value="none">----</option>
                                                {reduxFormFields
                                                    .filter((filterItem) => filterItem.field_name === item.parent)
                                                    .map((filteredItem) => (
                                                        <>
                                                            {filteredItem.values ? (
                                                                filteredItem.values.split(",").map((value, ind3) => (
                                                                    <option key={ind3} value={value}>
                                                                        {value}
                                                                    </option>
                                                                ))
                                                            ) : (
                                                                <></>
                                                            )}
                                                        </>
                                                    ))}
                                            </select>
                                        </div>
                                        <div>
                                            <span>Display Mode</span>
                                            <select
                                                id="behaviour"
                                                name="behaviour"
                                                onChange={(e) => onCondtitionChange(ind, ind2, "behaviour", e.target.value)}
                                                className="custom-form-inps"
                                                placeholder="parent"
                                                style={styles.fieldStyle}
                                            >
                                                <option value="none">----</option>
                                                <option value="show">Show</option>
                                                <option value="hide">Hide</option>
                                            </select>
                                        </div>
                                        <div>
                                            <span>Field Value</span>
                                            <input
                                                type="text"
                                                onChange={(e) => onCondtitionChange(ind, ind2, "value", e.target.value)}
                                                className="custom-form-inps"
                                                placeholder="field Value"
                                                style={styles.fieldStyle}
                                            />
                                        </div>
                                    </div>
                                ))}
                                <IconButton
                                    aria-label="delete"
                                    onClick={() => dispatch(removeFormField(ind))}
                                    style={{ forntSize: "12px" }}
                                >
                                    <Delete />
                                </IconButton>
                                <IconButton
                                    aria-label="delete"
                                    onClick={() => dispatch(reduxAddCondition(ind))}
                                    style={{ fontSize: "12px", padding: "0px" }}
                                >
                                    <AddIcon />
                                </IconButton>
                            </div>
                        </div>
                        {/* <Grid item xs={12}>
                            {item.conditions.map((condition, ind2) => (
                                <Grid container>
                                    <Grid item xs={3}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Add Condition</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                label="Condition"
                                                name="condition"
                                                onChange={(e) => onCondtitionChange(ind, ind2, "operator", e.target.value)}
                                            >
                                                <MenuItem value="eq">Equal ( = )</MenuItem>
                                                <MenuItem value="neq">Not Equal ( != )</MenuItem>
                                                <MenuItem value="geq">Greater Equal ( &gt;= )</MenuItem>
                                                <MenuItem value="leq">Lesser Equal ( &lt;= )</MenuItem>
                                                <MenuItem value="gt">Greater Than ( &gt; )</MenuItem>
                                                <MenuItem value="and">And ( &amp;&amp; )</MenuItem>
                                                <MenuItem value="or">Or ( || )</MenuItem>
                                                <MenuItem value="not">Not ( ! )</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            id="outlined-basic"
                                            label="Parent Field Value"
                                            variant="outlined"
                                            style={{ width: "100%" }}
                                            onChange={(e) => onCondtitionChange(ind, ind2, "parValue", e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Select Behaviour</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                label="Select Parent Value"
                                                name="parent_field_value"
                                                onChange={(e) => onCondtitionChange(ind, ind2, "behaviour", e.target.value)}
                                            >
                                                <MenuItem value="show">Show</MenuItem>
                                                <MenuItem value="hide">Hide</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <IconButton
                                            aria-label="delete"
                                            onClick={() => dispatch(reduxAddCondition(ind))}
                                            style={{ forntSize: "12px" }}
                                        >
                                            <AddIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            ))}
                        </Grid> */}
                    </div>
                ))}
                <div style={{ marginTop: "10px" }}>
                    <IconButton
                        aria-label="delete"
                        onClick={() => dispatch(reduxAddFormField())}
                        style={{ ...styles.button, marginRight: "5px" }}
                    >
                        ADD FORM FIELD
                    </IconButton>
                    <Button type="submit" variant="contained">
                        SUBMIT
                    </Button>
                </div>
            </form>
        </MainCard>
    );
}
export default CustomForm;
