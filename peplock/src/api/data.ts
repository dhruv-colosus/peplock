import { DuneClient } from "@duneanalytics/client-sdk";

const dune = new DuneClient(import.meta.env.VITE_DUNE_API_KEY);

const query_result = await dune.getLatestResult({ queryId: 4996314 });
console.log(query_result);
