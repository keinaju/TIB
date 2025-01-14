import { DropBox } from "./dropBox.js";

export class Terminal {
  #mediator;
  #inputElement;
  #outputElement;
  #sectionElement;
  #dropBox;

  constructor(mediator) {
    this.#mediator = mediator;

    this.#inputElement = document.createElement("input");

    this.#inputElement.placeholder = "<command>";

    this.#inputElement.addEventListener("keydown", (event) => {
      if (event.key == "Enter") {
        this.#mediator.onEnter(this, this.#inputElement.value);
      }

      if (event.ctrlKey && event.key == "l") {
        this.#clear();
        // Prevent browser hotkeys
        event.preventDefault();
      }

      if (event.key == "Tab") {
        this.#mediator.onTab(this);
        event.preventDefault();
      }
    });

    this.#outputElement = document.createElement("div");
  }

  #clear() {
    this.#outputElement.innerText = "";
  }

  #createOutputParagraph() {
    const paragraph = document.createElement("p");
    paragraph.classList.add("terminal-output-element");
    return paragraph;
  }

  #sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async appendOutput(text) {
    const paragraph = this.#createOutputParagraph(text);

    this.#outputElement.append(paragraph);

    let counter = 0;
    for (const char of text) {
      paragraph.append(char);

      if (counter % 15 == 0) {
        await this.#sleep(10);
      }
      counter++;
    }
  }

  createElement() {
    const section = document.createElement("section");
    section.append(this.#inputElement);
    section.append(this.#outputElement);
    section.classList.add("terminal");

    this.#sectionElement = section;

    this.#dropBox = new DropBox(section, (commands) =>
      this.#mediator.onFileDrop(this, commands)
    );

    return section;
  }

  focus() {
    this.#inputElement.focus();
  }

  hide() {
    this.#sectionElement.classList.add("hidden");
  }

  show() {
    this.#sectionElement.classList.remove("hidden");
  }

  async showTexts(texts) {
    this.#clear();

    for (const text of texts) {
      await this.appendOutput(text);
    }
  }

  showHelpText() {
    const texts = [
      "TIB (Terminal in Browser) is a command line client for sending text inputs as HTTP requests.",
      "Start by defining server's URL with command: url <destination>",
      "Type text command in the input field and press enter to send the request.",
      "You can also provide commands as a text file. Command values are to be seperated with ; character. Drag and drop the file at the terminal to send the request.",
      "Press CTRL + L to clear the terminal.",
      "Client commands:",
      "empty input = help text",
      "url <destination> = set server's URL",
      "split = show two terminals",
      "hide = show one terminal",
      "theme = change color theme",
    ];

    this.#clear();

    this.showTexts(texts);
  }

  showLoader() {
    this.#clear();

    const loader = document.createElement("div");
    loader.classList.add("loader");
    this.#outputElement.append(loader);
  }
}
