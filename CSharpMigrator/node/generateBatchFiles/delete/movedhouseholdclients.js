import { getSqlConnection } from '../../sqlConnection';

module.exports = {
    getRecordSet: async function(skip, take){
        let pool = await getSqlConnection();
    

        const { recordset } = await pool.request()
        .query(`select Id
                from hl_householdclient_delete 
                ORDER BY Id
                OFFSET     ${skip} ROWS 
                FETCH NEXT ${take} ROWS ONLY`);

        const batchKey = recordset.length > 0 ? recordset[recordset.length-1].Id : null;


        return { recordset, batchKey  };
    },
    operationSchema:{
        entity: "hl_householdclients",
        entityId: "Id" ,
        operation: "DELETE",
        fields:{}
    },
    stageData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[hl_stage_currenthouseholdclient]");
    },
    confirmData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[hl_confirm_currenthouseholdclient]");
    },
    pageSize: 1000 
}