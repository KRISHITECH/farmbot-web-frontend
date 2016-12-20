import * as React from "react";
import { NavBar } from "./nav";
import { Everything } from "./interfaces";
import { init } from "./ui";

/** Remove 300ms delay on touch devices - https://github.com/ftlabs/fastclick */
let fastClick = require("fastclick");
fastClick.attach(document.body);

/** For the logger module */
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
