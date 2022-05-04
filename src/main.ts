import "./entry.css";
import "./style.css";

console.log("hi main");
// import Experience from "./Experience/Experience";

// const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;

// new Experience(canvas);

const rootDiv = document.querySelector<HTMLDivElement>("#root");

if (rootDiv) {
  rootDiv.innerText = "this is a webpack playground with typescript and 3js";
}
console.log("hi xxx");
