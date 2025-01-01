import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
// const options = {
//     filterType: 'checkbox'
// };

const DataTableVisual = ({ data }) => {
    const columns = Object.keys(data[0]);
    const rows = data.map((obj) => Object.values(obj));
    // const longestForEachKey = data.reduce((acc, dict) => {
    //     Object.keys(dict).forEach((key) => {
    //         if (!acc[key] || dict[key].length > acc[key].length) {
    //             acc[key] = dict[key];
    //         }
    //     });
    //     return acc;
    // }, {});
    // const theme = useTheme();
    // const columns = Object.keys(data[0]).map((item) => ({
    //     label: item,
    //     name: item,
    //     options: {
    //         filter: false,
    //         sort: false,
    //         wrap: false,
    //         customBodyRender: (value, tableMeta, updateValue) => (
    //             <div style={{ width: longestForEachKey[`${item}`].toString().length * 16 }}>{value}</div>
    //         )
    //     }
    // }));
    // return <MUIDataTable data={data} columns={columns} options={options} />;
    return (
        <TableContainer>
            <PerfectScrollbar height="200px">
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((item, indx) => (
                                <TableCell key={indx}>{item}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody style={{ height: "200px" }}>
                        {rows.map((row, indx1) => (
                            <TableRow key={indx1}>
                                {row.map((item, indx2) => (
                                    <TableCell key={indx2}>{item}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </PerfectScrollbar>
        </TableContainer>
    );
};

DataTableVisual.propTypes = {
    data: PropTypes.array
};
export default DataTableVisual;
