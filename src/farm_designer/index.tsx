import * as React from "react";
import { GardenMap } from "./map/garden_map";
import { connect } from "react-redux";
import { Everything } from "../interfaces";
import { success } from "../ui";

@connect((state: Everything) => state)
export class FarmDesigner extends React.Component<Everything, {}> {
  componentDidMount() {
    success("Subscribe to the FarmBot.io mailing list for news and updates.",
      "Work in Progress");
  }

  render() {
    return (
      <div className="farm-designer">
        <div className="farm-designer-body">
          <div className="farm-designer-left">
            {this.props.children}
          </div>

          <div className="farm-designer-map">
            <GardenMap {...this.props} />
          </div>
        </div>
      </div>
    );
  }
}

