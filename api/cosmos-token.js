var crypto = require("crypto");  
  
function getAuthorizationTokenUsingMasterKey(verb, resourceType, resourceId, date, masterKey) {  
    var key = new Buffer.from(masterKey, "base64");  
  
    var text = (verb || "").toLowerCase() + "\n" +   
               (resourceType || "").toLowerCase() + "\n" +   
               (resourceId || "") + "\n" +   
               date.toLowerCase() + "\n" +   
               "" + "\n";  
  
    var body = new Buffer.from(text, "utf8");  
    var signature = crypto.createHmac("sha256", key).update(body).digest("base64");  
  
    var MasterToken = "master";  
  
    var TokenVersion = "1.0";  
  
    return encodeURIComponent("type=" + MasterToken + "&ver=" + TokenVersion + "&sig=" + signature);  
}

token = getAuthorizationTokenUsingMasterKey(
    "GET", 
    "dbs", 
    "dbs/cosmos-db", 
    "Thu, 27 Apr 2017 00:55:27 GMT", 
    "2ZLPTSb2vQ0Km2CU1SvPt4bCCZ53BcSqqKbSusRaDeLsu4ZpOtp3ZYrOg7GavZNC6QyUjBZjYeVCACDbhsmYMQ=="
)
console.log(token)
