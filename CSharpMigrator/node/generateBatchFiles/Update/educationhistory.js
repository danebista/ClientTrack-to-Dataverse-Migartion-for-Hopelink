import { getSqlConnection } from '../../sqlConnection';

module.exports = {
    getRecordSet: async function(skip, take){
        let pool = await getSqlConnection();
    

        const { recordset } = await pool.request()
        .query(`select *
                FROM hl_educationhistory_temp
                ORDER BY ID
                OFFSET     ${skip} ROWS 
                FETCH NEXT ${take} ROWS ONLY`);

        const batchKey = recordset.length > 0 ? `${recordset[0].EvalId}_${recordset[recordset.length-1].EvalId}` : null;


        return { recordset, batchKey  };
    },
    operationSchema: {
        entity: "hl_educationhistories",
        entityId: "CSP_ID",
        operation: "PATCH",
        fields: {
            "hl_dateenrolled": "DateEnrolled",
            "hl_schoolname": "SchoolName",
            "hl_status": "Status",
            "hl_client_id@odata.bind": {
                relatedEntity: "contacts",
                field: "ClientGuid"
            },
            "hl_education_level@odata.bind": {
                relatedEntity: "hl_educationlevels",
                field: "EducationLevelID"
            },
            "hl_education_type@odata.bind": {
                relatedEntity: "hl_educationtypes",
                field: "EducationTypeID"
            }
        }
    },
    stageData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[hl_update_EducationHistory]");
    },
    confirmData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[hl_update_EducationHistory_confirm]");
    }    
}