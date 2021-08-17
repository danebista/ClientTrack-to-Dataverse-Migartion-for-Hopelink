import { getSqlConnection } from '../sqlConnection';
import { generateBatchFiles } from '../generateBatchFiles';


const pageSize = 1000;

export async function generate(skip=0){
    let pool = await getSqlConnection();
    

    const { recordset } = await pool.request()
    .query(`select *
            FROM hl_educationhistory_temp
            ORDER BY ID
            OFFSET     ${skip} ROWS 
            FETCH NEXT ${pageSize} ROWS ONLY`);
    
    if((recordset||[]).length === 0)
        return;

    const lockKey = `${recordset[0].ID}_${recordset[recordset.length-1].ID}`;
    console.log('lockKey',lockKey);

    
        generateBatchFiles(lockKey, recordset, {
            entity: "hl_educationhistories",
            operation: "POST",
            fields: {
                "hl_dateenrolled": "DateEnrolled",
                "hl_schoolname": "SchoolName",
                "hl_status": "Status",
                "hl_client_id@odata.bind": {
                    relatedEntity: "contacts",
                    field: "ClientGuid"
                },
                "hl_education_level@odata.bind": {
                    relatedEntity: "hl_educationlevels",
                    field: "EducationLevelID"
                },
                "hl_education_type@odata.bind": {
                    relatedEntity: "hl_educationtypes",
                    field: "EducationTypeID"
                }
            }
        }, '../files/educationhistory');

        skip = skip + pageSize;
        generate(skip);
}

generate();