import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import CSVLogo from "assets/images/dataSource/CSV.png";
import PGSQLLogo from "assets/images/dataSource/pgsql.png";
import S3Logo from "assets/images/dataSource/s3.png";
import JSONLogo from "assets/images/dataSource/Json.png";
import MYSQLLogo from "assets/images/dataSource/mySql.png";
import AVROLogo from "assets/images/dataSource/avro.png";
import EXCELLogo from "assets/images/dataSource/excel.png";
import DYNAMODB from "assets/images/dataSource/dynamoDB.png";
import localFsLogo from "assets/images/dataSource/localFs.png";

// material-ui
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, Checkbox, useTheme, Box } from "@mui/material";

// third party
import PerfectScrollbar from "react-perfect-scrollbar";

// project imports
import MainCard from "ui-component/cards/MainCard";
// assets
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ViewCompactTwoToneIcon from "@mui/icons-material/ViewCompactTwoTone";

// assets

import { getStage } from "constants/generic";
// ===========================|| DASHBOARD ANALYTICS - TOTAL REVENUE CARD ||=========================== //

const DataSourceListCard = ({ title, data, handleSelectedDataSource, selectedDatasourceIds }) => {
    const theme = useTheme();

    const [open, setOpen] = useState(Array(data?.length)?.fill(false));

    const [checkedItems, setCheckedItems] = useState({});

    useEffect(() => {
        if (data && Array.isArray(data)) {
            const firstItem = data.find((item) => item.datapipelinelayer.stage === "GOLD");
            if (firstItem) {
                setCheckedItems((prev) => ({
                    ...prev,
                    [`3-${firstItem.datapipelinelayer.stage}`]: true
                }));
                handleSelectedDataSource(3, firstItem.datapipelinelayer.stage, firstItem.datapipelinelayer.datapipelinelayerid);
            }
        }
    }, [data]);

    const handleDatasourceClick = (datasourceId, datapipelinelayer, datapipelinelayerid, sourceFormat, sourceType) => {
        handleSelectedDataSource(datasourceId, datapipelinelayer, datapipelinelayerid, sourceFormat, sourceType);
        setCheckedItems({
            ...checkedItems,
            [`${datasourceId}-${datapipelinelayer}`]: !checkedItems[`${datasourceId}-${datapipelinelayer}`]
        });
    };

    const handleClick = (clickedIndex, datasourcePresent, datapipelinelayer, id) => {
        if (datasourcePresent === null) {
            handleDatasourceClick(clickedIndex, datapipelinelayer, id);
        }
        setOpen((prevOpen) => {
            const newOpen = [...prevOpen];
            newOpen[clickedIndex] = !prevOpen[clickedIndex];
            return newOpen;
        });
    };

    const isClicked = (datapipelinelayerid) =>
        selectedDatasourceIds && selectedDatasourceIds?.find((item) => item.layer === datapipelinelayerid);

    const logos = {
        S3: S3Logo,
        LOCALFS: localFsLogo,
        JSON: JSONLogo,
        DBMS: DYNAMODB,
        CSV: CSVLogo,
        MYSQL: MYSQLLogo,
        AVRO: AVROLogo,
        PGSQL: PGSQLLogo,
        EXCEL: EXCELLogo
        // Add more logos as needed
    };
    const renderLogo = (value) => {
        const LogoComponent = logos[value];
        return LogoComponent ? <img src={LogoComponent} alt={`${value} Logo`} width="20px" height="20px" /> : <span>{value}</span>;
    };

    return (
        <MainCard title={title} content={false}>
            <PerfectScrollbar style={{ height: "calc(100vh - 240px)" }}>
                {data.map((item, index) => (
                    <List key={index} component="nav" aria-labelledby="nested-list-subheader">
                        <ListItemButton
                            onClick={() =>
                                handleClick(
                                    index,
                                    item.datasources,
                                    item.datapipelinelayer.stage,
                                    item.datapipelinelayer.datapipelinelayerid
                                )
                            }
                        >
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
                            <ListItemText primary={getStage(item.datapipelinelayer.stage)} />
                            {item.datasources !== null && (open[index] ? <ExpandLess /> : <ExpandMore />)}
                        </ListItemButton>
                        {item.datasources !== null &&
                            item.datasources.map((datasource, index1) => (
                                <Collapse key={index1} in={open[index]} timeout="auto" unmountOnExit>
                                    {open[index] && (
                                        <List component="div" disablePadding>
                                            <ListItemButton
                                                sx={{ pl: 4 }}
                                                onClick={() =>
                                                    handleDatasourceClick(
                                                        datasource.datasourceid,
                                                        item.datapipelinelayer.stage,
                                                        item.datapipelinelayer.datapipelinelayer,
                                                        datasource.format,
                                                        datasource.sourcetype
                                                    )
                                                }
                                            >
                                                <ListItemIcon>
                                                    <Checkbox
                                                        checked={
                                                            checkedItems[`${datasource.datasourceid}-${item.datapipelinelayer.stage}`] ||
                                                            false
                                                        }
                                                    />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={
                                                        <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                                            <Box sx={{ minWidth: "30px", textAlign: "right" }}>
                                                                {datasource.datasourceid}
                                                            </Box>
                                                            -{renderLogo(datasource.sourcetype)}-{renderLogo(datasource.format)}
                                                        </Box>
                                                    }
                                                />
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
