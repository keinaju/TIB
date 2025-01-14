import { HttpClient } from "./httpClient.js";
import { Terminal } from "./terminal.js";

export class Mediator {
  #container;
  #httpClient;
  #terminal1;
  #terminal2;
  #themes = [
    "rgb(250, 250, 250)",
    "rgb(237, 252, 255)",
    "rgb(192, 255, 255)",
    "rgb(192, 255, 235)",
    "rgb(192, 255, 215)",
    "rgb(0, 255, 240)",
    "rgb(0, 255, 220)",
    "rgb(0, 255, 200)",
    "rgb(0, 0, 255)",
    "rgb(0, 0, 128)",
    "rgb(255, 0, 80)",
    "rgb(128, 0, 40)",
    "rgb(211, 158, 112)",
    "rgb(62, 45, 30)",
    "rgb(192, 192, 192)",
    "rgb(128, 128, 128)",
    "rgb(64, 64, 64)",
    "rgb(0, 0, 0)",
  ];
  #themeNow = 0;

  constructor() {
    this.#httpClient = new HttpClient();
    this.#terminal1 = new Terminal(this);
    this.#terminal2 = new Terminal(this);
  }

  #checkClientCommands(terminal, userInput) {
    return (
      this.#checkHelpCommand(terminal, userInput) ||
      this.#checkHideCommand(terminal, userInput) ||
      this.#checkSplitCommand(userInput) ||
      this.#checkThemeCommand(userInput) ||
      this.#checkUrlCommand(terminal, userInput)
    );
  }

  #changeTheme() {
    this.#themeNow++;
    if (this.#themeNow == this.#themes.length) {
      this.#themeNow = 0;
    }

    const root = document.querySelector(":root");
    root.style.setProperty("--body-bg-color", this.#themes[this.#themeNow]);
  }

  #checkHelpCommand(terminal, userInput) {
    if (userInput == "") {
      terminal.showHelpText();
      return true;
    }
  }

  #checkHideCommand(terminal, userInput) {
    if (userInput == "hide") {
      this.#container.classList.remove("container");
      terminal.hide();
      return true;
    }
  }

  #checkSplitCommand(userInput) {
    if (userInput == "split") {
      this.#container.classList.add("container");
      this.#terminal1.show();
      this.#terminal2.show();
      return true;
    }
  }

  #checkThemeCommand(userInput) {
    if (userInput == "theme") {
      this.#changeTheme();
      return true;
    }
  }

  #checkUrlCommand(terminal, userInput) {
    const urlRegex = /^url (.*)$/;
    const match = userInput.match(urlRegex);
    if (match && match[1]) {
      this.#httpClient.setUrl(match[1]);
      terminal.showTexts([`URL is set to ${match[1]}.`]);
      return true;
    }
  }

  #sendRequest(terminal, userInput) {
    this.#httpClient
      .sendRequest(userInput)
      .then((texts) => terminal.showTexts(texts));
  }

  createElement() {
    const div = document.createElement("div");
    div.append(this.#terminal1.createElement());
    div.append(this.#terminal2.createElement());

    this.#terminal1.showHelpText();
    this.#terminal2.hide();
    this.#container = div;

    return div;
  }

  onEnter(terminal, userInput) {
    const isClientCommand = this.#checkClientCommands(terminal, userInput);

    if (!isClientCommand) {
      this.#sendRequest(terminal, [userInput]);
      terminal.showLoader();
    }
  }

  onFileDrop(terminal, commands) {
    this.#sendRequest(terminal, commands);
    terminal.showLoader();
  }

  onTab(terminal) {
    if (terminal == this.#terminal1) {
      this.#terminal2.focus();
    } else {
      this.#terminal1.focus();
    }
  }
}
