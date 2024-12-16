export class HttpClient {
  #url;
  #token;

  constructor() {}

  async sendRequest(inputString) {
    if (!this.#url) {
      return [
        "Client is not ready to send requests because destination URL is not defined.",
        "Use command:\nurl <destination>",
      ];
    }

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    if (this.#token) {
      headers.append("Authorization", this.#token);
    }

    const request = new Request(this.#url, {
      method: "POST",
      body: JSON.stringify({ userInput: inputString }),
      headers: headers,
    });

    try {
      const response = await fetch(request);

      if (!response.ok) {
        return [
          `Server responded with status code #${response.status} (${response.statusText}).`,
        ];
      }

      const token = response.headers.get("token");
      if (token) {
        this.setToken(token);
      }

      const texts = await response.json();
      return texts;
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
