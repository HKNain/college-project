function removeAllSpaces(str) {
  return str.replace(/\s+/g, "");
}

export const securityKeyCheck = (securityKey) => {
  const cleaned = removeAllSpaces(securityKey);
  return (
    securityKey != null &&
    typeof securityKey === "string" &&
    cleaned.length >= 6 &&
    cleaned.length <= 10
  );
};
