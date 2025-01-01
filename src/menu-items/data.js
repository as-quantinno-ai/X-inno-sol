// third-party
// import { FormattedMessage } from "react-intl";

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
    IconTransform,
    IconAnalyze,
    IconFileDatabase,
    IconBrandMeta,
    IconBinaryTree,
    IconChartHistogram
} from "@tabler/icons";

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
    IconTransform,
    IconAnalyze,
    IconFileDatabase,
    IconBrandMeta,
    IconBinaryTree,
    IconChartHistogram
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
    id: "data",
    title: "Data Analysis",
    type: "group",
    children: [
        {
            id: "data-collect",
            title: "Data Ingestion",
            type: "item",
            icon: icons.IconFileImport,
            url: "/data-ingestion",
            perms: "DATA_VIEW",
            roles: ["SUPER_ADMIN", "TENANT_ADMIN", "USER@RS"]
        },
        // {
        //     id: 'raw-data',
        //     title: 'Raw Data Discovery',
        //     type: 'item',
        //     icon: icons.IconChartDonut2,
        //     url: '/raw-data-discovery',
        //     perms: 'DATA_VIEW',
        //     roles: ['SUPER_ADMIN', 'TENANT_ADMIN', 'USER@RS']
        // },
        // {
        //     id: 'feature-data',
        //     title: 'Feature Data Discovery',
        //     type: 'item',
        //     icon: icons.IconChartBubble,
        //     url: '/feature-data-discovery',
        //     perms: 'DATA_VIEW',
        //     roles: ['SUPER_ADMIN', 'TENANT_ADMIN', 'USER@RS']
        // },
        {
            id: "Data-Curation",
            title: "Data Curation",
            type: "item",
            icon: icons.IconTransform,
            url: "/data-curation",
            perms: "DATA_VIEW",
            roles: ["SUPER_ADMIN", "TENANT_ADMIN", "USER@RS"]
        },
        {
            id: "lakehouse",
            title: "Lake House",
            type: "item",
            icon: icons.IconChartBubble,
            url: "/lake-house",
            perms: "DATA_VIEW",
            roles: ["SUPER_ADMIN", "TENANT_ADMIN", "USER@RS"]
        },
        {
            id: "datadiscovery",
            title: "Data Discovery",
            type: "item",
            icon: icons.IconAnalyze,
            url: "/data-discovery",
            perms: "CATALOGS_SIDEBAR_VIEW",
            roles: ["SUPER_ADMIN", "TENANT_ADMIN", "USER@RS"]
        },
        {
            id: "meta-data",
            title: "Metadata Manager",
            type: "item",
            icon: icons.IconFileDatabase,
            url: "/metadata-manager",
            perms: "CATALOGS_SIDEBAR_VIEW",
            roles: ["SUPER_ADMIN", "TENANT_ADMIN", "USER@RS"]
        },
        {
            id: "dataquality",
            title: "Data Quality",
            type: "item",
            icon: icons.IconChartBubble,
            url: "/data-quality",
            perms: "CATALOGS_SIDEBAR_VIEW",
            roles: ["SUPER_ADMIN", "TENANT_ADMIN", "USER@RS"]
        }
    ]
};

export default pages;
