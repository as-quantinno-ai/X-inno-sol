// material-ui
import { Grid, FormControl, InputLabel, MenuItem, Select, Skeleton, useTheme, Box } from "@mui/material";

// third-party

import React, { useState, useEffect } from "react";
import { getDataSourcesByCatalogsId, getDataLakePipelineLayersByDatasetidandTableid } from "views/api-configuration/default";
// project imports
import DataSourceListCard from "./DatasourceList";
import { gridSpacing } from "store/constant";
import { useDispatch, useSelector } from "store";
import JSONLogo from "assets/images/dataSource/Json.png";
import DYNAMODB from "assets/images/dataSource/dynamoDB.png";
import MYSQLLogo from "assets/images/dataSource/mySql.png";
import AVROLogo from "assets/images/dataSource/avro.png";
import PGSQLLogo from "assets/images/dataSource/pgsql.png";
import LakeDataTable from "./LakeDataTable";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import api from "views/api-configuration/api";
import { getStage } from "constants/generic";
import { getLakehouseDataDomain } from "store/slices/tables-user-selected-val";
import PerfectScrollbar from "react-perfect-scrollbar";
import CSVLogo from "assets/images/dataSource/CSV.png";
import S3Logo from "assets/images/dataSource/s3.png";
import localFsLogo from "assets/images/dataSource/localFs.png";
// ==============================|| KANBAN - BOARD ||============================== //

const LakeHouse = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const { rawDataSources } = useSelector((state) => state.dataCollection);
    const { lakehouseDataDomain } = useSelector((state) => state.selectedvalue);

    const [datapipelinelayers, setDatapipelinelayers] = useState(null);
    const [selectedDatasourceIds, setSelectedDatasourceIds] = useState([]);

    useEffect(() => {
        if (lakehouseDataDomain === "" && rawDataSources) {
            dispatch(getLakehouseDataDomain(`${rawDataSources[0]?.productclientdatasetsid}-${rawDataSources[0]?.tableid}`));
        }
    }, []);

    useEffect(() => {
        if (lakehouseDataDomain) {
            const datasetid = Number(lakehouseDataDomain?.slice(0, lakehouseDataDomain.toString().search("-")));
            const tableid = Number(lakehouseDataDomain?.slice(lakehouseDataDomain.toString().search("-") + 1, lakehouseDataDomain.length));
            api.get(`${getDataSourcesByCatalogsId(tableid)}`)
                .then(() => {
                    api.get(getDataLakePipelineLayersByDatasetidandTableid(datasetid, tableid))
                        .then((res) => {
                            setDatapipelinelayers(res.data.result);
                            setSelectedDatasourceIds([]);
                        })
                        .catch((err) => console.log(err));
                })
                .catch((err) => console.log(err));
        }
    }, [lakehouseDataDomain]);

    const handleSelectedDataSource = (datasourceId, datapipelinelayer, datapipelinelayerid, sourceFormat, sourceType) => {
        const selectedItem = { id: datasourceId, layer: datapipelinelayer, datapipelinelayerid, sourceFormat, sourceType };
        const newSelectedIds = [...selectedDatasourceIds];
        const existingItemIndex = newSelectedIds.findIndex((item) => item.id === datasourceId);

        if (existingItemIndex > -1) {
            newSelectedIds.splice(existingItemIndex, 1);
        } else {
            newSelectedIds.push(selectedItem);
        }

        setSelectedDatasourceIds(newSelectedIds);
    };
    const DataSourceChangeHandler = (event) => {
        const value = event.target.value;

        dispatch(getLakehouseDataDomain(value));
    };
    const logos = {
        S3: S3Logo,
        LOCALFS: localFsLogo,
        JSON: JSONLogo,
        DBMS: DYNAMODB,
        CSV: CSVLogo,
        MYSQL: MYSQLLogo,
        AVRO: AVROLogo,
        PGSQL: PGSQLLogo
        // Add more logos as needed
    };

    const renderLogo = (value) => {
        const LogoComponent = logos[value];
        return LogoComponent ? <img src={LogoComponent} alt={`${value} Logo`} width="20px" height="20px" /> : <span>{value}</span>;
    };

    const formTitle = (id, tableName) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            {getStage(id.layer)}

            {tableName && (
                <>
                    <ArrowRightIcon
                        fontSize="large"
                        sx={{
                            width: 30,
                            height: 30,
                            verticalAlign: "middle",
                            color: theme.palette.primary.main
                        }}
                    />
                    <span>{tableName}</span>
                </>
            )}

            {id?.id && (
                <>
                    <ArrowRightIcon
                        fontSize="large"
                        sx={{
                            width: 30,
                            height: 30,
                            verticalAlign: "middle",
                            color: theme.palette.primary.main
                        }}
                    />
                    {id?.id}
                </>
            )}
            {id?.sourceType && (
                <>
                    <span style={{ margin: "0px 5px" }}>-</span>
                    {renderLogo(id?.sourceType)}
                </>
            )}
            {id?.sourceFormat && (
                <>
                    <span style={{ margin: "0px 5px" }}>-</span>
                    {renderLogo(id.sourceFormat)}
                </>
            )}
        </Box>
    );

    return (
        <>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <FormControl
                        sx={{ m: 1, minWidth: 120 }}
                        style={{
                            display: "block",
                            width: "100%",
                            marginTop: "0px",
                            paddingLeft: "0px",
                            marginLeft: "0px"
                        }}
                    >
                        <InputLabel id="data-source-select">Select Data Domain</InputLabel>
                        <Select
                            labelId="data-source-select"
                            id="data-source"
                            name="age"
                            fullWidth
                            defaultValue={lakehouseDataDomain}
                            value={lakehouseDataDomain}
                            onChange={DataSourceChangeHandler}
                            label="Select Data Source"
                        >
                            {rawDataSources?.map((menuItem, index) => {
                                let tag = <></>;
                                if (MenuItem) {
                                    tag = (
                                        <MenuItem key={index} value={`${menuItem?.productclientdatasetsid}-${menuItem?.tableid}`}>
                                            {menuItem.tablename}
                                        </MenuItem>
                                    );
                                }
                                return tag;
                            })}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} lg={9.5}>
                    <PerfectScrollbar style={{ height: "calc(100vh - 170px)" }}>
                        <Grid item xs={12}>
                            {selectedDatasourceIds.length > 0 ? (
                                <div>
                                    {selectedDatasourceIds.map((id) => {
                                        const tableName = rawDataSources.find(
                                            (item) =>
                                                item?.productclientdatasetsid ===
                                                    Number(lakehouseDataDomain?.slice(0, lakehouseDataDomain.toString().search("-"))) &&
                                                item.tableid ===
                                                    Number(
                                                        lakehouseDataDomain?.slice(
                                                            lakehouseDataDomain.toString().search("-") + 1,
                                                            lakehouseDataDomain.length
                                                        )
                                                    )
                                        )?.tablename;

                                        return (
                                            <LakeDataTable
                                                key={id.id}
                                                formTitle={formTitle(id, tableName)}
                                                type="feature"
                                                dashDatasetId={Number(
                                                    lakehouseDataDomain?.slice(0, lakehouseDataDomain.toString().search("-"))
                                                )}
                                                dashTableId={Number(
                                                    lakehouseDataDomain?.slice(
                                                        lakehouseDataDomain.toString().search("-") + 1,
                                                        lakehouseDataDomain.length
                                                    )
                                                )}
                                                id={id.datapipelinelayerid}
                                                deltaLakeLayer={id.layer}
                                                datasource={id.layer === "PRE_BRONZE" ? `${id.id}` : 0}
                                            />
                                        );
                                    })}
                                </div>
                            ) : (
                                <Skeleton variant="rectangular" height={200} />
                            )}
                        </Grid>
                    </PerfectScrollbar>
                </Grid>
                <Grid item xs={2} sm={2} md={2} lg={2.5} sx={{ height: "calc(100vh - 170px)" }}>
                    {datapipelinelayers ? (
                        <DataSourceListCard
                            title="Data Lakes"
                            data={datapipelinelayers}
                            handleSelectedDataSource={handleSelectedDataSource}
                            selectedDatasourceIds={selectedDatasourceIds}
                        />
                    ) : (
                        <Skeleton variant="rectangular" height={200} />
                    )}
                </Grid>
            </Grid>
        </>
    );
};

export default LakeHouse;
