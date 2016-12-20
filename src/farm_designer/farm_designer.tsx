import * as React from "react";
import { Panel1 } from "./panel_1";
import { GardenMap } from "./garden_map";
import { Panel2 } from "./panel_2";
import { connect } from "react-redux";
import { Everything } from "../interfaces";
import { success } from "../ui";

class FarmDesignerPage extends React.Component<Everything, any> {
  componentDidMount() {
    success("Subscribe to the FarmBot.io mailing list for news and updates.",
      "Work in Progress");
  }
  render() {
    return (
      <div className="farm-designer">
        <div className="farm-designer-body">
          <div className="farm-designer-left">
            <Panel1 { ...this.props } />
          </div>

          <div className="farm-designer-map">
            <GardenMap {...this.props} />
          </div>

          <div className="farm-designer-right">
            <Panel2 { ...this.props } />
          </div>
        </div>
      </div>
    );
  }
}

export let FarmDesigner = connect((state: Everything) => state)(FarmDesignerPage);
