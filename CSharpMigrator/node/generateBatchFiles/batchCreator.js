import { generateBatchFiles } from '../generateBatchFiles';



const defaultPageSize = 500;

export async function generate(dataSource, entity, skip=0){

    const pageSize = dataSource.pageSize || defaultPageSize;

    if(dataSource.getRecordSet){
        const { recordset, batchKey  } = await dataSource.getRecordSet(skip, pageSize);
    
        if((recordset||[]).length === 0)
            return;

        console.log('lockKey',batchKey);    
        const operationSchema = dataSource.operationSchema;
        
        generateBatchFiles(batchKey, recordset,operationSchema, process.env['batchesFolder']);
    }
    else if(dataSource.createCustomBatch){
        const { tryNext } = await dataSource.createCustomBatch(skip, pageSize);
        console.log("tryNext",tryNext)
        if(!tryNext)
            return;
    }

    skip = skip + pageSize;
    await generate(dataSource,entity,skip);
}

module.exports = {
    createBatches: async (entity,action) => {
        const dataSource = require(`./${action}/${entity}`);
        return new Promise(async (resolve, reject)=>{
            try{
                await dataSource.stageData();
                await generate(dataSource, entity);
                resolve(`${entity} Batches Created`);
            }
            catch(err){
                reject(err);
            }
        });     
    
    },
    confirmBatches: async (entity, action) => {
        const dataSource = require(`./${action}/${entity}`);
        return new Promise(async (resolve, reject)=>{
            try{
                await dataSource.confirmData();
                resolve(`${entity} Confirmed!`);
            }
            catch(err){
                reject(err);
            }
        });  
    }
}
