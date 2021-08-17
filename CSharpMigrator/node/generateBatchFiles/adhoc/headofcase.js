import { getSqlConnection } from '../../sqlConnection';

module.exports = {
    getRecordSet: async function(skip, take){
        let pool = await getSqlConnection();
    

        const { recordset } = await pool.request()
        .query(`select Id,  ClientGuid, EnrollmentCaseGuid, EnrollmentGuid
                from hl_enrollmentcases_to_update
                ORDER BY Id
                OFFSET     ${skip} ROWS 
                FETCH NEXT ${take} ROWS ONLY`);

        const batchKey = recordset.length > 0 ? `${recordset[0].Id}_${recordset[recordset.length-1].Id}` : null;


        return { recordset, batchKey  };
    },
    operationSchema:  {
        entity: `hl_enrollmentcases`,
        entityId: "EnrollmentCaseGuid",
        operation: "PATCH",
        fields:{
            "hl_headofcase@odata.bind": {
                relatedEntity: "hl_enrollments",
                field: "EnrollmentGuid"
            },
            "hl_headofcaseclient@odata.bind": {
                relatedEntity: "contacts",
                field: "ClientGuid"
            },
            "hl_exitdate": (record) => record['hl_exit_date'] ?  record['hl_exit_date'] : '01/01/2099'
        }
    },
    stageData: async function(){
    },
    confirmData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[hl_headofcase_confirm_atag]");
    }    
}