// import { useContext } from "react";
// import axios from "axios";
// import { getDataSourcesByCatalogsId, mlModelRunsPost, dashboardVisualList } from "./default";
import { getDataSourcesByCatalogsId } from "./default";
import api from "./api";

async function getDataSourcesByCatalogsIdFunc(catalogsid) {
    try {
        const response = await api.get(`${getDataSourcesByCatalogsId(catalogsid)}`);
        console.log("response.data", response.data.result);
        return response.data.result;
    } catch (error) {
        console.error("error", error);
        return null;
    }
}

export default getDataSourcesByCatalogsIdFunc;
// export async function getApiData(url) {
//     // let data = [];
//     const data = await axios
//         .get(url)
//         .then((response) => {
//             console.log(response.data.result);
//             return response.data.result;
//         })
//         .catch((response) => {
//             console.log(response);
//             return response;
//         });

//     return data;
// }

// export function postApiData(url, data, msg) {
//     axios
//         .post(url, data)
//         .then(() => {
//             console.log(data);
//             alert(msg);
//         })
//         .catch((response) => {
//             console.log(response);
//             return response;
//         });
// }

// export function deleteApiData(url, id) {
//     axios.delete(`${url}/${id}`).then(() => {
//         alert('Item Deleted Successfully');
//     });
// }

// export function putApiData(url, id, data, msg) {
//     axios
//         .put(`${url}/${id}`, data)
//         .then(() => {
//             alert(msg);
//         })
//         .then((response) => {
//             console.log(response);
//         });
// }

// export const DashboardVisualPostReq = (data) => {
//     // const { featureDataVisualList } = useContext(FeatureChartsDataContext);
//     // const { setFeatureDataVisualList } = useContext(FeatureChartsDataContext);

//     axios
//         .post(dashboardPost, data)
//         .then((response) => {
//             console.log('POST DATA', data);
//             axios
//                 .get(`${dashboardVisualList}`)
//                 .then((response) => {
//                     const featureVisuals = [];
//                     response.data.result.map((item) => {
//                         if (item.funcId === 6) {
//                             featureVisuals.push(item);
//                         }
//                         // else if (item.funcId === 4) {
//                         //     rawVisuals.push(item);
//                         // }
//                         return '';
//                     });
//                     // setRawVisualList(rawVisuals);
//                     // setFeatureDataVisualList(featureVisuals);
//                     return response.data.result;
//                 })
//                 .catch((response) => {
//                     console.log(response);
//                     return response;
//                 });
//             alert('Dashboard Visual Added Successfully');
//         })
//         .catch((response) => {
//             console.log(response);
//             return response;
//         });
//     console.log(data);
// };

// export function MlModelRunsPost(data) {
//     axios
//         .post(mlModelRunsPost, data)
//         .then((response) => {
//             console.log('POST DATA', data);
//             alert('ML MODEL RUN RECORD CREATED');
//         })
//         .catch((response) => {
//             console.log(response);
//             return response;
//         });
//     console.log(data);
// }
