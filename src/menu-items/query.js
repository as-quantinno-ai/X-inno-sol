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
    IconMessages
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
    IconMessages
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
    id: "queries",
    title: "Data Queries",
    type: "group",
    children: [
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
