import { getSqlConnection } from '../sqlConnection';
import { generateBatchFiles } from '../generateBatchFiles';


const pageSize = 1000;

export async function generate(skip=0){
    let pool = await getSqlConnection();
    

    const { recordset } = await pool.request()
    .query(`select Id
            FROM hl_employmenthistory_sync
            ORDER BY ID
            OFFSET     ${skip} ROWS 
            FETCH NEXT ${pageSize} ROWS ONLY`);
    
    if((recordset||[]).length === 0)
        return;

    const lockKey = recordset[recordset.length-1].Id;
    console.log('lockKey',lockKey);

    
        generateBatchFiles(lockKey, recordset, {
            entity: "hl_employmenthistories",
            entityId: "Id",
            operation: "DELETE",
            fields:{}
        }, '../files/employmenthistory/delete');

        skip = skip + pageSize;
        generate(skip);
}

generate();