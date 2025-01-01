import React, { useState } from "react";
import MainCard from "./cards/MainCard";
import { gridSpacing } from "store/constant";

import { Grid, Typography, Button, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";

// project imports
import { useDispatch } from "store";
import { openSnackbar } from "store/slices/snackbar";
import { useTheme } from "@mui/material/styles";
import image1 from "assets/images/dataSource/CSV.png";
import image2 from "assets/images/dataSource/pgsql.png";
import image3 from "assets/images/dataSource/s3.png";
import image4 from "assets/images/dataSource/Json.png";
import image5 from "assets/images/dataSource/mySql.png";
import image6 from "assets/images/dataSource/excel.png";
import image7 from "assets/images/dataSource/kafka.png";
import image8 from "assets/images/dataSource/avro.png";
import image9 from "assets/images/dataSource/CloudWatch.png";
import image10 from "assets/images/dataSource/cloudWatch1.png";
import image11 from "assets/images/dataSource/datadog.avif";
import image12 from "assets/images/dataSource/dynamoDB.png";
import image13 from "assets/images/dataSource/elasticsearch.svg";
import image14 from "assets/images/dataSource/git.png";
import image15 from "assets/images/dataSource/IBM.png";
import image16 from "assets/images/dataSource/java.png";
import image17 from "assets/images/dataSource/JIRA.png";
import image18 from "assets/images/dataSource/rabbitMq.png";
import image19 from "assets/images/dataSource/reddis.png";
import image20 from "assets/images/dataSource/splunk.jpeg";
import image21 from "assets/images/dataSource/SQS.png";

// API Config
import { GetAccessToken, postDatasource, createDataSource } from "views/api-configuration/default";

import { setConfigData } from "store/slices/datasource-configuration";
import PropTypes from "prop-types";
import FormButtons from "../FormButtons";
import api from "views/api-configuration/api";

const sourceType = [
    { value: "CSV", label: "LOCALFS", image: image1 },
    { value: "PGSQL", label: "PGSQL", image: image2 },
    { value: "S3", label: "CSV", image: image3 },
    { value: "JSON", label: "DATA-FORM", image: image4 },
    { value: "MYSQL", label: "MYSQL", image: image5 },
    { value: "EXCEL", label: "EXCEL", image: image6 },
    { value: "KAFKA", label: "KAFKA", image: image7 },
    { value: "AVRO", label: "AVRO", image: image8 },
    { value: "Cloud Watch Metic", label: "Cloud Watch metric", image: image9 },
    { value: "Cloud Watch", label: "Cloud Watch", image: image10 },
    { value: "Data Dog", label: "Data dog", image: image11 },
    { value: "Dynamo DB", label: "dynamoDB", image: image12 },
    { value: "Elastic search", label: "elasticsearch", image: image13 },
    { value: "Git", label: "git", image: image14 },
    { value: "IBM", label: "IBM", image: image15 },
    { value: "Java", label: "java", image: image16 },
    { value: "JIRA", label: "JIRA", image: image17 },
    { value: "RabbitMq", label: "rabbitMq", image: image18 },
    { value: "Reddis", label: "reddis", image: image19 },
    { value: "Splunk", label: "splunk", image: image20 },
    { value: "SQS", label: "SQS", image: image21 }
];

const DataSourceForm = (props) => {
    const { catalogsid, datasetid, tableid, handleCloseDrawer } = props;
    const dispatch = useDispatch();
    const theme = useTheme();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        catalogsid,
        connectionconfig: "{}",
        format: "",
        loadstatus: "SUBMITTED",
        productclientdatasetsid: datasetid,
        sourceValue: "",
        sourceconfig: "{}",
        sourcetype: "",
        tableid
    });
    const [, setLocalFile] = useState();
    const [selectedOption, setSelectedOption] = React.useState("");

    const determineSourceType = (fileFormat) => {
        if (fileFormat && fileFormat.toLowerCase() === "CSV") {
            return "LOCALFS";
        }
        if (fileFormat && (fileFormat === "MYSQL" || fileFormat === "PGSQL")) {
            return "DBMS";
        }
        if (fileFormat && fileFormat === "S3") {
            return "S3";
        }
        return "LOCALFS";
    };
    const changeFieldValue = (e, type) => {
        if (!e.target) {
            setSelectedOption(e);
        }

        if (e?.target && e.target.name === "tableLocation") {
            const formData = new FormData();
            formData.append("file", e.target.files[0]);
            setLocalFile(formData);
        }

        const data = { ...formData };

        if (type === "format" && e.value === "S3") {
            data[type] = "CSV";
            const autoSelectedSourceType = determineSourceType(e.value);
            data.sourcetype = autoSelectedSourceType;
        } else if (type === "format" && e.value !== "S3") {
            data[type] = e.value;
            const autoSelectedSourceType = determineSourceType(e.value);
            data.sourcetype = autoSelectedSourceType;
        } else {
            data[e.target.name] = e.target.value;
        }
        setFormData(data);
    };
    const submitForm = async (e) => {
        e.preventDefault();
        if (formData.sourcetype) {
            const formDataPost = formData;
            await api
                .post(createDataSource, formDataPost, {
                    headers: GetAccessToken()
                })
                .then((response) => {
                    const datasourceid = response.data.result.datasourceid;
                    dispatch(setConfigData(response.data.result));
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
                    navigate(`/datasource-configuration/${catalogsid}/${tableid}/${datasourceid}`);
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
        } else {
            api.post(postDatasource, formData)
                .then((response) => {
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
                    navigate(`/datasource-configuration/${response.data.result.datasourceid}`);
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
        <Grid container spacing={0} alignItems="right">
            <MainCard
                content={false}
                title={
                    <Grid container justifyContent="space-between" spacing={gridSpacing}>
                        <Grid item>
                            <Typography variant="h3" component="div" align="center" sx={{ color: theme.palette.primary.dark }}>
                                What Do You Want To Connect?
                            </Typography>
                        </Grid>
                    </Grid>
                }
                style={{ width: "100%", height: "fit-content" }}
            >
                <Grid container spacing={2} p={2}>
                    <Grid item xs={12} lg={12}>
                        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                            {sourceType.map((item, index) => (
                                <Tooltip key={index} title={item.value}>
                                    <Button
                                        key={item.value}
                                        variant={selectedOption.value === item.value ? "contained" : "outlined"}
                                        onClick={() => changeFieldValue(item, "format")}
                                        disabled={index === 6 || index > 6}
                                        style={{
                                            marginRight: (index + 1) % 7 === 0 ? 0 : 5,
                                            marginBottom: 5,
                                            pointerEvents: "auto",
                                            opacity: index === 6 || index > 6 ? 0.5 : 1
                                        }}
                                    >
                                        <img src={item.image} alt={item.label} style={{ width: 50, height: 50 }} />
                                    </Button>
                                </Tooltip>
                            ))}
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <FormButtons onSubmit={submitForm} onCancel={handleCloseDrawer} />
                    </Grid>
                </Grid>
            </MainCard>
        </Grid>
    );
};

DataSourceForm.propTypes = {
    catalogsid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    datasetid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tableid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    handleCloseDrawer: PropTypes.func
};

export default DataSourceForm;
