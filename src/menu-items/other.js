// third-party
import { FormattedMessage } from "react-intl";
import React from "react";
// assets
import { IconBrandChrome, IconHelp, IconSitemap } from "@tabler/icons";

// constant
const icons = {
    IconBrandChrome,
    IconHelp,
    IconSitemap
};

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const other = {
    id: "sample-docs-roadmap",
    type: "group",
    children: [
        {
            id: "documentation",
            title: <FormattedMessage id="documentation" />,
            type: "item",
            url: "https://codedthemes.gitbook.io/berry/",
            icon: icons.IconHelp,
            external: true,
            target: true
        },
        {
            id: "roadmap",
            title: <FormattedMessage id="roadmap" />,
            type: "item",
            url: "https://codedthemes.gitbook.io/berry/roadmap",
            icon: icons.IconSitemap,
            external: true,
            target: true
        }
    ]
};

export default other;
