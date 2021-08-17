import { createBatchFile } from './batch';

export function generateBatchFiles(batchId, resultSet, mappingSet, folder){
    const requests = generateRequests(resultSet, mappingSet, folder);

    createBatchFile(requests, batchId, folder);
}

function getFieldValue(value, record){
    if(typeof value === "function")
        return value(record);
    else if(typeof value === "object" && "relatedEntity" in value){
        return createRelatedLink({ ...value, record })
    }
    else if(value in record){
        return record[value]
    }
    
    return value;
}

export function createRelatedLink({ relatedEntity, field, record }){
    if(record[field]){
        return `/${relatedEntity}(${record[field]})`;
    }

    return null;
}

function getUri(entity, entityId,associationEntity, record){
    if(associationEntity && entityId){
        return `${entity}(${record[entityId]})/${associationEntity}/$ref`;
    }
    else if(entityId){
        return `${entity}(${record[entityId]})`;
    }
    else{
        return entity
    }
}

function generateRequests(resultSet, mappingSet){
    const requests = [];

    const {entity, entityId,associationEntity, operation, fields} = mappingSet;

    for(let record of resultSet){
        requests.push({
            resource: getUri(entity, entityId,associationEntity, record) ,
            method: operation,
            data: Object.keys(fields).reduce((acc,cur)=> { 
                const value = getFieldValue(fields[cur], record);
                if(cur.indexOf("@odata.bind") > -1 && !value) {
                    return acc;
                }
                return {
                    ...acc,
                    [cur]: value
                }
            }, {})
        });
    }

    return requests;
}