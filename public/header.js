export class Header {
  #headerElement;

  constructor() {}

  createElement() {
    const div = document.createElement("div");
    div.classList.add("header");

    this.#headerElement = div;
    this.setText("TIB");

    return div;
  }

  setText(text) {
    this.#headerElement.innerText = text;
  }
}
