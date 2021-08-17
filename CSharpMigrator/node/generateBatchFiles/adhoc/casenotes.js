import { getSqlConnection } from '../../sqlConnection';
import moment from 'moment';

module.exports = {
    getRecordSet: async function(skip, take){
        let pool = await getSqlConnection();
    

        const { recordset } = await pool.request()
        .query(`select *
                FROM casenotes_rat
                ORDER BY Id
                OFFSET     ${skip} ROWS 
                FETCH NEXT ${take} ROWS ONLY`);

                const batchKey = recordset.length > 0 ? recordset[recordset.length-1].Id : null;


        return { recordset, batchKey  };
    },
    operationSchema: {
        entity: "hl_casenotes",
        entityId: "Id",
        operation: "PATCH",
        fields: {
            "hl_notes": "Note"
        }
    },
    stageData: async function(){
    },
    confirmData: async function(){
    
    },
    pageSize: 1000  
}