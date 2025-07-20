import { OpenAIStream } from "@/lib/utils";
import { type RequestBody } from "@/types/type";

export const runtime = "edge"

export async function POST(req: Request) {
  try {
    const { messages, model, apiKey, mode } = (await req.json()) as RequestBody;
    const stream = await OpenAIStream(messages, model, apiKey, mode);

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
}
