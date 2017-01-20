import * as React from "react";
import { BackArrow } from "../back_arrow";
import { t } from "i18next";
import { Select } from "../../ui";

interface AddFarmEventState {
  sequences: {}[];
  regimens: {}[];
}

export class AddFarmEvent extends React.Component<{}, AddFarmEventState> {
  constructor() {
    super();
    this.state = { sequences: [], regimens: [] };
  }

  componentDidMount() {
    // this.setState({
    //   sequences: this.props.sequeces.all,
    //   regimens: this.props.regimens.all
    // });
  }

  render() {
    return <div className="panel-container magenta-panel">
      <div className="panel-header magenta-panel">
        <p className="panel-title">
          <BackArrow />Add Farm Event
        </p>
      </div>
      <div className="panel-content">
        <label>{t("Sequence or Regimen")}</label>
        // Select here
        <label>{t("Parameters")}</label>
        <p className="event-parameters">Show sequence/regimen parameters</p>
        <label>{t("Starts")}</label>
        <div className="row">
          <div className="col-xs-6">
            <input placeholder="Today"
              type="text"
              className="add-event-start-date" />
          </div>
          <div className="col-xs-6">
            <select className="add-event-start-time">
              <option value="1430">2:30pm</option>
              <option value="1700">5:00pm</option>
            </select>
          </div>
        </div>
        <label>{t("Repeats Every")}</label>
        <div className="row">
          <div className="col-xs-4">
            <input placeholder="2"
              type="text"
              className="add-evet-repeat-frequency" />
          </div>
          <div className="col-xs-8">
            <select className="add-event-repeat-period">
              <option value="none">Does not repeat</option>
              <option value="minutes">minutes</option>
              <option value="hours">hours</option>
              <option value="days">days</option>
              <option value="weeks">weeks</option>
              <option value="months">months</option>
            </select>
          </div>
        </div>
        <label>{t("Until")}</label>
        <div className="row">
          <div className="col-xs-6">
            <input placeholder="Today"
              type="text"
              className="add-event-end-date" />
          </div>
          <div className="col-xs-6">
            <select className="add-event-end-time">
              <option value="1430">2:30pm</option>
              <option value="1700">5:00pm</option>
            </select>
          </div>
        </div>
        <div>
          <button className="magenta button-like">
            Save
          </button>
        </div>
      </div>
    </div>;
  }
}
