import './env';
import postgres from 'postgres';
import * as schema from '../models/schema';
export declare const db: import("drizzle-orm/postgres-js").PostgresJsDatabase<typeof schema> & {
    $client: postgres.Sql<{}>;
};
//# sourceMappingURL=db.d.ts.map