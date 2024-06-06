import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from 'zod';
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})


export async function GET(request: Request) {
    await dbConnect();
    try {
        //extract username from query params
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username')
        }


        const result = UsernameQuerySchema.safeParse(queryParam)
        //if zod validation fails
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json({
                success: false,
                message: usernameErrors.length > 0
                    ? usernameErrors.join(', ')
                    : "Invalid Query parameters (username)"
            }, { status: 400 })
        }
        //if zod validation passes
        const { username } = result.data;

        //find user in db
        const exisitingVerifiedUser = await UserModel.findOne({ username, isVerified: true })
        if (exisitingVerifiedUser) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            })
        }
        return Response.json({
            success: true,
            message: "Username is unique, okay to proceed"
        })


    } catch (error) {
        console.error("Error checking username", error);
        return Response.json({
            success: false,
            message: "Error checking username"
        }, { status: 500 })
    }
}