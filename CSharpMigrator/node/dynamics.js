var DynamicsWebApi = require('dynamics-web-api');
var AuthenticationContext = require('adal-node').AuthenticationContext;

var authorityHostUrl = 'https://login.windows.net';
var tenant = '212accbe-08a2-4c07-987a-d386b8ec55bd'; // AAD Tenant name.
var authorityUrl = authorityHostUrl + '/' + tenant;
var applicationId = 'ee7449a9-0610-41b5-8d8a-59ee6185e5f6'; // Application Id of app registered under AAD.
var clientSecret = 'aoh9NKH0qA_d~zl.tjLOEvY8.312qRy.7M'; // Secret generated for app. Read this environment variable.
var resource = 'http://dd3d2392-5cd5-49be-8d23-e8846b287548/'; // URI that identifies the resource for which the token is valid.
 
//var context = new AuthenticationContext(authorityUrl);

// function acquireToken(dynamicsWebApiCallback){
//     function adalCallback(error, token) {
//         if (!error){
//             console.log("token",token)
//             //dynamicsWebApiCallback(token);
//         }
//         else{
//            console.log('Token has not been retrieved. Error: ' + error.stack);
//         }
//     }
//     context.acquireTokenWithClientCredentials(resource, applicationId, clientSecret, adalCallback);
// }

// acquireToken()
 

 


//the following settings should be taken from Azure for your application
//and stored in app settings file or in global variables
 
//OAuth Token Endpoint
var authorityUrl = 'https://login.windows.net/212accbe-08a2-4c07-987a-d386b8ec55bd';
//CRM Organization URL
var resource = 'dd3d2392-5cd5-49be-8d23-e8846b287548';
//Dynamics 365 Client Id when registered in Azure
   

var clientId = 'ee7449a9-0610-41b5-8d8a-59ee6185e5f6';
var username = 'sal@hopelink.org';
var password = '';
 
var adalContext = new AuthenticationContext(authorityUrl);
 
//add a callback as a parameter for your function
function acquireToken(dynamicsWebApiCallback){
    //a callback for adal-node
    function adalCallback(error, token) {
        if (!error){
            //call DynamicsWebApi callback only when a token has been retrieved
            console.log(token, token)
            //dynamicsWebApiCallback(token);
        }
        else{
            console.log('Token has not been retrieved. Error: ' + error.stack);
        }
    }
 
    //call a necessary function in adal-node object to get a token
    adalContext.acquireTokenWithUsernamePassword(resource, username, password, clientId, adalCallback);
}

acquireToken()
 
//create DynamicsWebApi object
// var dynamicsWebApi = new DynamicsWebApi({
//     webApiUrl: 'https://hopelinkcnry.crm.dynamics.com/api/data/v9.0/',
//     onTokenRefresh: acquireToken,
//     //impersonate: "f818e35b-ca5b-e911-a95b-000d3a1d578c"
// });
 
//call any function
// dynamicsWebApi.executeUnboundFunction("WhoAmI").then(function (response) {
//     console.log('Hello Dynamics 365! My id is: ' + response.UserId);
// }).catch(function(error){
//     console.log(error);
// });



// dynamicsWebApi.retrieve('E71E17A5-9D03-EB11-A813-000D3A98D1AD', 'contacts',['firstname'],).then(record=>{
//     console.log(record);
// }).catch( err=> console.error(err));

// var request = {
//     key: 'E71E17A5-9D03-EB11-A813-000D3A98D1AD',
//     collection: "contacts",
//     select: ["firstname"],
//     token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImtnMkxZczJUMENUaklmajRydDZKSXluZW4zOCIsImtpZCI6ImtnMkxZczJUMENUaklmajRydDZKSXluZW4zOCJ9.eyJhdWQiOiJodHRwOi8vZGQzZDIzOTItNWNkNS00OWJlLThkMjMtZTg4NDZiMjg3NTQ4LyIsImlzcyI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzIxMmFjY2JlLTA4YTItNGMwNy05ODdhLWQzODZiOGVjNTViZC8iLCJpYXQiOjE2MDIwMzA1NzcsIm5iZiI6MTYwMjAzMDU3NywiZXhwIjoxNjAyMDM0NDc3LCJhaW8iOiJFMlJnWUhqRloxbzZ2NHNsKzMvNXVzQXY4ZWtzQUE9PSIsImFwcGlkIjoiZWU3NDQ5YTktMDYxMC00MWI1LThkOGEtNTllZTYxODVlNWY2IiwiYXBwaWRhY3IiOiIxIiwiaWRwIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvMjEyYWNjYmUtMDhhMi00YzA3LTk4N2EtZDM4NmI4ZWM1NWJkLyIsIm9pZCI6ImNjNjRkZWU3LTljYWMtNGE0YS04OTliLTU5ZGFiMjM3Zjc2NCIsInJoIjoiMC5BUzBBdnN3cUlhSUlCMHlZZXRPR3VPeFZ2YWxKZE80UUJyVkJqWXBaN21HRjVmWXRBQUEuIiwic3ViIjoiY2M2NGRlZTctOWNhYy00YTRhLTg5OWItNTlkYWIyMzdmNzY0IiwidGlkIjoiMjEyYWNjYmUtMDhhMi00YzA3LTk4N2EtZDM4NmI4ZWM1NWJkIiwidXRpIjoid0QwbXlkSGg0MEt3WnJNTDMwWW9BQSIsInZlciI6IjEuMCJ9.s6tGcC7H2O0D_Nnoze9CENfRo1uMEojY-WaZYXBwECHfUa2p6u_Draii9v3-jW9MBFBgxNVpas6tEnTGLQQzQOIsSVI0Bp3YM3M-ejcDaumAZsTaLyuWeFkyKi_PYKNoj2GSfvz1m64-f6myMQiN7zm50h34ipRuFKGz3wnvlrVaJbDickL5w6fWooVwNaPm2E8oZqEXI4dF9xlvok8JNbFaDHqoWOHgXPdAEG1MsIvbC4cbKqYCsLrY_QkAKHMRsw-puVv78NAfZR0K2rjVHDozEtxc9IV5Lj1PBxqzZHUcXiz4EidnbXfZ1eWdqR4GK7wtnTH7dwz3CS9spKR_GA"
// };
 
// dynamicsWebApi.retrieveRequest(request).then(function (record) {
//     console.log(record);
// })
// .catch(function (error) {
//     console.error(error);
// });