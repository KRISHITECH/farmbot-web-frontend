import * as React from "react";
import { connect } from "react-redux";
import { Everything } from "../interfaces";
import { WeedDetector } from "../images";
import { HardwareSettings } from "./components/hardware_settings";
import { FarmbotOsSettings } from "./components/farmbot_os_settings";
import { Farmware } from "../farmware";

@connect((state: Everything) => state)
export class Devices extends React.Component<Everything, {}> {
  render() {
    if (this.props.auth) {
      let auth = this.props.auth;
      return <div className="all-content-wrapper">
        <div className="row">
          <div className="col-md-6 col-sm-6 col-xs-12 col-sm-12">
            <div className="widget-wrapper farmware-widget">
              <div className="row">
                <Farmware bot={this.props.bot} />
              </div>
            </div>
            <div className="row">
              <FarmbotOsSettings {...this.props} auth={auth} />
            </div>
          </div>
          <div className="col-md-6 col-sm-6 col-xs-12">
            <WeedDetector {...this.props} />
            <HardwareSettings {...this.props} />
          </div>
        </div>
      </div>;
    } else {
      throw new Error("Log in first");
    }
  }
};

