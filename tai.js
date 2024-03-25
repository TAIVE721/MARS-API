import { sql } from "@vercel/postgres";

process.loadEnvFile();

const { rows } = await sql`SELECT * FROM categorys;`;
console.log(rows);
