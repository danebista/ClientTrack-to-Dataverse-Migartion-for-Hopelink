import { getSqlConnection } from '../../sqlConnection';

module.exports = {
    getRecordSet: async function(skip, take){
        let pool = await getSqlConnection();
    

        const { recordset } = await pool.request()
        .query(`select * from hl_enrollment_temp
                ORDER BY ID
                OFFSET     ${skip} ROWS 
                FETCH NEXT ${take} ROWS ONLY`);

        const batchKey = recordset.length > 0 ? `${recordset[0].EnrollID}_${recordset[recordset.length-1].EnrollID}` : null;


        return { recordset, batchKey  };
    },
    operationSchema: {
        entity: "hl_enrollments",
        entityId: "CSP_ID",
        operation: "PATCH",
        fields:{
                "hl_enrolleddate": "EnrollDate",
                "hl_exit_date": "ExitDate",
                "hl_exitdate": "ExitDate",
                "hl_relationship": "RelationshipID",
                "hl_applicantstatus": "ApplicantStatus",
                "hl_EnrollmentPhaseStatusId@odata.bind":  {
                    relatedEntity: "hl_enrollmentphasestatuses",
                    field: "PhaseStatusId"
                }
              }
    },
    stageData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[hl_update_enrollments]");
    },
    confirmData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[hl_update_enrollments_confirm]");
    }    
}