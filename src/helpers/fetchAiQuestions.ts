import { GoogleGenerativeAI } from "@google/generative-ai";

export const fetchQuestionsFromGemini = async (): Promise<string> => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `Create a list of three open-ended and engaging questions fomatted as a json object.
            This object should contain a questions field and it should be an array of 3 strings, each string representing a 
            single question. These questions are for an anonymous social media platform and should be suitbale for 
            diverse audience. Avoid personal or sensitive topics, focus on universal themes that encourage friendly 
            conversation. For example {questions : ['What is your most recent hobby?', 'If you could have dinner with one 
            famous person dead or alive, who would it be and why?', 'What is a simple thing that makes you happy?']}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json|```/g, '').trim();
        console.log("fetched json string", text);
        if (text) return text
        else return ''
    } catch (error) {
        throw new Error("Error fetching questions from AI");
    }

}