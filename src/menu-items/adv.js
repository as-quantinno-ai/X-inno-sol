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
    id: "adv",
    title: "Advance Analysis",
    // caption: <FormattedMessage id="pages-caption" />,
    type: "group",
    children: [
        {
            id: "mc",
            title: "Advance Visualizations",
            type: "item",
            icon: icons.IconChartInfographic,
            url: "/advance-visualizations"
        }
    ]
};

export default pages;
