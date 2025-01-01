import React, { lazy } from "react";

// project imports
import AuthGuard from "utils/route-guard/AuthGuard";
import PermBasedAuthorizationHOC from "utils/route-guard/PermBasedAuthorizationHOC";
import MainLayout from "layout/MainLayout";
import Loadable from "ui-component/Loadable";
import AddPermissionForm from "views/new-app/components/basic/RoleAddPermission";
import AddAppRolePermissionForm from "views/new-app/components/basic/AppRoleAddPermission";
// import DataQualityFixation from "views/data-quality/DataQualityFixationTable";

// sample page routing
// const SamplePage = Loadable(lazy(() => import('views/sample-page')));
const NewApp = Loadable(lazy(() => import("views/new-app/pages")));
const MachineLearning = Loadable(lazy(() => import("views/new-app/pages/MachineLearning")));
const DataCollection = Loadable(lazy(() => import("views/new-app/pages/DataCollection")));
const StandardMetaData = Loadable(lazy(() => import("views/metadata-manager")));
const Chat = Loadable(lazy(() => import("views/chat")));
const ChatBots = Loadable(lazy(() => import("views/chatbots")));
const Home = Loadable(lazy(() => import("views/new-app/pages/Home")));

const PageBuilder = Loadable(lazy(() => import("views/page-builder/PageBuilder")));
const CustomDashboard = Loadable(lazy(() => import("views/page-builder/CustomDashboard")));
const DataSourceConfiguration = Loadable(lazy(() => import("views/DataSourceConfiguration")));

const CustomForm = Loadable(lazy(() => import("views/form-builder/FormBuilder")));
const TableForm = Loadable(lazy(() => import("views/table-form-builder/TableFormBuilder")));

// const DataEntry = Loadable(lazy(() => import("views/form-builder/DataEntry")));
const UpdatedDataEntry = Loadable(lazy(() => import("views/form-builder/UpdatedDataEntry")));
const Charts = Loadable(lazy(() => import("views/custom-charts/Charts")));
// const DashCharts = Loadable(lazy(() => import("views/custom-charts/DashCharts")));
const Map = Loadable(lazy(() => import("views/form-builder/GoogleMapCode")));
const GraphBuilder = Loadable(lazy(() => import("views/graph-builder/GraphBuilder")));
const MultiVariateAnalysis = Loadable(lazy(() => import("views/multi-variate-analysis")));
const RefrentialTree = Loadable(lazy(() => import("views/refrential-tree")));
const DataCuration = Loadable(lazy(() => import("views/data-curation/kanban")));
const LakeHouse = Loadable(lazy(() => import("views/lake-house")));
const DataDiscovery = Loadable(lazy(() => import("views/data-discovery")));
const DataQuality = Loadable(lazy(() => import("views/data-quality")));
const DataQualityFixationTable = Loadable(lazy(() => import("views/data-quality/DataQualityFixationTable")));

const TenantUser = Loadable(lazy(() => import("views/new-app/pages/TenantUser")));
const ApplicationUser = Loadable(lazy(() => import("views/new-app/pages/AppUser")));
const ResourceRole = Loadable(lazy(() => import("views/new-app/pages/ResourceRole")));
const ApplicationRole = Loadable(lazy(() => import("views/new-app/pages/ApplicationRole")));
const AssignAppRoles = Loadable(lazy(() => import("views/new-app/pages/AssignAppRole")));
const AssignResRoles = Loadable(lazy(() => import("views/new-app/pages/AssignResRole")));

// ==============================|| MAIN ROUTING ||============================== //

// console.log('main routes');

// const check = async () => {
//     const response = await api.get(`${getInitialData}`);
//     console.log(response, 'RESP');
//     dispatch(baseApi());
// };

// check();

const MainRoutes = {
    path: "/",
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
        // <MainLayout />
    ),
    children: [
        {
            path: "/",
            element: <Home />
        },
        {
            path: "/data-ingestion",
            element: (
                <PermBasedAuthorizationHOC perm="CATALOGS_READ">
                    <DataCollection />
                </PermBasedAuthorizationHOC>
            )
        },
        {
            path: "/da-main",
            element: <NewApp />
        },
        {
            path: "/app-user",
            element: <ApplicationUser />
        },
        {
            path: "/resource-user",
            element: <TenantUser />
        },
        {
            path: "/resource-role",
            element: <ResourceRole />
        },
        {
            path: "/add-permissions/:roleNamee/:productClientDatasetId",
            element: <AddPermissionForm />
        },
        {
            path: "/Assign-Res-roles",
            element: <AssignResRoles />
        },
        {
            path: "/application-role",
            element: <ApplicationRole />
        },
        {
            path: "/add-app-permissions/:roleNamee/:productClientDatasetId",
            element: <AddAppRolePermissionForm />
        },
        {
            path: "/Assign-App-roles",
            element: <AssignAppRoles />
        },
        {
            path: "/data-collection",
            element: (
                <PermBasedAuthorizationHOC perm="CATALOGS_READ">
                    <DataCollection />
                </PermBasedAuthorizationHOC>
            )
        },
        {
            path: "/machine-learning",
            element: (
                <PermBasedAuthorizationHOC perm="MLMODEL_READ">
                    <MachineLearning />
                </PermBasedAuthorizationHOC>
            )
        },
        // {
        //     path: '/feature-data-discovery',
        //     element: (
        //         <PermBasedAuthorizationHOC perm="CATALOGS_READ">
        //             <FeaturedDataDiscovery />
        //         </PermBasedAuthorizationHOC>
        //     )
        // },
        // {
        //     path: '/raw-data-discovery',
        //     element: (
        //         <PermBasedAuthorizationHOC perm="CATALOGS_READ">
        //             <RawDataDiscovery />
        //         </PermBasedAuthorizationHOC>
        //     )
        // },
        {
            path: "/graph-builder",
            element: (
                <PermBasedAuthorizationHOC perm="CATALOGS_READ">
                    <GraphBuilder />
                </PermBasedAuthorizationHOC>
            )
        },
        {
            path: "/multivariate-data-visualization",
            element: (
                <PermBasedAuthorizationHOC perm="CATALOGS_READ">
                    <MultiVariateAnalysis />
                </PermBasedAuthorizationHOC>
            )
        },
        {
            path: "/refrential-tree",
            element: (
                <PermBasedAuthorizationHOC perm="CATALOGS_READ">
                    <RefrentialTree />
                </PermBasedAuthorizationHOC>
            )
        },
        {
            path: "/XtremeQ",
            element: <Chat />
        },
        {
            path: "/xtreme-bots/:flowid",
            element: <ChatBots />
        },
        {
            path: "/metadata-manager",
            element: <StandardMetaData />
        },
        {
            path: "/build-dashboard",
            element: (
                <PermBasedAuthorizationHOC perm="SCREENMATRIX_CREATE">
                    <PageBuilder />
                </PermBasedAuthorizationHOC>
            )
        },
        {
            path: "/show-dashboard/:id",
            element: (
                // <PermBasedAuthorizationHOC perm="SCREENMATRIX_READ">
                <CustomDashboard />
                // </PermBasedAuthorizationHOC>
            )
        },
        {
            path: "/datasource-configuration/:id/:id/:id",
            element: (
                // <PermBasedAuthorizationHOC perm="SCREENMATRIX_READ">
                <DataSourceConfiguration />
                // </PermBasedAuthorizationHOC>
            )
        },
        {
            path: "/quality-controller/:dataset/:table/",
            element: (
                // <PermBasedAuthorizationHOC perm="SCREENMATRIX_READ">
                <DataQualityFixationTable />
                // </PermBasedAuthorizationHOC>
            )
        },
        {
            path: "/build-form",
            element: (
                <PermBasedAuthorizationHOC perm="FORMSTRUCTURE_CREATE">
                    <CustomForm />
                </PermBasedAuthorizationHOC>
            )
        },
        {
            path: "/form-builder",
            element: (
                <PermBasedAuthorizationHOC perm="FORMSTRUCTURE_CREATE">
                    <TableForm />
                </PermBasedAuthorizationHOC>
            )
        },
        {
            path: "/data-entry/:id",
            element: (
                // <PermBasedAuthorizationHOC perm="FORMSTRUCTURE_READ">
                <UpdatedDataEntry />
                // </PermBasedAuthorizationHOC>
            )
        },
        {
            path: "/advance-visualizations",
            element: (
                // <PermBasedAuthorizationHOC perm="ADV_VIZ_VIEW">
                <Charts />
                // </PermBasedAuthorizationHOC>
            )
        },
        {
            path: "/data-curation",
            element: <DataCuration />
        },
        {
            path: "/data-discovery",
            element: <DataDiscovery />
        },
        {
            path: "/data-quality",
            element: <DataQuality />
        },
        {
            path: "/lake-house",
            element: <LakeHouse />
        },
        {
            path: "/maps",
            element: <Map />
        },
        {
            path: "/details",
            element: <Map />
        }
    ]
};

export default MainRoutes;
