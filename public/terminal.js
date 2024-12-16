export class Terminal {
  #mediator;
  #inputElement;
  #outputElement;
  #sectionElement;

  constructor(mediator) {
    this.#mediator = mediator;

    this.#inputElement = document.createElement("input");
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

  #createOutputParagraph(element) {
    const paragraph = document.createElement("p");
    paragraph.classList.add("terminal-output-element");
    paragraph.append(element);
    return paragraph;
  }

  appendOutput(element) {
    const paragraph = this.#createOutputParagraph(element);

    this.#outputElement.append(paragraph);
  }

  createElement() {
    const section = document.createElement("section");
    section.append(this.#inputElement);
    section.append(this.#outputElement);
    section.classList.add("terminal");

    this.#sectionElement = section;

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

  setOutput(elements) {
    this.#clear();

    for (const text of elements) {
      this.appendOutput(text);
    }
  }

  showHelpText() {
    const texts = [
      "TIB (Terminal in Browser) is a command line tool for sending text inputs in HTTP requests.",
      document.createElement("br"),
      "Start by defining a server URL with command: url <destination>",
      document.createElement("br"),
      "Type text command in input field and press enter to send request.",
      "Press CTRL + L to clear the terminal.",
      document.createElement("br"),
      "Commands:",
      "Help text: empty input",
      "Set server URL: url <destination>",
      "Change to single terminal: hide",
      "Change to split terminal: split",
    ];

    this.#clear();

    this.setOutput(texts);
  }
}
