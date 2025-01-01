import React, { useState, useEffect } from "react";

// material-ui
// import { useTheme } from "@mui/material/styles";
import { Button, IconButton } from "@mui/material";

import MainCard from "views/new-app/components/basic/cards/MainCard";
import {
    postCustomFormData,
    getCustomFormDataByFormId,
    dltCustomFormDataByFormId,
    getCustomFormsByFormId
} from "views/api-configuration/default";
import { useSelector, useDispatch } from "store";
import axios from "axios";
import { openSnackbar } from "store/slices/snackbar";
import { useParams } from "react-router-dom";
import { Delete } from "@mui/icons-material";
import api from "views/api-configuration/api";
import PropTypes from "prop-types";
// ================================|| UI TABS - COLOR ||================================ //

const FormFieldStructure = ({ field, func }) => {
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
    let fieldStructure = <></>;
    if (field.role === "string")
        fieldStructure = (
            <div style={{ gridColumn: `span ${field.space}` }}>
                <div>{field.field_name.replace(/_/g, " ").toUpperCase()}</div>
                <input
                    type="text"
                    name={field.field_name.replace(/ /g, "_").toLowerCase()}
                    placeholder={field.field_name.replace(/_/g, " ").toUpperCase()}
                    onChange={func}
                    style={{ ...styles.fieldStyle, width: "100%", marginTop: "5px" }}
                />
                <div>{field.description}</div>
            </div>
        );
    else if (field.role === "integer" || field.role === "double")
        fieldStructure = (
            <div style={{ gridColumn: `span ${field.space}` }}>
                <div>{field.field_name.replace(/_/g, " ").toUpperCase()}</div>
                <input
                    type="number"
                    name={field.field_name.replace(/ /g, "_").toLowerCase()}
                    placeholder={field.field_name.replace(/_/g, " ").toUpperCase()}
                    onChange={func}
                    style={{ ...styles.fieldStyle, width: "100%", marginTop: "5px" }}
                />
                <div>{field.description}</div>
            </div>
        );
    else if (field.role === "choices")
        fieldStructure = (
            <div style={{ gridColumn: `span ${field.space}` }}>
                <div>{field.field_name.replace(/_/g, " ").toUpperCase()}</div>
                <select
                    name={field.field_name.replace(/ /g, "_").toLowerCase()}
                    placeholder={field.field_name.replace(/_/g, " ").toUpperCase()}
                    onChange={func}
                    style={{ ...styles.fieldStyle, width: "100%", marginTop: "5px" }}
                >
                    <option value="none">----</option>
                    {field.values.split(",").map((value, indx6) => (
                        <option key={indx6} value={value}>
                            {value}
                        </option>
                    ))}
                </select>
                <div>{field.description}</div>
            </div>
        );
    else if (field.role === "multi-choices")
        fieldStructure = (
            <div style={{ gridColumn: `span ${field.space}` }}>
                <div>{field.field_name.replace(/_/g, " ").toUpperCase()}</div>
                <select
                    name={field.field_name.replace(/ /g, "_").toLowerCase()}
                    placeholder={field.field_name.replace(/_/g, " ").toUpperCase()}
                    onChange={func}
                    style={{ ...styles.fieldStyle, width: "100%", marginTop: "5px" }}
                    multiple
                >
                    <option value="none">----</option>
                    {field.values.split(",").map((value, indx7) => (
                        <option key={indx7} value={value}>
                            {value}
                        </option>
                    ))}
                </select>
                <div>{field.description}</div>
            </div>
        );
    else if (field.role === "multiple-choice-consolidated")
        fieldStructure = (
            <div style={{ gridColumn: `span ${field.space}` }}>
                <div>{field.field_name.replace(/_/g, " ").toUpperCase()}</div>
                <select
                    name={field.field_name.replace(/ /g, "_").toLowerCase()}
                    placeholder={field.field_name.replace(/_/g, " ").toUpperCase()}
                    onChange={func}
                    style={{ ...styles.fieldStyle, width: "100%", marginTop: "5px" }}
                    multiple
                >
                    <option value="none">----</option>
                    {field.values.split(",").map((value, indx8) => (
                        <option key={indx8} value={value}>
                            {value}
                        </option>
                    ))}
                </select>
                <div>{field.description}</div>
            </div>
        );
    else if (field.role === "multiple-choice-split")
        fieldStructure = field.values.split(",").map((value, indx1) => (
            <div key={indx1} style={{ gridColumn: `span ${field.space}` }}>
                <div>{`${field.field_name.replace(/_/g, " ").toUpperCase()} ${indx1}`}</div>
                <select
                    name={field.field_name.replace(/ /g, "_").toLowerCase()}
                    placeholder={field.field_name.replace(/_/g, " ").toUpperCase()}
                    onChange={(e) => func(e, "split")}
                    style={{ ...styles.fieldStyle, width: "100%", marginTop: "5px" }}
                >
                    <option value="none">----</option>
                    {field.values.split(",").map((value, indx2) => (
                        <option key={indx2} value={value}>
                            {value}
                        </option>
                    ))}
                </select>
                <div>{field.description}</div>
            </div>
        ));
    else if (field.role === "radio")
        fieldStructure = (
            <div style={{ gridColumn: `span ${field.space}` }}>
                <div>{`${field.field_name.replace(/_/g, " ").toUpperCase()}`}</div>
                <div>
                    {field.values.split(",").map((value, indx3) => (
                        <div key={indx3}>
                            <input
                                type="radio"
                                id={`${field.field_name}_${indx3}`}
                                name={field.field_name.replace(/ /g, "_").toLowerCase()}
                                value={value}
                                onChange={(e) => func(e, "split")}
                            />
                            <label htmlFor={`${field.field_name}_${indx3}`}>{value}</label>
                        </div>
                    ))}
                </div>
                <div>{field.description}</div>
            </div>
        );
    else if (field.role === "checkbox") {
        fieldStructure = (
            <div style={{ gridColumn: `span ${field.space}` }}>
                <div>{`${field.field_name.replace(/_/g, " ").toUpperCase()}`}</div>
                <div>
                    {field.values.split(",").map((value, ind) => (
                        <div key={ind}>
                            <input
                                type="checkbox"
                                id={`${field.field_name}_${ind}`}
                                name={field.field_name.replace(/ /g, "_").toLowerCase()}
                                value={value}
                                onChange={(e) => func(e, "split")}
                            />
                            <label htmlFor={`${field.field_name}_${ind}`}>{value}</label>
                        </div>
                    ))}
                </div>
                <div>{field.description}</div>
            </div>
        );
    } else if (field.role === "upload-file")
        fieldStructure = (
            <div style={{ gridColumn: `span ${field.space}` }}>
                <div>{field.field_name.replace(/_/g, " ").toUpperCase()}</div>
                <input
                    type="file"
                    name={field.field_name.replace(/ /g, "_").toLowerCase()}
                    placeholder={field.field_name.replace(/_/g, " ").toUpperCase()}
                    onChange={func}
                    style={{ ...styles.fieldStyle, width: "100%", marginTop: "5px" }}
                />
                <div>{field.description}</div>
            </div>
        );
    else
        fieldStructure = (
            <>
                <input
                    type="text"
                    name={field.field_name.replace(/ /g, "_").toLowerCase()}
                    placeholder={field.field_name.replace(/_/g, " ").toUpperCase()}
                    onChange={func}
                    style={{ width: "100%", marginTop: "5px" }}
                />
                <div>{field.description}</div>
            </>
        );
    return fieldStructure;
};

FormFieldStructure.propTypes = {
    field: PropTypes.object,
    func: PropTypes.func
};
export function DataEntry() {
    const { id } = useParams();
    // const theme = useTheme();
    const dispatch = useDispatch();
    const { selectedDataset } = useSelector((state) => state.userLogin);
    const { rawDataSources } = useSelector((state) => state.dataCollection);

    const [form, setForm] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [formid, setFormid] = useState(0);
    // eslint-disable-next-line no-unused-vars
    const [customData, setCustomData] = useState([]);
    const [formData, setFormData] = useState({});
    // eslint-disable-next-line no-unused-vars
    const [columns, setColumns] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [rows, setRows] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [isLoading, setLoading] = useState(true);
    // eslint-disable-next-line no-unused-vars
    const [value, setValue] = useState(0);

    useEffect(() => {
        setLoading(false);
    }, []);

    const settingUpFormData = (formFields) => {
        const data = {};
        JSON.parse(formFields).map((field) => {
            data[field.field_name.replace(/ /g, "_").toLowerCase()] = "";
            return "";
        });
        setFormData(data);
    };

    const loadForms = async () => {
        try {
            const res = await api.get(getCustomFormsByFormId(id));
            setForm(res.data.result);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadForms();
    }, [rawDataSources]);

    useEffect(() => {
        const loadCustomFormData = async () => {
            try {
                const res = await api.get(getCustomFormDataByFormId(id, selectedDataset.productclientdatasetsid));
                const customFormData = res.data.result;
                setCustomData(customFormData);
                const formFields = res.data.result.formfields;
                /*eslint-disable*/
                if (formFields) {
                    setColumns(
                        customFormData.length > 0
                            ? JSON.parse(formFields).map((item) => ({
                                  name: item.field_name,
                                  label: item.field_name.replace(/ /g, "_").toUpperCase(),
                                  options: {
                                      filter: true,
                                      sort: true,
                                      wrap: true
                                  }
                              }))
                            : null
                    );
                    /*eslint-enable*/
                    settingUpFormData(formFields);
                    setRows(customFormData.length > 0 ? customFormData.map((item) => Object.values(JSON.parse(item.data))) : null);
                }
            } catch (err) {
                console.error(err);
            }
        };
        loadCustomFormData();
    }, []);

    // const handleFormSwitch = (formid, formFields) => {
    //     setFormid(formid);
    //     const formFieldsDict = JSON.parse(formFields).reduce((dict, field) => {
    //         dict[field.name] = "";
    //         return dict;
    //     }, {});
    //     setFormData(formFieldsDict);
    // };

    // const handleChange = (event, newValue) => {
    //     setFormid(event.target.formId);
    //     setValue(newValue);
    // };

    const handleFormDataChange = (e, type) => {
        const data = formData;
        if (type === "split") {
            data[e.target.name] = `${data[e.target.name]},${e.target.value}`;
        } else {
            data[e.target.name] = e.target.value;
        }
        setFormData(data);
    };

    const onFormSubmit = (e) => {
        e.preventDefault();
        axios
            .post(postCustomFormData, { formid, data: JSON.stringify(formData) })
            .then(() => {
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
            })
            .catch((err) => console.log(err));
    };

    const deleteForm = () => {
        axios.delete(`${dltCustomFormDataByFormId(id)}`).then(() => loadForms());
    };

    const styles = {
        grid: {
            display: "grid",
            gridTemplateColumns: "auto auto auto auto auto auto auto auto auto auto auto auto",
            columnGap: "10px",
            rowGap: "25px"
        }
    };

    return (
        <>
            <MainCard>
                <div style={{ marginBottom: "20px", textAlign: "right" }}>
                    <IconButton aria-label="delete" onClick={() => deleteForm(formid)} style={{ forntSize: "12px" }}>
                        <Delete />
                    </IconButton>
                </div>
                <form onSubmit={onFormSubmit}>
                    <div style={styles.grid}>
                        {JSON.parse(form.formfields).map((field, indx5) => (
                            <FormFieldStructure key={indx5} field={field} func={handleFormDataChange} />
                        ))}
                    </div>
                    <Button type="submit" variant="contained" style={{ marginTop: "10px" }}>
                        SUBMIT
                    </Button>
                </form>
            </MainCard>
            {/* <>
                <Tabs
                    value={value}
                    variant="scrollable"
                    onChange={handleChange}
                    textColor="secondary"
                    indicatorColor="secondary"
                    sx={{
                        mb: 3,
                        '& a': {
                            minHeight: 'auto',
                            minWidth: 10,
                            py: 1.5,
                            px: 1,
                            mr: 2.2,
                            color: theme.palette.grey[600],
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center'
                        },
                        '& a.Mui-selected': {
                            color: theme.palette.primary.main
                        },
                        '& a > svg': {
                            mb: '0px !important',
                            mr: 1.1
                        }
                    }}
                >
                    {forms.map((item, ind) => (
                        <Tab
                            component={Link}
                            to="#"
                            icon={<PersonOutlineTwoToneIcon sx={{ fontSize: '1.3rem' }} />}
                            label={item.formtitle}
                            formId={item.formid}
                            onClick={() => handleFormSwitch(item.formid, item.formfields)}
                            {...a11yProps(ind)}
                        />
                    ))}
                </Tabs>
                {forms.map((item, ind) => (
                    <TabPanel value={value} index={ind}>
                        <MainCard>
                            <div style={{ marginBottom: '20px', textAlign: 'right' }}>
                                <IconButton aria-label="delete" onClick={() => deleteForm(formid)} style={{ forntSize: '12px' }}>
                                    <Delete />
                                </IconButton>
                            </div>
                            <form onSubmit={onFormSubmit}>
                                <div style={styles.grid}>
                                    {JSON.parse(item.formfields).map((field) => (
                                        <FormFieldStructure field={field} func={handleFormDataChange} />
                                    ))}
                                </div>
                                <Button type="submit" variant="contained" style={{ marginTop: '10px' }}>
                                    SUBMIT
                                </Button>
                            </form>
                        </MainCard>
                        {rows && columns ? (
                            <>
                                <MUIDataTable
                                    style={{ marginTop: '20px' }}
                                    options={{ viewColumns: true, print: true, filter: false, download: true }}
                                    columns={columns}
                                    data={rows}
                                />
                            </>
                        ) : (
                            <></>
                        )}
                    </TabPanel>
                ))}
            </> */}
        </>
    );
}

export default DataEntry;
