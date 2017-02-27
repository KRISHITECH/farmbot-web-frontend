import * as React from "react";
import { t } from "i18next";
import { FBSelect } from "../ui";
import { BotState } from "../devices/interfaces";
import { devices } from "../device";

interface FWState {
  selectedFarmware: string | undefined;
  packageUrl: string | undefined;
}

interface FWProps {
  bot: BotState;
}

export class Farmware extends React.Component<FWProps, Partial<FWState>> {
  constructor() {
    super();
    this.state = {};
  }

  /** Keep null checking DRY for this.state.selectedFarmware */
  ifFarmwareSelected = (cb: (label: string) => void) => {
    let { selectedFarmware } = this.state;
    selectedFarmware ? cb(selectedFarmware) : alert("Select a farmware first.");
  }

  update = () => {
    this
      .ifFarmwareSelected(label => devices
        .current
        .updateFarmware(label)
        .then(() => this.setState({ selectedFarmware: undefined })));
  }

  remove = () => {
    this
      .ifFarmwareSelected(label => devices
        .current
        .removeFarmware(label)
        .then(() => this.setState({ selectedFarmware: undefined })));
  }

  run = () => {
    this
      .ifFarmwareSelected(label => devices
        .current
        .execScript(label)
        .then(() => this.setState({ selectedFarmware: undefined })));
  }

  install = () => {
    if (this.state.packageUrl) {
      devices
        .current
        .installFarmware(this.state.packageUrl)
        .then(() => this.setState({ packageUrl: "" }));
    } else {
      alert("Enter a URL");
    }
  }

  fwList = () => {
    let { farmwares } = this.props.bot.hardware.process_info;
    let choices = farmwares.map((x, i) => ({ value: i, label: x.name }));
    return choices;
  }

  render() {
    return <div className="col-sm-12">
      <div className="row">
        <div className="col-sm-12">
          <div className="widget-header">
            <h5>Farmware</h5>
            <i className="fa fa-question-circle widget-help-icon">
              <div className="widget-help-text">
                {t(`This widget shows Farmware (plugin) information.`)}
              </div>
            </i>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-xs-12">
          <div className="widget-content">
            <div className="row">
              <div className="col-xs-12">
                <div className="row">
                  <fieldset>
                    <div className="col-xs-12">
                      <input type="url"
                        placeholder={"http://...."}
                        value={this.state.packageUrl || ""}
                        onChange={(e) => {
                          this.setState({ packageUrl: e.currentTarget.value });
                        }}
                      />
                    </div>
                    <div className="col-xs-12">
                      <button className="button-like green"
                        onClick={this.install}>Install</button>
                    </div>

                  </fieldset>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12">
                <FBSelect dropDownItems={this.fwList()}
                  onChange={(x) => this.setState({ selectedFarmware: x.label })}
                  placeholder="Installed Farmware Packages" />
              </div>
              <div className="col-xs-12 col-sm-6">
                <button className="button-like red" onClick={this.remove}>
                  Remove
                </button>
                <button className="button-like yellow" onClick={this.update}>
                  Update
                </button>
                <button className="button-like green" onClick={this.run}>
                  Run
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
  }
}
