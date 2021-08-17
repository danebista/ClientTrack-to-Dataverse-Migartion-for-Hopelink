import { getSqlConnection } from '../../sqlConnection';

module.exports = {
    getRecordSet: async function(skip, take){
        let pool = await getSqlConnection();
    

        const { recordset } = await pool.request()
        .query(`SELECT * From enrollment_phase_status
                ORDER BY InsertedID
                OFFSET     ${skip} ROWS 
                FETCH NEXT ${take} ROWS ONLY
              `);

        const batchKey = recordset.length > 0 ? `${recordset[0].InsertedID}` : null;


        return { recordset, batchKey  };
    },
    operationSchema: {
        entity: "hl_enrollmentcases",
        entityId: "InsertedID",
        operation: "PATCH",
        fields:{
          "hl_EnrollmentPhaseStatusId@odata.bind":  {
            relatedEntity: "hl_enrollmentphasestatuses",
            field: "PhaseStatus"
        }
        }
    },
    stageData: async function(){
    },
    confirmData: async function(){
    },
    pageSize: 100
}
