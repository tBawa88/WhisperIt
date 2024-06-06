import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, code: enteredCode } = await request.json();
        const exisitingUser = await UserModel.findOne({ username })

        if (!exisitingUser || exisitingUser.isVerified) {
            return Response.json({
                success: false,
                message: "User verification not possible"
            }, { status: 405 })

        }

        const isCodeValid = enteredCode === exisitingUser.verifyCode;
        const isCodeNotExpired = new Date() < exisitingUser.verifyCodeExpire;
        if (isCodeValid && isCodeNotExpired) {
            //verify the user
            exisitingUser.isVerified = true;
            await exisitingUser.save();
            return Response.json({
                success: true,
                message: "User verified successfuly"
            }, { status: 200 })
        } else {
            //verificatoin failed
            return Response.json({
                success: false,
                message: "Verification code invalid or expired"
            }, { status: 500 })
        }

    } catch (error) {
        console.log("Error verifying the user", error)
        return Response.json({
            success: false,
            message: "Error finding the user, verifcation failed"
        })
    }

}