import { HttpClient } from "./httpClient.js";
import { Terminal } from "./terminal.js";

export class Mediator {
  #httpClient;
  #terminal1;
  #terminal2;

  constructor() {
    this.#httpClient = new HttpClient();
    this.#terminal1 = new Terminal(this);
    this.#terminal2 = new Terminal(this);
  }

  #checkClientCommands(terminal, userInput) {
    return (
      this.#checkHelpCommand(terminal, userInput) ||
      this.#checkHideCommand(terminal, userInput) ||
      this.#checkSplitCommand(terminal, userInput) ||
      this.#checkUrlCommand(terminal, userInput)
    );
  }

  #checkHelpCommand(terminal, userInput) {
    if (userInput == "") {
      terminal.showHelpText();
      return true;
    }
  }

  #checkHideCommand(terminal, userInput) {
    if (userInput == "hide") {
      terminal.hide();
      return true;
    }
  }

  #checkSplitCommand(terminal, userInput) {
    if (userInput == "split") {
      this.#terminal1.show();
      this.#terminal2.show();
      return true;
    }
  }

  #checkUrlCommand(terminal, userInput) {
    const urlRegex = /^url (.*)$/;
    const match = userInput.match(urlRegex);
    if (match && match[1]) {
      this.#httpClient.setUrl(match[1]);
      terminal.setOutput([`URL is set to ${match[1]}.`]);
      return true;
    }
  }

  #sendRequest(terminal, userInput) {
    this.#httpClient
      .sendRequest(userInput)
      .then((texts) => terminal.setOutput(texts));
  }

  #showLoader(terminal) {
    const loader = document.createElement("div");
    loader.classList.add("loader");
    terminal.setOutput([loader]);
  }

  createElement() {
    const div = document.createElement("div");
    div.append(this.#terminal1.createElement());
    div.append(this.#terminal2.createElement());
    div.classList.add("container");

    this.#terminal1.showHelpText();
    this.#terminal2.hide();

    return div;
  }

  onEnter(terminal, userInput) {
    const isClientCommand = this.#checkClientCommands(terminal, userInput);

    if (!isClientCommand) {
      this.#sendRequest(terminal, userInput);
      this.#showLoader(terminal);
    }
  }

  onTab(terminal) {
    if (terminal == this.#terminal1) {
      this.#terminal2.focus();
    } else {
      this.#terminal1.focus();
    }
  }
}
