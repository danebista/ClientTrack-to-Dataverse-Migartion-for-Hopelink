using System.Threading;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace CSharpMigrator
{
    public class DynamicsCRMHttpClient
    {
        private readonly IHttpClientFactory _httpFactory;
        HttpClient _httpClient;
        private readonly TokenGenerator _tokenGenerator;
        public DynamicsCRMHttpClient(IHttpClientFactory httpFactory, TokenGenerator tokenGenerator)
        {
            _tokenGenerator = tokenGenerator;
            _httpFactory = httpFactory;
            _httpClient = _httpFactory.CreateClient();
            _httpClient.BaseAddress = new Uri(Constants.BaseUrl);
            _httpClient.Timeout = TimeSpan.FromHours(10);
            _httpClient.MaxResponseContentBufferSize = 50000000; // 50MB
            _httpClient.DefaultRequestHeaders.TransferEncodingChunked = true;
            //_httpClient.DefaultRequestHeaders.ConnectionClose = true;
            //_httpClient.DefaultRequestHeaders.ExpectContinue = false;
        }
        TokenGenerator.JWT JWT;
        public async Task<HttpClient> BuildHttpClient()
        {

            var token = await GetToken();

            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

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