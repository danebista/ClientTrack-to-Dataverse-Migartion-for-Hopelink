import { getSqlConnection } from '../../sqlConnection';

module.exports = {
    getRecordSet: async function(skip, take){
        let pool = await getSqlConnection();
    

        const { recordset } = await pool.request()
        .query(`select * from hl_serviceinstanceclient_temp
                ORDER BY ClientID
                OFFSET     ${skip} ROWS 
                FETCH NEXT ${take} ROWS ONLY`);

        const lastRecord = recordset[recordset.length-1];
        const batchKey = recordset.length > 0 ? `${lastRecord.ClientID}`  : null;


        return { recordset, batchKey  };
    },
    operationSchema:{
        entity: "hl_serviceinstanceclients",
        operation: "POST",
        fields:{
         "hl_migrationid": (record) =>  record["ServiceID"].toString(),
         "hl_ContactId@odata.bind":{
            relatedEntity: "contacts",
            field: "ClientGuid"
         },
         "hl_ServiceInstanceId@odata.bind":{
             relatedEntity: "hl_serviceinstances",
             field: "ServiceGuid"
         }
        }
    },
    stageData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[hl_stage_serviceclients]");
    },
    confirmData: async function(){
       
    },
    pageSize: 1000    
}