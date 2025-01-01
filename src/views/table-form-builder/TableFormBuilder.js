import React, { useState, useEffect } from "react";

import {
    Box,
    Grid,
    Typography,
    IconButton,
    Button,
    Table,
    TableContainer,
    Tooltip,
    Collapse,
    Autocomplete,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl
} from "@mui/material";
import SubCard from "ui-component/cards/SubCard";
import SendIcon from "@mui/icons-material/Send";

import { openSnackbar } from "store/slices/snackbar";
import { gridSpacing } from "store/constant";
import MainCard from "views/new-app/components/basic/cards/MainCard";
// import { postCustomForm, catalogList, GetJWT, metadataList, getAllMetaDatabystage } from "views/api-configuration/default";
import { postCustomForm, catalogList, GetJWT, getAllMetaDatabystage } from "views/api-configuration/default";
import { useSelector, useDispatch } from "store";
import PropTypes from "prop-types";
import {
    setFormFieldsDispatcher,
    reduxUpdateFormField,
    reduxAddFormField,
    reduxAddCondition,
    reduxUpdateCondition,
    resetFormField,
    removeFormField,
    moveDownField,
    moveUpField,
    setParquetSchema
} from "store/slices/custom-form";

import { Delete } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { useFetch } from "react-async";
import { baseApi, selectBaseData } from "store/slices/initial-data";

import { useTheme } from "@emotion/react";
import api from "views/api-configuration/api";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import IconListDropdown from "views/page-builder/IconListDropdown";

const MetaDataField = ({ productclientdatasetsid, tableid, onCatalogValueChanged, index }) => {
    // const [metadata, setMetaData] = useState(null);
    const { data, error } = useFetch(getAllMetaDatabystage(productclientdatasetsid, tableid, "BRONZE"), {
        headers: { accept: "application/json", Authorization: `Bearer ${GetJWT()}` }
    });
    if (error) return error.message;
    if (data) {
        return (
            <Autocomplete
                multiple
                disableCloseOnSelect
                onChange={(value) => onCatalogValueChanged("metadata_list", value, index)}
                options={data.result}
                getOptionLabel={(option) => option.attributeName}
                renderInput={(params) => <TextField {...params} />}
            />
        );
        // return <>{data.result ? <DataTable data={data.result} height={height} /> : <></>}</>;
    }
    return null;
};

MetaDataField.propTypes = {
    productclientdatasetsid: PropTypes.string,
    tableid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onCatalogValueChanged: PropTypes.func,
    index: PropTypes.number
};

// eslint-disable-next-line no-unused-vars
const RoleSelectionFields = ({ productclientdatasetsid }) => {
    // const { assignapprole } = useSelector((state) => state.userrole);
    const baseData = useSelector(selectBaseData);
    const { roles } = baseData;
    const filteredRoles = roles?.filter((role) => role.type !== "TENANT_ADMIN") || [];

    // const { approle } = useSelector((state) => state.applicationrole);
    // const [metadata, setMetaData] = useState(null);
    return (
        <>
            {filteredRoles?.map((item) => (
                <MenuItem key={item.roleName} value={item.roleName}>
                    {item.roleName}
                </MenuItem>
            ))}
        </>
    );
};

RoleSelectionFields.propTypes = {
    productclientdatasetsid: PropTypes.string
};
const FormAsOption = ({ datasetid }) => {
    const { data, error } = useFetch(`${catalogList}${datasetid}`, {
        headers: { accept: "application/json", Authorization: `Bearer ${GetJWT()}` }
    });
    if (error) return error.message;
    if (data)
        return (
            <>
                {data.result.map((eachCatalog) => (
                    <option key={eachCatalog.tableid} value={[eachCatalog.productclientdatasetsid, eachCatalog.tableid]}>
                        {eachCatalog.tablename}
                    </option>
                ))}
            </>
        );
    return null;
};

FormAsOption.propTypes = {
    datasetid: PropTypes.string
};
// tab content customize
function TabPanel({ children, value, index, ...other }) {
    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && (
                <Box
                    sx={{
                        p: 3
                    }}
                >
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any,
    value: PropTypes.any
};

// ================================|| UI TABS - COLOR ||================================ //
// ================================|| OPTIMIZED SOLUTION FOR FORM FIELDS ||================================ //

function TableForm() {
    const dispatch = useDispatch();
    const theme = useTheme();

    const { rawDataSources } = useSelector((state) => state.dataCollection);
    const { reduxFormFields, parquetSchemaStr } = useSelector((state) => state.form);
    const baseData = useSelector(selectBaseData);
    const { roles } = baseData;
    const filteredRoles = roles?.filter((role) => role.type !== "TENANT_ADMIN") || [];

    // const { selectedDataset } = useSelector((state) => state.userLogin);
    const selectData = JSON.parse(localStorage.getItem("selectDataSet"));
    const selectedDataset = selectData.payload;
    const [openRows, setOpenRows] = useState([]);
    const maxIndex = reduxFormFields ? reduxFormFields.length - 1 : -1;
    const updateFormField = (name, value, ind) => dispatch(reduxUpdateFormField(name, value, ind));
    const [formData, setFormData] = useState({
        productclientdatasetsid: selectedDataset.productclientdatasetsid,
        formfields: JSON.stringify(reduxFormFields),
        parquetSchema: parquetSchemaStr,
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
                // dispatch(setForms(selectedDataset.productclientdatasetsid));
                dispatch(baseApi());
                return res;
            })
            // eslint-disable-next-line no-unused-vars
            .catch((err) => {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Error Creating Form",
                        variant: "alert",
                        alert: {
                            color: "error"
                        },
                        close: false
                    })
                );
            });
    };

    const [selectedIcon, setSelectedIcon] = useState("");

    const onFieldChange = (e) => {
        const data = formData;
        const { name, value } = e.target;

        if (name === "catalog") {
            try {
                const val = String(value).split(",");
                if (val) {
                    data.productclientdatasetsid = val[0];
                    data.tableid = val[1];
                    dispatch(setFormFieldsDispatcher(val[0], val[1]));
                } else {
                    console.error("Invalid catalog value:", value);
                }
            } catch (error) {
                console.error("Error splitting catalog value:", value, error);
            }
        } else if (name === "type") {
            data.type = value;
            dispatch(setFormFieldsDispatcher(0, 0, value));
        } else if (name === "style") {
            data[name] = JSON.stringify({ icon: value });
            setSelectedIcon(value);
        } else if (name === "params") {
            data.params = value;
        } else {
            data[name] = value;
        }

        setFormData(data);
    };
    const getCatalogValue = () => {
        if (formData.productclientdatasetsid && formData.tableid) {
            return `${formData.productclientdatasetsid},${formData.tableid}`;
        }
        return "";
    };
    useEffect(() => {
        const data = { ...formData };
        data.formfields = JSON.stringify(reduxFormFields);
        setFormData(data);
        dispatch(setParquetSchema());
    }, [reduxFormFields]);

    useEffect(() => {
        const data = { ...formData };

        data.parquetSchema = JSON.stringify({
            uuid_identifier_da_an_v1: "string",
            ...parquetSchemaStr,
            status_identifier_da_an_v1: "string",
            timestamp_identifier_da_an_v1: "datetime"
        });
        setFormData(data);
    }, [parquetSchemaStr]);

    const onCondtitionChange = (index1, index2, name, value) => {
        dispatch(reduxUpdateCondition(index1, index2, name, value));
    };

    const handleCollapse = (index) => {
        const isOpen = openRows.includes(index);
        setOpenRows(isOpen ? openRows.filter((i) => i !== index) : [...openRows, index]);
        // dispatch(open ? moveDownField(index) : moveUpField(index));
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
            paddingLeft: "8px",
            borderRadius: "6px",
            padding: "8px",
            border: "1px solid",
            width: "180px",
            margin: "5px",
            backgroundColor: theme.palette.mode === "dark" ? theme.palette.dark.main : theme.palette.grey[200]
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
        },
        additionalStyles: {
            width: "100%",
            paddingTop: "8px"
        },
        selectHeight: {},
        conditionStyles: {
            tabCells: {
                padding: "5px"
            }
        }
    };

    return (
        <MainCard>
            <form onSubmit={submitForm}>
                <Grid container spacing={gridSpacing} style={{ marginTop: "2px" }}>
                    <Grid item xs={6} sm={12} md={2} lg={2}>
                        <IconListDropdown
                            handleIconChange={onFieldChange}
                            selectedIcon={selectedIcon}
                            style={{ ...styles.fieldStyle }}
                            type="Form"
                        />
                    </Grid>
                    <Grid item xs={6} sm={12} md={2} lg={2}>
                        <TextField
                            sx={{ m: 0, p: 0 }}
                            fullWidth
                            size="small"
                            name="formtitle"
                            onChange={onFieldChange}
                            placeholder="Form Title"
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={2} lg={2} style={{ textAlign: "left" }}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="type-label">Select Form Type</InputLabel>
                            <Select
                                labelId="type-label"
                                name="type"
                                id="type"
                                label="Select Form Type"
                                onChange={onFieldChange}
                                value={formData.type || ""}
                                className="custom-form-inps"
                            >
                                <MenuItem value="">
                                    <em>Select Form Type</em>
                                </MenuItem>
                                <MenuItem value="GENERAL">GENERAL</MenuItem>
                                <MenuItem value="REGISTRATION">REGISTRATION</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={2} lg={2} style={{ textAlign: "left" }}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="params-label">Select User Group</InputLabel>
                            <Select
                                labelId="params-label"
                                name="params"
                                id="params"
                                label="Select User Group"
                                value={formData?.params || ""}
                                onChange={onFieldChange}
                                className="custom-form-inps"
                            >
                                <MenuItem value="">
                                    <em>Select User Group</em>
                                </MenuItem>
                                {filteredRoles?.map((item) => (
                                    <MenuItem key={item.roleName} value={item.roleName}>
                                        {item.roleName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={2} lg={2} style={{ textAlign: "left" }}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="catalog-label">Select Data Domain</InputLabel>
                            <Select
                                labelId="catalog-label"
                                name="catalog"
                                id="catalog"
                                label="Select Data Domain"
                                value={getCatalogValue()}
                                onChange={onFieldChange}
                                className="custom-form-inps"
                            >
                                <MenuItem value="">
                                    <em>Select Data Domain</em>
                                </MenuItem>
                                {rawDataSources?.map((item) => (
                                    <MenuItem
                                        key={`${item.productclientdatasetsid}-${item.tableid}`}
                                        value={`${item.productclientdatasetsid},${item.tableid}`}
                                    >
                                        {item.tablename}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={2} lg={2} style={{ textAlign: "right" }}>
                        <Tooltip title="reset">
                            <IconButton
                                aria-label="reset"
                                onClick={() => dispatch(resetFormField())}
                                style={{ fontSize: "12px", padding: "8px", marginTop: "8px" }}
                            >
                                <RestartAltIcon />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
                <div style={{ marginTop: "10px" }}>
                    <Button
                        aria-label="add"
                        variant="contained"
                        color="secondary"
                        onClick={() => dispatch(reduxAddFormField())}
                        style={{ marginRight: "5px", marginBottom: "20px" }}
                        startIcon={<AddCircleOutlineIcon />}
                    >
                        ADD FORM FIELD
                    </Button>
                </div>
                <TableContainer>
                    <Table stickyHeader>
                        <thead>
                            <tr>
                                <th>Actions</th>
                                <th>Field Id</th>
                                <th>Field Name</th>
                                <th>Field Label</th>
                                <th>No. Of Columns</th>
                                <th>Role </th>
                                <th>Field Category</th>
                                <th>Field Type</th>
                                <th>Default Value</th>
                                <th>Disabled</th>
                                <th>Required</th>
                                <th>Select Parent Field</th>
                                <th>Merge With</th>
                                <th>Field Filters</th>
                                <th>Possible Values</th>
                                <th>Field Width</th>
                                <th>Decimals</th>
                                <th>Missing Values</th>
                                <th>Columns</th>
                                <th>Align </th>
                                <th>Measure</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reduxFormFields?.map((field, index) => (
                                <React.Fragment key={field.id}>
                                    <tr>
                                        <td>
                                            <Tooltip title={openRows.includes(index) ? "Hide Conditions" : "Show Conditions"}>
                                                <IconButton aria-label="hide" onClick={() => handleCollapse(index)} size="small">
                                                    {openRows.includes(index) ? (
                                                        <KeyboardArrowUpIcon sx={{ fontSize: "1.3rem" }} />
                                                    ) : (
                                                        <KeyboardArrowDownIcon sx={{ fontSize: "1.3rem" }} />
                                                    )}
                                                </IconButton>
                                            </Tooltip>
                                            <IconButton
                                                sx={{ color: "error" }}
                                                aria-label="delete"
                                                onClick={() => dispatch(removeFormField(index))}
                                                size="small"
                                                color="error"
                                            >
                                                <Delete sx={{ fontSize: "1.3rem" }} />
                                            </IconButton>
                                            <Tooltip title="shift downward">
                                                <span>
                                                    <IconButton
                                                        aria-label="hide"
                                                        onClick={() => dispatch(moveDownField(index))}
                                                        size="small"
                                                        disabled={index === maxIndex}
                                                    >
                                                        <ArrowDownwardIcon sx={{ fontSize: "1.3rem" }} />
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                            <Tooltip title="shift upward">
                                                <span>
                                                    <IconButton
                                                        aria-label="hide"
                                                        onClick={() => dispatch(moveUpField(index))}
                                                        size="small"
                                                        disabled={index === maxIndex}
                                                    >
                                                        <ArrowUpwardIcon sx={{ fontSize: "1.3rem" }} />
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                onChange={(e) => updateFormField("id", e.target.value, index)}
                                                value={index}
                                                className="custom-form-inps"
                                                placeholder="id"
                                                style={styles.fieldStyle}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                size="small"
                                                value={field.field_name ? field.field_name : ""}
                                                name="field_name"
                                                id="field_name"
                                                onChange={(e) => updateFormField("field_name", e.target.value, index)}
                                                placeholder="field name"
                                                style={styles.fieldStyle}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                size="small"
                                                value={field.description ? field.description : ""}
                                                name="description"
                                                id="description"
                                                onChange={(e) => updateFormField("description", e.target.value, index)}
                                                placeholder="Description"
                                                style={styles.fieldStyle}
                                            />
                                        </td>
                                        <td>
                                            <select
                                                size="small"
                                                name="space"
                                                value={field.space ? field.space : ""}
                                                id="space"
                                                onChange={(e) => updateFormField("space", e.target.value, index)}
                                                className="custom-form-inps"
                                                placeholder="space"
                                                // value={field.space ? field.space : '12'}
                                                style={styles.fieldStyle}
                                            >
                                                <option value="">Select Col</option>
                                                <option value="12">12 COL</option>
                                                <option value="11">11 COL</option>
                                                <option value="10">10 COL</option>
                                                <option value="9">09 COL</option>
                                                <option value="8">08 COL</option>
                                                <option value="7">07 COL</option>
                                                <option value="6">06 COL</option>
                                                <option value="5">05 COL</option>
                                                <option value="4">04 COL</option>
                                                <option value="3">03 COL</option>
                                                <option value="2">02 COL</option>
                                                <option value="1">01 COL</option>
                                            </select>
                                        </td>
                                        <td>
                                            <select
                                                size="medium"
                                                name="role"
                                                id="role"
                                                onChange={(e) => updateFormField("role", e.target.value, index)}
                                                className="custom-form-inps"
                                                placeholder="role"
                                                value={field.role ? field.role : ""}
                                                style={styles.fieldStyle}
                                            >
                                                <option value="">Select Role</option>
                                                <option value="string">Text</option>
                                                <option value="text-area">Text Box</option>
                                                <option value="choices">Choices</option>
                                                <option value="multiple-choices">Multiple Choices</option>
                                                <option value="integer">Integer</option>
                                                <option value="double">Double</option>
                                                <option value="checkbox">Checkbox</option>
                                                <option value="radio">Radio</option>
                                                <option value="date">Date</option>
                                                <option value="time">Time</option>
                                                <option value="file">Upload File</option>
                                                <option value="sec">Section</option>
                                                <option value="rel">Relation</option>
                                                <option value="rel-multi">Relation Muliple Choices</option>
                                                <option value="loc">Location</option>
                                                <option value="hidden">Server Value</option>
                                            </select>
                                        </td>
                                        <td>
                                            <select
                                                size="small"
                                                name="category"
                                                value={field.category ? field.category : ""}
                                                id="category"
                                                onChange={(e) => updateFormField("category", e.target.value, index)}
                                                className="custom-form-inps"
                                                placeholder="category"
                                                style={styles.fieldStyle}
                                            >
                                                <option value="none">Select Category</option>
                                                <option value="QUALITATIVE">QUALITATIVE</option>
                                                <option value="QUANTITATIVE">QUANTITATIVE</option>
                                            </select>
                                        </td>
                                        <td>
                                            <select
                                                size="small"
                                                name="dtype"
                                                id="dtype"
                                                onChange={(e) => updateFormField("dtype", e.target.value, index)}
                                                className="custom-form-inps"
                                                placeholder="dtype"
                                                value={field.dtype ? field.dtype : ""}
                                                style={styles.fieldStyle}
                                            >
                                                <option value="none">Select Data Type</option>
                                                <option value="string">String</option>
                                                <option value="int">Integer</option>
                                                <option value="long">Long</option>
                                                <option value="decimal">Decimal</option>
                                                <option value="float">Float</option>
                                                <option value="double">Double</option>
                                                <option value="date">Date</option>
                                                <option value="timestamp">Timestamp</option>
                                            </select>
                                        </td>
                                        <td>
                                            <input
                                                size="small"
                                                name="default_val"
                                                value={field.default_val ? field.default_val : ""}
                                                id="default_val"
                                                onChange={(e) => updateFormField("default_val", e.target.value, index)}
                                                placeholder="Default Value"
                                                style={styles.fieldStyle}
                                            />
                                        </td>
                                        <td>
                                            <select
                                                size="small"
                                                name="disabled"
                                                value={field.disabled ? field.disabled : ""}
                                                id="disabled"
                                                onChange={(e) => updateFormField("disabled", e.target.value, index)}
                                                className="custom-form-inps"
                                                placeholder="disabled"
                                                style={styles.fieldStyle}
                                            >
                                                <option value="">------------</option>
                                                <option value="true">Yes</option>
                                                <option value="false">No</option>
                                            </select>
                                        </td>
                                        <td>
                                            <select
                                                size="small"
                                                name="required"
                                                value={field.required ? field.required : ""}
                                                id="required"
                                                onChange={(e) => updateFormField("required", e.target.value, index)}
                                                className="custom-form-inps"
                                                placeholder="required"
                                                style={styles.fieldStyle}
                                            >
                                                <option value="">------------</option>
                                                <option value="true">Yes</option>
                                                <option value="false">No</option>
                                            </select>
                                        </td>
                                        <td>
                                            <select
                                                name="parent"
                                                value={field.parent ? field.parent : ""}
                                                id="parent"
                                                onChange={(e) => updateFormField("parent", e.target.value, index)}
                                                placeholder="parent"
                                                style={{ ...styles.fieldStyle, ...styles.additionalStyles }}
                                            >
                                                <option value="none">Select Field</option>
                                                {reduxFormFields[index].role === "rel" || reduxFormFields[index].role === "rel-multi" ? (
                                                    <>
                                                        <FormAsOption datasetid={selectedDataset.productclientdatasetsid} />
                                                    </>
                                                ) : (
                                                    <>
                                                        {reduxFormFields.map((eachItem, indx) => (
                                                            <option key={indx} value={eachItem.field_name}>
                                                                {eachItem.field_name}
                                                            </option>
                                                        ))}
                                                    </>
                                                )}
                                            </select>
                                        </td>
                                        <td>
                                            <Autocomplete
                                                multiple
                                                style={{ marginLeft: "15px", marginRight: "10px" }}
                                                onChange={(value) => updateFormField("merging", value, index)}
                                                options={reduxFormFields.map((eachItem) => eachItem.field_name)}
                                                getOptionLabel={(option) => option}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </td>
                                        <td>
                                            {reduxFormFields[index].role === "rel" || reduxFormFields[index].role === "rel-multi" ? (
                                                <>
                                                    {reduxFormFields[index].parent}
                                                    <input
                                                        type="text"
                                                        onChange={(e) =>
                                                            // Notes -> Need to find a better approach to parse the incoming data into JS dict, invalid JSON can crash the app
                                                            updateFormField("field_filters", JSON.parse(e.target.value), index)
                                                        }
                                                        className="custom-form-inps"
                                                        placeholder="Put valid JSON `ROLENAME:SQL`"
                                                        style={styles.fieldStyle}
                                                    />
                                                </>
                                            ) : (
                                                <>This option not available for this field role</>
                                            )}
                                        </td>
                                        <td>
                                            <input
                                                size="small"
                                                onChange={(e) => updateFormField("values", e.target.value, index)}
                                                placeholder="Values"
                                                style={styles.fieldStyle}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={field.field_width || ""}
                                                onChange={(e) => updateFormField("field_width", e.target.value, index)}
                                                placeholder="Width"
                                                size="small"
                                                style={styles.fieldStyle}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={field.decimals || ""}
                                                onChange={(e) => updateFormField("decimals", e.target.value, index)}
                                                placeholder="Decimals"
                                                size="small"
                                                style={styles.fieldStyle}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                size="small"
                                                value={field.missing || ""}
                                                onChange={(e) => updateFormField("missing", e.target.value, index)}
                                                placeholder="Missing Value"
                                                style={styles.fieldStyle}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                size="small"
                                                type="number"
                                                value={field.columns || ""}
                                                onChange={(e) => updateFormField("columns", e.target.value, index)}
                                                placeholder="Columns"
                                                style={styles.fieldStyle}
                                            />
                                        </td>
                                        <td>
                                            <select
                                                name="align"
                                                id="align"
                                                onChange={(e) => updateFormField("align", e.target.value, index)}
                                                className="custom-form-inps"
                                                placeholder="align"
                                                value={field.role ? field.role : ""}
                                                style={{ ...styles.fieldStyle }}
                                            >
                                                <option value="none">Select Direction</option>
                                                <option value="left">Left</option>
                                                <option value="center">Center</option>
                                                <option value="right">Right</option>
                                            </select>
                                        </td>
                                        <td>
                                            <input
                                                size="small"
                                                type="number"
                                                onChange={(e) => updateFormField("measure", e.target.value, index)}
                                                placeholder="Measure"
                                                style={styles.fieldStyle}
                                            />
                                        </td>
                                    </tr>
                                    <>
                                        {openRows.includes(index) && (
                                            <tr key={index}>
                                                <td style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={14}>
                                                    <Collapse in={openRows.includes(index)} timeout="auto" unmountOnExit>
                                                        <Box sx={{ margin: 1 }}>
                                                            <TableContainer>
                                                                <SubCard title="Add Conditions">
                                                                    <thead>
                                                                        <td>
                                                                            <Tooltip title="Add Row">
                                                                                <IconButton
                                                                                    aria-label="add"
                                                                                    onClick={() => dispatch(reduxAddCondition(index))}
                                                                                    size="small"
                                                                                >
                                                                                    <AddIcon sx={{ fontSize: "1.3rem" }} />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                        </td>
                                                                        <td style={styles.conditionStyles.tabCells}>select Relation</td>
                                                                        <td style={styles.conditionStyles.tabCells}>Parent Field Value</td>
                                                                        <td style={styles.conditionStyles.tabCells}>Display Mode</td>
                                                                        <td style={styles.conditionStyles.tabCells}>Field Value</td>
                                                                    </thead>
                                                                    <tbody>
                                                                        {field.conditions.map((condition, ind2) => (
                                                                            <tr key={ind2}>
                                                                                <td />
                                                                                <td>
                                                                                    <select
                                                                                        id="condition"
                                                                                        name="condition"
                                                                                        onChange={(e) =>
                                                                                            onCondtitionChange(
                                                                                                index,
                                                                                                ind2,
                                                                                                "operator",
                                                                                                e.target.value
                                                                                            )
                                                                                        }
                                                                                        className="custom-form-inps"
                                                                                        placeholder="parent"
                                                                                        style={styles.fieldStyle}
                                                                                    >
                                                                                        <option value="none">Select Relation</option>
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
                                                                                </td>
                                                                                <td>
                                                                                    <select
                                                                                        id="parValue"
                                                                                        name="parValue"
                                                                                        onChange={(e) =>
                                                                                            onCondtitionChange(
                                                                                                index,
                                                                                                ind2,
                                                                                                "parValue",
                                                                                                e.target.value
                                                                                            )
                                                                                        }
                                                                                        className="custom-form-inps"
                                                                                        placeholder="Parent Value"
                                                                                        style={styles.fieldStyle}
                                                                                    >
                                                                                        <option value="none">----</option>
                                                                                        {reduxFormFields
                                                                                            .filter(
                                                                                                (filterItem) =>
                                                                                                    filterItem.field_name === field.parent
                                                                                            )
                                                                                            .map((filteredItem, indexx) => (
                                                                                                <React.Fragment key={indexx}>
                                                                                                    {filteredItem.values ? (
                                                                                                        filteredItem.values
                                                                                                            .split(",")
                                                                                                            .map((value, indx1) => (
                                                                                                                <option
                                                                                                                    key={indx1}
                                                                                                                    value={value}
                                                                                                                >
                                                                                                                    {value}
                                                                                                                </option>
                                                                                                            ))
                                                                                                    ) : (
                                                                                                        <></>
                                                                                                    )}
                                                                                                </React.Fragment>
                                                                                            ))}
                                                                                    </select>
                                                                                </td>
                                                                                <td>
                                                                                    <select
                                                                                        id="behaviour"
                                                                                        name="behaviour"
                                                                                        onChange={(e) =>
                                                                                            onCondtitionChange(
                                                                                                index,
                                                                                                ind2,
                                                                                                "behaviour",
                                                                                                e.target.value
                                                                                            )
                                                                                        }
                                                                                        className="custom-form-inps"
                                                                                        placeholder="parent"
                                                                                        style={styles.fieldStyle}
                                                                                    >
                                                                                        <option value="none">Select Mode</option>
                                                                                        <option value="show">Show</option>
                                                                                        <option value="hide">Hide</option>
                                                                                    </select>
                                                                                </td>
                                                                                <td>
                                                                                    <input
                                                                                        type="text"
                                                                                        onChange={(e) =>
                                                                                            onCondtitionChange(
                                                                                                index,
                                                                                                ind2,
                                                                                                "value",
                                                                                                e.target.value
                                                                                            )
                                                                                        }
                                                                                        className="custom-form-inps"
                                                                                        placeholder="field Value"
                                                                                        style={styles.fieldStyle}
                                                                                        // PropTypes
                                                                                    />
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </SubCard>
                                                            </TableContainer>
                                                        </Box>
                                                    </Collapse>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </Table>
                </TableContainer>
                <div style={{ marginTop: "10px" }}>
                    <Button type="submit" variant="contained" color="secondary" style={{ marginTop: "10px" }} endIcon={<SendIcon />}>
                        Submit
                    </Button>
                </div>
            </form>
        </MainCard>
    );
}
export default TableForm;
