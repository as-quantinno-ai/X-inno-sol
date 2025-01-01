import {
    Typography,
    Table,
    Paper,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Box,
    Chip,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from "@mui/material";
import SubCard from "ui-component/cards/SubCard";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "store";
import { useSelector } from "react-redux";
import MUIDataTable from "mui-datatables";
import DataSourceForm from "./DataSourceForm";
import FormArea from "../FormArea";
import { GetAccessToken, getCatalogButtons, metadataList, GetJWT, getFormattedDatetime } from "views/api-configuration/default";
import DataCollectionForm from "./DataCollectionForm";
import ButtonsForm from "./ButtonsForm";
import EventForm from "./EventForm";
import UniqueContraintsForm from "./UniqueContraintsForm";
import RefrentialMetaDataForm from "./RefrentialMetaDataForm";
import UpdateDataTypesForm from "./UpdateDataTypesForm";
import SortingParamsForm from "./SortingParamsForm";
import CatalogDumpForm from "./CatalogDumpForm";
import { useTheme } from "@mui/material/styles";
import { getConfigurations, getSchema, setConfigurations, getDbmsConfig, gets3config } from "store/slices/datasource-configuration";
import DialogArea from "../DialogArea";
import DeleteDataCollectionRecord from "./DeleteDataCollectionRecord";
import api from "views/api-configuration/api";
// import { THEME_MODE } from "constants/generic";
import { IconChevronDown, IconChevronUp } from "@tabler/icons";
import PropTypes from "prop-types";
// eslint-disable-next-line react/prop-types
const ExpandableRowTable = ({ title, data, columns }) => {
    const [expandedRow, setExpandedRow] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [dataSources, setDataSources] = useState([]);
    const [actionBtns, setActionBtns] = useState([]);
    const [uniqueHeader, setUniqueHeader] = useState([]);
    const [expanded, setExpanded] = useState([]);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { getconfigData } = useSelector((state) => state.datasourceconfiguration);
    // eslint-disable-next-line no-unused-vars
    const [submitted, setSubmitted] = useState(false);
    const theme = useTheme();
    const attributeNames = uniqueHeader.length > 0 ? uniqueHeader.map((item) => item.attributeName) : null;
    const uniqueId = uniqueHeader.length > 0 ? uniqueHeader.map((item) => item.uniqueIdentifier) : null;
    const relationParam = uniqueHeader.length > 0 ? uniqueHeader.map((item) => item.referenceParams) : null;
    const sortingParam = uniqueHeader.length > 0 ? uniqueHeader.map((item) => item.sortingParams) : null;
    const attributeType = uniqueHeader.length > 0 ? uniqueHeader.map((item) => item.attributeType) : null;

    const handleNavigate = (datasourceid, catalogsid, datasetid, tableid) => {
        const selectedConfiguration = getconfigData.find((config) => config.datasourceid === datasourceid);
        if (selectedConfiguration?.sourcetype === "DBMS") {
            dispatch(getDbmsConfig(datasourceid));
        } else if (selectedConfiguration?.sourcetype === "S3") {
            dispatch(gets3config(datasourceid));
        }
        if (selectedConfiguration) {
            dispatch(setConfigurations(selectedConfiguration));
            navigate(`/datasource-configuration/${catalogsid}/${tableid}/${datasourceid}`);
            dispatch(getSchema(datasourceid));
        } else {
            console.warn(`No configuration found for datasourceid ${datasourceid}`);
        }
    };

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded((prevExpanded) => (isExpanded ? [...prevExpanded, panel] : prevExpanded.filter((p) => p !== panel)));
    };

    const openAll = () => {
        setExpanded(["datasources", "action-buttons", "unique", "relations", "data-types", "sorting"]);
    };

    const closeAll = () => {
        setExpanded([]);
    };
    const options = {
        selectableRows: "none",
        selectableRowsVisibleOnly: false,
        expandableRows: true,
        expandableRowsHeader: false,

        customToolbar: () => (
            <>
                <FormArea form={<DataCollectionForm setSubmitted={setSubmitted} />} btnTitle="Add New Catalog" />
            </>
        ),

        renderExpandableRow: (rowData, rowMeta) => {
            let component = <></>;
            if (rowMeta.dataIndex === expandedRow) {
                component = (
                    <>
                        <tr>
                            <td style={{ padding: "20px 30px" }} colSpan={14}>
                                <Box>
                                    <Button variant="contained" color="primary" onClick={openAll} sx={{ width: "90px" }}>
                                        Open All
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={closeAll}
                                        width="200px"
                                        sx={{ width: "90px", marginLeft: "10px" }}
                                    >
                                        Close All
                                    </Button>
                                </Box>
                            </td>
                        </tr>

                        <tr key={rowMeta.dataIndex}>
                            <td style={{ paddingLeft: "15px", paddingRight: "15px" }} colSpan={14}>
                                <Accordion expanded={expanded.includes("datasources")} onChange={handleAccordionChange("datasources")}>
                                    <AccordionSummary aria-controls="datasources-content" id="datasources-header">
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            {expanded.includes("datasources") ? <IconChevronUp /> : <IconChevronDown />}
                                            <Typography sx={{ fontWeight: 600, fontSize: "16px", ml: 1 }}>Datasources</Typography>
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <TableContainer component={Paper} style={{ boxShadow: "1px 2px 10px solid gray" }}>
                                            <SubCard
                                                sx={{
                                                    backgroundColor:
                                                        theme.palette.mode === "dark"
                                                            ? theme.palette.dark.main
                                                            : theme.palette.primary.light
                                                }}
                                            >
                                                <Table style={{ margin: "5px", minWidth: "100%", width: "100%" }} aria-label="simple table">
                                                    <TableHead>
                                                        <TableRow key="datasourceHeader">
                                                            <TableCell>Action</TableCell>
                                                            <TableCell>Datasource Id</TableCell>
                                                            <TableCell>Table Id</TableCell>
                                                            <TableCell>Source Type</TableCell>
                                                            <TableCell>Format</TableCell>
                                                            <TableCell>Status</TableCell>
                                                            <TableCell>Create Date Time</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {getconfigData &&
                                                            getconfigData.map((item, index) => (
                                                                <TableRow key={`${item.name}-${index}`}>
                                                                    <TableCell component="th" scope="row">
                                                                        <Button
                                                                            variant="outlined"
                                                                            color="primary"
                                                                            sx={{ mr: 1 }}
                                                                            onClick={() =>
                                                                                handleNavigate(
                                                                                    item.datasourceid,
                                                                                    item.catalogsid,
                                                                                    item.productclientdatasetsid,
                                                                                    item.tableid,
                                                                                    item.tablename,
                                                                                    item.selectedOption
                                                                                )
                                                                            }
                                                                        >
                                                                            View Details
                                                                        </Button>
                                                                        <DialogArea
                                                                            form={
                                                                                <DeleteDataCollectionRecord
                                                                                    datasourceId={item.datasourceid}
                                                                                    catalogsid={item.catalogsid}
                                                                                    type="datasource"
                                                                                />
                                                                            }
                                                                            actionType="delete"
                                                                            btnTitle="Delete"
                                                                            variant="outlined"
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell component="th" scope="row">
                                                                        {item.datasourceid}
                                                                    </TableCell>
                                                                    <TableCell>{item.tableid}</TableCell>
                                                                    <TableCell component="th" scope="row">
                                                                        {item.sourcetype}
                                                                    </TableCell>
                                                                    <TableCell component="th" scope="row">
                                                                        {item.format}
                                                                    </TableCell>
                                                                    <TableCell component="th" scope="row">
                                                                        {item.loadstatus}
                                                                    </TableCell>
                                                                    <TableCell>{getFormattedDatetime(item.createdatetime)}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                    </TableBody>
                                                </Table>
                                            </SubCard>
                                        </TableContainer>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion
                                    expanded={expanded.includes("action-buttons")}
                                    onChange={handleAccordionChange("action-buttons")}
                                >
                                    <AccordionSummary aria-controls="action-buttons-content" id="action-buttons-header">
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            {expanded.includes("action-buttons") ? <IconChevronUp /> : <IconChevronDown />}
                                            <Typography sx={{ fontWeight: 600, fontSize: "16px", ml: 1 }}>
                                                Action Buttons and Events
                                            </Typography>
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <TableContainer component={Paper} style={{ boxShadow: "1px 2px 10px solid gray" }}>
                                            <SubCard
                                                sx={{
                                                    backgroundColor:
                                                        theme.palette.mode === "dark"
                                                            ? theme.palette.dark.main
                                                            : theme.palette.primary.light
                                                }}
                                            >
                                                <Table style={{ margin: "5px", minWidth: "100%", width: "90%" }} aria-label="simple table">
                                                    <TableHead>
                                                        <TableRow key="buttonHeader">
                                                            <TableCell style={{ padding: "4px" }} align="left">
                                                                Button Name
                                                            </TableCell>
                                                            <TableCell style={{ padding: "4px" }} align="left">
                                                                Button Type
                                                            </TableCell>
                                                            <TableCell style={{ padding: "4px" }} align="left">
                                                                Event
                                                            </TableCell>
                                                            <TableCell style={{ padding: "4px" }} align="left">
                                                                Event Type
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {actionBtns.length > 0 || actionBtns ? (
                                                            actionBtns.map((item, index) => (
                                                                <TableRow key={`${item.name}-${index}`}>
                                                                    <TableCell style={{ padding: "4px" }} component="th" scope="row">
                                                                        {item.button.buttonName}
                                                                    </TableCell>
                                                                    <TableCell style={{ padding: "4px" }} align="left">
                                                                        {item.button.buttonType}
                                                                    </TableCell>
                                                                    <TableCell style={{ padding: "4px" }} align="left">
                                                                        {item.event ? (
                                                                            <>{item.event.eventApi}</>
                                                                        ) : (
                                                                            <FormArea
                                                                                form={<EventForm buttonId={item.button.buttonId} />}
                                                                                btnTitle=""
                                                                                icon="true"
                                                                            />
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell style={{ padding: "4px" }} align="left">
                                                                        {item.event?.eventType}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        ) : (
                                                            <TableRow key="noRecord">
                                                                <TableCell colSpan={4} style={{ padding: "8px" }}>
                                                                    <Typography sx={{ alignContent: "center", alignItems: "center" }}>
                                                                        No record Available
                                                                    </Typography>
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </SubCard>
                                        </TableContainer>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion expanded={expanded.includes("unique")} onChange={handleAccordionChange("unique")}>
                                    <AccordionSummary aria-controls="unique-content" id="unique-header">
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            {expanded.includes("unique") ? <IconChevronUp /> : <IconChevronDown />}
                                            <Typography sx={{ fontWeight: 600, fontSize: "16px", ml: 1 }}>Unique</Typography>
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <TableContainer component={Paper} style={{ boxShadow: "1px 2px 10px solid gray" }}>
                                            <SubCard
                                                sx={{
                                                    backgroundColor:
                                                        theme.palette.mode === "dark"
                                                            ? theme.palette.dark.main
                                                            : theme.palette.primary.light
                                                }}
                                            >
                                                {uniqueId &&
                                                    attributeNames?.map((attributeName, index) => (
                                                        <React.Fragment key={index}>
                                                            {uniqueId[index] === null ? (
                                                                <Chip
                                                                    label={attributeName}
                                                                    variant="outlined"
                                                                    sx={{
                                                                        color: "grey",
                                                                        borderColor: "grey"
                                                                    }}
                                                                    style={{ margin: "4px", marginRight: "2px", borderRadius: "5px" }}
                                                                />
                                                            ) : (
                                                                <Chip
                                                                    label={attributeName}
                                                                    variant="filled"
                                                                    color="secondary"
                                                                    style={{ margin: "4px", marginRight: "2px", borderRadius: "5px" }}
                                                                />
                                                            )}
                                                        </React.Fragment>
                                                    ))}
                                            </SubCard>
                                        </TableContainer>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion expanded={expanded.includes("relations")} onChange={handleAccordionChange("relations")}>
                                    <AccordionSummary aria-controls="relations-content" id="relations-header">
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            {expanded.includes("relations") ? <IconChevronUp /> : <IconChevronDown />}
                                            <Typography sx={{ fontWeight: 600, fontSize: "16px", ml: 1 }}>Relations</Typography>
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <TableContainer component={Paper} style={{ boxShadow: "1px 2px 10px solid gray" }}>
                                            <SubCard
                                                sx={{
                                                    backgroundColor:
                                                        theme.palette.mode === "dark"
                                                            ? theme.palette.dark.main
                                                            : theme.palette.primary.light
                                                }}
                                            >
                                                {relationParam &&
                                                    attributeNames?.map((attributeName, index) => (
                                                        <React.Fragment key={index}>
                                                            {relationParam[index] === null ? (
                                                                <Chip
                                                                    label={attributeName}
                                                                    variant="outlined"
                                                                    sx={{
                                                                        color: "grey",
                                                                        borderColor: "grey"
                                                                    }}
                                                                    style={{ margin: "4px", marginRight: "2px", borderRadius: "5px" }}
                                                                />
                                                            ) : (
                                                                <Chip
                                                                    label={attributeName}
                                                                    variant="filled"
                                                                    color="secondary"
                                                                    style={{ margin: "4px", marginRight: "2px", borderRadius: "5px" }}
                                                                />
                                                            )}
                                                        </React.Fragment>
                                                    ))}
                                            </SubCard>
                                        </TableContainer>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion expanded={expanded.includes("data-types")} onChange={handleAccordionChange("data-types")}>
                                    <AccordionSummary aria-controls="data-types-content" id="data-types-header">
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            {expanded.includes("data-types") ? <IconChevronUp /> : <IconChevronDown />}
                                            <Typography sx={{ fontWeight: 600, fontSize: "16px", ml: 1 }}>Data Types</Typography>
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <TableContainer component={Paper} style={{ boxShadow: "1px 2px 10px solid gray" }}>
                                            <SubCard
                                                sx={{
                                                    backgroundColor:
                                                        theme.palette.mode === "dark"
                                                            ? theme.palette.dark.main
                                                            : theme.palette.primary.light
                                                }}
                                            >
                                                {attributeType &&
                                                    attributeNames?.map((attributeName, index) => (
                                                        <React.Fragment key={`${attributeName}-${index}`}>
                                                            <Chip
                                                                label={`${attributeName} | ${attributeType[index]}`}
                                                                variant="outlined"
                                                                sx={{
                                                                    color: "grey",
                                                                    borderColor: "grey"
                                                                }}
                                                                style={{ margin: "4px", marginRight: "2px", borderRadius: "5px" }}
                                                            />
                                                        </React.Fragment>
                                                    ))}
                                            </SubCard>
                                        </TableContainer>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion expanded={expanded.includes("sorting")} onChange={handleAccordionChange("sorting")}>
                                    <AccordionSummary aria-controls="sorting-content" id="sorting-header">
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            {expanded.includes("sorting") ? <IconChevronUp /> : <IconChevronDown />}
                                            <Typography sx={{ fontWeight: 600, fontSize: "16px", ml: 1 }}>Sorting</Typography>
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <TableContainer component={Paper} style={{ boxShadow: "1px 2px 10px solid gray" }}>
                                            <SubCard
                                                sx={{
                                                    backgroundColor:
                                                        theme.palette.mode === "dark"
                                                            ? theme.palette.dark.main
                                                            : theme.palette.primary.light
                                                }}
                                            >
                                                {sortingParam &&
                                                    attributeNames?.map((attributeName, index) => (
                                                        <React.Fragment key={attributeName}>
                                                            {sortingParam[index] === null ? (
                                                                <Chip
                                                                    label={attributeName}
                                                                    sx={{
                                                                        color: "grey",
                                                                        borderColor: "grey"
                                                                    }}
                                                                    variant="outlined"
                                                                    style={{ margin: "4px", marginRight: "2px", borderRadius: "5px" }}
                                                                />
                                                            ) : (
                                                                <Chip
                                                                    label={attributeName}
                                                                    variant="filled"
                                                                    color="secondary"
                                                                    style={{ margin: "4px", marginRight: "2px", borderRadius: "5px" }}
                                                                />
                                                            )}
                                                        </React.Fragment>
                                                    ))}
                                            </SubCard>
                                        </TableContainer>
                                    </AccordionDetails>
                                </Accordion>
                            </td>
                        </tr>
                    </>
                );
            }
            return component;
        },
        onRowExpansionChange: (currentRowsExpanded) => {
            const rowIndex = currentRowsExpanded[0];
            if (rowIndex !== undefined && rowIndex !== expandedRow) {
                setExpandedRow(rowIndex.index);
                dispatch(getConfigurations(data[rowIndex.index].catalogsid));
                setExpanded([]);

                api.get(`${getCatalogButtons(data[rowIndex.index].productclientdatasetsid, data[rowIndex.index].tableid)}`, {
                    headers: GetAccessToken()
                })
                    .then((res) => setActionBtns(res.data.result))
                    .then();
                api.get(`${metadataList}/${data[rowIndex.index].productclientdatasetsid}/${data[rowIndex.index].tableid}`, {
                    headers: { accept: "application/json", Authorization: `Bearer ${GetJWT()}` }
                })
                    .then((res) => setUniqueHeader(res.data.result))
                    .catch();
            } else {
                setExpandedRow(null);
                setExpanded([]);
                setDataSources([]);
                setActionBtns([]);
                setUniqueHeader([]);
            }
        }
    };

    return <MUIDataTable title={title} data={data} columns={columns} options={options} />;
};

const DataCollectionTable = () => {
    // const theme = useTheme();
    const { rawDataSources } = useSelector((state) => state.dataCollection);

    /*eslint-disable*/
    const columns =
        rawDataSources?.length > 0
            ? [
                  {
                      name: "actions",
                      label: "DATASOURCES",
                      options: {
                          filter: false,
                          sort: false,
                          empty: true,
                          customBodyRenderLite: (dataIndex) => {
                              const rowData = rawDataSources[dataIndex];
                              return (
                                  <FormArea
                                      form={
                                          <DataSourceForm
                                              datasetid={rowData.productclientdatasetsid}
                                              tableid={rowData.tableid}
                                              catalogsid={rowData.catalogsid}
                                              tablename={rowData.tablename}
                                          />
                                      }
                                      btnTitle=""
                                      icon="true"
                                  />
                              );
                          }
                      }
                  },
                  {
                      name: "buttons",
                      label: "BUTTONS",
                      options: {
                          filter: false,
                          sort: false,
                          empty: true,
                          customBodyRenderLite: (dataIndex) => {
                              const rowData = rawDataSources[dataIndex];
                              return (
                                  <FormArea
                                      form={
                                          <ButtonsForm
                                              datasetid={rowData.productclientdatasetsid}
                                              tableid={rowData.tableid}
                                              tablename={rowData.tablename}
                                          />
                                      }
                                      btnTitle=""
                                      icon="true"
                                  />
                              );
                          }
                      }
                  },
                  {
                      name: "unique-constraints",
                      label: "UNIQUE",
                      options: {
                          filter: false,
                          sort: false,
                          empty: true,
                          customBodyRenderLite: (dataIndex) => {
                              const rowData = rawDataSources[dataIndex];
                              return (
                                  <FormArea
                                      form={
                                          <UniqueContraintsForm
                                              datasetid={rowData.productclientdatasetsid}
                                              tableid={rowData.tableid}
                                              tablename={rowData.tablename}
                                          />
                                      }
                                      btnTitle=""
                                      icon="true"
                                  />
                              );
                          }
                      }
                  },
                  {
                      name: "relation",
                      label: "RELATIONS",
                      options: {
                          filter: false,
                          sort: false,
                          empty: true,
                          customBodyRenderLite: (dataIndex) => {
                              const rowData = rawDataSources[dataIndex];
                              return (
                                  <FormArea
                                      form={
                                          <RefrentialMetaDataForm
                                              datasetid={rowData.productclientdatasetsid}
                                              tableid={rowData.tableid}
                                              catalogsid={rowData.catalogsid}
                                              tablename={rowData.tablename}
                                          />
                                      }
                                      btnTitle=""
                                      icon="true"
                                  />
                              );
                          }
                      }
                  },
                  {
                      name: "data-types",
                      label: "DATA TYPES",
                      options: {
                          filter: false,
                          sort: false,
                          empty: true,
                          width: "50px",
                          customBodyRenderLite: (dataIndex) => {
                              const rowData = rawDataSources[dataIndex];
                              return (
                                  <FormArea
                                      form={
                                          <UpdateDataTypesForm
                                              datasetid={rowData.productclientdatasetsid}
                                              tableid={rowData.tableid}
                                              tablename={rowData.tablename}
                                          />
                                      }
                                      btnTitle=""
                                      icon="true"
                                  />
                              );
                          }
                      }
                  },
                  {
                      name: "sorting",
                      label: "SORTING",
                      options: {
                          filter: false,
                          sort: false,
                          empty: true,
                          customBodyRenderLite: (dataIndex) => {
                              const rowData = rawDataSources[dataIndex];
                              return (
                                  <FormArea
                                      form={
                                          <SortingParamsForm
                                              datasetid={rowData.productclientdatasetsid}
                                              tableid={rowData.tableid}
                                              tablename={rowData.tablename}
                                          />
                                      }
                                      btnTitle=""
                                      icon="true"
                                  />
                              );
                          }
                      }
                  },
                  {
                      name: "dump",
                      label: "DUMP",
                      options: {
                          filter: false,
                          sort: false,
                          empty: true,
                          customBodyRenderLite: (dataIndex) => {
                              const rowData = rawDataSources[dataIndex];
                              return (
                                  <FormArea
                                      form={
                                          <CatalogDumpForm
                                              datasetid={rowData.productclientdatasetsid}
                                              tableid={rowData.tableid}
                                              catalogsid={rowData.catalogsid}
                                              tablename={rowData.tablename}
                                          />
                                      }
                                      btnTitle=""
                                      icon="true"
                                  />
                              );
                          }
                      }
                  },
                  ...Object.keys(rawDataSources[0])
                      .filter(
                          (filteredItem) =>
                              filteredItem !== "productclientdatasetsid" &&
                              filteredItem !== "tableid" &&
                              filteredItem !== "partialloadedlocation" &&
                              filteredItem !== "createdatetime" &&
                              filteredItem !== "catalogsid" &&
                              filteredItem !== "viewname"
                      )
                      .map((item) => ({
                          name: item,
                          label: item
                              .replace(/table(type|name|loadstatus)/g, "table $1")
                              .replace(/loadstatus/g, "load status")
                              .toUpperCase(),
                          width: 300,
                          options: {
                              filter: true,
                              sort: false,
                              wrap: true
                          }
                      })),
                  {
                      name: "actions",
                      label: "Actions",
                      options: {
                          filter: false,
                          sort: false,
                          empty: true,
                          customBodyRenderLite: (dataIndex) => {
                              const rowData = rawDataSources[dataIndex];
                              return (
                                  <DialogArea
                                      form={
                                          <DeleteDataCollectionRecord
                                              datasetid={rowData.productclientdatasetsid}
                                              tableid={rowData.tableid}
                                              catalogsid={rowData.catalogsid}
                                              type="catalog"
                                          />
                                      }
                                      actionType="delete"
                                      btnTitle="Delete"
                                      variant="outlined"
                                      icon
                                  />
                              );
                          }
                      }
                  }
              ]
            : null;
    /*eslint-enable*/
    return (
        <>
            {rawDataSources?.length ? (
                <ExpandableRowTable
                    title={
                        <Typography sx={{ fontSize: "1rem", fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>Available Catalogs</Typography>
                    }
                    data={rawDataSources?.map((item) => ({
                        ...item,
                        updatedatetime: () => {
                            const date = new Date(item.updatedatetime);
                            const formattedDate = date.toISOString().split("T")[0];
                            const formattedTime = date.toISOString().split("T")[1].split(".")[0];
                            return `${formattedDate} ${formattedTime}`;
                        }
                    }))}
                    columns={columns}
                />
            ) : (
                <FormArea form={<DataCollectionForm />} btnTitle="Add New Catalog" />
            )}
            {!rawDataSources && <div>Loading....</div>}
        </>
    );
};

ExpandableRowTable.PropTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    data: PropTypes.array,
    columns: PropTypes.array
};
export default DataCollectionTable;
