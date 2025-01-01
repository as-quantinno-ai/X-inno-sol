// import { getJobs, GetAccessToken } from 'views/api-configuration/default';
// import { createSlice } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { dispatch } from '../index';

// const initialState = {
//     jobList: null
// };

// const slice = createSlice({
//     name: 'jobs',
//     initialState,
//     reducers: {
//         // Testing Reducer
//         hasRequest(state, action) {
//             console.log('hasRequest');
//             console.log(state.f1);
//             state.f1 += 1;
//         },

//         // Reducer to control jobs data
//         updateJobsSuccess(state, action) {
//             state.jobList = action.payload;
//         }
//     }
// });

// // Async calls from server
// export function updateJobs(userroledatasetid) {
//     return async () => {
//         try {
//             const response = await axios.get(`${getJobs}${userroledatasetid}`, { headers: GetAccessToken() });
//             dispatch(slice.actions.updateJobsSuccess(response.data.result));
//         } catch (error) {
//             console.log(error);
//             // dispatch(slice.actions.hasError(error));
//         }
//     };
// }

// export default slice.reducer;
