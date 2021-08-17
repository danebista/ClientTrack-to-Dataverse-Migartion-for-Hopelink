import { getSqlConnection } from '../../sqlConnection';

module.exports = {
    getRecordSet: async function(skip, take){
        let pool = await getSqlConnection();
    

        const { recordset } = await pool.request()
        .query(`select * from hl_household_temp
                ORDER BY ID
                OFFSET     ${skip} ROWS 
                FETCH NEXT ${take} ROWS ONLY`);

        const batchKey = recordset.length > 0 ? `${recordset[0].HHID}_${recordset[recordset.length-1].HHID}` : null;


        return { recordset, batchKey  };
    },
    operationSchema:{
        entity: "hl_households",
        entityId: "CSP_ID",
        operation: "PATCH",
        fields:{
            "hl_consent": "Consent"
        }
    },
    stageData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[hl_Update_households]");
    },
    confirmData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[hl_update_household_confirm]");
    }    
}