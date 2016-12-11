import * as React from "react";
import { NavBar } from "./nav";
import { Everything } from "./interfaces";
import { init } from "./ui";

init();
export default class App extends React.Component<Everything, {}> {
  render() {
    return (
      <div className="app">
        <NavBar { ...this.props } />
        {this.props.children}
      </div>
    );
  }
}
