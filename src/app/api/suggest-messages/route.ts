
import { fetchQuestionsFromGemini } from '@/helpers/fetchAiQuestions';

export async function POST(request: Request) {
    try {
        const response = await fetchQuestionsFromGemini();
        if (response) {
            const jsonObject = JSON.parse(response);
            return Response.json({
                sucess: true,
                message: "Successfully generated questions using AI",
                questions: jsonObject?.questions
            }, { status: 200 })
        } else {
            return Response.json({
                sucess: false,
                message: "Failed to fetch AI generated questions, please try again later",
            }, { status: 500 })
        }


    } catch (error) {
        console.log("Error fethcing AI response ->", error)
        return Response.json({
            sucess: false,
            message: "Failed to fetch AI generated questions, please try again later",
        }, { status: 500 })
    }
}
