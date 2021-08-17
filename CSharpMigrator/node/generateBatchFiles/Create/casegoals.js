import { getSqlConnection } from '../../sqlConnection';

module.exports = {
    getRecordSet: async function(skip, take){
        let pool = await getSqlConnection();
    

        const { recordset } = await pool.request()
        .query(`select * from dummy_case_goals
                ORDER BY GoalID
                OFFSET     ${skip} ROWS 
                FETCH NEXT ${take} ROWS ONLY`);

        const batchKey = recordset.length > 0 ? `${recordset[0].GoalID}_${recordset[recordset.length-1].GoalID}` : null;


        return { recordset, batchKey  };
    },
    operationSchema: {
        entity: "hl_casegoals",
        operation: "POST",
        fields:{
            "hl_client_id@odata.bind": {
                relatedEntity: "contacts",
                field: "ClientGuid"
            },
            "hl_enrollment_case_id@odata.bind": {
                relatedEntity: "hl_enrollmentcases",
                field: "EnrollmentCaseGuid"
            },
            "hl_goalgroupid@odata.bind": {
                relatedEntity: "hl_goalgroups",
                field: "GoalGroupID"
            },
            "hl_goaldescriptionid@odata.bind": {
                relatedEntity: "hl_goalses",
                field: "GoalDescriptionID"
            },
            "hl_status": "StatusValue",
            "hl_migrationid": (record) => record["GoalID"].toString(),
        }
    },
    stageData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[hl_stage_goalcases]");
    },
    confirmData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[hl_confirm_goalcases_atag]");
    }
    
}