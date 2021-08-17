using System;
using System.Linq;
using System.Threading.Tasks;

namespace CSharpMigrator
{
    public class Migrator
    {
        const int MinutesToSync = 4;
     
        public readonly BatchRunner _batchRunner;

        public Migrator(BatchRunner batchRunner)
        {
            _batchRunner = batchRunner;
        }
        public async Task StartMigration(string entity = null, string action = "Create", string resumeKey = null)
        {
            try
            {

                if(!string.IsNullOrEmpty(entity)){
                    await Migrate(entity,action, resumeKey);
                }
                else{
                    await Migrate("Clients");
                    await Migrate("ClientAssessmentResponse");
                    await Migrate("CaseNotes");
                    await Migrate("EmploymentHistory");
                    await Migrate("EducationHistory");
                    await Migrate("Households");
                    await Migrate("MovedHouseholdClients", action: "Delete");
                    await Migrate("HouseholdHistory");
                    await Migrate("HouseholdClients");
                    await Migrate("EnrollmentCases");
                    await Migrate("EnrollmentAssessments");
                    await Migrate("IntakeAssessmentProcess");
                    await Migrate("Enrollments");
                    await Migrate("HeadOfCase");
                    await Migrate("EnrollmentAssessmentClientAssessmentResponse");
                    await Migrate("EnrollmentAssessmentClientAssessmentResponse_Hoc");
                    await Migrate("CaseGoals");
                    await Migrate("Services");
                    await Migrate("ServiceClients");
                    await Migrate("ClassEnrollments");
                    await Migrate("TestResults");
                    await Migrate("UnitCheckins");

                    await Migrate("Clients", action: "Update");
                    await Migrate("CaseNotes", action: "Update");
                    await Migrate("EmploymentHistory", action: "Update");
                    await Migrate("EducationHistory", action: "Update");
                    await Migrate("Households", action: "Update");
                    await Migrate("EnrollmentCases", action: "Update");
                    await Migrate("Enrollments", action: "Update");
                    await Migrate("CaseGoals", action: "Update");
                    await Migrate("Services", action: "Update");
                    await Migrate("TestResults", action: "Update");
                    await Migrate("UnitCheckins", action: "Update");
                }

            }
            catch (Exception e)
            {
                CustomConsole.Error("An error was thrown:");
                CustomConsole.Error(e.Message, e.InnerException?.Message);
            }
        }

        private async Task Migrate(string entity, string action = "Create", string resumeFileNs = null)
        {
            var fileNs = !string.IsNullOrEmpty(resumeFileNs) ? resumeFileNs : RandomString(6);
            _batchRunner.Init(fileNs);
            CustomConsole.Info("({0}) Overall Process Started at:{1}", fileNs, DateTime.Now);
            var node = new NodeScriptRunner(fileNs);
            if(resumeFileNs == null){
                await node.CreateBatch(entity, action);
            }
            
            if (_batchRunner.AreThereFilesToRun())
            {
                await _batchRunner.RunBatches().ConfigureAwait(false);
                CustomConsole.Warning("Wait until the changes are commited to DB");
                await Task.Delay(TimeSpan.FromMinutes(MinutesToSync));
                await node.ConfirmBatch(entity, action);
            }
            else
            {
                CustomConsole.Warning($"No new {entity} to run");
            }
        }

        private static Random random = new Random();
        public static string RandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
            .Select(s => s[random.Next(s.Length)]).ToArray());
        }
        
    }
}