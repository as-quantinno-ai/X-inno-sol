import MUIDataTable from "mui-datatables";
import PropTypes from "prop-types";
import React from "react";
import { useFetch } from "react-async";

import { loadFileDataUrl, GetJWT } from "views/api-configuration/default";

function DataTable({ data, height }) {
    /*eslint-disable*/
    const columns =
        data.length > 0
            ? Object.keys(data[0]).map((item) => ({
                  name: item,
                  label: item.replace(/ /g, "_").toUpperCase(),
                  options: {
                      filter: true,
                      sort: true,
                      wrap: true
                  }
              }))
            : null;
    /*eslint-enable*/
    return (
        <>
            <MUIDataTable
                data={data}
                columns={columns}
                options={{
                    tableBodyHeight: height,
                    selectableRows: "none",
                    selectableRowsVisibleOnly: false,
                    download: false,
                    filter: false, // remove the filter icon
                    print: false, // remove the print icon
                    search: false, // remove the search icon
                    viewColumns: false, // remove the view columns icon
                    responsive: false // remove the responsive icon
                }}
            />
        </>
    );
}

DataTable.propTypes = {
    data: PropTypes.array,
    height: PropTypes.number
};
const AsyncDataTable = ({ location, height }) => {
    const { data, error } = useFetch(`${loadFileDataUrl}${location}`, {
        headers: { accept: "application/json", Authorization: `Bearer ${GetJWT()}` }
    });
    if (error) return error.message;
    if (data) {
        return <>{data.result ? <DataTable data={data.result} height={height} /> : <></>}</>;
    }
    return null;
};

AsyncDataTable.propTypes = {
    location: PropTypes.string,
    height: PropTypes.number
};
export default AsyncDataTable;
