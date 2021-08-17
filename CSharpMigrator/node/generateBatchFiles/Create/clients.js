import { getSqlConnection } from '../../sqlConnection';
import moment from 'moment';

module.exports = {
    getRecordSet: async function(skip, take){
        let pool = await getSqlConnection();
    

        const { recordset } = await pool.request()
        .query(`select *
                FROM hl_clients_temp
                ORDER BY ID
                OFFSET     ${skip} ROWS 
                FETCH NEXT ${take} ROWS ONLY`);

        const batchKey = recordset.length > 0 ? `${recordset[0].FormattedClientNumber}_${recordset[recordset.length-1].FormattedClientNumber}` : null;


        return { recordset, batchKey  };
    },
    operationSchema: {
        entity: "contacts",
        operation: "POST",
        fields:  {
            "birthdate": (record) => record["BirthDate"] ? moment(record["BirthDate"]).format("YYYY-MM-DD") : null,
            "hl_birthdatequality": "BirthDateQuality",
            "hl_disablingcondition": "DisablingCondition",
            "hl_emailnotavailable": "IsEmailNotAvailable",
            "hl_ethnicity": "Ethnicity",
            "firstname": "firstName",
            "gendercode": "gender",
            "hl_immigrantnewarrivalorrefugee": "ImmigrantNewArrivalRefugee",
            "hl_citizenshipstatus": "ImmigrantRefugee",
            "hl_LanguageId@odata.bind": {
                relatedEntity: "hl_languages",
                field:"PrimaryLanguage"
            },
            "lastname": "lastName",
            "hl_clientrace": "Race",
            "hl_veteranstatus1": "VeteranStatus1",
            "address1_city": "Address1City",
            "address1_line1": "Address1Line1",
            "address1_line2": "Address1Line2",
            "address1_postalcode": "Address1PostalCode",
            "hl_createanewhousehold": false,
            "emailaddress1": "EMailAddress1",
            "mobilephone": "Telephone1",
            "merged": false,
            "address1_stateorprovince": "Address1StateOrProvince",
            "address1_telephone2": "Telephone2",
            "address1_telephone3": "Telephone3",
            "hl_stateid@odata.bind": {
                relatedEntity: "hl_states",
                field: "StateGuid"
            },
            "isbackofficecustomer": false,
            "hl_cellphone": "CellPhone",
            "hl_cityid@odata.bind": {
                relatedEntity: "hl_cities",
                field: "CityGuid"
            },
            "hl_clientid": "FormattedClientNumber",
            "creditonhold": false,
            "donotbulkemail": false,
            "donotbulkpostalmail": false,
            "donotemail": false,
            "donotfax": false,
            "donotpostalmail": false,
            "donotphone": false,
            "cr031_donotallowtexts": false,
            "hl_emailavailable": "IsEmailAvailable",
            "hl_emergencycontactname": "EmergencyContactName",
            "cr031_emergencytelephone1": "EmergencyContactPhone1",
            "cr031_emergencytelephone2": "EmergencyContactPhone2",
            "followemail": true,
            "msdyn_gdproptout": false,
            "telephone2": "Telephone1",
            "hl_limitedenglish": "LimitedEnglish",
            "familystatuscode": "MaritalStatus",
            "marketingonly": false,
            "middlename": "middleName",
            "hl_migrationid": (record) => record["ClientID"].toString(),
            "participatesinworkflow": false,
            "donotsendmm": false,
            "hl_ssn": "SSN",
            "hl_ssnquality": "SSNQuality",
            "hl_zipcodeid": "ZipcodeGuid"
        }
    },
    stageData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[hl_stage_clients]");
    },
    confirmData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[Confirm_Client_Migrated_atag]");
    }    
}