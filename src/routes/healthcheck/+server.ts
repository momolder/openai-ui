import { json } from "@sveltejs/kit";

export async function GET(): Promise<Response> {
  return json(undefined, {status: 200 });
}
