import { Mediator } from "./mediator.js";

const mediator = new Mediator();

const rootElement = document.getElementById("root");
rootElement.append(mediator.createElement());
