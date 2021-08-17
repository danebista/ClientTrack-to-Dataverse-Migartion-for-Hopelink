import { getSqlConnection } from '../../sqlConnection';

module.exports = {
    getRecordSet: async function(skip, take){
        let pool = await getSqlConnection();
    

        const { recordset } = await pool.request()
        .query(`SELECT * from hl_ec
                ORDER BY insertedId
                OFFSET     ${skip} ROWS 
                FETCH NEXT ${take} ROWS ONLY`);

        const batchKey = recordset.length > 0 ? recordset[recordset.length-1].insertedId : null;


        return { recordset, batchKey  };
    },
    operationSchema:{
        entity: "hl_householdclients",
        entityId: "insertedId" ,
        operation: "DELETE",
       
        fields: {
            
        }
    },
    stageData: async function(){
       
    },
    confirmData: async function(){
    },
    pageSize: 1000 
}