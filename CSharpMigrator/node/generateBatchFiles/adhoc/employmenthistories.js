import { getSqlConnection } from '../../sqlConnection';

module.exports = {
    getRecordSet: async function(skip, take){
        let pool = await getSqlConnection();
    

        const { recordset } = await pool.request()
        .query(`select * from hrs_to_proceed
                ORDER BY recordid
                OFFSET     ${skip} ROWS 
                FETCH NEXT ${take} ROWS ONLY`);

        const batchKey = recordset.length > 0 ? recordset[recordset.length-1].recordid: null;


        return { recordset, batchKey  };
    },
    operationSchema:{
        entity: "hl_employmenthistories",
        entityId: "recordid",
        operation: "PATCH",
        fields:{
            "hl_averageweeklyhours": "hrs",
        }
    },
    stageData: async function(){
       
    },
    confirmData: async function(){
    },
    pageSize: 100   
}
