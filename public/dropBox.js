export class DropBox {
  #dropAreaElement;
  #passCommandsToTerminal;

  constructor(dropAreaElement, passCommandsToTerminal) {
    this.#dropAreaElement = dropAreaElement;

    this.#dropAreaElement.addEventListener(
      "dragenter",
      this.#dragenterHandler,
      false
    );

    this.#dropAreaElement.addEventListener(
      "dragover",
      this.#dragoverHandler,
      false
    );

    this.#dropAreaElement.addEventListener(
      "drop",
      (event) => {
        event.stopPropagation();
        event.preventDefault();

        const dt = event.dataTransfer;
        const file = dt.files[0];

        this.#readFile(file);
      },
      false
    );

    this.#passCommandsToTerminal = passCommandsToTerminal;
  }

  #dragenterHandler(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  #dragoverHandler(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  #readFile(file) {
    const reader = new FileReader();

    reader.onload = (event) => {
      const textInFile = event.target.result;
      // Filter line breaks
      const filteredText = textInFile.replaceAll(/(\n|\r)/g, "");
      const commands = this.#getArrayOfCommands(filteredText);
      this.#passCommandsToTerminal(commands);
    };

    reader.readAsText(file);
  }

  #getArrayOfCommands(text) {
    let commands = text.split(";");

    // Remove 0-character strings and strings with only white space characters
    commands = commands.filter((command) => command.trim() != "");

    return commands;
  }
}
