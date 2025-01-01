import React from "react";
import { Grid } from "@mui/material";
import MainCard from "views/new-app/components/basic/cards/MainCard";
import TotalGrowthBarChart from "views/new-app/components/basic/TotalGrowthBarChart";
import RevenueChartCard from "views/new-app/components/basic/RevenueChartCard";
import FormArea from "views/new-app/components/FormArea";
import PublishToDashboardForm from "views/new-app/components/basic/PublishToDashboardForm";
import { useSelector } from "store";

export function Charts() {
    // const [chart, setChart] = useState(null);

    const { publishedMlModel } = useSelector((state) => state.globe);

    return (
        <>
            <Grid container>
                <Grid item xs={12} sm={12} md={8} lg={8}>
                    <MainCard>
                        <FormArea
                            form={
                                <PublishToDashboardForm
                                    functionname="ML-MODEL-COMMULATIVE-BAR"
                                    referenceid={publishedMlModel?.mlmodelRuns?.mlmodelrunsid}
                                    tableid={0}
                                    componentDisplayType="COMMULATIVE BAR CHART"
                                />
                            }
                            btnTitle="Publish"
                        />
                        <TotalGrowthBarChart isLoading={false} mlRunId={6} />
                    </MainCard>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                    <FormArea
                        form={
                            <PublishToDashboardForm
                                functionname="ML-MODEL-COMMULATIVE-PIE"
                                referenceid={41}
                                tableid={0}
                                componentDisplayType="COMMULATIVE PIE CHART"
                            />
                        }
                        btnTitle="Publish"
                    />
                    <RevenueChartCard />
                </Grid>
            </Grid>
        </>
    );
}

export default Charts;
