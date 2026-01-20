function removeAllSpaces(str) {
    return str.replace(/\s+/g, "");
  }
  

export const securityKeyCheck = (securityKey) => {
    removeAllSpaces(securityKey)
    if (securityKey == null || typeof securityKey != "string" || securityKey.length < 6 || securityKey.length>10){
        return false ;
    }
}