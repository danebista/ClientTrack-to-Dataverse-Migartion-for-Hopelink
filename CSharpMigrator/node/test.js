const batch = require('./generateBatchFiles/batchCreator');

async function test(){
    await batch.createBatches('householdclients','create')
}

test();