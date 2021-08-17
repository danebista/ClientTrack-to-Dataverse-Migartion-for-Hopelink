import { getSqlConnection } from '../../sqlConnection';

module.exports = {
    getRecordSet: async function(skip, take){
        let pool = await getSqlConnection();
    

        const { recordset } = await pool.request()
        .query(`select * from consent_update
                ORDER BY  InsertedId

                OFFSET     ${skip} ROWS 
                FETCH NEXT ${take} ROWS ONLY`);

        const batchKey = recordset.length > 0 ? recordset[recordset.length-1].InsertedId : null;


        return { recordset, batchKey  };
    },
    operationSchema:{
        entity: "hl_households",
        entityId: "InsertedId" ,
        operation: "PATCH",
        fields:{
            "hl_consent_boolean": (record) => record["Consent"] === 'true',
        }
    },
    stageData: async function(){
       
    },
    confirmData: async function(){
    },
    pageSize: 500    
}
