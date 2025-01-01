import React, { useState, useEffect } from "react";
import MainCard from "./cards/MainCard";
import { gridSpacing } from "store/constant";

import { Grid, TextField, Typography, Autocomplete, Checkbox, Chip } from "@mui/material";

// project imports
// import { useDispatch } from "store";
// import { openSnackbar } from "store/slices/snackbar";
import { useTheme } from "@mui/material/styles";
// import SearchIcon from "@mui/icons-material/Search";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
// API Config
import { getcolumnDataDisByStage } from "views/api-configuration/default";
import PropTypes from "prop-types";
import api from "views/api-configuration/api";
import FormFooterButtons from "../FormButtons";

// const tableType = ["RAW", "FEATURE"];
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const ConfigFilterForm = ({ dashDatasetId, dashTableId, columns, setFinalData, handleApi, handleCloseDrawer }) => {
    // const dispatch = useDispatch();
    const theme = useTheme();

    const columnNames = Object.keys(JSON.parse(columns.parquetSchema));
    const [columnData, setColumnData] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [searchText, setSearchText] = useState("");

    const [fields, setFields] = useState(columnNames.reduce((acc, curr) => ({ ...acc, [curr]: "" }), {}));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`${getcolumnDataDisByStage(dashDatasetId, dashTableId, "BRONZE")}`);
                setColumnData(response.data.result);
            } catch (error) {
                console.error("Error fetching column data:", error);
            }
        };

        fetchData();
    }, [dashDatasetId, dashTableId]);

    const handleFieldChange = (field, value) => {
        setFields((prevFields) => ({ ...prevFields, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const filteredColumns = columnNames.filter((name) => fields[name] !== "");
        const filteredValues = filteredColumns.map((name) => fields[name]);
        const formattedColumns = `${filteredColumns.join(",")}`;
        const formattedValues = `${filteredValues.join(",")}`;
        const finalDataArray = filteredColumns.map((name) => ({
            attrib_name: name,
            value: fields[name]
        }));
        setFinalData(finalDataArray);
        handleApi(formattedColumns, formattedValues);
        handleCloseDrawer();
    };

    return (
        <MainCard
            content={false}
            title={
                <Grid container justifyContent="space-between" spacing={gridSpacing}>
                    <Grid item>
                        <Typography variant="h3" component="div" align="center" sx={{ color: theme.palette.primary.dark }}>
                            Add Filter
                        </Typography>
                    </Grid>
                </Grid>
            }
            style={{ width: "100%", height: "fit-content" }}
        >
            <Grid container spacing={2} p={2}>
                {/* {columnNames.map((name, index) => (
                    <Grid item xs={12} key={index}>
                        <TextField
                            fullWidth
                            label={name}
                            variant="outlined"
                            value={fields[name]}
                            onChange={(e) => handleFieldChange(name, e.target.value)}
                        />
                    </Grid>
                ))} */}
                {columnData &&
                    columnData?.map((item, indx) => {
                        if (item.attributetype === "string") {
                            const parsedDistinctValues = JSON.parse(item.distinctValues);
                            /*eslint-disable*/
                            const filteredOptions = searchText
                                ? Object.keys(parsedDistinctValues).filter((option) =>
                                      option.toLowerCase().includes(searchText.toLowerCase())
                                  )
                                : Object.keys(parsedDistinctValues);
                            const filtered = Object.keys(parsedDistinctValues).map((val) => val);
                            return (
                                <Grid key={indx} item xs={12} sm={12}>
                                    <Autocomplete
                                        labelId={`t-${item.attributename}`}
                                        id={`${item.attributename}`}
                                        name={`${item.attributename}`}
                                        label={item.attributename}
                                        placeholder={item.attributename}
                                        fullWidth
                                        variant="outlined"
                                        single
                                        options={filtered}
                                        disableCloseOnSelect
                                        disableClearable
                                        disableTag
                                        getOptionLabel={(option) => option}
                                        renderTags={(values) =>
                                            values.map((value, index) => (
                                                <Chip
                                                    key={index}
                                                    label={value}
                                                    color="primary"
                                                    variant="outlined"
                                                    style={{ marginRight: "3px" }}
                                                />
                                            ))
                                        }
                                        renderOption={(props, option, { selected }) => (
                                            <li {...props}>
                                                <Checkbox
                                                    icon={icon}
                                                    checkedIcon={checkedIcon}
                                                    style={{ marginRight: 8 }}
                                                    checked={selected}
                                                />
                                                {option}
                                            </li>
                                        )}
                                        onChange={(e, value) => handleFieldChange(item.attributename, value)}
                                        style={{ width: 500 }}
                                        renderInput={(params) => (
                                            <TextField {...params} label={`${item.attributename}`} placeholder={item.attributename} />
                                        )}
                                    />
                                </Grid>
                            );
                        }
                        /*eslint-enable*/
                        if (item.attributetype === "double" || item.attributetype === "integer") {
                            return (
                                <Grid key={indx} item xs={9.5} sm={9.5}>
                                    <TextField
                                        fullWidth
                                        label={item.attributename}
                                        variant="outlined"
                                        value={fields[item.attributename]}
                                        onChange={(e) => handleFieldChange(item.attributename, e.target.value)}
                                    />
                                </Grid>
                            );
                        }
                        return null;
                    })}

                <Grid item xs={12} sm={6}>
                    <FormFooterButtons onSubmit={handleSubmit} onCancel={handleCloseDrawer} />
                </Grid>
            </Grid>
        </MainCard>
    );
};

ConfigFilterForm.propTypes = {
    dashDatasetId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    dashTableId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    columns: PropTypes.string,
    setFinalData: PropTypes.func,
    handleApi: PropTypes.func,
    handleCloseDrawer: PropTypes.func,
    totalCount: PropTypes.number
};

export default ConfigFilterForm;
