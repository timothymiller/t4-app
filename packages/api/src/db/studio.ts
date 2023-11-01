import * as schema from "./schema";
import studio, { Setup } from "@drizzle-team/studio";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

async function getSqliteFile(){
  try {
      const path = "./state/v3/d1/miniflare-D1DatabaseObject/";
      const fileNames = await readdir(path);
      return fileNames.map(name => join(path, name)).filter(p => p.endsWith(".sqlite"))[0];
  }
  catch (err) {
      console.error(err);
  }
}

const db = drizzle(new Database(await getSqliteFile()));
const setup: Setup = {
  type: "sqlite",
  db: db,
  //@ts-expect-error
  schema: schema,
};

//@ts-expect-error
const server = await studio.prepareServer(setup);

const port = 1337;
const host = "0.0.0.0";
server.start({
  host,
  port,
  cb: (err: any, address: any) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Drizzle Studio running on ${address}`)
    }
  },
});
