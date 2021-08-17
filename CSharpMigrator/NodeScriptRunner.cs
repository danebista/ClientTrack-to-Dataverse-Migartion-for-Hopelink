using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Jering.Javascript.NodeJS;

namespace CSharpMigrator
{
    public class NodeScriptRunner
    {

        public NodeScriptRunner(string folderNs)
        {
              StaticNodeJSService.Configure<NodeJSProcessOptions>(options=>{
                    options.ProjectPath = "./node";
                    options.NodeAndV8Options = "-r esm";
                    options.EnvironmentVariables = new Dictionary<string, string>{
                        ["batchesFolder"] = $"../files_{folderNs}"
                    };
            });

              StaticNodeJSService.Configure<OutOfProcessNodeJSServiceOptions>(options=>{
                    options.TimeoutMS = -1;
            });
        }

         public async Task CreateBatch(string entity, string action){
            var response = await StaticNodeJSService.InvokeFromFileAsync<string>($"generateBatchFiles/batchCreator.js", "createBatches", new[] { entity.ToLower(), action.ToLower() });
            Console.WriteLine(response);
        }

         public async Task ConfirmBatch(string entity, string action){
            var response = await StaticNodeJSService.InvokeFromFileAsync<string>($"generateBatchFiles/batchCreator.js", "confirmBatches",  new[] { entity.ToLower(), action.ToLower() });
            Console.WriteLine(response);
        }
        
    }
}