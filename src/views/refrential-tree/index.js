import React, { useEffect, useState } from "react";
import { getRefrentialMetadata } from "views/api-configuration/default";
// import { useDispatch, useSelector } from "store";
import { useSelector } from "store";

// material-ui
import { Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
// third-party
import { Tree } from "react-organizational-chart";
import DataCard from "./DataCard";
import Card from "./Card";
// project imports
import MainCard from "ui-component/cards/MainCard";
import api from "views/api-configuration/api";

// ==============================|| ORGANIZATION CHARTS ||============================== //

const OrgChartPage = () => {
    const theme = useTheme();
    const { selectedDataset } = useSelector((state) => state.userLogin);
    const [data, setData] = useState();

    const [dsid, setDsid] = useState(null);
    const [taid, setTaid] = useState(null);
    const [name, setName] = useState(null);

    const changeCatalog = (e) => {
        setDsid(e.target.value.productclientdatasetsid);
        setTaid(e.target.value.tableid);
        setName(e.target.value.tablename);
    };
    useEffect(() => {
        api.get(getRefrentialMetadata(dsid, taid))
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.error("Error fetching referential metadata:", error);
            });
    }, [selectedDataset, taid]);

    return (
        <Grid container rowSpacing={2} justifyContent="center">
            <Grid item md={12} lg={12} xs={12}>
                <Grid container spacing={2}>
                    <Grid item md={12} lg={12} xs={12}>
                        <MainCard title="Refrential Tree" sx={{ overflow: "auto" }}>
                            <Tree
                                lineWidth="1px"
                                lineColor={theme.palette.secondary.main}
                                lineBorderRadius="10px"
                                label={
                                    <>
                                        <DataCard
                                            onChange={changeCatalog}
                                            name={name}
                                            //   linkedin={data[0].linkedin}
                                            //   meet={data[0].meet}
                                            //   skype={data[0].skype}
                                            root
                                        />
                                    </>
                                }
                            >
                                {data && <Card items={data?.result} />}
                            </Tree>
                        </MainCard>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default OrgChartPage;
