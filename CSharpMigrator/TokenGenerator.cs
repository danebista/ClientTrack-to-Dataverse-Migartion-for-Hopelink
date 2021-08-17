using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace CSharpMigrator
{
    public class TokenGenerator
    {
        HttpClient httpClient;
        public TokenGenerator(IHttpClientFactory httpClientFactory)
        {
            httpClient = httpClientFactory.CreateClient();
        }
        public class JWT {
            [JsonProperty("expires_in")]
            public double ExpiresIn { get; set; }
            [JsonProperty("expires_on")]
            public double ExpiresOn { get; set; }
            [JsonIgnore] public DateTime ExpiresOnDate => ExpiresOn.UnixTimeStampToDateTime();
            [JsonIgnore] public DateTime IssuedOn { get; set; }
            [JsonIgnore] public bool IsTokenExpired =>DateTime.Now.Subtract(IssuedOn).TotalMinutes >= 10;

             [JsonProperty("access_token")]
            public string AccessToken { get; set; }
        }

        public async Task<JWT> GetToken(){

          using(var response = await httpClient.PostAsync(Constants.AuthUrl, 
          new FormUrlEncodedContent(
              new Dictionary<string, string>{
                ["grant_type"] = "client_credentials",
                ["client_id"] = Constants.ClientID,
                ["client_secret"] = Constants.ClientSecret,
                ["resource"] = Constants.Resource
            })).ConfigureAwait(false)){
                 var responseBody = await response.Content.ReadAsStringAsync();
                var jwt = JsonConvert.DeserializeObject<JWT>(responseBody);
                jwt.IssuedOn = DateTime.Now;
                Console.WriteLine("AccessToken refreshed at :{0}", jwt.IssuedOn);
                return jwt;
            }
        }

      
    }
}