import {OpenAI} from "openai";
 
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://api.aimlapi.com",
});
 
export async function POST(req: Request) {
    try {
        const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.Change your response on every request";

        const result = await openai.chat.completions.create({
            model: "mistralai/Mistral-7B-Instruct-v0.2",
            messages : [{
                role : "user",content : prompt
            }],
            temperature: 0.3,
            max_tokens: 128,
            frequency_penalty:1.5,
        
        });

        console.log("AI/ML API:\n", result);


        return Response.json({
            success : true,
            message : result.choices[0].message.content
            }, {status: 200
        })
    } catch (error) {
        throw error
    }
  
}

// import {VertexAI} from'@google-cloud/vertexai';

// /**
//  * TODO(developer): Update these variables before running the sample.
//  */
// export async function POST(projectId = 'speedy-post-428204-h2') {
//     try{

//         const vertexAI = new VertexAI({project: projectId, location: "us-central1"});

//         const generativeModel = vertexAI.getGenerativeModel({
//             model: 'gemini-1.5-flash-001',
//         });

//         const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.Change your response on every request";

//         const request = {
//             contents: [{role: 'user', parts: [{text: prompt}]}],
//         }; 

//         const resp = await generativeModel.generateContent(request);

//         const contentResponse = await resp.response;

//         console.log(JSON.stringify(contentResponse));

//         return Response.json({
//             success : true,
//             message : contentResponse
//             }, {status: 200
//         })
//     }

//     catch(err){
//         throw err
//     }
// }
