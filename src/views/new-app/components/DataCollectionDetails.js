// import React from 'react';
// import { Grid } from '@mui/material';
// import MainCard from '../components/basic/cards/MainCard';
// import { useTheme } from '@mui/material/styles';
// import MachineLearningModelsTable from '../components/basic/MachineLearningModelsTable';
// import { gridSpacing } from 'store/constant';
// import MUIDataTable from 'mui-datatables';
// import DynamicChart from './basic/DynamicChart';

// // =============================|| LANDING - FEATURE PAGE ||============================= //

// const options = {
//     filterType: 'checkbox',
//     responsiveScroll: {
//         maxHeight: '200px'
//     }
// };

// const DataCollectoinDetails = ({ mlmodeldata, mlmodevisualdata }) => {
//     const theme = useTheme();

//     const columns = Object.keys(mlmodeldata[0]).map((item) => ({
//         name: item,
//         label: item.replace(/ /g, '_').toUpperCase(),
//         options: {
//             filter: true,
//             sort: true
//         }
//     }));

//     return (
//         <>
//             <Grid container spacing={gridSpacing} style={{ marginTop: gridSpacing }}>
//                 <Grid item xs={8} lg={8}>
//                     <MUIDataTable data={mlmodeldata} columns={columns} options={options} />
//                 </Grid>
//                 <Grid item xs={4} lg={4}>
//                     <DynamicChart mlModelRunId={mlmodevisualdata === null ? 0 : mlmodevisualdata.mlmodelrunsid} />
//                 </Grid>
//             </Grid>
//         </>
//     );
// };

// export default DataCollectionDetails;