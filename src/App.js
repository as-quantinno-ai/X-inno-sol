import React from "react";
// routing
import Routes from "routes";

// project imports
import Locales from "ui-component/Locales";
import NavigationScroll from "layout/NavigationScroll";
import RTLLayout from "ui-component/RTLLayout";
import Snackbar from "ui-component/extended/Snackbar";
import ThemeCustomization from "themes";
import { DataSourceProvider } from "contexts/DataSourcesContext";

// auth provider
import { FirebaseProvider as AuthProvider } from "contexts/FirebaseContext";
import DashboardDataContext from "contexts/DashboardData";
import MlModelsDataContext from "contexts/MlModelsDataContext";
import { useState } from "react";
import FeatureChartsDataContext from "contexts/FeatureChartsDataContext";
import RawChartsDataContext from "contexts/RawChartsDataContext";

// ==============================|| APP ||============================== //

const dashboardDataObj = {
    mlRunId: null,
    total_no_of_rows_processed: 0,
    accuracy: null,
    f1: null,
    precision: null,
    recall: null,
    mainChartData: null,
    mainChartLabels: null,
    predictionFileData: null
};

const App = () => {
    const [dashboardData, setDashboardData] = useState(dashboardDataObj);
    const [mlModelData, setMlModelData] = useState(null);
    const [featureDataVisualList, setFeatureDataVisualList] = useState(null);
    const [rawVisualList, setRawVisualList] = useState(null);

    return (
        <ThemeCustomization>
            {/* RTL layout */}
            <DataSourceProvider>
                <DashboardDataContext.Provider value={{ dashboardData, setDashboardData }}>
                    <MlModelsDataContext.Provider value={{ mlModelData, setMlModelData }}>
                        <FeatureChartsDataContext.Provider value={{ featureDataVisualList, setFeatureDataVisualList }}>
                            <RawChartsDataContext.Provider value={{ rawVisualList, setRawVisualList }}>
                                <RTLLayout>
                                    <Locales>
                                        <NavigationScroll>
                                            <AuthProvider>
                                                <>
                                                    <Routes />
                                                    <Snackbar />
                                                </>
                                            </AuthProvider>
                                        </NavigationScroll>
                                    </Locales>
                                </RTLLayout>
                            </RawChartsDataContext.Provider>
                        </FeatureChartsDataContext.Provider>
                    </MlModelsDataContext.Provider>
                </DashboardDataContext.Provider>
            </DataSourceProvider>
        </ThemeCustomization>
    );
};

export default App;
