import { getSqlConnection } from '../../sqlConnection';
import sql from 'mssql/msnodesqlv8';

module.exports = {
    getRecordSet: async function(skip, take){
        let pool = await getSqlConnection();
    

        const { recordset } =  await pool.request()
                                .input('skip',sql.Int, skip)
                                .input('take',sql.Int, take)
                                .execute('[dbo].[hl_get_EnrollmentToRelate_HOC]');

        const batchKey = recordset.length > 0 ? recordset[recordset.length-1].EnrollmentAssessmentId : null;


        return { recordset, batchKey  };
    },
    operationSchema: {
        entity: "hl_enrollmentassessments",
        entityId: "EnrollmentAssessmentId",
        associationEntity: "hl_hl_enrollmentassessment_hl_responseHOC",
        operation: "POST",
        fields:{
            "@odata.id": {
                relatedEntity: "hl_clientassessmentresponses",
                field: "ClientAssessmentResponseId"
            }
        }
    },
    stageData: async function(){
    },
    confirmData: async function(){
    }    
}