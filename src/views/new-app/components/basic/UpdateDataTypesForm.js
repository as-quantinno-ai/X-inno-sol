import React, { useState } from "react";
import MainCard from "./cards/MainCard";
import { gridSpacing } from "store/constant";
import PropTypes from "prop-types";
import {
    Grid,
    Typography,
    // Button,
    Select,
    ListItemText,
    ListItemButton,
    FormControl,
    InputLabel,
    MenuItem,
    // FormControlLabel,
    // Radio,
    RadioGroup
    // Autocomplete,
    // TextField
} from "@mui/material";
// import CloseIcon from "@mui/icons-material/Cancel";
import { useDispatch } from "store";
import { openSnackbar } from "store/slices/snackbar";
import { useTheme } from "@mui/material/styles";
// import SendIcon from "@mui/icons-material/Send";

// API Config
import { GetJWT, metadataList, updateMetadataDataTypes } from "views/api-configuration/default";
import { useFetch } from "react-async";
import FormButtons from "../FormButtons";
import api from "views/api-configuration/api";

const availableDataTypes = [
    { name: "string", label: "String" },
    { name: "integer", label: "Integer" },
    { name: "long", label: "Long" },
    { name: "double", label: "Double" },
    { name: "float", label: "Float" },
    { name: "date", label: "Date" },
    { name: "timestamp", label: "Tmestamp" }
];

const UpdateDataTypesForm = ({ datasetid, tableid, tablename, handleCloseDrawer }) => {
    const dispatch = useDispatch();
    const theme = useTheme();

    // eslint-disable-next-line no-unused-vars
    const [formState, setFormState] = useState(null);

    const [formData, setFormData] = useState({
        productClientDatasetsId: datasetid,
        tableId: tableid,
        attributes: []
    });

    // const { rawDataSources } = useSelector((state) => state.dataCollection);

    // const [catalogsMetadataList, setCatalogsMetadataList] = useState();

    const changeFieldValue = (attributeId, attributeType) => {
        const data = { ...formData };
        data.attributes = [
            ...data.attributes,
            {
                attributeId,
                attributeType
            }
        ];
        setFormData(data);
    };

    const updateMetadataDataType = (e) => {
        e.preventDefault();
        api.put(updateMetadataDataTypes, formData, {
            headers: {
                Authorization: `Bearer ${GetJWT()}`
            }
        })
            .then(() => {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Metadata Data Types Updated Successfully",
                        variant: "alert",
                        alert: {
                            color: "success"
                        },
                        close: false
                    })
                );
            })
            .catch((err) => {
                console.log("updateDataType", err);
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Error Updating Metadata Data Types",
                        variant: "alert",
                        alert: {
                            color: "error"
                        },
                        close: false
                    })
                );
            });
    };
    const { data, error } = useFetch(`${metadataList}/${datasetid}/${tableid}`, {
        headers: { accept: "application/json", Authorization: `Bearer ${GetJWT()}` }
    });
    if (error) return error.message;
    if (data)
        return (
            <Grid container spacing={0} alignItems="right">
                <MainCard
                    content={false}
                    title={
                        <Grid container justifyContent="space-between" spacing={gridSpacing}>
                            <Grid item>
                                <Typography variant="h3" component="div" align="center" sx={{ color: theme.palette.primary.dark }}>
                                    Modify Data Types ({tablename.replace(/_/g, " ")})
                                </Typography>
                            </Grid>
                        </Grid>
                    }
                    style={{ width: "100%", height: "fit-content" }}
                >
                    <RadioGroup
                        aria-labelledby="metadata-lables"
                        name="metadata"
                        onChange={(e) => {
                            setFormState(null);
                            setFormData(null);
                            setFormState(e.target.value.split(","));
                        }}
                        style={{ width: "100%" }}
                    >
                        <form onSubmit={updateMetadataDataType}>
                            <Grid container spacing={0}>
                                {data.result?.map((item, indx) => (
                                    <>
                                        <Grid key={indx} item lg={12} md={12}>
                                            <ListItemButton component="a" href="#simple-list">
                                                {/* {item.referenceproductclientdatasetsid && item.referencetableId && item.referenceattributeId ? (
                                            <StarRateIcon />
                                            ) : (
                                                <></>
                                        )} */}
                                                <ListItemText
                                                    primary={
                                                        <>
                                                            <Grid container spacing={0}>
                                                                <Grid item lg={6} md={6}>
                                                                    <h3>{item.attributeName}</h3>
                                                                </Grid>
                                                                <Grid item lg={6} md={6}>
                                                                    <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                                                        <InputLabel id="t-catalog">Select Data Domain</InputLabel>
                                                                        <Select
                                                                            labelId="catalog"
                                                                            id="catalog"
                                                                            name="catalog"
                                                                            label="Select Data Domain"
                                                                            fullWidth
                                                                            variant="outlined"
                                                                            defaultValue={item.attributeType}
                                                                            attribId={item.attributeId}
                                                                            onChange={(e) =>
                                                                                changeFieldValue(item.attributeId, e.target.value)
                                                                            }
                                                                        >
                                                                            {availableDataTypes.map((dtype, indx) => (
                                                                                <MenuItem key={indx} value={dtype.name}>
                                                                                    {dtype.label}
                                                                                </MenuItem>
                                                                            ))}
                                                                        </Select>
                                                                    </FormControl>
                                                                </Grid>
                                                            </Grid>
                                                        </>
                                                    }
                                                    secondary={item.attributeType}
                                                />
                                            </ListItemButton>
                                        </Grid>
                                    </>
                                ))}
                            </Grid>
                            {/*   <FormControl sx={{ m: 1, minWidth: 120, width: '100%' }}>
                                    <Button type="submit" variant="contained" endIcon={<SendIcon />}>
                                        Submit
                                    </Button>
                                </FormControl>
                           */}
                            <Grid item xs={12} sm={6}>
                                <FormButtons onCancel={handleCloseDrawer} onSubmit={updateMetadataDataType} />
                            </Grid>
                        </form>
                    </RadioGroup>
                </MainCard>
            </Grid>
        );
    return null;
};

UpdateDataTypesForm.propTypes = {
    datasetid: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    tableid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    availableDataTypes: PropTypes.array,
    handleCloseDrawer: PropTypes.func,
    tablename: PropTypes.string
};
export default UpdateDataTypesForm;
