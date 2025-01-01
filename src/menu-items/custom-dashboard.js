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
    id: "dashboards",
    title: "Dashboard",
    type: "group",
    children: [
        {
            id: "cd",
            title: "Dashboard",
            type: "custom-dashboard-items",
            icon: icons.IconDeviceDesktopAnalytics,
            url: "/show-dashboard",
            perms: "DASHBOARD_VIEW",
            roles: ["SUPER_ADMIN", "TENANT_ADMIN", "USER@RS", "USER@APP"]
        }
    ]
};

export default pages;
