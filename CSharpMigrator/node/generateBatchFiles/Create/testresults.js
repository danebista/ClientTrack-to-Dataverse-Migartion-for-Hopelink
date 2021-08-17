import { getSqlConnection } from '../../sqlConnection';

module.exports = {
    getRecordSet: async function(skip, take){
        let pool = await getSqlConnection();
    

        const { recordset } = await pool.request()
        .query(`select * from hl_testresult_temp
                ORDER BY ID
                OFFSET     ${skip} ROWS 
                FETCH NEXT ${take} ROWS ONLY`);

        const batchKey = recordset.length > 0 ? `${recordset[0].TestResultID}_${recordset[recordset.length-1].TestResultID}` : null;


        return { recordset, batchKey  };
    },
    operationSchema: {
        entity: "hl_testresultses",
        operation: "POST",
        fields:  {
            "hl_testdate": "TestDate",
            "hl_score": ({ Score }) => parseFloat(Score),
            "hl_testtype": "TestType",
            "hl_migrationid": ({ TestResultID }) => TestResultID.toString(),
            "hl_enrollmentcaseId@odata.bind":{
                relatedEntity: "hl_enrollmentcases",
                field: "EnrollmentCaseGuid"
            }
        }
    },
    stageData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[hl_stage_testresults]");
    },
    confirmData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[hl_confirm_testresults]");
    }
    
}