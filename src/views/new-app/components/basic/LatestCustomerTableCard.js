import PropTypes from "prop-types";

// material-ui
import { Typography } from "@mui/material";

import { useSelector } from "store";
import React from "react";
import MUIDataTable from "mui-datatables";
// table data
// function createData(subject, dept, date) {
//     return { subject, dept, date };
// }
// const rows = [
//     createData("Germany", "Angelina Jolly", "56.23%"),
//     createData("USA", "John Deo", "25.23%"),
//     createData("Australia", "Jenifer Vintage", "12.45%"),
//     createData("United Kingdom", "Lori Moore", "8.65%"),
//     createData("Brazil", "Allianz Dacron", "3.56%"),
//     createData("Australia", "Jenifer Vintage", "12.45%"),
//     createData("USA", "John Deo", "25.23%"),
//     createData("Australia", "Jenifer Vintage", "12.45%"),
//     createData("United Kingdom", "Lori Moore", "8.65%")
// ];

// =========================|| DASHBOARD ANALYTICS - LATEST CUSTOMERS TABLE CARD ||========================= //

// const data = [
//     { name: "Joe James", company: "Test Corp", city: "Yonkers", state: "NY" },
//     { name: "John Walsh", company: "Test Corp", city: "Hartford", state: "CT" },
//     { name: "Bob Herm", company: "Test Corp", city: "Tampa", state: "FL" },
//     { name: "James Houston", company: "Test Corp", city: "Dallas", state: "TX" }
// ];

const options = {
    filterType: "checkbox"
};

const LatestCustomerTableCard = () => {
    // const dispatch = useDispatch();
    const { predictionFileData } = useSelector((state) => state.dashboard);
    const columns = predictionFileData
        ? /*eslint-disable*/
          Object.keys(predictionFileData[0]).map((item) => ({
              name: item,
              label: item.replace(/ /g, "_").toUpperCase(),
              options: {
                  filter: true,
                  sort: true
              }
          }))
        : null;
    /*eslint-enable*/
    return (
        <>
            {predictionFileData && (
                <MUIDataTable
                    title={
                        <Typography sx={{ fontSize: "1.125rem", fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>Predictions Data</Typography>
                    }
                    data={predictionFileData}
                    columns={columns}
                    options={options}
                />
            )}
            {!predictionFileData && <div>Loading....</div>}
        </>
    );
};

LatestCustomerTableCard.propTypes = {
    title: PropTypes.string
};

export default LatestCustomerTableCard;
