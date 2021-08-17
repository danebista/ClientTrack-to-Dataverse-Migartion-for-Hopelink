import { getSqlConnection } from '../../sqlConnection';

module.exports = {
    getRecordSet: async function(skip, take){
        let pool = await getSqlConnection();
    

        const { recordset } = await pool.request()
        .query(`select * from hl_enrollmentcase_temp
                ORDER BY ID
                OFFSET     ${skip} ROWS 
                FETCH NEXT ${take} ROWS ONLY`);

        const batchKey = recordset.length > 0 ? `${recordset[0].CaseFormattedNumber}_${recordset[recordset.length-1].CaseFormattedNumber}` : null;


        return { recordset, batchKey  };
    },
    operationSchema: {
        entity: "hl_enrollmentcases",
        entityId: "CSP_ID",
        operation: "PATCH",
        fields:{
                "hl_appointmentdate": "AppointmentDate",
                "statecode": (record) => record['ActiveStatus'] == true ? 1 : 0,
                "hl_EnrollmentPhaseStatusId@odata.bind":  {
                    relatedEntity: "hl_enrollmentphasestatuses",
                    field: "EnrollmentPhaseStatusId"
                },
                "hl_ProgramVersion@odata.bind":  {
                    relatedEntity: "hl_programversions",
                    field: "PrograVersionId"
                },
                "hl_ProgramOfferingLocationId@odata.bind":  {
                    relatedEntity: "hl_programofferinglocations",
                    field: "ProgramOfferingLocationId"
                },
                "hl_address1stateorprovinceid@odata.bind":   {
                    relatedEntity: "hl_states",
                    field: "StateGuid"
                },
                "hl_address1cityid@odata.bind":  {
                    relatedEntity: "hl_cities",
                    field: "CityGuid"
                },
                "hl_address1zipcodeid@odata.bind":  {
                    relatedEntity: "hl_zipcodes",
                    field: "ZipcodeGuid"
                },
                "hl_approveddate": (record) => (record['EnrollDate']||null),
                "hl_amipercentage": "AMI",
                "hl_projected_outcome_ami": "AMI",
                "hl_projected_eligibility_ami": "AMI",
                "hl_fplpercentage": "FPL",
                "hl_projected_eligibility_fpl": "FPL",
                "hl_projected_outcome_fpl": "FPL",
                "hl_address1line1": "Address1Line1",
                "hl_address1line2": "Address1Line2",
                "hl_zipcodeid": "Address1PostalCode",
                "hl_certifieddate": "CertificationDate",
                "hl_outreach": "Outreach",
                "hl_outreachother": "OutreachOther",
                "hl_exitdate": "ProgramEnd"
              }
    },
    stageData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[hl_update_enrollmentcases]");
    },
    confirmData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[hl_update_enrollmentcases_confirm]");
    }    
}