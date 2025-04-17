import { DiscordRequest } from "./utils.js";

const endpoint = `guilds/934455195725860934/channels`;

try {
  const res = await DiscordRequest(endpoint).then((res) => res.json());

  console.log(res);
} catch (err) {
  console.error(err);
}