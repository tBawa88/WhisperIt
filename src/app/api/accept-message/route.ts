import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, { status: 401 })
    }

    const userId = user._id;
    const { acceptMessageStatus } = await request.json();
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAccepting: acceptMessageStatus },
            { new: true }
        )

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "Failed to toggle user's message status",
                updatedUser
            }, { status: 401 })
        } else {
            return Response.json({
                success: true,
                message: "Successfully toggled user's message status"
            }, { status: 200 })
        }

    } catch (error) {
        console.log("Error fetching user from DB ", error);
        return Response.json(
            {
                success: false,
                message: "Failed to toggle user's message status"
            },
            {
                status: 500
            }
        )
    }
}

export async function GET(request: Request) {
    dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, { status: 401 })
    }

    try {
        const userId = user._id;
        const foundUser = await UserModel.findById(userId);

        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 401 })
        } else {
            return Response.json({
                success: true,
                message: "Successfully fetched user's message status",
                isAccepting: foundUser.isAccepting
            }, { status: 200 })
        }




    } catch (error) {
        console.log("Error fetching user from DB ", error);
        return Response.json(
            {
                success: false,
                message: "Failed to fetch user's message status"
            },
            {
                status: 500
            }
        )
    }



}