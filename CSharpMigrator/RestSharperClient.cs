using System.Threading;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using RestSharp;
using RestSharp.Authenticators;

namespace CSharpMigrator
{
    public class RestSharperClient
    {
        private readonly IHttpClientFactory _httpFactory;
        RestClient _httpClient;
        private readonly TokenGenerator _tokenGenerator;
        public RestSharperClient(TokenGenerator tokenGenerator)
        {
            _tokenGenerator = tokenGenerator;
            _httpClient = new RestClient(Constants.BaseUrl);
            _httpClient.Timeout = -1;
        }
        static TokenGenerator.JWT JWT;
        public async Task<RestClient> BuildHttpClient()
        {

            var token = await GetToken();
            //_httpClient.AddDefaultHeader("Authorization","Bearer "+ token);
            _httpClient.Authenticator = new JwtAuthenticator(token);

            return _httpClient;
        }

        public async Task<string> GetToken()
        {
            if (JWT == null || JWT.IsTokenExpired)
            {
                JWT = await _tokenGenerator.GetToken();
            }

            return JWT.AccessToken;
        }

        public HttpClient GetClient(string token)
        {
            var httpClient = _httpFactory.CreateClient();
            httpClient.Timeout = TimeSpan.FromHours(10);
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            return httpClient;
        }
    }
}