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
        operation: "POST",
        fields:{
            "hl_consent_boolean": (record) => record["Consent"] == 100000000,
            "hl_consent": "Consent",
            "hl_HeadofHouseholdId@odata.bind":  {
                relatedEntity: "contacts",
                field: "ClientGuid"
            },
            "hl_address1line1": "Address1Line1",
            "hl_address1line2": "Address1Line2",
            "hl_addresscity@odata.bind": {
                relatedEntity: "hl_cities",
                field: "CityGuid"
            },
            "hl_address1state@odata.bind":  {
                relatedEntity: "hl_states",
                field: "StateGuid"
            },
            "hl_addresszipcode@odata.bind":{
                relatedEntity: "hl_zipcodes",
                field: "ZipcodeGuid"
            },
             
            "hl_address1stateorprovince": "Address1StateOrProvince",
            "hl_address1postalcode": "Address1PostalCode",
            "hl_communityguidelines": 100000001,
            "hl_confidentialaddress": false,
            "hl_householdtype": "FamilyType",
            "hl_migrationid": (record) => record["HHID"].toString()
        }
    },
    stageData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[hl_stage_households]");
    },
    confirmData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[Confirm_Household_Migrated_atag]");
    }    
}