import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();
    const { username, content } = await request.json();
    try {
        const foundUser = await UserModel.findOne(username);
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }
        if (!foundUser.isAccepting) {
            return Response.json({
                success: false,
                message: "User not accepting messages atm"
            }, { status: 404 })
        }

        //If user is found and isAccepting 
        const newMessage = {
            content,
            createdAt: new Date()
        }
        foundUser.messages.push(newMessage as Message); //type asertion since messages in an array of Message type
        await foundUser.save();

        //send a response indicating message sent
        return Response.json({
            success: true,
            message: "Message sent successfully to user"
        }, { status: 200 })
    } catch (error) {
        console.log("Error sending message to user ", error)
        return Response.json({
            success: false,
            message: "rror sending message to user"
        }, { status: 500 })
    }
}