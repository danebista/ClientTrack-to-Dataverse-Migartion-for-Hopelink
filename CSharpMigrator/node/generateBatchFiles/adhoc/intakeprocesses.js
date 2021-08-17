import { getSqlConnection } from '../../sqlConnection';
import moment from 'moment';

module.exports = {
    getRecordSet: async function(skip, take){
        let pool = await getSqlConnection();
    

        const { recordset } = await pool.request()
        .query(`select *
                FROM hl_households_inserted
                WHERE HomePhone IS NOT NULL
                ORDER BY ClientID
                OFFSET     ${skip} ROWS 
                FETCH NEXT ${take} ROWS ONLY`);

        const batchKey = recordset.length > 0 ? `${recordset[0].ClientID}_${recordset[recordset.length-1].ClientID}`: null;


        return { recordset, batchKey  };
    },
    operationSchema: {
        entity: "contacts",
        entityId: "InsertedID",
        operation: "PATCH",
        fields:  {
            "telephone2": "HomePhone"
        }
    },
    stageData: async function(){
    },
    confirmData: async function(){
    
    },
    pageSize: 300  
}