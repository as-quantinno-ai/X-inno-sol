class CatalogsDTO {
    constructor(
        catalogsid,
        datasetid,
        tabletype,
        tableid,
        tablename,
        tableloadstatus,
        partialloadedlocation,
        createdatetime,
        updatedatetime
    ) {
        this.catalogsid = catalogsid;
        this.datasetid = datasetid;
        this.tabletype = tabletype;
        this.tableid = tableid;
        this.tablename = tablename;
        this.tableloadstatus = tableloadstatus;
        this.partialloadedlocation = partialloadedlocation;
        this.createdatetime = createdatetime;
        this.updatedatetime = updatedatetime;
    }
}

export default CatalogsDTO;
