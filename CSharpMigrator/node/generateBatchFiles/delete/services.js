import { getSqlConnection } from '../../sqlConnection';

module.exports = {
    getRecordSet: async function(skip, take){
        let pool = await getSqlConnection();
    

        const { recordset } = await pool.request()
        .query(`select *
                from dummynotneeded
                ORDER BY DW_Id
                OFFSET     ${skip} ROWS 
                FETCH NEXT ${take} ROWS ONLY`);

        const batchKey = recordset.length > 0 ? `${recordset[0].DW_Id}_${recordset[recordset.length-1].DW_Id}` : null;


        return { recordset, batchKey  };
    },
    operationSchema: {
        entity: "hl_serviceinstanceclients",
        entityId: "Id",
        operation: "DELETE",
        fields: { }
    },
    stageData: async function(){
    },
    confirmData: async function(){
    },
    
    pageSize: 1000   
}
