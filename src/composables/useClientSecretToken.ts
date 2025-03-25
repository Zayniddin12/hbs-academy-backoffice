export const useClientSecret = () => {
  const secretId = localStorage.getItem("client_secret_id");
  function generateRandomHexString(length: number) {
    const byteCount = Math.ceil(length / 2); // 2 hex characters per byte
    const randomBytes = new Uint8Array(byteCount);
    crypto.getRandomValues(randomBytes);
    let hexString = "";
    for (let i = 0; i < byteCount; i++) {
      hexString += randomBytes[i].toString(16).padStart(2, "0");
    }
    return hexString.substr(0, length);
    // truncate to the desired length
  }
  // Example usage: generate a 16-character long random hex string
  const randomHex = generateRandomHexString(16);
  function init() {
    if (!secretId) {
      localStorage.setItem("client_secret_id", randomHex);
    }
  }
  return { randomHex, init, secretId };
};
