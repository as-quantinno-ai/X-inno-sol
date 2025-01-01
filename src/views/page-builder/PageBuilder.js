import React, { useState, useEffect, useContext } from "react";
import { Grid, TextField, Button, Checkbox, Tooltip, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { gridSpacing } from "store/constant";
import MainCard from "views/new-app/components/basic/cards/MainCard";
import { createCustomDashboardScreen, createCustomDashboardComponentLayout } from "views/api-configuration/default";
import { useDispatch, useSelector } from "store";
import SubCard from "ui-component/cards/SubCard";
import { openSnackbar } from "store/slices/snackbar";
import { ConfigContext } from "../../contexts/ConfigContext";
import { baseApi } from "store/slices/initial-data";
import api from "views/api-configuration/api";
import IconListDropdown from "./IconListDropdown";
import PropTypes from "prop-types";
// ================================|| UI TABS - COLOR ||================================ //

function submitScreenRerquest(productclientdatasetsid, screenorder, screenrows, screentitle, components, dispatch, mode, icon) {
    const data = {
        createDateTime: "2023-03-13T09:29:19.445Z",
        productclientdatasetsid,
        noofcols: 12,
        screenid: 0,
        mode,
        screenorder,
        screenrows: JSON.stringify(screenrows[0]),
        screentitle,
        style: JSON.stringify({ icon })
    };

    api.post(createCustomDashboardScreen, data)
        .then((res) => {
            components.map((eachCompoenentLayout) => {
                const eachCompoenentLayoutData = {
                    layoutid: 0,
                    height: "",
                    screenid: res.data.result.screenid,
                    content: "[]",
                    styling: "[]",
                    position: JSON.stringify(eachCompoenentLayout),
                    datetime: "2023-03-13T11:00:27.888+0000"
                };
                api.post(createCustomDashboardComponentLayout, eachCompoenentLayoutData).then().catch();
                return "";
            });
            dispatch(
                openSnackbar({
                    open: true,
                    message: "Screen Created Successfully",
                    variant: "alert",
                    alert: {
                        color: "success"
                    },
                    close: false
                })
            );
            // dispatch(setScreens(selectedDataset.productclientdatasetsid));
            dispatch(baseApi());
        })
        // eslint-disable-next-line no-unused-vars
        .catch((err) =>
            dispatch(
                openSnackbar({
                    open: true,
                    message: "Error Creating Screen",
                    variant: "alert",
                    alert: {
                        color: "error"
                    },
                    close: false
                })
            )
        );
}

function CreateComponentArray(size) {
    const array = [];
    for (let i = 1; i <= size; i += 1) {
        array.push({ num: i, height: `${200}px` });
    }
    return array;
}
function GridGenerator({ dimensions, gridMode, handleComponentBoxChecked, handleSelectRow }) {
    // eslint-disable-next-line no-unused-vars
    const [cellWidth, setCellWidth] = useState(80);
    const [checkboxState, setCheckboxState] = useState({});

    useEffect(() => {
        const handleResize = () => setCellWidth(80);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // const handleBoxChecked = (e) => {
    //     handleComponentBoxChecked(e.target.value);
    // };

    const handleBoxChecked = (e) => {
        const [row, cell] = e.target.value.split(",").map((val) => parseInt(val, 10));
        setCheckboxState((prevState) => ({
            ...prevState,
            [`${row}x${cell}`]: e.target.checked
        }));
        handleComponentBoxChecked(e.target.value);
    };

    const handleRowChecked = (e) => {
        handleSelectRow(e.target.value);
    };

    return (
        <table style={{ width: "100%" }}>
            <thead>
                <tr>
                    <th
                        style={{
                            // width: '900px',
                            height: "60px",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "2px",
                            borderRadius: "3px",
                            background: "#eceff1"
                        }}
                        colSpan={1}
                    >
                        Select Tiles For Card and Add to Component
                    </th>
                    <th
                        style={{
                            // width: 80,
                            height: "60px",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "2px",
                            borderRadius: "3px",
                            background: "#eceff1"
                        }}
                        colSpan={12}
                    >
                        Row Height
                    </th>
                    <th style={{ border: "none" }} />
                </tr>
            </thead>
            <tbody>
                {dimensions[0].map((row) => (
                    <React.Fragment key={`row-fragment-${row.num}`}>
                        <tr key={`row-${row.num}`}>
                            {dimensions[1].map((cell) => {
                                const key = `${row.num}x${cell.num}`;
                                return (
                                    <td
                                        key={key}
                                        style={{
                                            width: 66,
                                            height: `${row.height}`,
                                            display: "inline-flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            fontSize: "12px",
                                            // border: '1px dashed black',
                                            margin: "2px",
                                            borderRadius: "3px",
                                            background: "#eceff1"
                                        }}
                                        // position={`${row.num}x${cell.num}`}
                                    >
                                        <label
                                            htmlFor={`${row.num}x${cell.num}`}
                                            style={{
                                                display: "flex",
                                                width: "100%",
                                                height: "100%",
                                                justifyContent: "center",
                                                alignItems: "center"
                                            }}
                                        >
                                            {/* <div style={{ width: '24px', textAlign: 'right' }}>
                                            {row.num}X{cell.num}
                                        </div> */}
                                            {gridMode ? (
                                                <Checkbox
                                                    onChange={handleBoxChecked}
                                                    id={`${row.num}x${cell.num}`}
                                                    value={[row.num, cell.num]}
                                                    checked={checkboxState[key] || false}
                                                />
                                            ) : (
                                                <></>
                                            )}
                                        </label>
                                    </td>
                                );
                            })}
                            <td>
                                <input type="radio" id="html" name="fav_language" value={row.num} onChange={handleRowChecked} />
                            </td>
                        </tr>
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    );
}

GridGenerator.propTypes = {
    dimensions: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)),
    gridMode: PropTypes.bool,
    handleComponentBoxChecked: PropTypes.func,
    handleSelectRow: PropTypes.func
};
export function PageBuilder() {
    const { selectedDataset } = useSelector((state) => state.userLogin);
    // const { screens } = useSelector((state) => state.globe);
    const [rowNum, setRowNum] = useState(null);
    const [screenName, setScreenName] = useState("");
    const [componentBox, setComponentBox] = useState([]);
    const [previewComponentBox, setPreviewComponentBox] = useState([]);
    const [components, setComponents] = useState([]);
    const [numOfRows, setNoOfRows] = useState(1);
    const [showScreen, setShowScreen] = useState(false);
    const initialGridDimensions = [CreateComponentArray(numOfRows), CreateComponentArray(12)];
    const [gridDimensions, setGridDimensions] = useState(initialGridDimensions);
    const [rowHeight, setRowHeight] = useState(200);
    const dispatch = useDispatch();
    const configContext = useContext(ConfigContext);
    const { presetColor } = configContext;
    // eslint-disable-next-line no-unused-vars
    const [currentColor, setCurrentColor] = useState(presetColor);
    useEffect(() => {
        setCurrentColor(presetColor);
    }, [presetColor]);

    // const handleRowHeight = (e) => {
    //     setRowHeight(e.target.value);
    // };
    const [mode, setMode] = useState("");

    const handleMode = (event) => {
        setMode(event.target.value);
    };
    const addGridRow = () => {
        const newNumOfRows = numOfRows + 1;
        setNoOfRows(newNumOfRows);
        const newGridDimensions = [CreateComponentArray(newNumOfRows), CreateComponentArray(12)];
        setGridDimensions(newGridDimensions);
    };

    const [gridMode, setGridMode] = useState(false);

    const handleComponentBoxChecked = (val) => {
        // const newComponentBox = val.split(',').map((item) => Number(item));

        if (showScreen) {
            setPreviewComponentBox([...previewComponentBox, val.split(",").map((item) => Number(item))].sort((a, b) => a[0] - b[0]));
        } else {
            setComponentBox([...componentBox, val.split(",").map((item) => Number(item))].sort((a, b) => a[0] - b[0]));
        }
    };

    const handleComponentAdd = () => {
        if (componentBox.length === 0) {
            return;
        }

        setComponents([...components, [componentBox[0], componentBox[componentBox.length - 1]]]);
        setComponentBox([]);
    };

    const handleSelectRow = (rowNum) => {
        setRowNum(rowNum);
        setRowHeight("40px");
    };

    const handleRowSize = (e, rowNum) => {
        const newHeight = `${e.target.value}px`;

        setRowHeight(newHeight);
        if (rowNum) {
            setGridDimensions([
                gridDimensions[0].map((item) => {
                    if (item.num === Number(rowNum)) {
                        item.height = newHeight;
                        return item;
                    }
                    return item;
                }),
                gridDimensions[1]
            ]);
        }
    };

    const handleScreenName = (e) => {
        const value = e.target.value;
        setScreenName(value);
    };

    const gridStyles = {
        tableLayout: {
            top: "26.7%",
            width: "59%",
            position: "absolute"
        },
        formLayout: {
            width: "22%",
            position: "absolute",
            left: "76%",
            right: "10%"
        }
    };
    const handleScreenPreview = () => {
        setShowScreen(!showScreen);
    };
    const handleReset = () => {
        setComponentBox([]);
        setComponents([]);
    };
    const [selectedIcon, setSelectedIcon] = useState("");
    const handleIconChange = (event) => {
        setSelectedIcon(event.target.value);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        submitScreenRerquest(
            selectedDataset.productclientdatasetsid,
            1,
            gridDimensions,
            screenName,
            components,
            dispatch,
            selectedDataset,
            mode,
            selectedIcon
        );
    };

    return (
        <>
            {selectedDataset ? (
                <>
                    <Grid container spacing={2}>
                        <Grid item xs={8} lg={9}>
                            <SubCard title="Custom Dashboard Customized Screen" content={false} style={{ margin: 0, padding: "16px" }}>
                                {!showScreen && (
                                    <GridGenerator
                                        key="index"
                                        dimensions={gridDimensions}
                                        rowHeight={rowHeight}
                                        gridMode={gridMode}
                                        handleComponentBoxChecked={handleComponentBoxChecked}
                                        handleSelectRow={handleSelectRow}
                                        selectedComponents={showScreen ? previewComponentBox : componentBox}
                                    />
                                )}

                                {/* {window.innerWidth / 12} */}
                            </SubCard>
                        </Grid>
                        <Grid item xs={6} lg={6} style={{ position: "fixed", right: "20px", width: "300px" }}>
                            <SubCard title="Custom Cards For Custom Dashboard">
                                <form onSubmit={handleSubmit}>
                                    <Grid container direction="column" spacing={2}>
                                        <Grid item>
                                            <IconListDropdown
                                                handleIconChange={handleIconChange}
                                                selectedIcon={selectedIcon}
                                                size="small"
                                                type="screen"
                                            />
                                        </Grid>

                                        <Grid item>
                                            <InputLabel>Screen Name</InputLabel>
                                            <TextField
                                                id="screenName"
                                                label="Screen Name"
                                                variant="outlined"
                                                fullWidth
                                                onChange={(e) => handleScreenName(e)}
                                                inputProps={{ min: 20 }}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <InputLabel>Add Row Height </InputLabel>
                                            <TextField
                                                id="outlined-basic"
                                                label="Row Height"
                                                variant="outlined"
                                                fullWidth
                                                type="number"
                                                onChange={(e) => handleRowSize(e, rowNum)}
                                                inputProps={{ min: 20 }}
                                            />
                                        </Grid>
                                        {/* MODE: DETAILS, MAIN */}
                                        <Grid item>
                                            <FormControl fullWidth>
                                                <InputLabel>Select Mode </InputLabel>
                                                <Select
                                                    labelId="select-mode"
                                                    id="select-mode"
                                                    value={mode}
                                                    label="Mode"
                                                    onChange={handleMode}
                                                >
                                                    <MenuItem value="DETAILS">Details</MenuItem>
                                                    <MenuItem value="MAIN">Main</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item>
                                            <Tooltip title="Create new row below this chart">
                                                <Button
                                                    variant="contained"
                                                    sx={{
                                                        color: "primary"
                                                    }}
                                                    fullWidth
                                                    onClick={addGridRow}
                                                >
                                                    Add New Row
                                                </Button>
                                            </Tooltip>
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                variant="contained"
                                                color={gridMode ? "secondary" : "primary"}
                                                fullWidth
                                                onClick={() => setGridMode(!gridMode)}
                                            >
                                                {gridMode ? "Exit Card Selection" : "Select Cards"}
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                disabled={componentBox.length === 0}
                                                onClick={handleComponentAdd}
                                            >
                                                Add Component
                                            </Button>
                                        </Grid>
                                    </Grid>

                                    <Grid container direction="column" spacing={2} sx={{ paddingTop: 2 }}>
                                        <Grid item>
                                            <Button
                                                variant="contained"
                                                color={showScreen ? "secondary" : "primary"}
                                                fullWidth
                                                onClick={() => {
                                                    handleScreenPreview();
                                                }}
                                            >
                                                {showScreen ? "Exit Screen Preview" : "Screen Preview"}
                                            </Button>
                                        </Grid>
                                        <Grid container spacing={2} sx={{ p: 2 }}>
                                            <Grid item>
                                                <Button variant="contained" type="submit" color="success">
                                                    Create Screen
                                                </Button>
                                            </Grid>
                                            <Grid item>
                                                <Button variant="contained" color="error" onClick={handleReset}>
                                                    Reset
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </form>
                            </SubCard>
                        </Grid>
                    </Grid>
                    {showScreen ? (
                        <div style={{ ...gridStyles.tableLayout, paddingTop: "0px", background: "#ffffff61" }}>
                            {gridDimensions[0].map((rowInd) => (
                                <Grid
                                    key={`row-${rowInd.num}`}
                                    container
                                    spacing={gridSpacing}
                                    style={{ height: rowInd.height, marginTop: "2px" }}
                                >
                                    {components
                                        .filter((item) => item[0][0] === rowInd.num)
                                        .map((item, index) => (
                                            <Grid
                                                key={`component-${rowInd.num}-${index}`}
                                                item
                                                xs={12}
                                                sm={12}
                                                md={12}
                                                // lg={item[0][1] !== 1 ? item[1][1] - (item[0][1] - 1) : item[1][1]}
                                                lg={item[1][1] - (item[0][1] - 1)}
                                                style={{
                                                    // background: 'green',
                                                    color: "white",
                                                    borderRight: "2px solid white"
                                                }}
                                            >
                                                <MainCard style={{ height: "100%" }}>
                                                    COL {item[0][1]} | {item[1][1]} === ROW {item[0][0]} | {item[1][0]}
                                                </MainCard>
                                            </Grid>
                                        ))}
                                </Grid>
                            ))}
                        </div>
                    ) : (
                        <></>
                    )}
                </>
            ) : (
                <></>
            )}
        </>
    );
}

export default PageBuilder;
