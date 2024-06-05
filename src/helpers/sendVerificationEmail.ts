import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { Verification } from "next/dist/lib/metadata/types/metadata-types";

export const sendVerificatoinEmail = async (
    username: string,
    email: string,
    verificationCode: string
): Promise<ApiResponse> => {
    try {
        await resend.emails.send({
            from: '<onboarding@resend.dev>',
            to: email,
            subject: 'WhisperIt Account Verification code',
            react: VerificationEmail({ username, otp: verificationCode }),
        });

        return {
            successs: true,
            message: "Successfully sent the verification email"
        }

    } catch (error) {
        console.log("Error sending verificatoin email", email)
        return {
            successs: false,
            message: "Failed to send verification email"
        }
    }
}