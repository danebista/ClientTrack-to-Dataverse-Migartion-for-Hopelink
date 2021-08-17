import { getSqlConnection } from '../sqlConnection';
import { generateBatchFiles } from '../generateBatchFiles';


const pageSize = 1000;

export async function generate(skip=0){
    let pool = await getSqlConnection();
    

    const { recordset } = await pool.request()
    .query(`select c.InsertedId as Id from hl_clients_inserted c
            where c.ClientID=4461457 
            ORDER BY ClientID
            OFFSET     ${skip} ROWS 
            FETCH NEXT ${pageSize} ROWS ONLY`);
    
    if((recordset||[]).length === 0)
        return;

    const lockKey = recordset[recordset.length-1].Id;
    console.log('lockKey',lockKey);

    
        generateBatchFiles(lockKey, recordset, {
            entity: "contacts",
            entityId: "Id",
            operation: "DELETE",
            fields: {}
        }, './files/contacts');

        skip = skip + pageSize;
        generate(skip);
}

generate();