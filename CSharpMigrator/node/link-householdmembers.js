import { getHttpClient, apiUrl } from './apiClient';
import { getSqlConnection } from './sqlConnection';
import { StopWatch } from 'stopwatch-node';
import { createBatchRequest } from './batch';
import {GetRandomId} from './utilities';



function getGuidFromResponse(response){
    return response.headers['odata-entityid'].match(/[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}/)[0];
}

function getGuidFromOdata(odata){
    return odata.match(/[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}/)[0];
}

export async function deleteWrong(){
    const httpClient = getHttpClient();
    var data = []
        for(let r of data){
            await httpClient.delete(`hl_householdclients(${r})`); 
        }
   
}

async function callService() {
  const a = await httpClient.get("contacts?$top=1&$select=firstname");
  console.log(a.data.value);
}

export function getGuidsFromBatchResponse(rawResponse){
    var occurrencies = rawResponse.match(/OData-EntityId:.*\/hl_householdclients\([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}\)/gm)
    return occurrencies.map(o=>getGuidFromOdata(o));
}

export async function batchLinkHouseholdMembers() {
    const sw = new StopWatch('sw');
    sw.start("Household Client Task")
    console.info(`Started at ${new Date().toISOString()}`);

    let pool = await getSqlConnection();
    const lockKey = GetRandomId();

    console.log('lockKey',lockKey);

    await pool.request()
    .query(`UPDATE hl_clients_inserted SET IsLocked=1, LockedKey='${lockKey}'
             WHERE ID IN  (select top 500 ID
                            from hl_clients_inserted 
                            where HouseholdMemberID IS NULL 
                            AND HouseholdID IS NOT NULL
                            AND ISNULL(IsLocked,0)=0)`)

    const { recordset } = await pool.request()
    .query(`select HouseholdID, InsertedID, HHBeginDate, Relationship, HHID, ClientID
             from hl_clients_inserted where LockedKey='${lockKey}'`);

           

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

    var responseBody = await createBatchRequest(requests,lockKey);

    // var insertedGuids = getGuidsFromBatchResponse(responseBody);

    // console.log("Updating hl_clients_inserted")

    // for(let i =0; i < insertedGuids.length; i++){
    //     console.log("insertedGuids", insertedGuids[i])
    //     console.log("ClientGuid", recordset[i]['InsertedID'])


    //     await pool.request()
    //     .query(`UPDATE hl_clients_inserted SET HouseholdMemberID='${insertedGuids[i]}' WHERE InsertedID='${recordset[i]['InsertedID']}'`); 
    // }

    console.info(`Finished at ${new Date().toISOString()}`)
    sw.stop();
    console.info(`Short Summary: ${sw.shortSummary()}`);
}


export async function linkHouseholdMembers() {
    const sw = new StopWatch('sw');
    sw.start('Household Client Linking');
    console.info(`Started at ${new Date().toISOString()}`)

    let counter = 1;

    let pool = await getSqlConnection();
    const httpClient = getHttpClient();

    let sqlResult = await pool.request()
    .query(`select top 1 HouseholdID, InsertedID, HHBeginDate, Relationship, HHID, ClientID
             from hl_clients_inserted where HouseholdMemberID IS NULL AND HouseholdID IS NOT NULL`);

             try{
                for(let client of sqlResult.recordset){
                    const response1 = httpClient.post("hl_householdclients", {
                                                hl_begindate: client['HHBeginDate'],
                                                hl_relationship: client['Relationship'],
                                                 "hl_ContactId@odata.bind": `/contacts(${client['InsertedID']})`,
                                                "hl_HouseholdId@odata.bind": `/hl_households(${client['HouseholdID']})`,
                                                hl_migrationid: `${client['HHID']}_${client['ClientID']}`
                                            });

                       const insertedId = getGuidFromResponse(response1);

                       console.log("Household Member Created id:",insertedId);

                       const response2 = await httpClient.patch(`contacts(${client['InsertedID']})`, {
                                                 "hl_ActiveHousehold@odata.bind": `/hl_households(${client['HouseholdID']})`,
                                                 "hl_ActiveHouseholdClient@odata.bind": `/hl_householdclients(${insertedId})`
                                            });

                        console.log("Updated Client's Active HH and HH Client on CSP")
                            
                        await pool.request()
                            .query(`UPDATE hl_clients_inserted SET HouseholdMemberID='${insertedId}' WHERE InsertedID='${client['InsertedID']}'`);      

                        console.log("Updated Client's HH Client on DB")

                        console.log(`Household Member linked ${counter}/${sqlResult.recordset.length} at ${new Date().toISOString()}`);
                        counter++;

                 }
             }
             catch(ex){
                 if(ex.response)
                    console.log(ex.response);

                 console.log(ex);
             }

             sw.stop();
             console.info(`Short Summary: ${(sw.shortSummary() / 1000) / 60} minutes`);
             

           

}