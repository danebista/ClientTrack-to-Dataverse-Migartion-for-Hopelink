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
        entity: "hl_enrollmentassessments",
        entityId: "EnrollAssessmentId",
        operation: "GET",
        fields:{}
    },
    stageData: async function(){
    },
    confirmData: async function(){
    }    
}
