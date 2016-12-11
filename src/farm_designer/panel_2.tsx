import * as React from "react";
// Import all of the Events panel views
import { Events } from "./events";
import { AddEvent } from "./add_event";
import { getParam } from "../util";

// Dynamically determine what to render in the designer's second panel
// based on the value of hash fragment 'p2'
type ComponentMap = { [name: string]: React.ComponentClass<any> };
export class Panel2 extends React.Component<any, any> {
  get tabName() {
    return (getParam("p2") || "Events");
  }

  get content() {
    let component = ({ Events, AddEvent } as ComponentMap)[this.tabName];
    return React.createElement(component, this.props);
  }

  render() {
    return (
      <div>
        {this.content}
      </div>
    );
  }
};
