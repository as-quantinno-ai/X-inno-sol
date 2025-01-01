import axios from "axios";

import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import CancelIcon from "@mui/icons-material/Cancel";
// material-ui
import { useTheme } from "@mui/material/styles";
import {
    Box,
    Typography,
    Button,
    MenuItem,
    Select,
    TextField,
    ListSubheader,
    InputAdornment,
    Autocomplete,
    IconButton,
    Modal,
    CircularProgress,
    Tooltip,
    Grid
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import MainCard from "views/new-app/components/basic/cards/MainCard";
import {
    postCustomFormData,
    dltCustomFormDataByFormId,
    getCustomFormsByFormId,
    GetJWT,
    // loadParquetData,
    cleanFormStructureUrl,
    getQueryAppDataByFieldFilters,
    loadParquetData
} from "views/api-configuration/default";
import { useSelector, useDispatch } from "store";
import PropTypes from "prop-types";
import { openSnackbar } from "store/slices/snackbar";
import { useParams } from "react-router-dom";
// import { useFetch } from "react-async";
import GoogleMapCode from "./GoogleMapCode";
import FeaturedDataTable from "views/new-app/components/basic/FeaturedDataTable";
import { Delete } from "@mui/icons-material";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import RoleBasedHOC from "authorization-hocs/RoleBasedHOC";
import CustomTextField from "./customComponent/CustomTextField";
import CustomIntTextField from "./customComponent/CustomIntTextField";
import CustomSelect from "./customComponent/CustomSelect";
import CustomAutocomplete from "./customComponent/CustomAutoComplete";
import CustomRadio from "./customComponent/CustomRadio";
import CustomCheckbox from "./customComponent/CustomCheckbox";
import CustomFileInput from "./customComponent/CustomFileInput";
import CustomDateTime from "./customComponent/CustomDateTime";
import api from "views/api-configuration/api";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import UploadImages from "./ImageToText";
import FormFooterButtons from "views/new-app/components/FormButtons";
import PermBasedAuthorizationHOC from "utils/route-guard/PermBasedAuthorizationHOC";
// import { UserFormFields } from "constants/generic";
import { selectBaseData } from "store/slices/initial-data";
import CustomTextBox from "./customComponent/CustomTextBox";

const parquetDataTypesForFields = {
    string: "string",
    varchar: "varchar",
    char: "char",
    int: "int",
    long: "long",
    decimal: "decimal",
    float: "float",
    double: "double",
    date: "date",
    timestamp: "datetime",
    radio: "string"
};

function removeUuid(data) {
    // eslint-disable-next-line no-unused-vars
    const { uuid_identifier_da_an_v1: uuid, DATA_STATUS: status, ...rest } = data;
    return { ...rest };
}

export async function getRelationalData(catalogid, metadata) {
    try {
        const res = await axios.get(loadParquetData(catalogid[0], catalogid[1], 10, 1, metadata), {
            headers: { accept: "application/json", Authorization: `Bearer ${GetJWT()}` }
        });

        const parsedData = JSON.parse(res.data.data);

        return parsedData;
    } catch (error) {
        // Handle error appropriately
        console.error("Error:", error);
        throw error; // You might want to handle or re-throw the error here
    }
}

export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

const FormDataAsOption = ({ formid, field, defaultValue }) => {
    const [dataOptionss, setDataOptionss] = useState(null);
    const [selectedVal, setSelectedVal] = useState(defaultValue ? defaultValue[field.field_name] : "");
    const [searchText, setSearchText] = useState("");
    // eslint-disable-next-line no-unused-vars
    const [page, setPage] = useState(0);
    const baseData = useSelector(selectBaseData);
    const { selfuser } = baseData;
    const formatted = selfuser.emailAddress.replace("@", "%40");
    const debouncedSearchText = useDebounce(searchText, 1000);

    const getFieldData = (responseData, fieldName) => {
        const dataObject = responseData.data.find((item) => item[fieldName]);

        if (dataObject) {
            const jsonString = dataObject[fieldName];
            try {
                return JSON.parse(jsonString);
            } catch (error) {
                console.error("Error parsing JSON:", error);
                return [];
            }
        }
        return [];
    };

    const fetchData = async () => {
        try {
            const payload = {
                column_values: {
                    [field.field_name]: debouncedSearchText
                }
            };

            const response = await api.post(getQueryAppDataByFieldFilters(formid, formatted), payload);

            if (response.status !== 200) {
                throw new Error("Network response was not ok");
            }

            const data = response.data;
            const fieldData = getFieldData(data, field.field_name);
            setDataOptionss(fieldData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        setDataOptionss([]);
        fetchData();
    }, [page, debouncedSearchText]);

    if (!dataOptionss) {
        return null;
    }
    const displayOptions = dataOptionss.length === 0 ? [{ label: "No record available" }] : dataOptionss;
    return (
        <>
            <Select
                name={field.field_name}
                id={field.field_name}
                placeholder={field.field_name.replace(/_/g, " ").toUpperCase()}
                style={{ width: "100%", marginTop: "5px", padding: "0px" }}
                disabled={field.disabled === "true"}
                required={field.required === "true"}
                inputProps={{
                    dtype: parquetDataTypesForFields[field.dtype]
                }}
                defaultValue={selectedVal}
                // value={selectedVal}
                onChange={(e) => {
                    const selectedValue = e.target.value;
                    const selectedObject = displayOptions?.find((option) => option.uuid_identifier_da_an_v1 === selectedValue);
                    setSelectedVal(selectedObject || null);
                }}
                onClose={() => setSearchText("")}
                MenuProps={{
                    autoFocus: false,
                    PaperProps: {
                        style: {
                            maxHeight: 200
                        }
                    }
                }}
            >
                <ListSubheader>
                    <TextField
                        size="small"
                        autoFocus
                        placeholder="Type to search..."
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            )
                        }}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key !== "Escape") {
                                e.stopPropagation();
                            }
                        }}
                    />
                </ListSubheader>
                {displayOptions?.map((eachParqRec) => (
                    <MenuItem key={eachParqRec.uuid_identifier_da_an_v1} value={eachParqRec.uuid_identifier_da_an_v1}>
                        {Object.values(removeUuid(eachParqRec)).map((colValue) => `${colValue} `)}
                    </MenuItem>
                ))}
            </Select>
        </>
    );
};

FormDataAsOption.propTypes = {
    formid: PropTypes.string,
    field: PropTypes.object,
    // func: PropTypes.func,
    defaultValue: PropTypes.any
};

const FormDataAsMultipleOptions = ({ field, formid, func, defaultValue }) => {
    const [dataOptions, setDataOptions] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line no-unused-vars
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchText, setSearchText] = useState("");
    const debouncedSearchText = useDebounce(searchText, 1000);
    const [selectedOptions, setSelectedOptions] = useState(defaultValue?.[field.field_name] || []);

    const fieldname = field.field_name;
    const baseData = useSelector(selectBaseData);
    const { selfuser } = baseData;
    const formattedEmail = selfuser.emailAddress.replace("@", "%40");

    const fetchData = async () => {
        try {
            setLoadingMore(true);

            const payload = {
                column_values: {
                    [field.field_name]: debouncedSearchText
                }
            };
            const response = await api.post(getQueryAppDataByFieldFilters(formid, formattedEmail), payload);

            if (response.status !== 200) {
                throw new Error("Network response was not ok");
            }

            const string = response.data.data[0][fieldname];
            const parsedData = JSON.parse(string);
            setDataOptions(parsedData);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [debouncedSearchText, formid, formattedEmail]);
    const handleSearchInputChange = (event) => {
        setSearchText(event.target.value);
    };

    const handleDropdownClose = () => {
        setSearchText("");
        fetchData();
    };

    const handleChange = (value) => {
        const newSelectedOptions = value.filter(
            (option) => !selectedOptions.some((selected) => selected.uuid_identifier_da_an_v1 === option.uuid_identifier_da_an_v1)
        );

        const deselectedOptions = selectedOptions.filter(
            (selected) => !newSelectedOptions.some((option) => option.uuid_identifier_da_an_v1 === selected.uuid_identifier_da_an_v1)
        );

        const combinedOptions = [...deselectedOptions, ...newSelectedOptions];

        setSelectedOptions(combinedOptions);

        const selectedUuids = combinedOptions.map((item) => item?.uuid_identifier_da_an_v1).join();
        func([field.field_name, selectedUuids], "multiple-choices-rel");
    };

    const handleRemove = (uuid) => {
        const updatedSelectedOptions = selectedOptions.filter((selected) => selected.uuid_identifier_da_an_v1 !== uuid);

        setSelectedOptions(updatedSelectedOptions);

        const selectedUuids = updatedSelectedOptions.map((item) => item?.uuid_identifier_da_an_v1).join();
        func([field.field_name, selectedUuids], "multiple-choices-rel");
    };
    const displayOptions = dataOptions.length === 0 ? [{ label: "No record available" }] : dataOptions;

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <Autocomplete
            multiple
            disableCloseOnSelect
            options={displayOptions}
            name={field.field_name}
            id={field.field_name}
            value={selectedOptions}
            onChange={handleChange}
            // onChange={(e, value) =>
            //     func([field.field_name, value.map((item) => item.uuid_identifier_da_an_v1).join()], 'multiple-choices-rel')
            // }
            // getOptionLabel={(option) => Object.values(option).join().replace(/,/g, ' ')}
            getOptionLabel={(option) => Object.values(removeUuid(option)).join().replace(/,/g, " ")}
            disabled={field.disabled === "true"}
            required={field.required === "true"}
            onClose={handleDropdownClose}
            renderInput={(params) => (
                <TextField
                    {...params}
                    value={searchText}
                    onChange={handleSearchInputChange}
                    placeholder="Type to search..."
                    InputProps={{
                        ...params.InputProps
                    }}
                />
            )}
            renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                    <span
                        key={option.uuid_identifier_da_an_v1}
                        {...getTagProps({ index })}
                        style={{ display: "flex", alignItems: "center", margin: "2px", borderRadius: "30px", border: "1px solid #ccc" }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "4px 8px",
                                backgroundColor: "transparent",
                                borderRadius: "16px",
                                marginRight: "4px"
                            }}
                        >
                            <span style={{ marginRight: "4px" }}>{Object.values(removeUuid(option)).join().replace(/,/g, " ")}</span>
                            <CancelIcon
                                onClick={() => handleRemove(option.uuid_identifier_da_an_v1)}
                                style={{ cursor: "pointer", color: "black" }}
                            />
                        </div>
                    </span>
                ))
            }
        />
    );
};

FormDataAsMultipleOptions.propTypes = {
    // metadata: PropTypes.object,
    field: PropTypes.object,
    formid: PropTypes.string,
    styles: PropTypes.object,
    func: PropTypes.func,
    defaultValue: PropTypes.arrayOf(PropTypes.object)
};

function conditionParser(conditions, parentFieldVal) {
    const conditionStrings = [];
    function generateCompOperator(opCode) {
        /*eslint-disable*/
        switch (opCode) {
            case "eq":
                return "===";
            default:
                return "";
        }
        /*eslint-enable*/
    }

    // function generateLogOperator(opCode) {
    //     switch (opCode) {
    //         case "and":
    //             return "&&";
    //         default:
    //             return "";
    //     }
    // }

    conditions.map((cond) => {
        conditionStrings.push(`('${parentFieldVal}' ${generateCompOperator(cond.operator)} '${cond.parValue}')`);
        // if (ind === 0)
        //     conditionStrings += `('${parentFieldVal}' ${generateCompOperator(cond.operator)} '${cond.parValue}')`;
        // else conditionStrings += `('${parentFieldVal}' ${generateCompOperator(cond.operator)} '${cond.parValue}')`;
        // if (ind === 0) {
        // } else {
        //     conditionStrings += ` if ('${parentFieldVal}' ${generateCompOperator(cond.operator)} '${cond.parValue}') {'${cond.value}'} `;
        //     // conditionStrings += ` ${generateLogOperator(cond.join)} state.parent_field ${generateCompOperator(cond.operator)} '${
        //     //     cond.parValue
        //     // }' `;
        // }
        return 1;
    });

    return conditions.length === 0 ? true : eval(conditionStrings.join(" && "));
}

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

// function a11yProps(index) {
//     return {
//         id: `simple-tab-${index}`,
//         "aria-controls": `simple-tabpanel-${index}`
//     };
// }
function generatePassword(length, includeUppercase, includeNumbers, includeSymbols) {
    const charset = [
        "abcdefghijklmnopqrstuvwxyz",
        includeUppercase && "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        includeNumbers && "0123456789",
        includeSymbols && "!@#$%^&*()_-+=<>?"
    ]
        .filter(Boolean)
        .join("");

    return Array.from({ length }, () => charset[Math.floor(Math.random() * charset.length)]).join("");
}

// ================================|| UI TABS - COLOR ||================================ //

export const FormFieldStructure = ({ field, func, inputRefs, formid, types, defaultValue, conditionsFunc, display }) => {
    const { selectedDataset } = useSelector((state) => state.userLogin);
    const theme = useTheme();

    // const inputRefs = useRef({});
    const setRefs = (input, fieldName) => {
        if (inputRefs && inputRefs.current) {
            inputRefs.current[`${fieldName}`] = input?.querySelector("input");
            if (field.default_val === "FETCH_PAR_DA_AN") {
                const parentInputRef = inputRefs?.current[`${field.parent}`];

                parentInputRef?.addEventListener("input", () => {
                    const currentFieldInputRef = inputRefs?.current[`${field.field_name}`];

                    if (currentFieldInputRef) {
                        currentFieldInputRef.value = parentInputRef.value;
                    }
                });
            }
        }
    };
    const [selectedValue, setSelectedValue] = useState(defaultValue && defaultValue[field.field_name]);

    const primary = theme.palette.primary.dark;
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
            background: "#fafafa",
            borderRadius: "6px",
            width: "100%",
            padding: "16px",
            border: "1px solid"
        }
    };

    function settingDefaultValue(value) {
        let defaultVal = "";
        const currentDate = moment().format("YYYY-MM-DD");
        const currentTime = moment().format("HH:mm:ss");
        // const formattedDateTime = currentDate.toLocaleString();
        // const formattedTime = currentTime.toLocaleString();

        /*eslint-disable*/
        switch (value) {
            case "CD_DA_AN": // Current Date
                defaultVal = currentDate;
                break;
            case "CT_DA_AN": // Current Time
                defaultVal = currentTime;
                break;
            case "CDCT_DA_AN": // Current Date Current Time
                defaultVal = currentDate;
                break;
            case "CMSD_DA_AN": // Current Month Start Date
                // defaultVal = formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1));
                break;
            case "CMED_DA_AN": // Current Month End Date
                // defaultVal = formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0));
                break;
            case "PWD_AUTO_GEN_DA_AN":
                defaultVal = generatePassword(12, true, true, true);
                break;
            case "PROD_CL_ID_DA_AN":
                defaultVal = selectedDataset.productclientid;
                break;
            case "FETCH_PAR_DA_AN": {
                // console.log('parentInputRef');
                // if (field.default_val === 'FETCH_PAR_DA_AN' && inputRefs && inputRefs.current) {
                //     console.log(inputRefs, inputRefs.current, ' inputRefs && inputRefs.current');
                //     const parentInputRef = inputRefs?.current[`${field.parent}`];

                //     parentInputRef?.addEventListener('input', () => {
                //         const currentFieldInputRef = inputRefs?.current[`${field.field_name}`];

                //         if (currentFieldInputRef) {
                //             currentFieldInputRef.value = parentInputRef.value;
                //         }
                //     });
                // }
                // if (inputRefs && inputRefs.current) {
                //     inputRefs.current[`${fieldName}`] = input?.querySelector('input');
                //     if (field.default_val === 'FETCH_PAR_DA_AN') {
                //         const parentInputRef = inputRefs?.current[`${field.parent}`];

                //         parentInputRef?.addEventListener('input', () => {
                //             const currentFieldInputRef = inputRefs?.current[`${field.field_name}`];

                //             if (currentFieldInputRef) {
                //                 currentFieldInputRef.value = parentInputRef.value;
                //             }
                //         });
                //     }

                // else {
                // defaultVal = 'name';
                // //  }
                break;
            }
            default:
                defaultVal = value;
        }
        /* eslint-enable*/
        return defaultVal;
    }

    const defauldValue = settingDefaultValue(field.default_val);
    const modifiedDescription = types === "edit" ? field?.description?.replace("Add ", "Update ") ?? "" : field?.description ?? "";
    const [time, setTime] = useState((defaultValue && defaultValue[field.field_name]) || defauldValue);
    const [date, setDate] = useState((defaultValue && defaultValue[field.field_name]) || defauldValue);

    useEffect(() => {
        if (defaultValue === undefined && (field.role === "time" || field.role === "date")) {
            setDate(defauldValue);
            setTime(defauldValue);
        }
    }, [field]);

    let fieldStructure = <></>;

    // new changes here

    /*eslint-disable*/
    switch (field.role) {
        case "string":
            fieldStructure = (
                <CustomTextField
                    field={field}
                    func={func}
                    display={display}
                    defaultValue={defaultValue}
                    defauldValue={defauldValue}
                    parquetDataTypesForFields={parquetDataTypesForFields}
                    setRef={setRefs}
                />
            );
            break;
        case "text-area":
            fieldStructure = (
                <CustomTextBox
                    field={field}
                    func={func}
                    display={display}
                    defaultValue={defaultValue}
                    defauldValue={defauldValue}
                    parquetDataTypesForFields={parquetDataTypesForFields}
                    setRef={setRefs}
                />
            );
            break;
        case "integer":
        case "double":
            fieldStructure = (
                <CustomIntTextField
                    field={field}
                    func={func}
                    display={display}
                    defaultValue={defaultValue}
                    defauldValue={defauldValue}
                    parquetDataTypesForFields={parquetDataTypesForFields}
                    setRef={setRefs}
                />
            );
            break;
        case "choices":
            fieldStructure = (
                <CustomSelect
                    field={field}
                    func={func}
                    defaultValue={defaultValue}
                    defauldValue={defauldValue}
                    parquetDataTypesForFields={parquetDataTypesForFields}
                />
            );
            break;
        case "multiple-choices":
            fieldStructure = (
                <CustomAutocomplete
                    field={field}
                    func={func}
                    defaultValue={defaultValue}
                    defauldValue={defauldValue}
                    parquetDataTypesForFields={parquetDataTypesForFields}
                />
            );
            break;
        case "radio":
            fieldStructure = (
                <CustomRadio
                    field={field}
                    func={func}
                    selectedValue={selectedValue}
                    setRadioVal={setSelectedValue}
                    parquetDataTypesForFields={parquetDataTypesForFields}
                    conditionsFunc={conditionsFunc}
                />
            );
            break;
        case "checkbox":
            fieldStructure = <CustomCheckbox field={field} func={func} parquetDataTypesForFields={parquetDataTypesForFields} />;
            break;
        case "file":
            fieldStructure = (
                <CustomFileInput field={field} func={func} styles={styles} parquetDataTypesForFields={parquetDataTypesForFields} />
            );
            break;
        case "rel":
            fieldStructure = (
                <div style={{ gridColumn: `span ${field.space}` }}>
                    <div>{field.description}</div>
                    <FormDataAsOption defaultValue={defaultValue} formid={formid} styles={styles} func={func} field={field} />
                </div>
            );
            break;
        case "rel-multi":
            fieldStructure = (
                <div style={{ gridColumn: `span ${field.space}` }}>
                    <div>{field.description}</div>
                    <FormDataAsMultipleOptions defaultValue={defaultValue} formid={formid} styles={styles} func={func} field={field} />
                </div>
            );
            break;
        case "sec":
            fieldStructure = (
                <div style={{ gridColumn: "span 12", background: primary, padding: "10px", color: "white", borderRadius: 5 }}>
                    <h4 style={{ margin: 0 }}>{modifiedDescription}</h4>
                </div>
            );
            break;
        case "hidden":
            fieldStructure = func(defauldValue, field.role, field.merging);
            break;
        case "date":
        case "time":
            fieldStructure = (
                <CustomDateTime
                    field={field}
                    func={func}
                    date={date}
                    setDate={setDate}
                    time={time}
                    setTime={setTime}
                    defaultValue={defaultValue}
                    excludeFirst11Digits={(value) => value.substr(11)} // Define this function accordingly
                    parquetDataTypesForFields={parquetDataTypesForFields}
                />
            );
            break;
        case "loc":
            fieldStructure = (
                <div style={{ gridColumn: "span 12", marginBottom: "80px" }}>
                    <div>{field.description}</div>
                    <GoogleMapCode />
                </div>
            );
            break;
        default:
            fieldStructure = (
                <>
                    <div>{field.description}</div>
                    <input
                        type="text"
                        name={field.field_name}
                        id={field.field_name}
                        placeholder={field.field_name.replace(/_/g, " ").toUpperCase()}
                        onChange={func}
                        defaultValue={(defaultValue && defaultValue[field.field_name]) || defauldValue}
                        value={() => {
                            let val = "adsf";
                            if (field.conditions.length > 0) {
                                val = "no conditions";
                            } else {
                                val = "condtions";
                            }
                            return val;
                        }}
                        // inputProps={{
                        //     dtype: parquetDataTypesForFields[field.dtype],
                        //     ...(field.merging && { merging: field.merging })
                        // }}
                        style={{ width: "100%", marginTop: "5px" }}
                    />
                </>
            );
    }
    /*eslint-enable*/
    return fieldStructure;
};

FormFieldStructure.propTypes = {
    field: PropTypes.object,
    func: PropTypes.func,
    display: PropTypes.string,
    defaultValue: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.number, PropTypes.bool]),
    inputRefs: PropTypes.object,
    formid: PropTypes.string,
    types: PropTypes.arrayOf(PropTypes.string),
    conditionsFunc: PropTypes.func
};

export function DataEntry({ formId, handleCloseDrawer, reload }) {
    const [conditionsManager, setConditionsManager] = useState({});
    const { id } = useParams();
    const dispatch = useDispatch();
    const { selectedDataset } = useSelector((state) => state.userLogin);
    const { rawDataSources } = useSelector((state) => state.dataCollection);
    const [formData, setFormData] = useState(new FormData());
    // const [mergingMap, setMergingMap] = useState({});

    const [multiChoiceData, setMultiChoiceData] = useState({});
    const [choiceData, setChoiceData] = useState();

    const [uploadImages, setUploadImages] = useState(false);
    const [defaultImageText, setDefaultImageText] = useState(null);

    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [form, setForm] = useState(null);
    const inputRefs = useRef({});

    const formRef = useRef();
    const effectiveFormId = formId || id;
    const loadForm = async () => {
        try {
            const res = await api.get(getCustomFormsByFormId(effectiveFormId));
            setForm(res.data.result);

            JSON.parse(res.data.result.formfields)?.map((item) => {
                const data = conditionsManager;
                data[item.field_name] = undefined;
                setConditionsManager({ ...data });
                return 0;
            });
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        setForm(null);
        setDefaultImageText(null);

        const formDataObj = new FormData();
        formDataObj.append("data", "{}");
        formDataObj.append("formdataid", "0");
        formDataObj.append("formid", effectiveFormId);
        formDataObj.append("status", "A");
        setMultiChoiceData({});

        setFormData(formDataObj);
        const resetTextFields = () => {
            if (formRef.current) {
                const formElements = Array.from(formRef.current.elements);
                formElements.forEach((element) => {
                    if (element.type) {
                        element.value = "";
                    }
                });
            }
        };
        resetTextFields();
    }, [id]);

    useEffect(() => {
        loadForm();
    }, [selectedDataset, rawDataSources, effectiveFormId]);

    useEffect(() => {
        setForm(null);
        loadForm();
    }, [selectedDataset, rawDataSources, defaultImageText, effectiveFormId]);

    // const formdata = new FormData();
    // formdata.append('data', '{}');
    // formdata.append('formdataid', '0');
    // formdata.append('formid', id);
    // formdata.append('status', 'A');
    // const bodyContent = formdata;

    const getDisabledFields = () => {
        const form = document.getElementById("custom-form");
        const disabledFieldsArray = Array.from(form.elements).filter((element) => element.disabled);

        const mergingMap = Array.from(form.elements).reduce((acc, element) => {
            if (element.name) {
                const mergingFieldName = element.getAttribute("merging");
                if (mergingFieldName) {
                    acc[element.name] = mergingFieldName;
                }
            }
            return acc;
        }, {});

        const disabledFieldsObject = disabledFieldsArray.reduce((acc, field) => {
            let value = field.value;
            const name = field.name;
            const type = field.getAttribute("dtype");

            if (mergingMap[name]) {
                const mergingFieldValues = Array.isArray(mergingMap[name])
                    ? mergingMap[name].map((item) => `${form[item].value}`)
                    : [form[mergingMap[name]].value];

                value = [...mergingFieldValues, value].join(" ");
            }

            if (type === "datetime") {
                const localDateTime = moment(value, "YYYY-MM-DD HH:mm:ss");
                if (localDateTime.isValid()) {
                    value = localDateTime.utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
                }
            }

            acc[name] = { value, type };
            return acc;
        }, {});

        return disabledFieldsObject;
    };
    // This function returns data of all form fields in JS Object Form except ( Multiple Auto Complete, Disabled Fields )
    const getFormData = () => {
        const formDataObject = new FormData(formRef.current);

        const formDataDict = Object.fromEntries(formDataObject);

        const formElements = Array.from(formRef.current.elements);
        const mergingMap = {};

        const nameTypePairs = formElements.reduce((acc, element) => {
            if (element.name) {
                // Access the custom attribute 'dtype' using getAttribute
                let dtype = element.getAttribute("dtype");

                if (dtype === "textarea") {
                    dtype = "string";
                }
                acc[element.name] = dtype || element.type;
                const mergingFieldName = element.getAttribute("merging");

                if (mergingFieldName) {
                    mergingMap[element.name] = mergingFieldName;
                }
            }
            return acc;
        }, {});

        const result = Object.keys(formDataDict).reduce((acc, key) => {
            if (nameTypePairs[key]) {
                let value = formDataDict[key];

                if (mergingMap[key]) {
                    const mergingFieldValues = Array.isArray(mergingMap[key])
                        ? mergingMap[key].map((item) => `${formDataDict[item]}`)
                        : [formDataDict[mergingMap[key]]];

                    value = [...mergingFieldValues, value].join(" ");
                }

                if (nameTypePairs[key] === "datetime") {
                    const localDateTime = moment(value, "YYYY-MM-DD HH:mm:ss");
                    if (localDateTime.isValid()) {
                        value = localDateTime.utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
                    }
                }

                acc[key] = { value, type: nameTypePairs[key] };
            }
            return acc;
        }, {});

        return result;
    };

    const handleConditionsChange = (event, fieldName) => {
        const updatedConditionsManager = { ...conditionsManager, [fieldName]: event.target.value };
        setConditionsManager(updatedConditionsManager);
    };

    // const shouldRenderFormField = (field) => {
    //     const { parent, conditions } = field;

    //     return conditionsManager[parent] === (conditions[0]?.parValue || "");
    // };

    const handleFormDataChange = (e, type) => {
        if (type === "file") {
            formData.append("files", e.target.files[0]);
            const currentFileInfoString = formData.get("filesInfo");
            const FileInfo = currentFileInfoString
                ? `${currentFileInfoString.replace("}", "")} ${e.target.files[0].name}:${e.target.name},`
                : `${e.target.files[0].name}:${e.target.name},`;
            formData.set("filesInfo", FileInfo);
            const currentDataString = formData.get("data");
            const currentData = JSON.parse(currentDataString);
            currentData[e.target.name] = "";
            const updatedDataString = JSON.stringify({ ...getFormData(), ...multiChoiceData, ...getDisabledFields() });
            formData.set("data", updatedDataString);
        } else if (type === "multiple-choices-rel") {
            setMultiChoiceData({ ...multiChoiceData, [e[0]]: { value: e[1], type: "string" }, ...getDisabledFields() });
        } else if (type === "choices") {
            const currentDataString = formData.get("data");
            const currentData = JSON.parse(currentDataString);

            const updatedChoiceData = {
                ...currentData,
                [e.target.name]: { value: e.target.value, type: "string" }
            };
            setChoiceData(updatedChoiceData);
        }

        // if (merging) {
        //     const mergings = { ...mergingMap };
        //     mergings[e.target.name] = merging;
        //     setMergingMap(mergings);
        // }
    };

    const [refreshDataTable, setRefreshDataTable] = useState(false);

    const onFormSubmit = (e) => {
        e.preventDefault();
        setLoadingSubmit(true);
        //    const updatedDataString = JSON.stringify({ ...getFormData(), ...multiChoiceData, ...choiceData, ...getDisabledFields() });
        const updatedDataString = JSON.stringify({ ...getFormData(), ...multiChoiceData, ...choiceData, ...getDisabledFields() });

        formData.set("data", updatedDataString);

        const reqOptions = {
            url: postCustomFormData,
            method: "POST",
            headers: {
                Accept: "*/*",
                Authorization: `Bearer ${GetJWT()}`
            },
            data: formData
        };
        api.request(reqOptions)
            .then(() => {
                setLoadingSubmit(false);

                setRefreshDataTable((prev) => !prev);

                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Your Form Submitted Successfully",
                        variant: "alert",
                        alert: {
                            color: "success"
                        },
                        close: false
                    })
                );
                if (typeof handleCloseDrawer === "function") {
                    handleCloseDrawer();
                    reload();
                }
                // loadCustomFormData();
                return "";
            })
            .catch((err) => {
                setLoadingSubmit(false);

                if (err.response && err.response.status === 403) {
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: "Form submission failed due to unauthorized access.",
                            variant: "alert",
                            alert: {
                                color: "error"
                            },
                            close: false
                        })
                    );
                    if (typeof handleCloseDrawer === "function") {
                        handleCloseDrawer();
                    }
                } else {
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: "Error Submitting Form",
                            variant: "alert",
                            alert: {
                                color: "error"
                            },
                            close: false
                        })
                    );
                    if (typeof handleCloseDrawer === "function") {
                        handleCloseDrawer();
                    }
                }
            });
    };

    const deleteForm = (formid) => {
        api.delete(`${dltCustomFormDataByFormId(formid)}`)
            .then(() => {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Form Delete Successfully",
                        variant: "alert",
                        alert: {
                            color: "success"
                        },
                        close: false
                    })
                );
                loadForm();
            })
            .catch((err) => {
                console.log("Delete Form ERROR:", err);
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Error Deleting Form",
                        variant: "alert",
                        alert: {
                            color: "error"
                        },
                        close: false
                    })
                );
            });
    };

    const clearFormData = (formid) => {
        api.delete(`${cleanFormStructureUrl(form.productclientdatasetsid, form.tableid, formid)}`)
            .then(() => {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Your Form Submitted Successfully",
                        variant: "alert",
                        alert: {
                            color: "success"
                        },
                        close: false
                    })
                );
                loadForm();
            })
            .catch((err) => {
                console.log("Clear Form Data ERROR:", err);
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Error Deleting Form",
                        variant: "alert",
                        alert: {
                            color: "error"
                        },
                        close: false
                    })
                );
            });
    };

    const styles = {
        grid: {
            display: "grid",
            gridTemplateColumns: "auto auto auto auto auto auto auto auto auto auto auto auto",
            columnGap: "10px",
            rowGap: "25px"
        }
    };

    const handleUploadImagesModal = () => {
        setUploadImages(!uploadImages);
    };
    const handleImageTextValue = (value) => {
        if (value && value?.data) {
            setDefaultImageText(value.data);
        }
    };

    const formsatrribs = form && Object.keys(JSON.parse(form.parquetSchema));

    return (
        <>
            <MainCard>
                <div style={{ marginBottom: "20px", textAlign: "right" }}>
                    <RoleBasedHOC allowedRoles={["TENANT_ADMIN"]}>
                        <Tooltip title="Upload Images">
                            <IconButton
                                aria-label="images"
                                onClick={() => handleUploadImagesModal(effectiveFormId)}
                                style={{ forntSize: "12px" }}
                            >
                                <AddPhotoAlternateIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Form">
                            <IconButton aria-label="delete" onClick={() => deleteForm(effectiveFormId)} style={{ forntSize: "12px" }}>
                                <Delete />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Clear Form Data">
                            <IconButton aria-label="delete" onClick={() => clearFormData(effectiveFormId)} style={{ forntSize: "12px" }}>
                                <PlaylistRemoveIcon />
                            </IconButton>
                        </Tooltip>
                    </RoleBasedHOC>
                </div>

                {/* <form onSubmit={onFormSubmit} encType="multipart/form-data"> */}
                <form ref={formRef} onSubmit={onFormSubmit} id="custom-form" encType="multipart/form-data">
                    {form ? (
                        <>
                            {/* {JSON.parse(form.formfields).map((field) => (
                                    <>
                                        {conditionsManager[field.parent] === field.conditions[0]?.parValue ? (
                                            <FormFieldStructure
                                                field={field}
                                                func={handleFormDataChange}
                                                state={fieldsData}
                                                formid={form.formid}
                                                inputRefs={inputRefs}
                                                conditionsFunc={handleConditionsChange}
                                            />
                                        ) : (
                                            <></>
                                        )}
                                    </>
                                ))} */}

                            {formId ? (
                                <Grid container spacing={2} p={2}>
                                    <Grid item xs={12} lg={12} mt={0} mb={2}>
                                        {JSON?.parse(form?.formfields)?.map((field, index) => (
                                            <Grid
                                                item
                                                xs={12}
                                                lg={12}
                                                mt={2}
                                                mb={3}
                                                key={field.field_name || `${field.field_name}-${index}`}
                                            >
                                                <FormFieldStructure
                                                    key={index}
                                                    field={field}
                                                    func={handleFormDataChange}
                                                    display={
                                                        conditionParser(field.conditions, conditionsManager[field.parent])
                                                            ? "block"
                                                            : "none"
                                                    }
                                                    formid={form.formid}
                                                    defaultValue={defaultImageText}
                                                    inputRefs={inputRefs}
                                                    conditionsFunc={handleConditionsChange}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Grid>
                            ) : (
                                <div style={styles.grid}>
                                    {JSON.parse(form.formfields).map((field, index) => (
                                        <FormFieldStructure
                                            key={index}
                                            field={field}
                                            func={handleFormDataChange}
                                            display={conditionParser(field.conditions, conditionsManager[field.parent]) ? "block" : "none"}
                                            formid={form.formid}
                                            defaultValue={defaultImageText}
                                            inputRefs={inputRefs}
                                            conditionsFunc={handleConditionsChange}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <Box sx={{ display: "flex", justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                            <CircularProgress />
                        </Box>
                    )}

                    {formId === undefined && (
                        <Button
                            type="submit"
                            variant="contained"
                            color="secondary"
                            style={{ marginTop: "10px" }}
                            sx={{ width: "140px" }}
                            endIcon={loadingSubmit ? <></> : <SendIcon />}
                            disabled={loadingSubmit || form === null}
                        >
                            {loadingSubmit ? <CircularProgress size={24} color="inherit" /> : "SUBMIT"}
                        </Button>
                    )}
                    {formId && <FormFooterButtons onCancel={handleCloseDrawer} />}
                </form>
            </MainCard>
            {formId === undefined && form?.productclientdatasetsid && form?.tableid && (
                <PermBasedAuthorizationHOC perm="FORMDATA_READ">
                    <div style={{ marginTop: "20px" }}>
                        <FeaturedDataTable
                            key={form?.tableid}
                            dashDatasetId={form.productclientdatasetsid}
                            dashTableId={form.tableid}
                            onDashboard="yes"
                            id={id}
                            formTitle={form.formtitle}
                            refreshDataTable={refreshDataTable}
                            dashColumns={form}
                        />
                    </div>
                </PermBasedAuthorizationHOC>
            )}
            {uploadImages && (
                <Modal
                    open={uploadImages}
                    onClose={handleUploadImagesModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            borderRadius: "8px",
                            width: "90%",
                            height: "90%",
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: 4
                        }}
                    >
                        <UploadImages
                            formattrib={formsatrribs}
                            handleImageTextValue={handleImageTextValue}
                            handleUploadImagesModal={handleUploadImagesModal}
                        />
                    </Box>
                </Modal>
            )}
        </>
    );
}

DataEntry.propTypes = {
    formId: PropTypes.string,
    handleCloseDrawer: PropTypes.func,
    reload: PropTypes.bool
};

export default DataEntry;
