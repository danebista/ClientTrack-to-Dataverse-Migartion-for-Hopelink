import { getSqlConnection } from '../../sqlConnection';

module.exports = {
    getRecordSet: async function(skip, take){
        let pool = await getSqlConnection();
    

        const { recordset } = await pool.request()
        .query(`select *
                from hl_enrollmentcase_inserted
                WHERE EnrollmentAssessmentId IS NULL
                ORDER BY ID
                OFFSET     ${skip} ROWS 
                FETCH NEXT ${take} ROWS ONLY`);

        const batchKey = recordset.length > 0 ? `${recordset[0].CaseFormattedNumber}_${recordset[recordset.length-1].CaseFormattedNumber}` : null;


        return { recordset, batchKey  };
    },
    operationSchema: {
        entity: "hl_enrollmentassessments",
        operation: "POST",
        fields: {
            "hl_istheaddresseligible": 100000000,
            "hl_EnrollmentCase@odata.bind": {
                relatedEntity: "hl_enrollmentcases",
                field: "InsertedID"
            },
            "hl_appointmentdate": "AppointmentDate",
            "hl_base": ({ ProgramName })=> ProgramName.indexOf('PSA') > -1  || ProgramName.indexOf('HEAP') > -1 ? 3 : 1,
            "hl_finanaceassessmentstatus": 100000001,
            "hl_name": (record) => `Assessment ${record['hl_caseid']} | ${record['ProgramName']}}`,
            "hl_programspecificassessmentstatus": 100000001,
            "hl_standardassessmentstatus": 100000001,
            "hl_Zipcode@odata.bind":  {
                relatedEntity: "hl_zipcodes",
                field: "ZipcodeGuid"
            }
        }
    },
    stageData: async function(){
    },
    confirmData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[Confirm_EnrollmentAssessment_Atag]");
    }    
}
