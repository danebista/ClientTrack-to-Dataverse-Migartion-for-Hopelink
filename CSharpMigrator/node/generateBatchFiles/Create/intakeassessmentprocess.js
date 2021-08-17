import { getSqlConnection } from '../../sqlConnection';
import sql from 'mssql/msnodesqlv8';

module.exports = {
    getRecordSet: async function(skip, take){
        let pool = await getSqlConnection();
    

        const { recordset } = await pool.request()
        .input('skip',sql.Int, skip)
        .input('take',sql.Int, take)
        .execute('hl_get_IntakeAssessmentProcess');

        const batchKey = recordset.length > 0 ? recordset[0].Id : null;


        return { recordset, batchKey  };
    },
    operationSchema: {
        entity: "hl_intakeassessmentprocesses",
        entityId: "Id",
        operation: "PATCH",
        fields:{
            "activestageid@odata.bind": {
                relatedEntity: "processstages",
                field:"ActiveStatus"
            },
            "bpf_hl_enrollmentassessmentid@odata.bind": {
                relatedEntity:"hl_enrollmentassessments",
                field:"EnrollAssessmentId"
            }
        }
    },
    stageData: async function(){
    },
    confirmData: async function(){
    }    
}
