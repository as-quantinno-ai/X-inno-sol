export const THEME_MODE = {
    DARK: "dark",
    LIGHT: "light"
};

export const USER_ROLES = {
    USER_TR: "USER@TR",
    TENANT_ADMIN: "TENANT_ADMIN"
};

export const LOCAL_STORAGE_KEYS = {
    SELECTED_DATASETS: "selectDataSet"
};

export const FILE_FORMAT = {
    MYSQL: "MYSQL",
    PGSQL: "PGSQL",
    CSV: "CSV",
    EXCEL: "EXCEL"
};

export const SOURCE_TYPE = {
    LOCALFS: "LOCALFS",
    DATA_FORM: "DATA-FORM",
    CSV: "CSV",
    S3: "S3",
    KAFKA: "KAFKA",
    AVRO: "AVRO",
    MYSQL: "MYSQL"
};

export const UserFormFields = [
    { id: "firstName", label: "First Name" },
    { id: "lastName", label: "Last Name" },
    { id: "emailAddress", label: "Email" },
    { id: "phone", label: "Phone Number" },
    { id: "companyName", label: "Company Name" }
];

export const dataSource = [
    { label: "Standardize Layer", value: "BRONZE" },
    { label: "Curated Layer", value: "SILVER" },
    { label: "Consumption Layer", value: "GOLD" },
    { label: "Intelligence Layer", value: "ML_PUBLISH" }
];

export const EXCLUDED_KEYS = [
    "uuid_identifier_da_an_v1",
    "status_identifier_da_an_v1",
    "DATA_STATUS",
    "offset_msg_xan",
    "partition_msg_xan",
    "topic_name_xan"
];

export const EXCLUDED_FORM_ATTRIBUTES = [
    "uuid_identifier_da_an_v1",
    "status_identifier_da_an_v1",
    "timestamp_identifier_da_an_v1",
    "offset_msg_xan",
    "partition_msg_xan",
    "topic_name_xan"
];

// Utility Functions

export const getStage = (stage) => {
    switch (stage) {
    case "BRONZE":
        return "Standardize Layer";
    case "SILVER":
        return "Curated Layer";
    case "GOLD":
        return "Consumption layer";
    case "PRE_BRONZE":
        return "Raw";
    case "ML_PUBLISH":
        return "Intelligence Layer";
    default:
        return stage;
    }
};

export const filterKeys = (keys) => keys.filter((key) => !EXCLUDED_KEYS.includes(key));

export const filterFormAttributes = (keys) => keys.filter((key) => !EXCLUDED_FORM_ATTRIBUTES.includes(key.attributeName));

export const formatKey = (key) => key.replace("_identifier_da_an_v1", "").replace("_xan", "").replace(/_/g, " ").toUpperCase();

export const convertToUTC = (date, time) => {
    const [year, month, day] = date.split("-").map(Number);
    const [hours, minutes] = time.split(":").map(Number);

    const localDate = new Date(year, month - 1, day, hours, minutes);

    return new Date(localDate).toISOString();
};
