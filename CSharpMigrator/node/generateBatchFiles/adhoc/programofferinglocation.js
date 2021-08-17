import { getSqlConnection } from '../../sqlConnection';

module.exports = {
    getRecordSet: async function(skip, take){
        let pool = await getSqlConnection();
    

        const { recordset } = await pool.request()
        .query(`select * from hl_program_offering_location_FRP
                ORDER BY CASEID
                OFFSET     ${skip} ROWS 
                FETCH NEXT ${take} ROWS ONLY`);

        const batchKey = recordset.length > 0 ? recordset[recordset.length-1].recordid: null;


        return { recordset, batchKey  };
    },
    operationSchema:{
        entity: "hl_programofferinglocations",
        entityId: "recordid",
        operation: "PATCH",
        fields:{
            "hl_ProgramVersionID@odata.bind":  {
                relatedEntity: "hl_programversions",
                field: "PrograVersionId"
            }
        }
    },
    stageData: async function(){
       
    },
    confirmData: async function(){
    },
    pageSize: 500   
}