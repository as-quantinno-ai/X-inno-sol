import React from "react";

// this is the equivalent to the createStore method of Redux
// https://redux.js.org/api/createstore

const DataSourceContext = React.createContext();

function DataSourceProvider(props) {
    const [DataSources, setDataSource] = React.useState([]);

    function setDataSources(arr) {
        setDataSource(arr);
    }

    return <DataSourceContext.Provider value={[DataSources, setDataSources]} {...props} />;
}
function useDataSource() {
    const context = React.useContext(DataSourceContext);
    return context;
}

// export default DataSourceContext;
export { DataSourceContext, DataSourceProvider, useDataSource };
