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
    IconBrandMeta,
    IconBinaryTree
    // IconArrowBadgeRight
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
    IconBrandMeta,
    IconBinaryTree
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
    id: "pages",
    type: "group",
    children: [
        {
            id: "Data-Ingestion",
            title: "Data Ingestion",
            type: "item",
            icon: icons.IconFileImport,
            url: "/data-Ingestion"
        },
        {
            id: "Data-Curation",
            title: "Data Curation",
            type: "item",
            icon: icons.IconTransform,
            url: "/data-curation"
        },
        // {
        //     id: 'raw-data',
        //     title: 'Raw Data Discovery',
        //     type: 'item',
        //     icon: icons.IconChartDonut2,
        //     url: '/raw-data-discovery'
        // },
        // {
        //     id: 'feature-data',
        //     title: 'Feature Data Discovery',
        //     type: 'item',
        //     icon: icons.IconChartBubble,
        //     url: '/feature-data-discovery'
        // },
        {
            id: "meta-data",
            title: "Standard Metadata",
            type: "item",
            icon: icons.IconFileImport,
            url: "/IconBrandMeta"
        },
        {
            id: "ml",
            title: "Machine Learning",
            type: "item",
            icon: icons.IconChartInfographic,
            url: "/machine-learning"
        },
        {
            id: "pb",
            title: "Dashboard Builder",
            type: "item",
            icon: icons.IconWreckingBall,
            url: "/build-dashboard"
        },
        {
            id: "tf",
            title: "Form Builder",
            type: "item",
            icon: icons.IconShape,
            url: "/form-builder"
        },
        {
            id: "de",
            title: "Data Entry",
            type: "item",
            icon: icons.IconNote,
            url: "/data-entry"
        },
        {
            id: "mc",
            title: "Advance Visualizations",
            type: "item",
            icon: icons.IconChartInfographic,
            url: "/advance-visualizations"
        },
        {
            id: "cm",
            title: "XtremeQ",
            type: "item",
            icon: icons.IconMessages,
            url: "/XtremeQ"
        }
    ]
};

export default pages;
