using System.Drawing;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Threading;
using System.Net;
using System.Net.Http.Headers;
using System.Collections.Concurrent;

namespace CSharpMigrator
{
    public class BatchRunner
    {
        private string FolderNs;

        const int PageSize = 5;
        const string FileFolder = "files";
        TimeSpan retryWaitingTime = TimeSpan.FromSeconds(300);
        public DynamicsCRMHttpClient _httpClientBuilder { get; }

        public string FolderName => $"{FileFolder}_{FolderNs}";


        public BatchRunner(DynamicsCRMHttpClient httpClientBuilder)
        {
            _httpClientBuilder = httpClientBuilder;
            ServicePointManager.FindServicePoint(new Uri(Constants.BaseUrl)).ConnectionLimit = 10;
        }

        public void Init(string folderNs){
            FolderNs = folderNs;
            Directory.CreateDirectory(FolderName);
        }

        

        private IEnumerable<string> GetFileNames() => Directory.GetFiles(FolderName)
                        .Where(f => f.EndsWith(".txt"))
                        .OrderBy(d => new FileInfo(d).CreationTime);

        public void ClearFolder()
        {
            var fileNames = GetFileNames();
            CustomConsole.Info("Deleting leftover files");
            foreach (var fileName in fileNames)
            {
                File.Delete(fileName);
            }
            CustomConsole.Success($"{fileNames.Count()} Files deleted");
        }

        public bool AreThereFilesToRun() => GetFileNames().Any();

        public async Task RunBatches()
        {

            Stopwatch stopWatch = new Stopwatch();
            stopWatch.Start();

            var files = GetFileNames();

            while(files.Any()) {
                var results = new ConcurrentBag<HttpResponseMessage>();
                var requests = files.Take(PageSize).Select(async file =>
                {
                    var batchId = Regex.Match(file.Split('\\').Last(), @"_(.*)\.").Groups[1].ToString();
                    var response = await SendRequest(batchId, file);
                    results.Add(response);
                    
                }).ToArray();
                
                 await Task.WhenAll(requests);         

                stopWatch.Stop();
                CustomConsole.Info("Overall Time Elapsed: {0} mins", stopWatch.Elapsed.TotalMinutes);

                if (results.Any(r => !r.IsSuccessStatusCode))
                {
                    CustomConsole.Warning("One or more operations failed, waiting:{0}secs to retry", retryWaitingTime.TotalSeconds);
                    await Task.Delay(retryWaitingTime);
                }


                 files = GetFileNames();
            }

            Directory.Delete(FolderName);

        }

        private async Task<HttpResponseMessage> SendRequest(string batchId, string file)
        {
            CustomConsole.Info("Sending batch: {0} at {1}", batchId, DateTime.Now);
            var batchWatcher = new Stopwatch();
            batchWatcher.Start();
            var httpClient = await _httpClientBuilder.BuildHttpClient().ConfigureAwait(false);

             var requestBody = GetRequestBody(file);

            using(var request = GetRequest(batchId, requestBody)){
              using(var response = await httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead).ConfigureAwait(false)){
                  if (response.IsSuccessStatusCode)
                  {
                      CustomConsole.Success("({0})Successfully Sent batch: {1}", response.StatusCode, batchId);
                      File.Delete(file);
                  }
                  else
                  {
                      CustomConsole.Error("({0}) Error sending batch: {1}", response.StatusCode, batchId);
                      var responseBody = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
                      CustomConsole.Info("Response Body:");
                      CustomConsole.Info("{0}",responseBody);
                  }

                  batchWatcher.Stop();
                  CustomConsole.Warning("Batch {0} Time Elapsed: {1} mins", batchId, batchWatcher.Elapsed.TotalMinutes);         

                  return response;   
                }
            }
           
        }

        string GetRequestBody(string file)
        {
            var requestBody = "";
            using (var sr = new StreamReader(file))
            {
                requestBody = sr.ReadToEnd();
            }

            return requestBody;
        }

        HttpRequestMessage GetRequest(string batchId, string requestBody)
        {
            var request = new HttpRequestMessage(HttpMethod.Post,"$batch");
            //request.Headers.Add("Cookie", Constants.AuthCookie);
            //request.Headers.Add("Accept", "application/json");
            request.Headers.Add("OData-MaxVersion", "4.0");
            request.Headers.Add("OData-Version", "4.0");
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/octet-stream"));
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("text/plain"));
            request.Content = GetContent(batchId, requestBody);

            // foreach(var keyPair in request.Headers){
            //     Console.WriteLine("{0}: {1}", keyPair.Key, keyPair.Value);
            // }

            return request;
        }

         StringContent GetContent(string batchId, string requestBody)
        {
            var content = new StringContent(requestBody);
            content.Headers.Remove("Content-Type");
            //content.Headers.Remove("Content-Transfer-Encoding");
            content.Headers.Add("Content-Type", $"multipart/mixed;boundary=batch_{batchId}");
            //content.Headers.Add("Content-Transfer-Encoding", "binary");

            return content;
        }
    }
}