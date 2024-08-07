import { Helper } from "../utils/helper.js";
import logger from "../utils/logger.js";

export class API {
  constructor() {
    this.url = "https://api-game.kibble.exchange";
    this.origin = "https://clicker.kibble.exchange";
    this.ua = Helper.randomUserAgent();
  }

  generateHeaders(token) {
    const headers = {
      Accept: "application/json, text/plain, */*",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
      "Content-Type": "application/json",
      Priority: "u=1, i",
      Referer: `${this.origin}/`,
      Origin: `${this.origin}`,
      "User-Agent": this.ua,
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-site",
    };
    if (this.token) {
      headers.Authorization = token;
    }

    return headers;
  }

  async fetch(endpoint, method, token, body = {}) {
    try {
      const url = `${this.url}${endpoint}`;
      const headers = this.generateHeaders(token);
      const options = {
        cache: "default",
        credentials: "include",
        headers,
        method,
        mode: "cors",
        redirect: "follow",
        referrer: this.url,
        referrerPolicy: "strict-origin-when-cross-origin",
      };
      logger.info(`${method} : ${url}`);
      logger.info(`Request Header : ${JSON.stringify(headers)}`);

      if (method !== "GET") {
        options.body = `${JSON.stringify(body)}`;
        logger.info(`Request Body : ${options.body}`);
      }

      const res = await fetch(url, options);

      logger.info(`Response : ${res.status} ${res.statusText}`);
      if (res.ok || res.status == 400) {
        const data = await res.json();
        logger.info(`Response Data : ${JSON.stringify(data)}`);
        return data;
      } else {
        throw new Error(res.statusText);
      }
    } catch (err) {
      logger.error(`Error : ${err.message}`);
      throw err;
    }
  }
}
