import { getSqlConnection } from '../../sqlConnection';

module.exports = {
    getRecordSet: async function(skip, take){
        let pool = await getSqlConnection();
    

        const { recordset } = await pool.request()
        .query(`select * from 
                dummy_eduhistory_deactivate
                ORDER BY InsertedId

                OFFSET     ${skip} ROWS 
                FETCH NEXT ${take} ROWS ONLY`);

        const batchKey = recordset.length > 0 ? recordset[recordset.length-1].Id : null;


        return { recordset, batchKey  };
    },
    operationSchema:{
        entity: "hl_educationhistories",
        entityId: "Id" ,
        operation: "DELETE",
        fields:{
            "statecode": 1,
            "statuscode": 2,
        }
    },
    stageData: async function(){
       
    },
    confirmData: async function(){
    },
    pageSize: 1000   
}
