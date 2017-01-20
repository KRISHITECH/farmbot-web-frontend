import * as React from "react";
import { Everything } from "../../interfaces";

export class GardenMap extends React.Component<Everything, {}> {
  handleDragOver(e: React.DragEvent<HTMLElement>) {
    // Perform drop availability here probably
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  handleDragEnter(e: React.DragEvent<HTMLElement>) {
    e.preventDefault();
  }

  handleDrop(e: React.DragEvent<HTMLElement>) {
    e.preventDefault();
    var data = e.dataTransfer.getData("text");
    // e.target.appendChild(document.getElementById(data));
  }

  componentDidMount() {
    document.addEventListener("drop", function (e) {
      e = e || window.event;
      var dragX = e.pageX, dragY = e.pageY;
      console.log("X: " + dragX + " Y: " + dragY);
    }, false);
  }

  render() {
    return <div className="drop-area"
      id="drop-area"
      onDrop={this.handleDrop}
      onDragEnter={this.handleDragEnter}
      onDragOver={this.handleDragOver}>
    </div>;
  }
}
