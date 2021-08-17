import { getSqlConnection } from '../../sqlConnection';

module.exports = {
    getRecordSet: async function(skip, take){
        let pool = await getSqlConnection();
    

        const { recordset } = await pool.request()
        .query(`select *
                FROM dummy_workhistories
                ORDER BY WorkHistID
                OFFSET     ${skip} ROWS 
                FETCH NEXT ${take} ROWS ONLY`);

        const batchKey = recordset.length > 0 ? `${recordset[0].WorkHistID}_${recordset[recordset.length-1].WorkHistID}` : null;


        return { recordset, batchKey  };
    },
    operationSchema: {
        entity: "hl_employmenthistories",
        entityId: "InsertedID",
        operation: "PATCH",
        fields:{
            "statecode": 1,
            "statuscode": 2
        }
    },
    stageData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[hl_update_WorkHistory]");
    },
    confirmData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[hl_update_WorkHistory_confirm]");
    }    
}