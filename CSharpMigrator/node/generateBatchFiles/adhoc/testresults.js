import { getSqlConnection } from '../../sqlConnection';

module.exports = {
    getRecordSet: async function(skip, take){
        let pool = await getSqlConnection();
    

        const { recordset } = await pool.request()
        .query(`select * from tt_todelete
                ORDER BY InsertedId
                OFFSET     ${skip} ROWS 
                FETCH NEXT ${take} ROWS ONLY`);

        const batchKey = recordset.length > 0 ? recordset[recordset.length-1].InsertedId: null;


        return { recordset, batchKey  };
    },
    operationSchema:{
        entity: "hl_testresultses",
        entityId: "InsertedId",
        operation: "DELETE",
        fields:{
           
        }
    },
    stageData: async function(){
       
    },
    confirmData: async function(){
    },
    pageSize: 500   
}
