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
            id: "pb",
            title: "Dashboard Builder",
            type: "item",
            icon: icons.IconWreckingBall,
            url: "/build-dashboard",
            perms: "FORM_VIEW",
            roles: ["SUPER_ADMIN", "TENANT_ADMIN", "USER@TR", "USER@APP"]
        }
    ]
};

export default pages;
