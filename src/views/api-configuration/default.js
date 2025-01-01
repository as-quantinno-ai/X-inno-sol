// FOR CLOUD SERVICE
export const servicePort = "9072";
export const pyServicePort = "9052";
export const chatbotServicePort = "8000";
export const uniVariatePort = "8050";
export const mulVariatePort = "8070";

export const serviceIp = "158.220.114.235";
export const pyServiceIp = "144.126.140.238";

export const baseUrl = `http://${serviceIp}:${servicePort}/dataanalytics`;

// CLIENT SERVICE URLS CONFIGURATION
export const postClient = `${baseUrl}/v1/user/create-client`;
export const getClientsUrl = `${baseUrl}/v1/user/get-all-clients`;

// PRODUCT SERVICE URLS CONFIGURATION
export const postProduct = `${baseUrl}/v1/user/create-product`;
export const getProductUrl = `${baseUrl}/v1/user/get-all-products`;
// DATASET SERVICE URLS CONFIGURATION
export const postDataset = `${baseUrl}/v1/user/create-dataset`;
export const getDatasetUrl = `${baseUrl}/v1/user/get-all-datasets`;

// PRODUCT-CLIENT SERVICE URLS CONFIGURATION
export const postTenants = `${baseUrl}/v1/user/create-product-client`;
export const getTenantsUrl = `${baseUrl}/v1/user/get-all-product-clients`;

// PRODUCT-CLIENT-ADMIN SERVICE URLS CONFIGURATION
export const postTenantUser = `${baseUrl}/v1/user/create-user-tenant`;
export const getAllUserTenantUrl = `${baseUrl}/v1/user/get-all-user-tenant?productClientId=`;

// APPLICATION-USER SERVICE URLS CONFIGURATION
export const postApplicationUser = `${baseUrl}/v1/user/create-user-app`;
export const getAllAppUserUrl = `${baseUrl}/v1/user/get-all-user-app?productClientId=`;
export const saveApplicationRolePermission = `${baseUrl}/v1/permissions/save-application-roles`;

// ROLES SERVICE URLS CONFIGURATION
export const postResRole = `${baseUrl}/v1/user/create-role-resource`;
export const getResRoleUrl = `${baseUrl}/v1/user/get-all-resource-roles-by-productclientdatasetsid?productClientDatasetsId=`;
export function getTenantResourcePermissions(productClDatasetId, roleName) {
    return `${baseUrl}/v1/permissions/get-tenant-resource-permissions?productClientDatasetsId=${productClDatasetId}&roleName=${roleName}`;
}
export const postAppRole = `${baseUrl}/v1/user/create-role-application`;
export const postUserRoleDataset = `${baseUrl}//v1/user/create-user-role-dataset`;
export const getAllAppRolesUrl = `${baseUrl}/v1/user/get-all-app-roles-by-productclientdatasetsid?productClientDatasetsId=`;
export function getTenantApplicationPermissions(productClDatasetId) {
    return `${baseUrl}/v1/permissions/get-all-application-permissions?productClientDatasetsId=${productClDatasetId}`;
}

// ocr Image

export const postOcrImage = `http://${pyServiceIp}:${pyServicePort}/chat/ocr-image/`;

// Set Api services
export const setRoleResoursePermission = `${baseUrl}/v1/permissions/set-resource-permission`;
export const delRoleResourcePermission = `${baseUrl}/v1/permissions/del-resource-permission`;
export const getAllResRolesUrl = `${baseUrl}/v1/user/get-all-resource-roles-by-productclientdatasetsid?productClientDatasetsId=`;

// USER ROLES SERVICE URLS CONFIGURATION
export const postUserRoles = `${baseUrl}/v1/user/create-user-role-dataset`;
export const getUserRolesUrl = `${baseUrl}/v1/user/get-user-role-dataset`;

// Api services for App-Permission-Screen
export function putUpdateAppPerm(productclientdatasetsid, roleName) {
    return `${baseUrl}/v1/permissions/update-application-permission?productClientDatasetsId=${productclientdatasetsid}&roleName=${roleName}`;
}

export function getAppPerm(productclientdatasetsid, roleName) {
    return `${baseUrl}/v1/permissions/get-application-permission?productClientDatasetsId=${productclientdatasetsid}&roleName=${roleName}`;
}
// CATALOG SERVICE URLS CONFIGURATION
export const catalogMainUrl = `${baseUrl}/v1/catalog`;
export const catalogList = `${catalogMainUrl}/get-all-catalogs?prodclidsid=`;
export const individualCat = `${catalogMainUrl}/get-catlog`;
export const postCatalog = `${catalogMainUrl}`;
export const postDatasource = `${catalogMainUrl}/create-datasource`;

// DATA SOURCE CONFIGURATION
export function getDataSourcesByCatalogsId(catalogsid) {
    return `${baseUrl}/v1/catalog/get-datasource-by-catalogsid?catalogsid=${catalogsid}`;
}
export function getCreateConnector(datasourceid) {
    return `${baseUrl}/v1/catalog/create-connectors?datasourceId=${datasourceid}`;
}

export function getDataSourceSchemaFields(datasourceId) {
    return `${baseUrl}/v1/catalog/get-datasource-schema-fields?datasourceId=${datasourceId}`;
}
export function getDBMSConfig(datasourceId) {
    return `${baseUrl}/v1/catalog/get-dbms-config/${datasourceId}`;
}

export function updateSchema(datasourceId) {
    return `${baseUrl}/v1/catalog/approve-schema?datasourceId=${datasourceId}`;
}
export const createDataSource = `${baseUrl}/v1/catalog/create-datasource`;

export function postDataSourceConfigForDatabase(datasourceid) {
    return `${baseUrl}/v1/catalog/save-dbms-config/${datasourceid}`;
}

export function deleteDataSources(datasourceId) {
    return `${baseUrl}/v1/catalog/delete-datasources?datasourceId=${datasourceId}`;
}
export function deleteCatalog(catalogId) {
    return `${baseUrl}/v1/catalog/delete-catalog?catalogId=${catalogId}`;
}
export function makeStandardMetadata(datasourceId, prodCliDsid, tableId) {
    return `${baseUrl}/v1/datasource/make-standard-metadata?datasourceId=${datasourceId}&prodCliDsid=${prodCliDsid}&tableId=${tableId}`;
}

// export const userDeleteUrl = `${baseUrl}/`;
// export const userPutUrl = `${baseUrl}/v1/user`;

// DELTA LAKE SERVER URLS CONFIGURATION

// export function getDeltaByPCDSID(productClientDatasetsId) {
export function getDeltaByPCDSID() {
    return `${baseUrl}/v1/datapipelinelayers/get-datapipelinelayer-pcdsid?productClientDatasetsId=13`;
}
export function getDeltaByPCDSIDtableid(productClientDatasetsId, tableid) {
    return `${baseUrl}/v1/datapipelinelayers/get-datapipelinelayer-pcdsid-tableid?productClientDatasetsId=${productClientDatasetsId}&tableId=${tableid}`;
}

export function createDeltaLakeLayers() {
    return `${baseUrl}/v1/deltalakelayers/create-deltalakelayers`;
}

export function deleteDeltalakelayerById(deltalakelayerId) {
    return `${baseUrl}/v1/deltalakelayers/delete-deltalakelayer-by-id=${deltalakelayerId}`;
}

export function getDeltaByPCDSIDAndTableId(productClientDatasetsId, tableId) {
    return `${baseUrl}/v1/deltalakelayers/get-deltalakelayer-pcdsid-tableid?productClientDatasetsId=${productClientDatasetsId}&tableId=${tableId}`;
}
export function getDataLakePipelineLayersByDatasetidandTableid(productClientDatasetsId, tableId) {
    return `${baseUrl}/v1/collective/get-datapipelinelayers-and-datasources?productclientdatasetsid=${productClientDatasetsId}&tableId=${tableId}`;
}
export function getDataLakePipelineLayersDetailsByDatasetidandTableid(
    productClientDatasetsId,
    tableId,
    deltalakelayer,
    datasourceId,
    rowCount,
    limit
) {
    return `http://${pyServiceIp}:${pyServicePort}/data-retrieval-by-query-app/delta-view/${productClientDatasetsId}/${tableId}/${deltalakelayer}?datasource_id=${datasourceId}&limit=${rowCount}&offset=${limit}`;
}
export function getDataByMatchingValue(productClientDatasetsId, tableId, limit, offset) {
    return `http://${pyServiceIp}:${pyServicePort}/data-retrieval-by-query-app/get-data-by-matching-value/${productClientDatasetsId}/${tableId}?limit=${limit}&offset=${offset}`;
}

// dataquality

export function getDataQualityManagerWithViewNameProductidandTableid(limit, offset, productClientDatasetsId, tableId) {
    return `${baseUrl}/v1/data-quality/get-dqfailed-uuids?limit=${limit}&offset=${offset}&prodCliDsId=${productClientDatasetsId}&tableId=${tableId}`;
}
export function getDataQualityTrackerbyDQManagerid(managerId) {
    return `${baseUrl}/v1/data-quality/get-dataqualitytracker-by-dqmanagerid?dQmangerId=${managerId}`;
}

export const updateFailedRule = `${baseUrl}/v1/data-quality/update-failed-rules`;

// TRANSFORMER SERIVCE URLS CONFIGURATION
export const createTransformers = `${baseUrl}/v1/transformers/create-transformers`;

export function deleteTransformerByTransfomerId(transformerId) {
    return `${baseUrl}/v1/transformers/delete-transformer-by-id?transformerId=${transformerId}`;
}

export function getTransformerByProductIdTableId(pcdsid, tableid) {
    return `${baseUrl}/v1/transformers/get-transformers-by-pcdsid-tableid?pcdsid=${pcdsid}&tableid=${tableid}`;
}
export function getTransformerByTransformerId(id) {
    return `${baseUrl}/v1/transformers/get-transformers-by-id?id=${id}`;
}
export function getTransformerBypcdsidtableiddatasourceid(pcdsid, tableid, datasourceid) {
    return `${baseUrl}/v1/transformers/get-transformers-by-pcdsid-tableid-datasourceid?datasourceid=${datasourceid}&pcdsid=${pcdsid}&tableid=${tableid}`;
}
export function getTransformerByDataLakeId(id) {
    return `${baseUrl}/v1/transformers/get-transformers-deltalakelayerid?deltaLakeLayerId=${id}`;
}
export function getTransformerByPcdsIdTableIdDataLakeId(pcdsid, tableid, deltalakelayerid) {
    return `${baseUrl}/v1/transformers/get-transformers-pcdsid-tableid-deltalakelayerid?deltalakelayerid=${deltalakelayerid}&pcdsid=${pcdsid}&tableid=${tableid}`;
}
export function getTransformerByPcdsIdTableId(pcdsid, tableid) {
    return `${baseUrl}/v1/transformers/get-transformers-by-pcdsid-tableid?pcdsid=${pcdsid}&tableid=${tableid}`;
}
// METADATA SERVICE URLS CONFIGURATION
export const metadataMainUrl = `${baseUrl}/v1/metadata`;
export const metadataList = `${metadataMainUrl}/get-all-metadata/`;
export function getAllMetaDatabystage(prodclidsid, tableid, stage) {
    return `${metadataMainUrl}/get-metadata-by-layer/${prodclidsid}/${tableid}/${stage}`;
}
export function metadataUniqueConstraintsApi(prodclidsid, tableid, attid, value) {
    return `${metadataMainUrl}/update-uniqueidentifier/${prodclidsid}/${tableid}/${attid}?booleanValue=${value}`;
}
export function metadataRelationApi(prodclidsid, tableid, attid) {
    return `${metadataMainUrl}/update-references/${prodclidsid}/${tableid}/${attid}`;
}
export function metadataSortingParams(prodclidsid, tableid, attid) {
    return `${metadataMainUrl}/update-sorting-params/${prodclidsid}/${tableid}/${attid}`;
}
export const updateMetadataDataTypes = `${metadataMainUrl}/update-attributetypes`;

// METADETA SERVER URLS CONFIGURATION
export function createStandardizeMetadata(productclientdatasetsid, tableId, layer) {
    return `${metadataMainUrl}/standardize-metadata/${productclientdatasetsid}/${tableId}?forLayer=${layer}`;
}

export function getMetaDataVersionTracking(datasourceId, productClientDatasetsId, tableId) {
    return `${baseUrl}/v1/datasource/get-dsmetadata-version-tracking?datasourceId=${datasourceId}&prodCliDsId=${productClientDatasetsId}&tableId=${tableId}`;
}
export function getMetadataDataSourceOrPipeline(productclientdatasetsid, tableid, id, type) {
    return `${metadataMainUrl}/get-metadata-datasource-or-pipeline/${productclientdatasetsid}/${tableid}?id=${id}&type=${type}`;
}

export function getCatalogDataPipelineLayersAndDataSourcesOrPipeline(productclientdatasetsid) {
    return `${baseUrl}/v1/collective/get-catalog-datapipelinelayers-and-datasources?productclientdatasetsid=${productclientdatasetsid}`;
}

export function getAllMetaData(productClientDatasetsId, tableId) {
    return `${metadataList}/${productClientDatasetsId}/${tableId}`;
}
export function getMetadatamapping(datasourceId, productClientDatasetsId, tableId) {
    return `${baseUrl}/v1/datasource/get-metadatamapping-by-prodclidsid-tableid-datasourceid?datasourceId=${datasourceId}&prodCliDsId=${productClientDatasetsId}&tableId=${tableId}`;
}

export function getDataSourceMetaData(dataSourceId, productClientDatasetsId, tableId) {
    return `${baseUrl}/v1/datasource/get-dsmetadata-by-pcdsid-tableid-datasourceid?datasourceid=${dataSourceId}&pcdsid=${productClientDatasetsId}&tableid=${tableId}`;
}

export function postDataSourceMapping() {
    return `${baseUrl}/v1/datasource/create-metadata-mapping`;
}

// COLUMN DATA DISCOVERY SERVIC URLS CONFIGURATION
export const columnDataDisMainUrl = `${baseUrl}/v1/columndatadiscovery`;
export const columnDataDisList = `${columnDataDisMainUrl}/get-all-columndatadis/`;
export const columnDataDisObjs = `${columnDataDisMainUrl}/get-columndatadis-objs/`;
export const columnDataDisVisualData = `${columnDataDisMainUrl}/get-visual-data/`;
export const columnDataDisSemiChartVisualData = `${columnDataDisMainUrl}/get-semi-donut/`;

export function getcolumnDataDisByStage(product, tableId, stage) {
    return `${columnDataDisMainUrl}/get-all-columndatadis-by-stage/${product}/${tableId}/${stage}`;
}

export function columnDataDisGetAllCOlumndatadis(product, tableId) {
    return `${columnDataDisMainUrl}/get-all-columndatadis/${product}/${tableId}`;
}

export function columnDataDisGetAllCOlumndatadisByLayerId(product, tableId, layerID) {
    return `${columnDataDisMainUrl}/get-all-columndatadis-by-layerid/${product}/${tableId}/${layerID}`;
}
export const columnDataDisPostBiVariantAnalysis = `${columnDataDisMainUrl}/post/bivariant-data`;
export function columnDataDisGetBiVariantAnalysisByprodclidsid(prodclidsid) {
    return `${columnDataDisMainUrl}/get/bivariant-data-by-productclientdatasetsid?prodclidsid=${prodclidsid}`;
}
export function columnDataDisGetBiVariantAnalysisByDsTaId(prodclidsid, taid) {
    return `${columnDataDisMainUrl}/get/bivariant-data-by-productclientdatasetsid-tableid?prodclidsid=${prodclidsid}&taid=${taid}`;
}
export function columnDataDisGetBiVariantAnalysisByUnqCon(ct, prodclidsid, taid, faid, seattids) {
    return `${columnDataDisMainUrl}/get/bivariant-data?ChartType=${ct}&prodclidsid=${prodclidsid}&filterAttId=${faid}&selectedAttIds=${seattids}&taid=${taid}`;
}
// Multi Variate Analysis
export function getMultiVariate(prodclidsid) {
    return `${baseUrl}/v1/multivariate/get-multivariate-pcdsid?productClientDatasetsId=${prodclidsid}`;
}

// FILE SERVICE URLS CONFIGURATION
export const filesMainUrl = `${baseUrl}/v1/fileupload`;
export const loadFileDataUrl = `${filesMainUrl}/get-json-data?location=`;
// export const uploadFile = `${filesMainUrl}/upload`;
export function uploadFile(prodclidsid, taid) {
    return `${filesMainUrl}/upload?prodCliDsid=${prodclidsid}&tableId=${taid}`;
}
export function getRawIngestedFiles(datasourceId, prodclidsid, taid) {
    return `${filesMainUrl}/get-raw-ingestested-files?datasourceId=${datasourceId}&productClientDatasetsId=${prodclidsid}&tableId=${taid}`;
}

// COMPARATIVE ANALYSIS SERVICE URLS CONFIGURATION
export const comparativeAnalysisMainUrl = `${baseUrl}/v1/comparative-analysis`;
export const comparativeAnalysisChiSqrRecs = `${comparativeAnalysisMainUrl}/get-comparative-analysis-list`;

// ML MODELS SERVICE URLS CONFIGURATION
export const mlModelsMainUrl = `${baseUrl}/v1/ml-model`;
export const mlModelsByDSandTABId = `${mlModelsMainUrl}/get-ml-models/`;
export const mlModelTypesList = `${mlModelsMainUrl}/get-all-model-types`;
export const mlModelMetadataList = `${mlModelsMainUrl}/get-ml-models-list/`;
export const mlModelRunsPost = `${mlModelsMainUrl}/model-runs?productclientdatasetsid=`;
export const mlModelRunsByStatusAndStepCD = `${mlModelsMainUrl}/get-MLModelRuns/`;
export const quickTestAttribs = `${mlModelsMainUrl}/get-published-featured-attribs?productclientdatasetsid=`;
export const quickTestPost = `${mlModelsMainUrl}/get-published-featured-attribs`;
export const postMlModel = `${mlModelsMainUrl}`;
export const getPublishedMlModel = `${mlModelsMainUrl}/publish-ml-model`;
export const getMlModelsByProdClDsId = `${mlModelsMainUrl}/get-ml-models-list`;
export const getPublishedMlModelAndMlModelRun = `${mlModelsMainUrl}/get-published-mlmodel?productclientdatasetsid=`;
export function getMlModelCummulativeDataByModelId(modelId) {
    return `${mlModelsMainUrl}/get-MlModelCummulativeData/${modelId}`;
}
// Function to create the Api call for fetching published Ml Model (updated)...
export function getPublishedMlModels(productclientdatasetsid, tableId, modelId) {
    return `${getPublishedMlModel}/${productclientdatasetsid}/${tableId}/${modelId}`;
}

// DASHBOARD SERVICE URLS CONFIGURATION
export const dashboardPost = `${baseUrl}/v1/Dashboard`;
export const dashboardVisualList = `${dashboardPost}/get-all-dashboards?prodclidsid=`;
export const mainDashboardData = `${dashboardPost}/get-main-dashboard-data`;
export const loadMainDashboardData = `${dashboardPost}/load-main-dashboard-data?prodclidsid=`;
export const applicationModeConfiguration = `${dashboardPost}/app-mode-configuration?modeFlag=`;
export const applicationModeStatus = `${dashboardPost}/get-app-mode`;
export const cumulativeData = `${dashboardPost}/get-cumulative-data`;
export function getApplicationModeConfiguration(modeFlag, userroleproductclientdatasetsid) {
    return `${applicationModeConfiguration}productclientdatasetsid=${userroleproductclientdatasetsid}&modeFlag=${modeFlag}`;
}

// PREDICTION SUMMARY SERVICE URLS CONFIGURATION
export const predSumMainUrl = `${baseUrl}/v1/prediction-summary`;
export const predictionSumList = `${predSumMainUrl}/get-prediction-summary-recs`;
export const predictionSumCummalativeList = `${predSumMainUrl}/get-prediction-summary-commulative-recs`;

// USER LOGIN SERVICE URLS CONFIGURATION
export const userSerMainUrl = `${baseUrl}/v1/user`;
export const getUser = `${userSerMainUrl}/get-user?password=`;
export const getUserRoleDatasets = `${userSerMainUrl}/get-user-role-dataset`;
export const getClubUserRoleAndClientDatasets = `${userSerMainUrl}/get-bulk-user-role-dataset-client-dataset?username=`;
export const getUserDetails = `${userSerMainUrl}/get-user-details`; // Used to retrive user specific datasets
export const getProductClientDatasetRoles = `${userSerMainUrl}/get-all-roles-by-productclientdatasetsid?productClientDatasetsId=`; // Used to retrive user specific datasets

// JOB SERVICE URLS CONFIGURATION
export const getJobs = `${baseUrl}/v1/jobs/get-job-status?userroleproductclientdatasetsid=`;

// CUSTOM DASHBOARD SCREEN
export const createCustomDashboardScreen = `${baseUrl}/v1/custom_dashboard`;
export const createCustomDashboardComponentLayout = `${baseUrl}/v1/custom_dashboard/component_layout`;
export const createCustomDashboardComponentData = `${baseUrl}/v1/custom_dashboard/component_data`;
export const getCustomScreenNames = `${baseUrl}/v1/custom_dashboard/get-screens`;
export const getCustomDashboard = `${baseUrl}/v1/custom_dashboard/get-screens/`;
export function getScreenLayoutByprodclidsidAndStatus(screenId, status) {
    return `${baseUrl}/v1/custom_dashboard/get-dashboard-screens-layout-by-status?screenId=${screenId}&status=${status}`;
}
export const createCustomDashboardContentStyling = `${baseUrl}/v1/custom_dashboard/component_layout_content_styling`;
export function getScreenByScreenId(screenId) {
    return `${baseUrl}/v1/custom_dashboard/get-dashboard-screen-by-screenid?screenId=${screenId}`;
}

export function getScreenByScreenIdAndMode(screenId, mode) {
    return `${baseUrl}/v1/custom_dashboard/get-dashboard-screen-by-screenid-mode?mode=${mode}&screenId=${screenId}`;
}
export function getScreenByScreenIdAndModeAndDashboard(screenId, mode, dashboard) {
    return `${baseUrl}/v1/custom_dashboard/get-dashboard-screen-by-screenid-mode?mode=${mode}&screenId=${screenId}&dashboard=${dashboard}`;
}

// CUSTOM FORM
export const postCustomForm = `${baseUrl}/v1/custom_form`;

export function getCustomFormsByFormId(prodclidsid) {
    return `${baseUrl}/v1/custom_form//get-custom-form-structure/${prodclidsid}`;
}

export function retrieveCustomFormRecord() {
    return `http://${pyServiceIp}:${pyServicePort}/data-retrieval-by-query-app/spark-fetch-record`;
}

export function retrieveLowQualityRecord() {
    return `http://${pyServiceIp}:${pyServicePort}/data-retrieval-by-query-app/spark-fetch-lowquality-record`;
}
export function createCustomFormRefreshBronzeView(productclientdatasetsid, tableid) {
    return `http://${pyServiceIp}:${pyServicePort}/data-retrieval-by-query-app/create-refresh-bronze-view/${productclientdatasetsid}/${tableid}`;
}
export function putCustomFormsBindComponent(componentdataid, formid, prodclidsid) {
    return `${baseUrl}/v1/custom_form/bind-component-with-form?componentdataid=${componentdataid}&formid=${formid}&productclientdatasetsid=${prodclidsid}`;
}
export function getCustomFormsByprodclidsid(prodclidsid) {
    return `${baseUrl}/v1/custom_form/get-custom-forms-by-productclientdatasetsid?productclientdatasetsid=${prodclidsid}`;
}
export function getCustomFormsByprodclidsidandTableIid(prodclidsid, taid) {
    return `${baseUrl}/v1/custom_form/get-custom-forms?productclientdatasetsid=${prodclidsid}&tableid=${taid}`;
}
// export function updateCustomFormData(prodclidsid, taid) {
export function updateCustomFormData() {
    return `http://${serviceIp}:${servicePort}/dataanalytics/v1/custom_form/form_data`;
}

export const postCustomFormData = `${baseUrl}/v1/custom_form/form_data`;
export function getCustomFormDataByFormId(formid, dsid) {
    return `${baseUrl}/v1/custom_form/get-custom-form-data?formid=${formid}&productClientDatasetsId=${dsid}`;
}
export function dltCustomFormDataByFormId(formid) {
    return `${baseUrl}/v1/custom_form/delete-custom-form?formid=${formid}`;
}
export function getRefrentialMetadata(prodcldsid, tableid) {
    return `${metadataMainUrl}/get-referential-metadata/${prodcldsid}/${tableid}`;
}
// Permission Controller
export function getResourcePermissions(prodcldsid, rleName) {
    return `${baseUrl}/v1/permissions/get-tenant-resource-permissions?productClientDatasetsId=${prodcldsid}&roleName=${rleName}`;
}

export function getAppPermissions(prodcldsid, rleName) {
    return `${baseUrl}/v1/permissions/get-application-role?productClientDatasetsId=${prodcldsid}&roleName=${rleName}`;
}
export const updateDatasetSelection = `${baseUrl}/v1/security/set-selected-dataset?productclientdatasetsid=`;
export const getInitialData = `${baseUrl}/v1/collective/get-initial-data`;
// Action Buttons & Events Controller
export const createButton = `${baseUrl}/v1/buttons-events/save-button`;
export const createEvent = `${baseUrl}/v1/buttons-events/save-event`;
export function getCatalogButtons(prodcldsid, tableid) {
    return `${baseUrl}/v1/buttons-events/get-buttons-and-events/${prodcldsid}/${tableid}`;
}
export function getCatalogButton(prodcldsid) {
    return `${baseUrl}/v1/buttons-events/get-buttons/${prodcldsid}`;
}

export function dataSourceConfigurationFileUpload(datasourceId, datasetid, tableid) {
    return `${baseUrl}/v1/fileupload/upload?datasourceId=${datasourceId}&prodCliDsid=${datasetid}&tableId=${tableid}`;
}

// S3 Connector Configuration

export function putdataSourceConfigurationSaveS3Config(datasourceId) {
    return `${baseUrl}/v1/catalog/save-s3-config/${datasourceId}`;
}
export function getS3Config(datasourceId) {
    return `${baseUrl}/v1/catalog/get-s3-config/${datasourceId}`;
}
export const dataSourceConfiguration = `${baseUrl}/v1/catalog/create-datasource`;

// Application Configuration Controller
export const updateAppConfigRec = `${baseUrl}/v1/appconfig/set-appconfig-filter`;
export const getDatasetFilterConfigUrl = `${baseUrl}/v1/appconfig/get-appconfig-filter/`;

// Filter COnfiguration Controller
export const createConfigFilter = `${baseUrl}/v1/filter/create-configfilter`;
export const createQueryFilter = `${baseUrl}/v1/filter/create-queryfilter`;
export function createQuerAppFilter(prodcldsid, tableid, user) {
    return `http://${pyServiceIp}:${pyServicePort}/data-retrieval-by-query-app/apply-filter/${prodcldsid}/${tableid}?limit=3&offset=2&usr=${user}`;
}
// http://206.72.205.105:9072/dataanalytics/v1/buttons-events/save-button

// export const dashChartUrl = `http://${serviceIp}:${uniVariatePort}/`;
export const dashChartUrl = `http://${serviceIp}:${uniVariatePort}/`;
export const dashChartUrlMultiVariate = `http://${serviceIp}:${mulVariatePort}/`;

export function renderStreamingMultiVariateChart(multivariateid, themetype, charttype, viewname) {
    /*eslint-disable*/
    switch (charttype) {
        case "Scatter Plot With Trendline":
            return `${dashChartUrlMultiVariate}ws-scatter-plot-with-trendline-chart?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        case "Bar Chart":
            return `${dashChartUrlMultiVariate}ws-bar-chart?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        case "Line Chart":
            return `${dashChartUrlMultiVariate}ws-line-chart?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        case "Scatter Chart":
            return `${dashChartUrlMultiVariate}ws-scatter-chart?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        case "Bar Chart (Mean and Standard Error)":
            return `${dashChartUrlMultiVariate}ws-bar-chart-mean-standard-error?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        case "Box Plot":
            return `${dashChartUrlMultiVariate}ws-box-chart?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        case "CandleStick Chart":
            return `${dashChartUrlMultiVariate}ws-candlestick-chart?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        case "Dist Plot":
            return `${dashChartUrlMultiVariate}ws-dist-plot-chart?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        case "Grouped Bar Chart":
            return `${dashChartUrlMultiVariate}ws-grouped-bar-chart?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        case "Horizontal Bar Chart (Categorical vs Categorical)":
            return `${dashChartUrlMultiVariate}ws-horizontal-bar-chart-categorical-vs-categorical?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        case "Horizontal Bar Charts (Categorical)":
            return `${dashChartUrlMultiVariate}ws-horizontal-bar-chart-categorical?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        case "Line and Area Chart":
            return `${dashChartUrlMultiVariate}ws-line-area-chart?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        case "Multitraced Horizontal Bar Chart":
            return `${dashChartUrlMultiVariate}ws-multi-trace-horizontal-bar-chart?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        case "Multitraced Horizontal Categorical Bar Chart":
            return `${dashChartUrlMultiVariate}ws-multi-traced-categorical-bar-chart?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        case "Multitraced Mean and Standard Error Bar Chart":
            return `${dashChartUrlMultiVariate}ws-multi-traced-mean-standard-error-bar-graph?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        case "Multitraced Conversion Bar Chart":
            return `${dashChartUrlMultiVariate}ws-multi-traced-conversion-bar-chart?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        case "Multitraced Horizontal Line Chart":
            return `${dashChartUrlMultiVariate}ws-muti-traced-horizontal-line-chart-renderer?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        case "Overlay bar Chart":
            return `${dashChartUrlMultiVariate}ws-overlay-bar-chart?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        case "Scatter Chart (By Category)":
            return `${dashChartUrlMultiVariate}ws-scatter-chart-by-category?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        case "Scatter Plot with Trendline":
            return `${dashChartUrlMultiVariate}ws-scatter-plot-with-trendline?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        case "Stacked Bar Chart":
            return `${dashChartUrlMultiVariate}ws-stacked-bar-chart?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        default:
            return `${dashChartUrlMultiVariate}render-chart?multivariateId=${multivariateid}&theme=${themetype}&jwt=`;
    }
    /*eslint-enable*/
}

export function renderNonStreamingMultiVariateChart(multivariateid, themetype, charttype, viewname) {
    /*eslint-disable*/
    switch (charttype) {
        case "Scatter Plot With Trendline":
            return `${dashChartUrlMultiVariate}rs-scatter-plot-with-trendline-chart-renderer?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        case "Bar Chart":
            return `${dashChartUrlMultiVariate}rs-bar-chart-renderer?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        case "Line Chart":
            return `${dashChartUrlMultiVariate}rs-line-chart-renderer?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        case "Scatter Chart":
            return `${dashChartUrlMultiVariate}rs-scatter-chart-renderer?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        case "Bar Chart (Mean and Standard Error)":
            return `${dashChartUrlMultiVariate}rs-bar-chart-mean-standard-error-renderer?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        case "Box Plot":
            return `${dashChartUrlMultiVariate}rs-box-chart-renderer?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        case "CandleStick Chart":
            return `${dashChartUrlMultiVariate}rs-candlestick-chart-renderer?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        case "Dist Plot":
            return `${dashChartUrlMultiVariate}rs-dist-plot-chart-renderer?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        case "Grouped Bar Chart":
            return `${dashChartUrlMultiVariate}rs-grouped-bar-chart-renderer?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        case "Horizontal Bar Chart (Categorical vs Categorical)":
            return `${dashChartUrlMultiVariate}rs-horizontal-bar-chart-categorical-vs-categorical-renderer?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        case "Horizontal Bar Charts (Categorical)":
            return `${dashChartUrlMultiVariate}rs-horizontal-bar-chart-categorical-renderer?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        case "Line and Area Chart":
            return `${dashChartUrlMultiVariate}rs-line-area-chart-renderer?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        case "Multitraced Horizontal Bar Chart":
            return `${dashChartUrlMultiVariate}rs-multi-traced-horizontal-bar-chart-renderer?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        case "Multitraced Horizontal Categorical Bar Chart":
            return `${dashChartUrlMultiVariate}rs-multi-traced-categorical-bar-chart-renderer?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        case "Multitraced Mean and Standard Error Bar Chart":
            return `${dashChartUrlMultiVariate}rs-multi-traced-mean-standard-error-chart-renderer?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        case "Multitraced Conversion Bar Chart":
            return `${dashChartUrlMultiVariate}rs-multi-traced-conversion-bar-chart-renderer?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        case "Multitraced Horizontal Line Chart":
            return `${dashChartUrlMultiVariate}rs-multi-traced-line-chart-renderer?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        case "Overlay bar Chart":
            return `${dashChartUrlMultiVariate}rs-overlay-bar-chart-renderer?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        case "Scatter Chart (By Category)":
            return `${dashChartUrlMultiVariate}rs-scatter-chart-by-category-renderer?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        case "Scatter Plot with Trendline":
            return `${dashChartUrlMultiVariate}rs-scatter-plot-with-trendline-renderer?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        case "Stacked Bar Chart":
            return `${dashChartUrlMultiVariate}rs-stacked-bar-chart-renderer?multivariateId=${multivariateid}&viewname=${viewname}&theme=${themetype}&jwt=`;
        default:
            return `${dashChartUrlMultiVariate}render-chart?multivariateId=${multivariateid}&theme=${themetype}&jwt=`;
    }
    /*eslint-enable*/
}

export function renderRecordLevelCharts(
    productclientdatasetsid,
    recordvisualid,
    themetype,
    charttype,
    viewname,
    tableid,
    uuid,
    width
    // height
) {
    /*eslint-disable*/
    switch (charttype) {
        case "Area Chart":
            return `${dashChartUrl}record-level-graphs/record-level-area-chart?datasetid=${productclientdatasetsid}&tableid=${tableid}&uuid=${uuid}&width=${width}&viewname=${viewname}&recordvisualid=${recordvisualid}&theme=${themetype}&jwt=`;
        case "Bar Chart":
            return `${dashChartUrl}record-level-graphs/record-level-bar-chart?datasetid=${productclientdatasetsid}&tableid=${tableid}&uuid=${uuid}&width=${width}&viewname=${viewname}&recordvisualid=${recordvisualid}&theme=${themetype}&jwt=`;
        case "Line Chart":
            return `${dashChartUrl}record-level-graphs/record-level-line-chart?datasetid=${productclientdatasetsid}&tableid=${tableid}&uuid=${uuid}&width=${width}&viewname=${viewname}&recordvisualid=${recordvisualid}&theme=${themetype}&jwt=`;
        case "Scatter Chart":
            return `${dashChartUrl}record-level-graphs/record-level-scatter-chart?datasetid=${productclientdatasetsid}&tableid=${tableid}&uuid=${uuid}&width=${width}&viewname=${viewname}&recordvisualid=${recordvisualid}&theme=${themetype}&jwt=`;
        case "Box Chart":
            return `${dashChartUrl}record-level-graphs/record-level-box-chart?datasetid=${productclientdatasetsid}&tableid=${tableid}&uuid=${uuid}&width=${width}&viewname=${viewname}&recordvisualid=${recordvisualid}&theme=${themetype}&jwt=`;
        case "Donut Chart":
            return `${dashChartUrl}record-level-graphs/record-level-donut-chart?datasetid=${productclientdatasetsid}&tableid=${tableid}&uuid=${uuid}&width=${width}&viewname=${viewname}&recordvisualid=${recordvisualid}&theme=${themetype}&jwt=`;
        case "Pie Chart":
            return `${dashChartUrl}record-level-graphs/record-level-pie-chart?datasetid=${productclientdatasetsid}&tableid=${tableid}&uuid=${uuid}&width=${width}&viewname=${viewname}&recordvisualid=${recordvisualid}&theme=${themetype}&jwt=`;
        case "Polar Chart":
            return `${dashChartUrl}record-level-graphs/record-level-polar-chart?datasetid=${productclientdatasetsid}&tableid=${tableid}&uuid=${uuid}&width=${width}&viewname=${viewname}&recordvisualid=${recordvisualid}&theme=${themetype}&jwt=`;
        case "Radial Chart":
            return `${dashChartUrl}record-level-graphs/record-level-radial-chart?datasetid=${productclientdatasetsid}&tableid=${tableid}&uuid=${uuid}&width=${width}&viewname=${viewname}&recordvisualid=${recordvisualid}&theme=${themetype}&jwt=`;
        case "SemiDonut Chart":
            return `${dashChartUrl}record-level-graphs/record-level-semidonut-chart?datasetid=${productclientdatasetsid}&tableid=${tableid}&uuid=${uuid}&width=${width}&viewname=${viewname}&recordvisualid=${recordvisualid}&theme=${themetype}&jwt=`;
        case "Gauge Chart":
            return `${dashChartUrl}record-level-graphs/record-level-gauge-chart?datasetid=${productclientdatasetsid}&tableid=${tableid}&uuid=${uuid}&width=${width}&viewname=${viewname}&recordvisualid=${recordvisualid}&theme=${themetype}&jwt=`;
        default:
            return `${dashChartUrl}record-level-graphs/record-level-col-chart?datasetid=${productclientdatasetsid}&tableid=${tableid}&uuid=${uuid}&width=${width}&viewname=${viewname}&recordvisualid=${recordvisualid}&theme=${themetype}&jwt=`;
    }
    /*eslint-enable*/
}

// CHAT ENGINE URLS
export const chatEngineurl = "http://127.0.0.1:8000/chat/chat-message";
export const gptQueryEngine = `http://${pyServiceIp}:${pyServicePort}/chat/nlp-query`;

export const gptChatBotUrl = `http://${serviceIp}:${chatbotServicePort}/chatbot/flow-runner`;

export const getGenAiFLowProductIdUrl = (prodCliDsid) => `http://${serviceIp}:${servicePort}/dataanalytics/v1/genaiflows/${prodCliDsid}`;

export const getGenAiFLowFlowIdUrl = (flowid) => `http://${serviceIp}:${chatbotServicePort}/flows/run-flow/${flowid}`;

export const chatVisualizationIframeUrl = (messageId, visualType, theme, jwt) =>
    `http://${serviceIp}:${mulVariatePort}/chat-visualization?chat_message_id=${messageId}&visual_type=${visualType}&theme=${theme}&jwt=${jwt}`;

// CHART TYPE B WIDTH & HEIGHT
export const chartBWidth = 200;
export const chartBHeight = 200;

// *********************************************************************************************************************
// ********************************************* REGISTRATION SERVICE URLS *********************************************
// *********************************************************************************************************************

export const superAdminLoginUrl = `http://${serviceIp}:${servicePort}/registration/v1/authentication/superadmin`;
export const refreshTokenUrl = `http://${serviceIp}:${servicePort}/registration/v1/authentication/refresh?refresh_token=`;
export const logoutUrl = `http://${serviceIp}:${servicePort}/registration/v1/authentication/logout?refresh_token=`;
export const loginUrl = `http://${serviceIp}:${servicePort}/registration/v1/authentication/authenticate`;
export const getOtp = `http://${serviceIp}:${servicePort}/registration/v1/authentication/get-otp`;

// ************************************************************************************************************
// ********************************************* WEB SOCKETS URLS *********************************************
// ************************************************************************************************************

export const DashboardListner = "/topic/message";
export const SOCKET_URL = `http://${serviceIp}:${servicePort}/dataanalytics/ws-message`;

// ************************************************************************************************************
// ********************************************* PYTHON SERV URLS *********************************************
// ************************************************************************************************************

export function loadParquetData(prodcldsid, tableid, limit, offset, cols, usr, dashboard, componentdataid, colsName, searchText) {
    return `http://${pyServiceIp}:${pyServicePort}/data-reader/get-source-data/${prodcldsid}/${tableid}/?limit=${limit}&offset=${offset}&cols=${cols}&usr=${usr}&dashboard=${dashboard}&componentdataid=${componentdataid}&searchby=${colsName}&value=${searchText}`;
}

export function loadAllParquetData(prodcldsid, tableid, limit, offset, cols, usr, dashboard, componentdataid) {
    return `http://${pyServiceIp}:${pyServicePort}/data-reader/read-parquet-consolidate-file/${prodcldsid}/${tableid}/?limit=${limit}&offset=${offset}&cols=${cols}&usr=${usr}&dashboard=${dashboard}&componentdataid=${componentdataid}`;
}

export function loadRefrentialData(prodcldsid, tableid, limit, offset, cols, usr, dashboard, componentdataid) {
    return `http://${pyServiceIp}:${pyServicePort}/data-reader/get-referential-data/${prodcldsid}/${tableid}/?limit=${limit}&offset=${offset}&cols=${cols}&usr=${usr}&dashboard=${dashboard}&componentdataid=${componentdataid}`;
}

export function loadMlModelParquetData(mlmodelid, limit, offset, cols) {
    return `http://${pyServiceIp}:${pyServicePort}/ml-models/ml-model-parquet-reader/${mlmodelid}/?limit=${limit}&offset=${offset}&cols=${cols}`;
}

export function cleanFormStructureUrl(productclientdatasetsid, tableid, formid) {
    return `http://${pyServiceIp}:${pyServicePort}/data-reader/clean-form-data/${productclientdatasetsid}/${tableid}/${formid}`;
}

export function truncateProcessedDataUrl(productclientdatasetsid, tableid) {
    return `http://${pyServiceIp}:${pyServicePort}/data-reader/truncate-processed-data/${productclientdatasetsid}/${tableid}`;
}

export function truncateUnprocessedDataUrl(productclientdatasetsid, tableid) {
    return `http://${pyServiceIp}:${pyServicePort}/data-reader/truncate-unprocessed-data/${productclientdatasetsid}/${tableid}`;
}

export function deleteCertainRecordsUrl(productclientdatasetsid, tableid) {
    return `http://${pyServiceIp}:${pyServicePort}/data-reader/delete-certain-records/${productclientdatasetsid}/${tableid}`;
}

export function catalogDumpUrl(productclientdatasetsid, tableid) {
    return `http://${pyServiceIp}:${pyServicePort}/data-reader/catalog-dump/${productclientdatasetsid}/${tableid}`;
}

// ************************************************************************************************************
// ********************************************* PYTHON SERV URLS QUERY FILTERS *********************************************
// ************************************************************************************************************

export function queryBasedGetRefColumnData(viewName, column, limit, offset) {
    return `http://${pyServiceIp}:${pyServicePort}/data-retrieval-by-query-app/get-ref-column-data?viewname=${viewName}&column=${column}&limit=${limit}&offset=${offset}`;
}

export function queryBasedFilterData(uuid, prodcldsid, tableid, componentdataid, limit, offset, cols, usr) {
    return `http://${pyServiceIp}:${pyServicePort}/data-retrieval-by-query-app/apply-filter/${prodcldsid}/${componentdataid}?uuid=${uuid}&limit=${limit}&offset=${offset}&usr=${usr}`;
}

export function getQueryAppDataByFieldFilters(formid, email) {
    return `http://${pyServiceIp}:${pyServicePort}/data-retrieval-by-query-app/get-data-by-field-filters?formid=${formid}&useremail=${email}`;
}
export const customApiUrl = `http://${serviceIp}:${pyServicePort}/`;

export function truncateText(text, len) {
    let txt = "";
    if (text) {
        txt = text.length > len ? `${text.slice(0, len)}...` : text;
    }
    return txt;
}

export const GetAccessToken = () => ({ Authorization: `Bearer ${window.localStorage.getItem("serviceToken")}` });
export const GetJWT = () => window.localStorage.getItem("serviceToken");
export const GetRefreshToken = () => ({ Authorization: `Bearer ${window.localStorage.getItem("serviceRefreshToken")}` });
export const GetRawRefreshToken = () => window.localStorage.getItem("serviceRefreshToken");
export const GetActiveTheme = () => JSON.parse(window.localStorage.getItem("berry-config")).presetColor;
export const getFormattedDatetime = (dateTimeString) => {
    const date = new Date(dateTimeString);

    const optionsDate = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    };
    const formattedDate = date.toLocaleDateString("en-CA", optionsDate);

    const optionsTime = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    };
    const formattedTime = date.toLocaleTimeString("en-GB", optionsTime);

    return `${formattedDate} ${formattedTime}`;
};
// *********************** Login Constants ****************************
export const ANALYTICS_WEBSITE_URL = "https://xtremeanalytix.com/";
export const WINDOW_OPTIONS = "_blank";
export const ADDITIONAL_OPTIONS = "noopener,noreferrer";
