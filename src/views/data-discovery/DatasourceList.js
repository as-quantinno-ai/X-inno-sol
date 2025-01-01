import PropTypes from "prop-types";
import React, { useState } from "react";

// material-ui
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, Checkbox, useTheme } from "@mui/material";

// third party
import PerfectScrollbar from "react-perfect-scrollbar";

// project imports
import MainCard from "ui-component/cards/MainCard";
// assets
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ViewCompactTwoToneIcon from "@mui/icons-material/ViewCompactTwoTone";

// assets

// ===========================|| DASHBOARD ANALYTICS - TOTAL REVENUE CARD ||=========================== //

const DataSourceListCard = ({ title, data, handleSelectedDataSource, selectedDatasourceIds }) => {
    const theme = useTheme();

    const [open, setOpen] = useState(Array(data?.length)?.fill(false));

    const [checkedItems, setCheckedItems] = useState({});
    const handleDatasourceClick = (datasourceId, datapipelinelayer) => {
        handleSelectedDataSource(datasourceId, datapipelinelayer);
        setCheckedItems({
            ...checkedItems,
            [`${datasourceId}-${datapipelinelayer}`]: !checkedItems[`${datasourceId}-${datapipelinelayer}`]
        });
    };

    const handleClick = (clickedIndex, datasourcePresent, datapipelinelayer) => {
        if (datasourcePresent === null) {
            handleDatasourceClick(clickedIndex, datapipelinelayer);
        }
        setOpen((prevOpen) => {
            const newOpen = [...prevOpen];
            newOpen[clickedIndex] = !prevOpen[clickedIndex];
            return newOpen;
        });
    };

    const isClicked = (datapipelinelayerid) =>
        selectedDatasourceIds && selectedDatasourceIds?.find((item) => item.layer === datapipelinelayerid);

    return (
        <MainCard title={title} content={false}>
            <PerfectScrollbar style={{ height: 440 }}>
                {data.map((item, index) => (
                    <List key={index} component="nav" aria-labelledby="nested-list-subheader">
                        <ListItemButton onClick={() => handleClick(index, item.datasources, item.datapipelinelayer.stage)}>
                            <ListItemIcon>
                                <ViewCompactTwoToneIcon
                                    sx={{
                                        fontSize: "1.3rem",
                                        color: isClicked(item.datapipelinelayer.stage)
                                            ? theme.palette.secondary.dark
                                            : theme.palette.primary.dark
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText primary={item.datapipelinelayer.stage} />
                            {item.datasources !== null && (open[index] ? <ExpandLess /> : <ExpandMore />)}
                        </ListItemButton>
                        {item.datasources !== null &&
                            item.datasources.map((datasource, index1) => (
                                <Collapse key={index1} in={open[index]} timeout="auto" unmountOnExit>
                                    {open[index] && (
                                        <List component="div" disablePadding>
                                            <ListItemButton
                                                sx={{ pl: 4 }}
                                                onClick={() => handleDatasourceClick(datasource.datasourceid, item.datapipelinelayer.stage)}
                                            >
                                                <ListItemIcon>
                                                    <Checkbox
                                                        checked={
                                                            checkedItems[`${datasource.datasourceid}-${item.datapipelinelayer.stage}`] ||
                                                            false
                                                        }
                                                    />
                                                </ListItemIcon>
                                                <ListItemText primary={datasource.datasourceid} />
                                            </ListItemButton>
                                        </List>
                                    )}
                                </Collapse>
                            ))}
                    </List>
                ))}
            </PerfectScrollbar>
        </MainCard>
    );
};

DataSourceListCard.propTypes = {
    title: PropTypes.string,
    data: PropTypes.array,
    handleSelectedDataSource: PropTypes.func,
    selectedDatasourceIds: PropTypes.array
};

export default DataSourceListCard;
