import { getSqlConnection } from '../../sqlConnection';
import moment from 'moment';

module.exports = {
    getRecordSet: async function(skip, take){
        let pool = await getSqlConnection();
    

        const { recordset } = await pool.request()
        .query(`select *
                from tt_to_beti
                ORDER BY ClientID
                OFFSET     ${skip} ROWS 
                FETCH NEXT ${take} ROWS ONLY`);

        const batchKey = recordset.length > 0 ? `${recordset[0].ClientID}`: null;


        return { recordset, batchKey  };
    },
    operationSchema: {
        entity: "contacts",
        entityId: "InsertedID",
        operation: "PATCH",
        fields: {
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
            "emailaddress1": "EMailAddress1",
            "mobilephone": "Telephone1",
            "address1_stateorprovince": "Address1StateOrProvince",
            "address1_telephone2": "Telephone2",
            "address1_telephone3": "Telephone3",
            "hl_stateid@odata.bind": {
                relatedEntity: "hl_states",
                field: "StateGuid"
            },
            "hl_cellphone": "CellPhone",
            "hl_cityid@odata.bind": {
                relatedEntity: "hl_cities",
                field: "CityGuid"
            },
            "hl_emailavailable": "IsEmailAvailable",
            "hl_emergencycontactname": "EmergencyContactName",
            "cr031_emergencytelephone1": "EmergencyContactPhone1",
            "cr031_emergencytelephone2": "EmergencyContactPhone2",
            "telephone2": "Telephone1",
            "hl_limitedenglish": "LimitedEnglish",
            "familystatuscode": "MaritalStatus",
            "middlename": "middleName",
            "hl_ssn": "SSN",
            "hl_ssnquality": "SSNQuality",
            "hl_zipcodeid": "ZipcodeGuid"
        }
    },
    stageData: async function(){
    },
    confirmData: async function(){
    },
    pageSize: 250
}
