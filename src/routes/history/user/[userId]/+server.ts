import { json } from "@sveltejs/kit";
import databaseService from "$lib/services/database-service";

export async function GET({ params }): Promise<Response> {
  return json(await databaseService.getHistory(params.userId));
};

export async function DELETE({ params }): Promise<Response> {
  return json(databaseService.deleteUserHistory(params.userId));
};
