import React, { useState } from "react";
import { useDispatch, useSelector } from "store";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PropTypes from "prop-types";
// material-ui
import { useTheme } from "@mui/material/styles";
import { Typography, TextField, Grid, FormControl, Button, IconButton, InputAdornment } from "@mui/material";
import { openSnackbar } from "store/slices/snackbar";
import {
    GetJWT,
    dataSourceConfigurationFileUpload,
    postDataSourceConfigForDatabase,
    GetAccessToken,
    putdataSourceConfigurationSaveS3Config
} from "views/api-configuration/default";
import { getSchema } from "store/slices/datasource-configuration";
// assets
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SendIcon from "@mui/icons-material/Send";
import api from "views/api-configuration/api";

export default function Configurations({ handleChange }) {
    const dispatch = useDispatch();
    const { configData, schemaFields, dbmsConfig, s3Config } = useSelector((state) => state.datasourceconfiguration);
    const theme = useTheme();

    const DISALLOWED_CHARS = /[:*?"<>|]/;

    const handleKeyDown = (event) => {
        if (DISALLOWED_CHARS.test(event.key)) {
            event.preventDefault();
        }
    };

    const [formData, setFormData] = useState({
        datasourceid: 0,
        productclientdatasetsid: configData?.productclientdatasetsid,
        connectorclass: "",
        taskmax: "",
        "connection.url": "",
        "connection.user": "",
        "connection.password": "",
        mode: "",
        "table.whitelist": "",
        prefix: "",
        "poll.interval.ms": "",
        timestamp: "",
        "incrementing.column.name": "",
        sourcetype: "", // This will populate on Big Data Service
        format: "",
        sourceValue: "",
        connectionconfig: "{}",
        loadstatus: "SUBMITTED",
        "timestamp.column.name": "",
        updatedatetime: "",
        loadbehaviour: ""
    });
    const [showPassword, setShowPassword] = useState(false);

    const [s3formData, sets3FormData] = useState({
        "aws.access.key.id": "",
        "aws.secret.access.key": "",
        "aws.s3.bucket.name": "",
        "file.filter.regex.pattern": "",
        "aws.s3.region": ""
    });

    const [localFIle, setLocalFile] = useState();
    const [fileName, setFileName] = useState("");

    const changeFieldValue = (e) => {
        if (e.target.name === "tableLcation") {
            const formData = new FormData();
            formData.append("file", e.target.files[0]);
            setFileName(e.target.files[0].name);
            setLocalFile(formData);
        }
        const data = { ...formData };
        data[e.target.name] = e.target.value;
        setFormData(data);
    };
    const changeS3ConfigFieldValue = (e) => {
        const data = { ...s3formData };
        data[e.target.name] = e.target.value;
        sets3FormData(data);
    };
    const handleToggleVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };
    const submitForm = (e) => {
        e.preventDefault();
        if (configData.sourcetype === "LOCALFS") {
            if (schemaFields && schemaFields.unapproved) {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Unapproved Schema File Already Exists",
                        variant: "alert",
                        alert: {
                            color: "error"
                        },
                        close: false
                    })
                );
            } else {
                api.post(
                    dataSourceConfigurationFileUpload(configData.datasourceid, configData.productclientdatasetsid, configData.tableid),
                    localFIle,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            Authorization: `Bearer ${GetJWT()}`
                        }
                    }
                )
                    .then(() => {
                        dispatch(getSchema(configData.datasourceid));

                        handleChange(null, 2);
                        dispatch(
                            openSnackbar({
                                open: true,
                                message: "File Uploaded Successfully",
                                variant: "alert",
                                alert: {
                                    color: "success"
                                },
                                close: false
                            })
                        );
                    })
                    .catch((response) => {
                        dispatch(
                            openSnackbar({
                                open: true,
                                message: "Error Uploading File",
                                variant: "alert",
                                alert: {
                                    color: "error"
                                },
                                close: false
                            })
                        );
                        return response;
                    });
            }
        } else if (configData?.sourcetype === "S3") {
            api.put(putdataSourceConfigurationSaveS3Config(configData?.datasourceid), s3formData)
                .then(() => {
                    dispatch(getSchema(configData.datasourceid));

                    handleChange(null, 2);
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: "Form Submitted Successfully",
                            variant: "alert",
                            alert: {
                                color: "success"
                            },
                            close: false
                        })
                    );
                })
                .catch((response) => {
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
                    return response;
                });
        } else {
            api.put(postDataSourceConfigForDatabase(configData.datasourceid), formData, {
                headers: GetAccessToken()
            })
                .then(() => {
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: "Data Source Created Successfully",
                            variant: "alert",
                            alert: {
                                color: "success"
                            },
                            close: false
                        })
                    );
                })
                .catch((response) => {
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: "Error Creating Data Source Record",
                            variant: "alert",
                            alert: {
                                color: "error"
                            },
                            close: false
                        })
                    );
                    return response;
                });
        }
    };
    return (
        <>
            <div
                style={{
                    gridColumn: "span 12",
                    background: theme.palette.primary.main,
                    padding: "10px",
                    color: "white",
                    borderRadius: 5
                }}
            >
                <Typography component="span" color="inherit" variant="h4" style={{ margin: 0 }}>
                    {configData?.sourcetype}
                </Typography>
            </div>
            <Grid container spacing={2} p={2}>
                {configData?.sourcetype === "S3" && s3Config ? (
                    <>
                        <Grid item xs={12} sm={6}>
                            <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                {/* formId for DATA-FORM, file-absolute-location for LOCALFS */}
                                <TextField
                                    fullWidth
                                    id="aws.access.key.id"
                                    name="aws.access.key.id"
                                    label="Key Id"
                                    defaultValue={(s3Config && s3Config["aws.access.key.id"]) || "*****"}
                                    onChange={changeS3ConfigFieldValue}
                                    variant="outlined"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                <TextField
                                    fullWidth
                                    id="aws.secret.access.key"
                                    name="aws.secret.access.key"
                                    label="Access Key"
                                    defaultValue={(s3Config && s3Config["aws.secret.access.key"]) || "*****"}
                                    onChange={changeS3ConfigFieldValue}
                                    variant="outlined"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                {/* formId for DATA-FORM, file-absolute-location for LOCALFS */}
                                <TextField
                                    fullWidth
                                    id="aws.s3.bucket.name"
                                    name="aws.s3.bucket.name"
                                    label="S3 Bucket Name"
                                    defaultValue={s3Config && s3Config["aws.s3.bucket.name"]}
                                    onChange={changeS3ConfigFieldValue}
                                    variant="outlined"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                <TextField
                                    fullWidth
                                    id="file.filter.regex.pattern"
                                    name="file.filter.regex.pattern"
                                    label="Bucket Prefix"
                                    defaultValue={s3Config && s3Config["file.filter.regex.pattern"]}
                                    onChange={changeS3ConfigFieldValue}
                                    onKeyDown={handleKeyDown}
                                    variant="outlined"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                {/* formId for DATA-FORM, file-absolute-location for LOCALFS */}
                                <TextField
                                    fullWidth
                                    id="aws.s3.region"
                                    name="aws.s3.region"
                                    label="S3 Region"
                                    defaultValue={s3Config && s3Config["aws.s3.region"]}
                                    onChange={changeS3ConfigFieldValue}
                                    variant="outlined"
                                />
                            </FormControl>
                        </Grid>
                    </>
                ) : (
                    <></>
                )}
                {configData?.sourcetype !== "LOCALFS" &&
                configData?.sourcetype !== "DATA-FORM" &&
                configData?.sourcetype !== "S3" &&
                dbmsConfig ? (
                    /*eslint-disable*/
                    <>
                        <Grid item xs={12} sm={6}>
                            <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                {/* formId for DATA-FORM, file-absolute-location for LOCALFS */}
                                <TextField
                                    fullWidth
                                    id="connector.class"
                                    name="connectorclass"
                                    label="Connector Class"
                                    defaultValue={dbmsConfig && dbmsConfig["connector.class"]}
                                    onChange={changeFieldValue}
                                    variant="outlined"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                <TextField
                                    fullWidth
                                    id="taskmax"
                                    name="taskmax"
                                    label="Task Max"
                                    defaultValue={dbmsConfig && dbmsConfig["tasks.max"]}
                                    onChange={changeFieldValue}
                                    variant="outlined"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                {/* formId for DATA-FORM, file-absolute-location for LOCALFS */}
                                <TextField
                                    fullWidth
                                    id="connection.url"
                                    name="connection.url"
                                    label="Connection Url"
                                    defaultValue={dbmsConfig && dbmsConfig["connection.url"]}
                                    onChange={changeFieldValue}
                                    variant="outlined"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                <TextField
                                    fullWidth
                                    id="connection.user"
                                    name="connection.user"
                                    label="Connection User"
                                    defaultValue={dbmsConfig && dbmsConfig["connection.user"]}
                                    onChange={changeFieldValue}
                                    variant="outlined"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                {/* formId for DATA-FORM, file-absolute-location for LOCALFS */}
                                <TextField
                                    fullWidth
                                    id="connection.password"
                                    name="connection.password"
                                    label="Connection Password"
                                    type={showPassword ? "text" : "password"}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleToggleVisibility}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                    defaultValue={dbmsConfig && dbmsConfig["connection.password"]}
                                    onChange={changeFieldValue}
                                    variant="outlined"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                <TextField
                                    fullWidth
                                    id="mode"
                                    name="mode"
                                    label="Mode"
                                    defaultValue={dbmsConfig?.mode}
                                    onChange={changeFieldValue}
                                    variant="outlined"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                {/* formId for DATA-FORM, file-absolute-location for LOCALFS */}
                                <TextField
                                    fullWidth
                                    id="incrementing.column.name"
                                    name="incrementing.column.name"
                                    label="Incrementing Column Name"
                                    defaultValue={dbmsConfig && dbmsConfig["incrementing.column.name"]}
                                    onChange={changeFieldValue}
                                    variant="outlined"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                <TextField
                                    fullWidth
                                    id="table.whitelist"
                                    name="table.whitelist"
                                    label="WhiteList"
                                    defaultValue={dbmsConfig && dbmsConfig["table.whitelist"]}
                                    onChange={changeFieldValue}
                                    variant="outlined"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                <TextField
                                    fullWidth
                                    id="prefix"
                                    name="prefix"
                                    label="Prefix"
                                    defaultValue={dbmsConfig?.prefix}
                                    onChange={changeFieldValue}
                                    variant="outlined"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                <TextField
                                    fullWidth
                                    id="poll.interval.ms"
                                    name="poll.interval.ms"
                                    label="interval"
                                    defaultValue={dbmsConfig["poll.interval.ms"]}
                                    onChange={changeFieldValue}
                                    variant="outlined"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                <TextField
                                    fullWidth
                                    id="timestamp.column.name"
                                    name="timestamp.column.name"
                                    label="Timestamp"
                                    defaultValue={dbmsConfig && dbmsConfig["timestamp.column.name"]}
                                    onChange={changeFieldValue}
                                    variant="outlined"
                                />
                            </FormControl>
                        </Grid>
                    </>
                ) : (
                    <></>
                )}

                {configData.sourcetype === "LOCALFS" ? (
                    <Grid item xs={12} sm={12}>
                        {fileName && (
                            <Typography component="span">
                                <span>File : </span>
                                <span>{fileName}</span>
                            </Typography>
                        )}

                        <FormControl
                            sx={{
                                m: 1,
                                minWidth: 120,
                                width: "100%",
                                background: theme.palette.primary.light,
                                borderRadius: "8px",
                                display: "grid",
                                gridTemplateRows: "auto auto",
                                alignItems: "center"
                            }}
                        >
                            <label htmlFor="tableLocation" className="custom-file-upload">
                                <CloudUploadIcon style={{ marginRight: "5px", color: `${theme.palette.primary.main}` }} />
                                <Typography component="span">Upload File</Typography>
                                <input type="file" onChange={changeFieldValue} id="tableLocation" name="tableLcation" />
                            </label>
                        </FormControl>
                    </Grid>
                ) : (
                    <></>
                )}
            </Grid>
            <Grid item xs={6} sm={6}>
                <Button
                    type="submit"
                    onClick={submitForm}
                    color="secondary"
                    variant="contained"
                    style={{ marginTop: "10px" }}
                    endIcon={<SendIcon />}
                >
                    SUBMIT
                </Button>
            </Grid>
        </>
    );
}

Configurations.propTypes = {
    handleChange: PropTypes.func
};
