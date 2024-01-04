import { env } from '$env/dynamic/private';
import type { Conversation } from '$lib/models/Contracts';
import { Container, CosmosClient, ItemResponse } from '@azure/cosmos';

class DatabaseService {
  private db = {} as Container;
  private key = env.Database_AccountKey;
  private endpoint = env.Database_AccountEndpoint;
  private client: CosmosClient;

  constructor() {
    this.client = new CosmosClient({ endpoint: this.endpoint, key: this.key });
  }

  async init(): Promise<DatabaseService> {
    const { database } = await this.client.databases.createIfNotExists({ id: env.Database_DatabaseName });
    const { container } = await database.containers.createIfNotExists({
      id: 'Conversations',
      partitionKey: { paths: ['/userId'] }
    });
    this.db = container;
    return this;
  }

  public async getHistory(userId: string): Promise<Conversation[]> {
    const { resources } = await this.db.items
      .query({
        query:
          'SELECT * from conversation WHERE conversation.userId = @userId ORDER BY conversation.date DESC',
        parameters: [{ name: '@userId', value: userId }]
      })
      .fetchAll();
    return resources as Conversation[];
  }

  public async createHistory(conversation: Conversation): Promise<Conversation> {
    const { resource } = await this.db.items.create(conversation);
    return resource as Conversation;
  }

  public async updateHistory(conversation: Conversation): Promise<Conversation | undefined> {
    const { resource }: ItemResponse<Conversation> = await this.db
      .item(conversation.id, conversation.userId)
      .replace(conversation);
    return resource;
  }

  public async deleteHistory(conversation: Conversation): Promise<void> {
    await this.db.item(conversation.id, conversation.userId).delete();
  }

  public async deleteUserHistory(userId: string): Promise<void> {
    await this.db.items
      .query<Conversation>({
        query: 'select * from conversation WHERE conversation.userId = @userId',
        parameters: [{ name: '@userId', value: userId }]
      })
      .fetchAll()
      .then(async (r) => {
        for (const c of r.resources) {
          await this.db.item(c.id, userId).delete();
        }
      });
    // await this.db.deleteAllItemsForPartitionKey(userId);
  }
}

const databaseService: DatabaseService = await new DatabaseService().init();
export default databaseService;
