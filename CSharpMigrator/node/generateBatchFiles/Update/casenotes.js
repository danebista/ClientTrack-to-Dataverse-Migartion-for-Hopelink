import { getSqlConnection } from '../../sqlConnection';

const systemuserid = "4fc8098e-19be-e911-a966-000d3a1d51ba";

module.exports = {
    getRecordSet: async function(skip, take){
        let pool = await getSqlConnection();
    

        const { recordset } = await pool.request()
        .query(`select *
                FROM dummy_casenotes_deactivate
                ORDER BY UniqueID
                OFFSET     ${skip} ROWS 
                FETCH NEXT ${take} ROWS ONLY`);

        const batchKey = recordset.length > 0 ? `${recordset[0].UniqueID}_${recordset[recordset.length-1].UniqueID}` : null;


        return { recordset, batchKey  };
    },
    operationSchema:{
        entity: "hl_casenotes",
        entityId: "Id",
        operation: "PATCH",
        fields:{
            "statecode": 1,
            "statuscode": 2
        }
    },
    stageData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[hl_update_casenotes]");
    },
    confirmData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[hl_update_casenotes_confirm]");
    }    
}