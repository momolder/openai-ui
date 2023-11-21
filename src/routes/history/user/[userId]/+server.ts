import { json } from "@sveltejs/kit";
import DatabaseService from "$lib/services/database-service";

export async function GET({ params }): Promise<Response> {
  const databaseService = await new DatabaseService().init();
  return json(await databaseService.getHistory(params.userId));
};

export async function DELETE({ params }): Promise<Response> {
  const databaseService = await new DatabaseService().init();
  return json(databaseService.deleteUserHistory(params.userId));
};
