import { getSqlConnection } from '../../sqlConnection';

module.exports = {
    getRecordSet: async function(skip, take){
        let pool = await getSqlConnection();
    

        const { recordset } = await pool.request()
        .query(`select * from hl_householdhistory_temp
                ORDER BY ID
                OFFSET     ${skip} ROWS 
                FETCH NEXT ${take} ROWS ONLY`);

        const batchKey = recordset.length > 0 ? `${recordset[0].ID}_${recordset[recordset.length-1].ID}` : null;


        return { recordset, batchKey  };
    },
    operationSchema: {
        entity: "hl_householdclients",
        operation: "POST",
        fields:{
            hl_begindate: 'BeginDate',
            hl_enddate: 'EndDate',
            hl_relationship: 'Relationship',
             "hl_ContactId@odata.bind": {
                 relatedEntity: "contacts",
                 field: "ClientGuid"
             },
            "hl_HouseholdId@odata.bind": {
                relatedEntity: "hl_households",
                field: "HouseholdGuid"
            },
            hl_migrationid: (record) => record['ID'].toString()
        }
    },
    stageData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[hl_stage_householdhistory]");
    },
    confirmData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[hl_confirm_householdhistory]");
    },
    pageSize: 250
}