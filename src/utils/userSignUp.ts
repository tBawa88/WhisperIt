export const generateOTP = (): string => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
}
export const generateExpiryDate = (): number => {
    const expiryDate = new Date();
    return expiryDate.setMinutes(expiryDate.getMinutes() + 30);
}