import { getSqlConnection } from '../../sqlConnection';

module.exports = {
    getRecordSet: async function(skip, take){
        let pool = await getSqlConnection();
    

        const { recordset } = await pool.request()
        .query(`select * from ec_to_up    
                ORDER by InsertedID
                OFFSET     ${skip} ROWS 
                FETCH NEXT ${take} ROWS ONLY`);

        const batchKey = recordset.length > 0 ? recordset[recordset.length-1].InsertedID : null;


        return { recordset, batchKey  };
    },
    operationSchema:{
        entity: "hl_enrollments",
        entityId: "InsertedID" ,
        operation: "PATCH",
        fields:{
            "hl_EnrollmentPhaseStatusId@odata.bind":  {
                relatedEntity: "hl_enrollmentphasestatuses",
                field: "PhaseStatus"
            },
        }
    },
    stageData: async function(){
       
    },
    confirmData: async function(){
    },
    pageSize: 500   
}