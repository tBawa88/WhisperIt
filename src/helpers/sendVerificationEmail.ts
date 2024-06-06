import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export const sendVerificatoinEmail = async (
    username: string,
    email: string,
    verificationCode: string
): Promise<ApiResponse> => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'WhisperIt Account Verification code',
            react: VerificationEmail({ username, otp: verificationCode }),
        });

        console.log("data from email send ", data)
        console.log("error from email send ", error)
        return {
            success: true,
            message: "Successfully sent the verification email"
        }

    } catch (error) {
        console.log("Error sending verificatoin email", email)
        return {
            success: false,
            message: "Failed to send verification email"
        }
    }
}