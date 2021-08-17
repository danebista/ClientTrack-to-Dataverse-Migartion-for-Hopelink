import { getSqlConnection } from '../../sqlConnection';

module.exports = {
    getRecordSet: async function(skip, take){
        let pool = await getSqlConnection();
    

        const { recordset } = await pool.request()
        .query(`select * from hl_classenrollment_temp
                ORDER BY ID
                OFFSET     ${skip} ROWS 
                FETCH NEXT ${take} ROWS ONLY`);

        const batchKey = recordset.length > 0 ? `${recordset[0].ID}_${recordset[recordset.length-1].ID}` : null;


        return { recordset, batchKey  };
    },
    operationSchema: {
        entity: "hl_classenrollments",
        operation: "POST",
        fields:{
            "hl_classid@odata.bind": {
                relatedEntity: "hl_classes",
                field: "ClassID"
            },
            "hl_clientnameid@odata.bind": {
                relatedEntity: "contacts",
                field: "ClientGuid"
             },
            "hl_enrollmentcaseid@odata.bind": {
                relatedEntity: "hl_enrollmentcases",
                field: "EnrollmentCaseGuid"
             }
        }
    },
    stageData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[hl_stage_classenrollments]");
    },
    confirmData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[hl_confirm_classenrollment_atag]");
    }
    
}
