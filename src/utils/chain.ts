// import {
//     StreamingTextResponse,
//     LangChainStream,
//     Message,
//     experimental_StreamData,
// } from 'ai';
// import { ChatOpenAI } from 'langchain/chat_models/openai';
// import { AIMessage, HumanMessage } from 'langchain/schema';
// import { RemoteRunnable } from "langchain/core/runnables/remote";

// const remoteChain = new RemoteRunnable({
//     url: "https://your_hostname.com/path",
// });

// export const runtime = 'edge';

// export async function POST(req: Request) {
//     const { messages } = await req.json();

//     const data = new experimental_StreamData();

//     // important: use LangChainStream from the AI SDK:
//     const { stream, handlers } = LangChainStream({
//         onFinal: () => {
//             data.append(JSON.stringify({ key: 'value' })); // example
//             data.close();
//         },
//         experimental_streamData: true,
//     });

//     const llm = new ChatOpenAI({
//         streaming: true,
//     });

//     llm
//         .call(
//             (messages as Message[]).map(m =>
//                 m.role == 'user'
//                     ? new HumanMessage(m.content)
//                     : new AIMessage(m.content),
//             ),
//             {},
//             [handlers],
//         )
//         .catch(console.error);

//     return new StreamingTextResponse(stream, {}, data);
// }
