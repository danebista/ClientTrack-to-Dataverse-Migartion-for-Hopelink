import { getSqlConnection } from '../../sqlConnection';

module.exports = {
    getRecordSet: async function(skip, take){
        let pool = await getSqlConnection();
    

        const { recordset } = await pool.request()
        .query(`select *
                from hl_enrollmentcase_inserted
                ORDER BY ID
                OFFSET     ${skip} ROWS 
                FETCH NEXT ${take} ROWS ONLY`);

        const batchKey = recordset.length > 0 ? `${recordset[0].CaseFormattedNumber}_${recordset[recordset.length-1].CaseFormattedNumber}` : null;


        return { recordset, batchKey  };
    },
    operationSchema: {
        entity: "hl_enrollmentassessments",
        entityId: "EnrollmentAssessmentId",
        operation: "PATCH",
        fields: {
            "hl_base": ({ ProgramName })=> ProgramName.indexOf('PSA') > -1  || ProgramName.indexOf('HEAP') > -1 ? 3 : 1
        }
    },
    stageData: async function(){
    },
    confirmData: async function(){
    }    
}
