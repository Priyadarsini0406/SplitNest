const crypto = require("crypto");

/**
 * Generate a secure 6-digit OTP.
 *
 * @returns {string} Example: "482193"
 */
const generateOTP = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

/**
 * Hash OTP before storing it in MongoDB.
 *
 * @param {string} otp
 * @returns {string}
 */
const hashOTP = (otp) => {
  return crypto
    .createHash("sha256")
    .update(String(otp))
    .digest("hex");
};

/**
 * Create OTP expiry time.
 *
 * @param {number} minutes
 * @returns {Date}
 */
const createOTPExpiry = (minutes = 10) => {
  return new Date(Date.now() + minutes * 60 * 1000);
};

/**
 * Check whether OTP is expired.
 *
 * @param {Date|string} expiryTime
 * @returns {boolean}
 */
const isOTPExpired = (expiryTime) => {
  if (!expiryTime) {
    return true;
  }

  return new Date(expiryTime).getTime() < Date.now();
};

/**
 * Compare entered OTP with stored hashed OTP.
 *
 * @param {string} enteredOTP
 * @param {string} storedHashedOTP
 * @returns {boolean}
 */
const verifyOTPHash = (enteredOTP, storedHashedOTP) => {
  if (!enteredOTP || !storedHashedOTP) {
    return false;
  }

  const enteredHashedOTP = hashOTP(enteredOTP);

  return crypto.timingSafeEqual(
    Buffer.from(enteredHashedOTP),
    Buffer.from(storedHashedOTP)
  );
};

module.exports = {
  generateOTP,
  hashOTP,
  createOTPExpiry,
  isOTPExpired,
  verifyOTPHash,
};