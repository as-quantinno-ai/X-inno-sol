import PropTypes from "prop-types";

import React, { Fragment } from "react";

// third party
import { TreeNode } from "react-organizational-chart";

// project imports
import DataCard from "./DataCard";

// ==============================|| CARD ORGANIZATION CHART ||============================== //

function Card({ items }) {
    return (
        <>
            {items.map((item, id) => (
                <Fragment key={id}>
                    {item.children ? (
                        <TreeNode label={<DataCard name={item.attributeName} />}>
                            <Card items={item.children} />
                        </TreeNode>
                    ) : (
                        <TreeNode label={<DataCard name={item.attributeName} />} />
                    )}
                </Fragment>
            ))}
        </>
    );
}

Card.propTypes = {
    items: PropTypes.array
};

export default Card;
