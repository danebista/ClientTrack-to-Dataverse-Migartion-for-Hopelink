import { getSqlConnection } from '../../sqlConnection';

module.exports = {
    getRecordSet: async function(skip, take){
        let pool = await getSqlConnection();
    

        const { recordset } = await pool.request()
        .query(`select * from recordsToConsider
                ORDER BY recordid
                OFFSET     ${skip} ROWS 
                FETCH NEXT ${take} ROWS ONLY`);

        const batchKey = recordset.length > 0 ? recordset[recordset.length-1].recordid: null;


        return { recordset, batchKey  };
    },
    operationSchema:{
        entity: "hl_unit_checkins",
        entityId: "recordid" ,
        operation: "PATCH",
        fields:{
            "hl_checkoutdate": "EndDate",
            "hl_end_date":  "EndDate",
            "hl_statusset": "status"
        }
    },
    stageData: async function(){
       
    },
    confirmData: async function(){
    },
    pageSize: 500   
}
