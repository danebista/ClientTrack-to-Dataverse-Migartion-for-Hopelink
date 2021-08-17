import { getSqlConnection } from '../../sqlConnection';

module.exports = {
    getRecordSet: async function(skip, take){
        let pool = await getSqlConnection();
    

        const { recordset } = await pool.request()
        .query(`select *
                FROM hl_clients_inserted
                WHERE ClientAssessmentResponseId IS NULL
                ORDER BY ID
                OFFSET     ${skip} ROWS 
                FETCH NEXT ${take} ROWS ONLY`);

        const batchKey = recordset.length > 0 ? `${recordset[0].ClientID}_${recordset[recordset.length-1].ClientID}` : null;


        return { recordset, batchKey  };
    },
    operationSchema: {
        entity: "hl_clientassessmentresponses",
        operation: "POST",
        fields:  {
            "hl_Client@odata.bind": {
                relatedEntity: "contacts",
                field: "InsertedID"
            },
            "hl_areyoucurrentlyworking": false,
            "hl_areyoulookingformorehoursoranotherjob": false,
            "hl_doyouhaveanadditionaljob": false,
            "hl_doyouhaveincomefromanysource": false,
            "hl_issecondaryapplicant": false,
            "hl_istheclienteligible": false
        }
    },
    stageData: async function(){
    },
    confirmData: async function(){
        let pool = await getSqlConnection();
      //  await pool.request().execute("[dbo].[hl_confirm_ClientAssessmentResponse_atag]");
    }    
}