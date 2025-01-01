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
    id: "form",
    title: "Forms",
    type: "group",
    children: [
        {
            id: "de",
            title: "Data Entry",
            type: "custom-form-items",
            icon: icons.IconNote,
            url: "/data-entry",
            perms: "FORM_VIEW",
            roles: ["SUPER_ADMIN", "TENANT_ADMIN", "USER@RS", "USER@APP"]
        }
    ]
};

export default pages;
