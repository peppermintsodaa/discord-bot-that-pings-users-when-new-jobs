import { GetGuildChannels, SendMessage } from "./utils.js";

const res = await GetGuildChannels('934455195725860934')
  .then(async (channels) => {
    const c = channels.filter((c) => c.name === 'i-like-cheese');
    
    return await SendMessage(c.at(0).id);
  })
  .then((res) => res.json());

console.log(res);