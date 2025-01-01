import PropTypes from "prop-types";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useState, useEffect } from "react";
import { Card, Divider, Grid, ListItemText, CardContent, Typography, Radio, Collapse, IconButton } from "@mui/material";
import PerfectScrollbar from "react-perfect-scrollbar";
import { getDataSourcesByCatalogsId } from "views/api-configuration/default";
import { useDispatch } from "store";
import { useSelector } from "react-redux";
import { getAllCatalogs } from "store/slices/AppDashboardRawSha";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { selectBaseData } from "store/slices/initial-data";
import api from "views/api-configuration/api";

// ==============================|| USER PROFILE / DETAILS ||============================== //

const RowaddExpand = ({ rawDataSources, index }) => {
    const [dataSources, setDataSources] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get(getDataSourcesByCatalogsId(rawDataSources[index].catalogsid));
                setDataSources(res.data.result);
            } catch (err) {
                console.log(err);
            }
        };

        if (index) {
            fetchData();
        } else {
            setDataSources([]);
        }
    }, [index, rawDataSources]);

    return (
        <>
            {dataSources.map((item) => (
                <>
                    <Grid item sx={{ pl: 8, pr: 2 }}>
                        <Radio size="small" />
                    </Grid>
                    <Grid item>
                        <ListItemText
                            secondary={
                                <Typography
                                    variant="caption"
                                    component="span"
                                    sx={{
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        display: "block"
                                    }}
                                >
                                    {item.sourcetype}
                                </Typography>
                            }
                        />
                    </Grid>
                    <Divider />
                </>
            ))}
        </>
    );
};

RowaddExpand.propTypes = {
    rawDataSources: PropTypes.array,
    index: PropTypes.number
};
const VisualTypes = [
    { desc: "Line Chart", cd: "line" },
    { desc: "Bar Chart", cd: "bar" },
    { desc: "Pie Chart", cd: "pie" },
    { desc: "Text Box", cd: "count" }
];

const ChatMenu = ({ handleSelectItem, handleChatTypeChange, catalogueFields }) => {
    // const theme = useTheme();

    const [mainMenuOpen, setMainMenuOpen] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [subMenuOpen, setSubMenuOpen] = useState(false);

    const handleMainMenuClick = () => {
        setSubMenuOpen(false);
        setMainMenuOpen(!mainMenuOpen);
    };

    // const handleSubMenuClick = (index) => {
    //     setSubMenuOpen(subMenuOpen === index ? false : index);
    // };

    const dispatch = useDispatch();
    const { rawDataSources } = useSelector((state) => state.dataCollection);
    // const { selectedDataset } = useSelector((state) => state.userLogin);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const handleSelectedItem = (e, index) => {
        setSelectedIndex(index);
        handleSelectItem(e, index);
    };
    const baseData = useSelector(selectBaseData);
    const { catalogs } = baseData;

    useEffect(() => {
        if (catalogs) {
            dispatch(getAllCatalogs(catalogs));
        }
    }, [catalogs]);
    return (
        <Card>
            <CardContent>
                <Grid container alignItems="center" spacing={0.5}>
                    <Grid item>
                        <IconButton onClick={handleMainMenuClick} size="small">
                            <MenuRoundedIcon />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <Typography variant="h5">Select Any Catalogue</Typography>
                    </Grid>
                    <Grid container direction="row" alignItems="center" justify="center" spacing={1} sx={{ p: 2 }}>
                        {catalogueFields && (
                            <PerfectScrollbar
                                style={{
                                    width: "100%",
                                    height: "calc(110vh - 440px)",
                                    overflowX: "hidden",
                                    minHeight: 200,
                                    maxHeight: 300
                                }}
                            >
                                {catalogueFields.split(",").map((item, index) => (
                                    <>
                                        <Typography key={index} variant="body1">
                                            {item.trim()}
                                        </Typography>
                                        <Divider />
                                    </>
                                ))}
                            </PerfectScrollbar>
                        )}
                    </Grid>
                </Grid>
                {rawDataSources.map((item, index) => (
                    <>
                        <Collapse in={mainMenuOpen} timeout="auto" unmountOnExit>
                            <Grid container alignItems="center" spacing={0.5}>
                                <Grid item>
                                    <Radio
                                        size="small"
                                        checked={selectedIndex === index}
                                        value={(item.tablename, item.productclientdatasetsid, item.tableid)}
                                        onChange={handleSelectedItem}
                                    />
                                </Grid>

                                <Grid item>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            fontSize: "11px",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            display: "block"
                                        }}
                                    >
                                        {item.label}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Collapse>
                    </>
                ))}
                {VisualTypes.map((item, index) => (
                    <>
                        <Collapse key={index} in={mainMenuOpen} timeout="auto" unmountOnExit>
                            <Grid container alignItems="center" spacing={0.5}>
                                <Grid item>
                                    <Radio size="small" value={item.cd} onChange={(e) => handleChatTypeChange(e)} name="chart-type" />
                                </Grid>

                                <Grid item>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            fontSize: "11px",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            display: "block"
                                        }}
                                    >
                                        {item.desc}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Collapse>
                    </>
                ))}
            </CardContent>
        </Card>
        // <Card>
        //     <CardContent sx={{ width: 370 }}>
        //         <Grid container alignItems="center" spacing={0.5}>
        //             <Grid item>
        //                 <IconButton onClick={handleMainMenuClick} size="small">
        //                     <MenuRoundedIcon />
        //                 </IconButton>
        //             </Grid>
        //             <Grid item>
        //                 <Typography variant="h5">Menu</Typography>
        //             </Grid>
        //         </Grid>
        //         {rawDataSources.map((item, index) => (
        //             <>
        //                 <Collapse in={mainMenuOpen} timeout="auto" unmountOnExit>
        //                     <Grid container alignItems="center" spacing={0.5}>
        //                         <Grid item>
        //                             <Radio size="small" checked={selectedIndex === index} onChange={() => handleSelectItem(index)} />
        //                         </Grid>
        /*eslint-disable*/
        //                         <Grid item>
        //                             <Typography
        //                                 variant="subtitle1"
        //                                 sx={{
        //                                     fontSize: '11px',
        //                                     overflow: 'hidden',
        //                                     textOverflow: 'ellipsis',
        //                                     whiteSpace: 'nowrap',
        //                                     display: 'block'
        //                                 }}
        //                             >
        //                                 {item.tablename}
        //                             </Typography>
        //                         </Grid>
        //                         <Grid item>
        //                             {subMenuOpen === index ? (
        //                                 <IconButton onClick={() => handleSubMenuClick(index)} size="small">
        //                                     <ExpandLessIcon />
        //                                 </IconButton>
        //                             ) : (
        //                                 <IconButton onClick={() => handleSubMenuClick(index)} size="small">
        //                                     <ExpandMoreIcon />
        //                                 </IconButton>
        //                             )}
        //                         </Grid>
        //                     </Grid>
        //                 </Collapse>

        //                 <Collapse in={subMenuOpen === index} timeout="auto" unmountOnExit>
        //                     <Grid container alignItems="center" sx={{ pl: 2 }} spacing={0.5}>
        //                         <RowaddExpand index={index} rawDataSources={rawDataSources} />
        //                     </Grid>
        //                 </Collapse>
        //             </>
        //         ))}
        //     </CardContent>
        // </Card>
        /*eslint-enable*/
    );
};

ChatMenu.propTypes = {
    user: PropTypes.object,
    handleChatTypeChange: PropTypes.func,
    handleSelectItem: PropTypes.func,
    catalogueFields: PropTypes.string
};

export default ChatMenu;
