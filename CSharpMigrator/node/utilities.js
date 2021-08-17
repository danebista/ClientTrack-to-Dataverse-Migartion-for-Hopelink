export function GetRandomId() {
    const idLength = 10;
   var returnValue = "";
   var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
   for (var i = 0; i < idLength; i++)
     returnValue += characters.charAt(Math.floor(Math.random() * characters.length));
   return returnValue;
 }