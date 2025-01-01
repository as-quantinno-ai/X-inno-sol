import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import MainCard from "./basic/cards/MainCard";
import { gridSpacing } from "store/constant";
// import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
import { useDispatch } from "store";
import { openSnackbar } from "store/slices/snackbar";
import {
    GetJWT,
    updateCustomFormData,
    retrieveCustomFormRecord,
    getCustomFormsByprodclidsidandTableIid
} from "views/api-configuration/default";
import { FormFieldStructure } from "views/form-builder/UpdatedDataEntry";
import { Grid, Typography, CircularProgress, Box } from "@mui/material";
import api from "views/api-configuration/api";
import FormFooterButtons from "./FormButtons";

const EditFeatureTableRecord = ({ id, dashTableId, dashDatasetId, recId, handleCloseDrawer, handleReload }) => {
    const dispatch = useDispatch();

    const [form, setForm] = useState(null);
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState(new FormData());

    const formRef = useRef();

    // eslint-disable-next-line no-unused-vars
    const [fieldsData, setFieldsData] = useState({});
    const [multiChoiceData, setMultiChoiceData] = useState({});
    const [choiceData, setChoiceData] = useState({});

    const inputRefs = useRef({});

    const [selectedRecord, setSelectedRecord] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const apiUrl = retrieveCustomFormRecord();

                const response = await api.get(getCustomFormsByprodclidsidandTableIid(dashDatasetId, dashTableId));
                setForm(response.data.result[0]);
                setLocation(response.data.result[0].fileLocation);
                const viewName = response.data.result[0].viewname;
                const RequestBody = {
                    productclientdatasetsid: dashDatasetId,
                    uuid: recId.toString(),
                    viewname: viewName
                };

                RequestBody.viewname = viewName;

                if (viewName) {
                    const recordResponse = await axios.post(apiUrl, RequestBody);
                    const responseData = recordResponse.data.data;
                    const parsedData = JSON.parse(responseData);
                    setSelectedRecord(parsedData);
                }
                setLoading(false);
            } catch (error) {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Feature not available at the moment",
                        variant: "alert",
                        alert: {
                            color: "error"
                        },
                        close: false
                    })
                );
                setLoading(false);
                setError(error.message);

                console.error("Error fetching data:", error.message);
            }
        };
        fetchData();
    }, []);

    const selectedRecordObject = selectedRecord && selectedRecord[0];

    useEffect(() => {
        const formDataObj = new FormData();
        formDataObj.append("data", "{}");
        formDataObj.append("formid", id);
        formDataObj.append("status", "U");
        formDataObj.append("uuid", recId);
        formDataObj.append("files", null);

        formDataObj.append("file_location", location);

        setMultiChoiceData({});
        setChoiceData();
        setFormData(formDataObj);
    }, [id, selectedRecord, location]);

    const getDisabledFields = () => {
        const form = document.getElementById("custom-form");
        const disabledFieldsArray = Array.from(form.elements).filter((element) => element.disabled);

        const disabledFieldsObject = disabledFieldsArray.reduce((acc, field) => {
            acc[field.name] = { value: field.value, type: field.getAttribute("dtype") };
            return acc;
        }, {});
        return disabledFieldsObject;
    };
    const getFormData = () => {
        const formDataObject = new FormData(formRef.current);

        const formDataDict = Object.fromEntries(formDataObject);

        const formElements = Array.from(formRef.current.elements);
        const mergingMap = {};

        const nameTypePairs = formElements.reduce((acc, element) => {
            if (element.name) {
                // Access the custom attribute 'dtype' using getAttribute
                let dtype = element.getAttribute("dtype");

                if (dtype === "textarea" || dtype === null) {
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
                if (mergingMap[key]) {
                    const mergingFieldValues = Array.isArray(mergingMap[key])
                        ? mergingMap[key].map((item) => `${formDataDict[item]}`)
                        : [formDataDict[mergingMap[key]]];
                    acc[key] = {
                        value: [...mergingFieldValues, formDataDict[key]].join(" "),
                        type: nameTypePairs[key]
                    };
                } else {
                    acc[key] = { value: formDataDict[key], type: nameTypePairs[key] };
                }
            }
            return acc;
        }, {});

        return result;
    };

    // const handleFormDataChange = (e, type, merging, value, fieldname) => {
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
            const updatedDataString = JSON.stringify({ ...getFormData() });
            formData.set("data", updatedDataString);
        } else if (type === "multiple-choices-rel") {
            // const currentDataString = formData.get("data");
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

    const onFormSubmit = (e) => {
        e.preventDefault();

        const updatedDataString = JSON.stringify({ ...getFormData(), ...multiChoiceData, ...choiceData, ...getDisabledFields() });
        formData.set("data", updatedDataString);

        const reqOptions = {
            url: updateCustomFormData(dashDatasetId, dashTableId),
            method: "PUT",
            headers: {
                Accept: "*/*",
                Authorization: `Bearer ${GetJWT()}`
            },
            data: formData
            // uuid: recId,
            // status: 'u'
        };

        api.request(reqOptions)
            .then((res) => {
                if (res && res.status === 200) {
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: "Your Form Updated Successfully",
                            variant: "alert",
                            alert: {
                                color: "success"
                            },
                            close: false
                        })
                    );
                    handleCloseDrawer();
                    handleReload();
                }
            })
            .catch((err) => {
                console.error("Error updating form:", err);
                handleCloseDrawer();
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Error Updating Form",
                        variant: "alert",
                        alert: {
                            color: "error"
                        },
                        close: false
                    })
                );
            });
    };

    return (
        <>
            <Grid container spacing={gridSpacing} sx={{ p: 2 }}>
                {loading || error ? (
                    <Grid item xs={12}>
                        <Box display="flex" justifyContent="center" alignContent="center" alignItems="center" height="100%">
                            {error && <Typography>{error}</Typography>}
                            {loading && <CircularProgress />}
                        </Box>
                    </Grid>
                ) : (
                    <Grid container spacing={0} style={{ minHeight: "100vh" }}>
                        <MainCard content={false} style={{ width: "100%", height: "fit-content" }} sx={{ p: 0, m: 0 }}>
                            <form ref={formRef} onSubmit={onFormSubmit} id="custom-form" encType="multipart/form-data">
                                <div>
                                    {form && selectedRecordObject ? (
                                        <>
                                            <Grid container spacing={2} p={2}>
                                                <Grid item xs={12} lg={12} mt={0} mb={2}>
                                                    {JSON.parse(form.formfields).map((field, index) => (
                                                        <Grid
                                                            item
                                                            xs={12}
                                                            lg={12}
                                                            mt={2}
                                                            mb={3}
                                                            key={field.field_name || `${field.field_name}-${index}`}
                                                        >
                                                            <FormFieldStructure
                                                                field={field}
                                                                func={handleFormDataChange}
                                                                state={fieldsData}
                                                                formid={form.formid}
                                                                inputRefs={inputRefs}
                                                                types="edit"
                                                                defaultValue={selectedRecordObject}
                                                            />
                                                        </Grid>
                                                    ))}
                                                    <Grid item xs={12} lg={12}>
                                                        <Grid item xs={12} sm={6}>
                                                            <FormFooterButtons onSubmit={onFormSubmit} onCancel={handleCloseDrawer} />
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </form>
                        </MainCard>
                    </Grid>
                )}
            </Grid>
        </>
    );
};

EditFeatureTableRecord.propTypes = {
    id: PropTypes.string,
    dashTableId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dashDatasetId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    recId: PropTypes.string,
    handleCloseDrawer: PropTypes.func,
    handleReload: PropTypes.func
};

export default EditFeatureTableRecord;
