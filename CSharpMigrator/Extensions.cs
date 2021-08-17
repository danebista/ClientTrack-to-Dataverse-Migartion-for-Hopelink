using System;

namespace CSharpMigrator
{
    public static class CustomConsole
    {
        public static void Error(string text, params object[] args){
            Console.ForegroundColor = ConsoleColor.Red;
            WriteLine(text,args);
        }

         public static void Info(string text, params object[] args){
           Console.WriteLine(text,args);
        }

        public static void Warning(string text, params object[] args){
            Console.ForegroundColor = ConsoleColor.Yellow;
            WriteLine(text,args);
        }

         public static void Success(string text, params object[] args){
            Console.ForegroundColor = ConsoleColor.Green;
            WriteLine(text,args);
        }

        private static void WriteLine(string text, params object[] args){
            Console.WriteLine(text,args);
            Console.ForegroundColor = ConsoleColor.White;
        }
    }

    public static class Extensions{
          public static DateTime UnixTimeStampToDateTime(this double unixTimeStamp)
          {
            // Unix timestamp is seconds past epoch
            System.DateTime dtDateTime = new DateTime(1970,1,1,0,0,0,0,System.DateTimeKind.Utc);
            dtDateTime = dtDateTime.AddSeconds( unixTimeStamp ).ToLocalTime();
            return dtDateTime;
          }
    }
}