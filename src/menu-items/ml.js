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
    id: "ml",
    title: "Machine Learning",
    type: "group",
    children: [
        {
            id: "ml",
            title: "Machine Learning",
            type: "item",
            icon: icons.IconChartInfographic,
            url: "/machine-learning",
            perms: "MACHINE_LEARNING_VIEW",
            roles: ["SUPER_ADMIN", "USER_AT_TENANT_ADMIN", "USER_AT_TENANT_RES"]
        }
    ]
};

export default pages;
