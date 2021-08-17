using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace CSharpMigrator
{
    class Program
    {


        static async Task Main(string[] args)
        {
            var builder = new HostBuilder()
              .ConfigureServices((hostContext, services) =>
              {
                  services.AddHttpClient();
                  services.AddSingleton<DynamicsCRMHttpClient>();
                  services.AddScoped<RestSharperClient>();
                  services.AddTransient<BatchRunner>();
                  services.AddSingleton<TokenGenerator>();
              }).UseConsoleLifetime();

               var host = builder.Build();
 
           using (var serviceScope = host.Services.CreateScope())
           {
               var services = serviceScope.ServiceProvider;
 
               try
               {
                    var batchRunner = services.GetRequiredService<BatchRunner>();
                    var migrator = new Migrator(batchRunner);
                    string entity = args.Length >= 1 ? args[0] : null;
                    string action = args.Length >= 2 ? args[1] : null;
                    string resume = args.Length >= 3 ? args[2] : null;
                    
                    await migrator.StartMigration(entity,action, resume);
                    
                   
               }
               catch (Exception ex)
               {
                   Console.WriteLine("Error Occured:{0}", ex.Message);
               }
           }

           
        }

        
    }
}
