import { getSqlConnection } from '../../sqlConnection';

const systemuserid = "2a07c2bd-3809-eb11-a813-000d3a98d1ad";

module.exports = {
    getRecordSet: async function(skip, take){
        let pool = await getSqlConnection();
    

        const { recordset } = await pool.request()
        .query(`select *, '${systemuserid}' as SystemUserID 
                FROM hl_casenote_temp
                ORDER BY UniqueID
                OFFSET     ${skip} ROWS 
                FETCH NEXT ${take} ROWS ONLY`);

        const batchKey = recordset.length > 0 ? `${recordset[0].UniqueID}_${recordset[recordset.length-1].UniqueID}` : null;


        return { recordset, batchKey  };
    },
    operationSchema:{
        entity: "hl_casenotes",
        operation: "POST",
        fields:{
            "hl_notes": "Note",
            "hl_migrationid": (record) => record["UniqueID"].toString(),
            "hl_casemanager@odata.bind": {
                relatedEntity:"systemusers",
                field: "SystemUserID"
            },
            "hl_clientid@odata.bind": {
                relatedEntity: "contacts",
                field: "ClientGuid"
            },
            "hl_enrollmentcaseid@odata.bind": {
                relatedEntity: "hl_enrollmentcases",
                field: "EnrollmentCaseGuid"
            },
            "hl_title": "Regarding",
            "hl_date_of_service": "EntryDate",
            "hl_notessummary": "NoteSummary"
        }
    },
    stageData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[hl_stage_casenotes]");
    },
    confirmData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[hl_confirm_casenote_atag]");
    },
    pageSize: 1000
}