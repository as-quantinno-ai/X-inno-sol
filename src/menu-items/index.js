import HomeIcon from "@mui/icons-material/Home";
// assets
import {
    IconBug,
    IconChartDonut2,
    IconChartBubble,
    IconFileImport,
    IconDeviceDesktopAnalytics,
    IconChartInfographic,
    IconNote,
    IconWreckingBall,
    IconShape,
    IconMessages,
    IconUserCircle,
    IconKey,
    IconTransform,
    IconAnalyze,
    IconFileDatabase,
    IconBinaryTree,
    IconChartHistogram,
    IconFileSearch,
    IconStack,
    IconChartBar
} from "@tabler/icons";
import AddchartIcon from "@mui/icons-material/Addchart";
// constant
const icons = {
    IconBug,
    IconChartDonut2,
    IconChartBubble,
    IconFileImport,
    IconDeviceDesktopAnalytics,
    IconChartInfographic,
    IconNote,
    IconWreckingBall,
    IconShape,
    IconMessages,
    IconUserCircle,
    IconKey,
    IconTransform,
    HomeIcon,
    IconAnalyze,
    IconFileDatabase,
    IconBinaryTree,
    IconChartHistogram,
    IconFileSearch,
    AddchartIcon,
    IconStack,
    IconChartBar
};
// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
    items: [
        {
            id: "dashboards",
            title: "Dashboard",
            type: "group",
            perms: "SCREENMATRIX_READ",
            roles: ["SUPER_ADMIN", "TENANT_ADMIN", "USER@TR", "USER@APP"],
            userApp: "USER@APP",
            children: [
                {
                    id: "cd",
                    title: "Dashboard",
                    type: "custom-dashboard-items",
                    icon: icons.IconDeviceDesktopAnalytics,
                    url: "/show-dashboard",
                    perms: "SCREENMATRIX_READ ",
                    roles: ["SUPER_ADMIN", "TENANT_ADMIN", "USER@TR", "USER@APP"]
                }
            ]
        },
        // {
        //     id: 'form',
        //     title: 'Forms',
        //     type: 'group',
        //     perms: 'FORMSTRUCTURE_READ',
        //     roles: ['SUPER_ADMIN', 'TENANT_ADMIN', 'USER@TR', 'USER@APP'],
        //     userApp: 'USER@APP',
        //     children: [
        //         {
        //             id: 'de',
        //             title: 'Data Entry',
        //             type: 'custom-form-items',
        //             icon: icons.IconNote,
        //             url: '/data-entry',
        //             perms: 'FORMSTRUCTURE_READ',
        //             roles: ['SUPER_ADMIN', 'TENANT_ADMIN', 'USER@TR', 'USER@APP']
        //         }
        //     ]
        // },
        {
            id: "queries",
            title: "Chat Bot",
            type: "group",
            perms: "LLMCHAT_SIDEBARVIEW",
            roles: ["SUPER_ADMIN", "TENANT_ADMIN", "USER@TR"],
            children: [
                {
                    id: "cm",
                    title: "XtremeQ",
                    type: "item",
                    icon: icons.IconMessages,
                    url: "/XtremeQ",
                    perms: "LLMCHAT_SIDEBARVIEW",
                    roles: ["SUPER_ADMIN", "TENANT_ADMIN"]
                },

                {
                    id: "cb",
                    title: "Chat Bot",
                    type: "custom-chat-bots",
                    icon: icons.IconMessages,
                    url: "/xtreme-bots",
                    perms: "LLMCHAT_SIDEBARVIEW",
                    roles: ["SUPER_ADMIN", "TENANT_ADMIN"]
                }
            ]
        },
        {
            id: "data",
            title: "Data Analysis",
            type: "group",
            perms: "CATALOGS_READ",
            roles: ["SUPER_ADMIN", "TENANT_ADMIN", "USER@TR"],
            children: [
                {
                    id: "data-collect",
                    title: "Data Ingestion",
                    type: "item",
                    icon: icons.IconFileImport,
                    url: "/data-ingestion",
                    perms: "CATALOGS_SIDEBARVIEW",
                    roles: ["SUPER_ADMIN", "TENANT_ADMIN", "USER@TR"]
                },
                // {
                //     id: 'raw-data',
                //     title: 'Raw Data Discovery',
                //     type: 'item',
                //     icon: icons.IconChartDonut2,
                //     url: '/raw-data-discovery',
                //     perms: 'METADATA_READ',
                //     roles: ['SUPER_ADMIN', 'TENANT_ADMIN', 'USER@TR']
                // },
                // {
                //     id: 'feature-data',
                //     title: 'Feature Data Discovery',
                //     type: 'item',
                //     icon: icons.IconChartBubble,
                //     url: '/feature-data-discovery',
                //     perms: 'METADATA_READ',
                //     roles: ['SUPER_ADMIN', 'TENANT_ADMIN', 'USER@TR']
                // },
                {
                    id: "data-discovery",
                    title: "Data Discovery",
                    type: "item",
                    icon: icons.IconAnalyze,
                    url: "/data-discovery",
                    perms: "COLUMNDATADISCOVERY_SIDEBARVIEW",
                    roles: ["SUPER_ADMIN", "TENANT_ADMIN", "USER@TR"]
                },
                {
                    id: "meta-data",
                    title: "Metadata Manager",
                    type: "item",
                    icon: icons.IconFileDatabase,
                    url: "/metadata-manager",
                    perms: "METADATA_SIDEBARVIEW",
                    roles: ["SUPER_ADMIN", "TENANT_ADMIN", "USER@TR"]
                },

                {
                    id: "Data-Curation",
                    title: "Data Curation",
                    type: "item",
                    icon: icons.IconTransform,
                    url: "/data-curation",
                    perms: "TRANSFORMERS_SIDEBARVIEW",
                    roles: ["SUPER_ADMIN", "TENANT_ADMIN", "USER@TR"]
                },
                {
                    id: "lakehouse",
                    title: "Lake House",
                    type: "item",
                    icon: icons.IconStack,
                    url: "/lake-house",
                    perms: "DATAPIPELINELAYERS_SIDEBARVIEW",
                    roles: ["SUPER_ADMIN", "TENANT_ADMIN", "USER@TR"]
                },

                {
                    id: "dataquality",
                    title: "Data Quality",
                    type: "item",
                    icon: icons.IconFileSearch,
                    url: "/data-quality",
                    perms: "DATAQUALITYMANAGER_SIDEBARVIEW",
                    roles: ["SUPER_ADMIN", "TENANT_ADMIN", "USER@TR"]
                },
                {
                    id: "multi-variate",
                    title: "Multivariate Data Visualization",
                    type: "item",
                    icon: icons.IconChartHistogram,
                    url: "/multivariate-data-visualization",
                    perms: "VISUALSMULTIVARIATE_SIDEBARVIEW",
                    roles: ["SUPER_ADMIN", "TENANT_ADMIN", "USER@TR"]
                },
                {
                    id: "refrential-tree",
                    title: "Refrential Tree",
                    type: "item",
                    icon: icons.IconBinaryTree,
                    url: "/refrential-tree",
                    perms: "METADATA_SIDEBARVIEW",
                    roles: ["SUPER_ADMIN", "TENANT_ADMIN", "USER@TR"]
                }
            ]
        },
        {
            id: "forms",
            title: "Custom Builders",
            type: "group",
            perms: ["FORMSTRUCTURE_SIDEBARVIEW", "SCREENMATRIX_SIDEBARVIEW", "VISUALSMULTIVARIATE_SIDEBARVIEW"],
            roles: ["SUPER_ADMIN", "TENANT_ADMIN", "USER@TR"],
            children: [
                {
                    id: "tf",
                    title: "Form Builder",
                    type: "item",
                    icon: icons.IconShape,
                    url: "/form-builder",
                    perms: "FORMSTRUCTURE_SIDEBARVIEW",
                    roles: ["SUPER_ADMIN", "TENANT_ADMIN", "USER@TR"]
                },
                {
                    id: "pb",
                    title: "Dashboard Builder",
                    type: "item",
                    icon: icons.IconWreckingBall,
                    url: "/build-dashboard",
                    perms: "SCREENMATRIX_SIDEBARVIEW",
                    roles: ["SUPER_ADMIN", "TENANT_ADMIN", "USER@TR"]
                },
                {
                    id: "graph-builder",
                    title: "Graph Builder",
                    type: "item",
                    icon: icons.IconChartBar,
                    url: "/graph-builder",
                    perms: "VISUALSMULTIVARIATE_SIDEBARVIEW",
                    roles: ["SUPER_ADMIN", "TENANT_ADMIN", "USER@TR"]
                }
            ]
        },
        {
            id: "adv-charts",
            title: "Advance Visualizations",
            type: "group",
            perms: "PREDICTIONSSUMMARY_SIDEBARVIEW",
            roles: ["SUPER_ADMIN", "TENANT_ADMIN", "USER@TR"],
            children: [
                {
                    id: "ac",
                    title: "Advance Visualizations",
                    type: "item",
                    icon: icons.IconShape,
                    url: "/advance-visualizations",
                    perms: "PREDICTIONSSUMMARY_SIDEBARVIEW",
                    roles: ["SUPER_ADMIN", "TENANT_ADMIN", "USER@TR"]
                }
            ]
        },
        {
            id: "ml",
            title: "Artificial Intelligence",
            type: "group",
            perms: "MLMODEL_SIDEBARVIEW",
            roles: ["SUPER_ADMIN", "TENANT_ADMIN", "USER@TR"],
            children: [
                {
                    id: "ml",
                    title: "Machine Learning",
                    type: "item",
                    icon: icons.IconChartInfographic,
                    url: "/machine-learning",
                    perms: "MLMODEL_SIDEBARVIEW",
                    roles: ["SUPER_ADMIN", "TENANT_ADMIN", "USER@TR"]
                }
            ]
        },

        {
            id: "settings",
            title: "Tenant Settings",
            type: "group",
            perms: "ROLE_PERMISSION_RESOURCE_SIDEBARVIEW",
            roles: ["SUPER_ADMIN", "TENANT_ADMIN", "USER@TR"],
            children: [
                {
                    id: "Home-screen",
                    title: "Profile",
                    type: "item",

                    icon: icons.HomeIcon,
                    url: "/"
                },
                {
                    id: "Resource-User",
                    title: "Resource User",
                    type: "item",
                    perms: "ROLE_PERMISSION_RESOURCE_SIDEBARVIEW",
                    roles: ["SUPER_ADMIN", "TENANT_ADMIN", "USER@TR"],
                    icon: icons.IconUserCircle,
                    url: "/resource-user"
                },
                {
                    id: "Resource-Role",
                    title: "Resource Role",
                    type: "item",
                    perms: "ROLE_PERMISSION_RESOURCE_SIDEBARVIEW",
                    roles: ["SUPER_ADMIN", "TENANT_ADMIN", "USER@TR"],
                    icon: icons.IconKey,
                    url: "/resource-role"
                },
                {
                    id: "AssignResRoles",
                    title: "Assign Res Roles",
                    type: "item",
                    perms: "ROLE_PERMISSION_RESOURCE_SIDEBARVIEW",
                    roles: ["SUPER_ADMIN", "TENANT_ADMIN", "USER@TR"],
                    icon: icons.IconKey,
                    url: "/assign-res-roles"
                },
                {
                    id: "Application-User",
                    title: "Application User",
                    type: "item",
                    perms: "ROLE_PERMISSION_RESOURCE_SIDEBARVIEW",
                    roles: ["SUPER_ADMIN", "TENANT_ADMIN", "USER@TR"],
                    icon: icons.IconUserCircle,
                    url: "/app-user"
                },
                {
                    id: "Application-Role",
                    title: "Application Role",
                    type: "item",
                    perms: "ROLE_PERMISSION_RESOURCE_SIDEBARVIEW",
                    roles: ["SUPER_ADMIN", "TENANT_ADMIN", "USER@TR"],
                    icon: icons.IconKey,
                    url: "/application-role"
                },
                {
                    id: "AssignAppRoles",
                    title: "Assign App Roles",
                    type: "item",
                    perms: "ROLE_PERMISSION_RESOURCE_SIDEBARVIEW",
                    roles: ["SUPER_ADMIN", "TENANT_ADMIN", "USER@TR"],
                    icon: icons.IconKey,
                    url: "/assign-app-roles"
                }
            ]
        }
    ]
};

export default menuItems;
