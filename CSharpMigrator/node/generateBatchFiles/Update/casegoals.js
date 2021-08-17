import { getSqlConnection } from '../../sqlConnection';

module.exports = {
    getRecordSet: async function(skip, take){
        let pool = await getSqlConnection();
    

        const { recordset } = await pool.request()
        .query(`select * from dummy_casegoals_desc
                ORDER BY GoalID
                OFFSET     ${skip} ROWS 
                FETCH NEXT ${take} ROWS ONLY`);

        const batchKey = recordset.length > 0 ? `${recordset[0].GoalID}_${recordset[recordset.length-1].GoalID}` : null;


        return { recordset, batchKey  };
    },
    operationSchema: {
        entity: "hl_casegoals",
        entityId: "InsertedID",
        operation: "PATCH",
        fields:{

            "hl_goaldescriptionid@odata.bind": {
                relatedEntity: "hl_goalses",
                field: "DescriptionID"
            }
        }
    },
    stageData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[hl_update_goalcases]");
    },
    confirmData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[hl_update_goalcases_confirm]");
    }
    
}