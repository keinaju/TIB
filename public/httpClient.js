export class HttpClient {
  #url;
  #token;

  constructor() {}

  async sendRequest(commandsArray) {
    if (!this.#url) {
      return [
        "Client is not ready to send requests because destination URL is not defined.",
        "Use command:\nurl <destination>",
      ];
    }

    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const request = new Request(this.#url, {
      method: "POST",
      body: JSON.stringify({
        commands: commandsArray,
        token: this.#token || "",
      }),
      headers: headers,
    });

    try {
      const response = await fetch(request);

      if (!response.ok) {
        return [`Server responded with status code ${response.status}.`];
      }

      const json = await response.json();

      const token = json.token;
      if (token) {
        this.setToken(token);
      }

      return json.texts;
    } catch (error) {
      return [error.message];
    }
  }

  setUrl(url) {
    this.#url = url;
  }

  setToken(token) {
    this.#token = token;
  }
}
