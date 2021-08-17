import { getSqlConnection } from '../../sqlConnection';

module.exports = {
    getRecordSet: async function(skip, take){
        let pool = await getSqlConnection();
    

        const { recordset } = await pool.request()
        .query(`SELECT * From delete_enrollmentassessments
                ORDER BY Id
                OFFSET     ${skip} ROWS 
                FETCH NEXT ${take} ROWS ONLY
              `);

        const batchKey = recordset.length > 0 ? `${recordset[0].Id}` : null;


        return { recordset, batchKey  };
    },
    operationSchema: {
        entity: "hl_enrollmentassessments",
        entityId: "Id",
        operation: "DELETE",
        fields:{
        }
    },
    stageData: async function(){
    },
    confirmData: async function(){
    },
    pageSize: 1000
}
