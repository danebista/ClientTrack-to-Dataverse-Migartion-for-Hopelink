import { authHeader, apiUrl, getBasicHttpClient } from './apiClient';
import {GetRandomId} from './utilities';
import axios from 'axios';

﻿var http = require('http');
var https = require('https');
var url = require('url');
const fs = require('fs');



//Create 1 Js web resource method that will handle batch request
// async function executeBatch(payload, batchId) {
//     const headers = {
//         ...authHeader,
//         Accept:  "application/json",
//         "Content-Type": "multipart/mixed; boundary=batch_" + batchId,
//         "OData-MaxVersion": "4.0",
//         "OData-Version": "4.0"
//     };
//     //const httpClient = getBasicHttpClient();
//     const httpsAgent = new https.Agent({ keepAlive: true });

//     var config = {
//         method: 'post',
//         url: apiUrl+'$batch',
//         headers,
//         data: payload,
//         httpsAgent
//     }
//     const response = await axios(config)
//                         .then(()=>console.log('It success'))
//                         .finally(()=>console.log('It finished'))
//                         .catch((err)=>console.log(err.Error));

//     return {   statusCode: response.status, statusMessage: response.statusText, rawData: response.data };
//   }

function executeBatch(payload, batchId) {
    var promise = new Promise((success, fail) => {
      
      var parsedUrl = url.parse(apiUrl+'$batch');
      var protocolInterface = https;
      const headers = {
        ...authHeader,
        Accept:  "application/json",
        "Content-Type": "multipart/mixed;boundary=batch_" + batchId,
        "OData-MaxVersion": "4.0",
        "OData-Version": "4.0"
    };

    //console.log("headers", headers)

      var internalOptions = {
		hostname: parsedUrl.hostname,
		port: parsedUrl.port,
		path: parsedUrl.path,
		method: "POST",
		headers: headers
      };
      
      var request = protocolInterface.request(internalOptions, (res)=>{
        var rawData = '';
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
            console.log("chunk",chunk);
			rawData += chunk;
        });
        res.on('end', function () {
            switch (res.statusCode) {
                case 200: // Success with content returned in response body.
				case 201: // Success with content returned in response body.
				case 204: // Success with no content returned in response body.
				case 304: {// Success with Not Modified
                    const { statusCode, statusMessage } = res;
                    success( { statusCode, statusMessage, rawData })
					break;
                }
                default:
                    const { statusCode, statusMessage } = res;
                    fail({ statusCode, statusMessage, rawData })
                    break;
            }
        });
      });

      request.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
        const { statusCode, statusMessage } = res;
        fail({ statusCode, statusMessage, rawData })
      });

      request.write(payload);
      request.end();
    });
  
    return promise;
  }

  //Generating random id for Payload object


  function stringifyData(data, config) {
	var stringifiedData;
	if (data) {
		stringifiedData = JSON.stringify(data, function (key, value) {
			/// <param name="key" type="String">Description</param>
			if (key.endsWith('@odata.bind') || key.endsWith('@odata.id')) {
				if (typeof value === 'string' && !value.startsWith('$')) {
					//remove brackets in guid
					if (/\(\{[\w\d-]+\}\)/g.test(value)) {
						value = value.replace(/(.+)\(\{([\w\d-]+)\}\)/g, '$1($2)');
                    }
                    
                    if (key.endsWith('@odata.bind')) {
                        if (!value.startsWith('/')) {
                            value = '/' + value;
                        }
                    }
                    else {
                        value = apiUrl + value.replace(/^\//, '');
                    }
				}
			}
			else
				if (key.startsWith('oData') ||
					key.endsWith('_Formatted') ||
					key.endsWith('_NavigationProperty') ||
					key.endsWith('_LogicalName')) {
					value = undefined;
				}

			return value;
		});

		stringifiedData = stringifiedData.replace(/[\u007F-\uFFFF]/g, function (chr) {
			return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4);
		});
	}

	return stringifiedData;
}

export function generateBatchBody(requests,batchId, onlyGet){
    batchId = batchId || GetRandomId();
    const changeSetId = GetRandomId();
    let contentId = 1;
    const payload = [];
    if(!onlyGet){
        payload.push("--batch_" + batchId);
        payload.push("\r\n");
    }
    
    if(!onlyGet){
        payload.push("Content-Type: multipart/mixed;boundary=changeset_" + changeSetId);
        payload.push("\r\n");    
    }
    
   
    for (let request of requests) {
      const { resource, method, data } = request;
      payload.push("\r\n");
      if(!onlyGet){
        payload.push("--changeset_" + changeSetId);
        payload.push("\r\n");
      }
      else{
        payload.push("--batch_" + batchId);
        payload.push("\r\n");
      }
      payload.push("Content-Type: application/http");
      payload.push("\r\n");
      payload.push("Content-Transfer-Encoding: binary");
      payload.push("\r\n");
      if(!onlyGet){
        payload.push("Content-ID: " + contentId);
        payload.push("\r\n");
      }     
      payload.push("\r\n");
      payload.push(method + ' '+ apiUrl + resource + " HTTP/1.1");
      payload.push("\r\n");
      if(!onlyGet){
        payload.push("Content-Type: application/json;");
        payload.push("\r\n");
      }
      else{
        payload.push("Accept: application/json;");
      }
      
     
      if(data){
        payload.push("\r\n");
         if(data) payload.push(stringifyData(data).replace("{contentId}", `${contentId-1}`));
      }
      payload.push("\r\n");
  
      contentId++;
    }

    payload.push("\r\n");  
    //End of ChangeSet
    if(!onlyGet) payload.push("--changeset_" + changeSetId + "--");
    payload.push("\r\n");
    //End of Batch
    payload.push("--batch_" + batchId + "--");
    return { payload: payload.join(""), batchId };
}

export function createBatchFile(requests,batchId, folder){
    const {payload } = generateBatchBody(requests,batchId);
    if (!fs.existsSync(folder)){
        fs.mkdirSync(folder);
    }
    fs.writeFile(`${folder}/payload_${batchId}.txt`, payload, "utf-8", ()=> console.log("Payload file ready!"))
}

  
  export async function createBatchRequest(requests,batchId, onlyGet) {
   
    try{
        const {payload } = generateBatchBody(requests,batchId,onlyGet);
        fs.writeFile(`./files/payload_${batchId}.txt`, payload, "utf-8", ()=> console.log("Payload file ready!"))
        //const response = await executeBatch(payload, batchId)
        //console.log("response--", response)

        //return response.rawData;
    }
    catch(err){
        console.log("ERROR",err);
    }
  }