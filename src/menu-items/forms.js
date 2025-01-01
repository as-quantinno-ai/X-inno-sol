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
    id: "forms",
    title: "Forms",
    type: "group",
    children: [
        {
            id: "tf",
            title: "Form Builder",
            type: "item",
            icon: icons.IconShape,
            url: "/form-builder",
            perms: "FORM_CREATE",
            roles: ["SUPER_ADMIN", "TENANT_ADMIN", "USER@RS"]
        }
    ]
};

export default pages;
