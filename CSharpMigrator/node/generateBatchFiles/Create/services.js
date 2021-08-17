import { getSqlConnection } from '../../sqlConnection';

module.exports = {
    getRecordSet: async function(skip, take){
        let pool = await getSqlConnection();
    

        const { recordset } = await pool.request()
        .query(`select * from  hl_serviceinstance_temp 
                ORDER BY ServiceID
                OFFSET     ${skip} ROWS 
                FETCH NEXT ${take} ROWS ONLY`);

        const batchKey = recordset.length > 0 ? `${recordset[0].ServiceID}_${recordset[recordset.length-1].ServiceID}` : null;


        return { recordset, batchKey  };
    },
    operationSchema: {
        entity: "hl_serviceinstances",
        operation: "POST",
        fields:   {
            "hl_servicedate": "BeginDate",
            "hl_units": (record)=> (record['Units']||0) >= 0.1 ? record['Units'] : record['UnitValue'],
            "hl_unitsofmeasure": "UnitsOfMeasure",
            "hl_servicelocationid@odata.bind": {
                relatedEntity: "hl_servicelocations",
                field: "ServiceLocationID"
            },
            "hl_ServiceVersionId@odata.bind":  {
                relatedEntity: "hl_serviceversions",
                field: "ServiceVersionID"
            },
            "hl_comments": "Comments",
            "hl_clientid@odata.bind":  {
                relatedEntity: "contacts",
                field: "ClientGuid"
            },
            "hl_migrationid": (record) => record["ServiceID"].toString(),
            "hl_EnrollmentCaseId@odata.bind": {
                relatedEntity: "hl_enrollmentcases",
                field:"CaseGuid"
            }
        }
    },
    stageData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[hl_stage_services]");
    },
    confirmData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[hl_ConfirmServiceInstance_atag]");
    }    
}