import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs';
import { sendVerificatoinEmail } from "@/helpers/sendVerificationEmail";
import { generateOTP, generateExpiryDate } from '@/utils/userSignUp'


export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();

        //otp is generated on every sign up request
        const verifyCode = generateOTP();

        //find if a verified user exists with same username
        const existingVerifiedUserByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })
        if (existingVerifiedUserByUsername) {
            return Response.json({
                success: false,
                message: 'Username is already taken'
            }, { status: 201 })
        }


        const existingUserByEmail = await UserModel.findOne({ email })
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exists with this email"
                }, { status: 400 })
            } else {
                //update the exisiting credentials and save user
                const hashedPassword = await bcrypt.hash(password, 12);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpire = new Date(Date.now() + 3600);
                await existingUserByEmail.save();
            }

        } else {
            //user is here for the first time, so create new user
            const hashedPassword = await bcrypt.hash(password, 12);
            const expiryDate = generateExpiryDate();
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpire: expiryDate,
                isVerified: false,
                isAccepting: true,
                messages: []
            });
            await newUser.save();
        }

        //send verification email
        const emailResponse = await sendVerificatoinEmail(username, email, verifyCode);
        if (!emailResponse.success) {
            //email sending failed
            return Response.json({
                sucess: false,
                message: emailResponse.message
            }, { status: 500 })
        }

        return Response.json({
            success: true,
            message: "Verification email sent to email address."
        }, { status: 201 })



    } catch (error) {
        console.error('Error registering User');
        return Response.json({
            success: false,
            message: "Error registering user"
        }, { status: 500 })
    }
}