import { getSqlConnection } from '../../sqlConnection';
import { createBatchFile } from '../../batch';

module.exports = {
    createCustomBatch: async function(skip, take){
        let pool = await getSqlConnection();

        const { recordset } = await pool.request()
        .query(`select ci.ID, ci.HouseholdID, ci.InsertedID, cs.DateAdded HHBeginDate, ci.Relationship, ci.HHID, ci.ClientID, ci.FormattedClientNumber
        from hl_clients_inserted ci
        inner join HL_ClientsToExportSnapshot cs on ci.ClientID = cs.ClientID
       
        WHERE  ci.HouseholdMemberID IS  NULL AND ci.HouseholdID IS NOT NULL  and cs.DateAdded is not null
        ORDER BY ID
                 OFFSET     ${skip} ROWS 
                 FETCH NEXT ${take} ROWS ONLY`);
    
        if((recordset||[]).length === 0)
            return { tryNext: false };
    
            const lockKey = `${recordset[0].FormattedClientNumber}_${recordset[recordset.length-1].FormattedClientNumber}`;
    
            const requests = [];
    
            for(let record of recordset){
                requests.push({
                    resource: "hl_householdclients",
                    method: "POST",
                    data: {
                        hl_begindate: record['HHBeginDate'],
                        hl_relationship: record['Relationship'],
                        "hl_ContactId@odata.bind": `/contacts(${record['InsertedID']})`,
                        "hl_HouseholdId@odata.bind": `/hl_households(${record['HouseholdID']})`,
                        hl_migrationid: `${record['HHID']}_${record['ClientID']}`
                    }
                });
        
                requests.push({
                    resource: `contacts(${record['InsertedID']})`,
                    method: "PATCH",
                    data: {
                        "hl_ActiveHousehold@odata.bind": `/hl_households(${record['HouseholdID']})`,
                        "hl_ActiveHouseholdClient@odata.bind": "${contentId}"
                    }
                });
            }
    
            createBatchFile(requests,lockKey, process.env['batchesFolder']);

            return { tryNext: true };
    },
    stageData: async function(){
    },
    confirmData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[hl_Confirm_HouseholdMember_atag]");
    },
    pageSize: 250
}