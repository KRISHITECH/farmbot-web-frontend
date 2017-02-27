import * as React from "react";
import { t } from "i18next";
import { FarmEvent } from "../interfaces";
import {
  FBSelect,
  Select,
  BlurableInput,
  Col,
  Row,
  BackArrow
} from "../../ui";
import { connect } from "react-redux";
import { mapStateToPropsAdd, AddFarmEventProps } from "./map_state_to_props_add";

// type AddFarmEventState = Partial<FarmEvent>
type AddFarmEventState = Partial<Record<keyof FarmEvent, string>>;

@connect(mapStateToPropsAdd)
export class AddFarmEvent extends React.Component<AddFarmEventProps,
AddFarmEventState> {
  constructor() {
    super();
    this.state = { next_time: new Date().toISOString() };
  }

  updateSequenceOrRegimen = (e: Partial<FarmEvent>) => {
    let { executable_id, executable_type } = e;
    console.log("This WILL break in production.");
    this.setState({
      executable_id: JSON.stringify(executable_id),
      executable_type: JSON.stringify(executable_id)
    });
  }

  updateForm = (e: React.SyntheticEvent<HTMLInputElement>) => {
    switch (name) {
      case "start_time":
      case "end_time":
      case "repeat":
      case "time_unit":
      case "next_time":
        let { name, value } = e.currentTarget;
        return this.setState({ [name]: value });
      default:
        console.log("NOPE!");
    }
  }

  render() {
    return <div className={`panel-container magenta-panel
            add-farm-event-panel`}>
      <div className="panel-header magenta-panel">
        <p className="panel-title">
          <BackArrow /> {t("Add Farm Event")}
        </p>
      </div>
      <div className="panel-content">
        <label>{t("Sequence or Regimen")}</label>
        <FBSelect
          list={this.props.selectOptions}
          onChange={this.updateSequenceOrRegimen}
          value={"0"} />
        <label>{t("Starts")}</label>
        <Row>
          <Col xs={6}>
            <BlurableInput
              type="date"
              className="add-event-start-date"
              name="start_date"
              value={(this.state.start_time || new Date().toISOString())}
              onCommit={this.updateForm} />
          </Col>
          <Col xs={6}>
            <BlurableInput type="time"
              className="add-event-start-time"
              name="start_time"
              value={(this.state.start_time || new Date().toISOString())}
              onCommit={this.updateForm} />
          </Col>
        </Row>
        <label>{t("Repeats Every")}</label>
        <Row>
          <Col xs={4}>
            <BlurableInput
              placeholder="(Number)"
              type="number"
              className="add-event-repeat-frequency"
              name="repeat"
              value={(this.state.repeat || 0).toString()}
              onCommit={this.updateForm} />
          </Col>
          <Col xs={8}>
            <Select
              options={this.props.repeatOptions}
              name="time_unit"
              value={this.state.time_unit || "daily"}
              onChange={this.updateForm} />
          </Col>
        </Row>
        <label>{t("Until")}</label>
        <Row>
          <Col xs={6}>
            <BlurableInput
              type="date"
              className="add-event-end-date"
              name="end_date"
              value={"eventEndDate"}
              onCommit={this.updateForm} />
          </Col>
          <Col xs={6}>
            <BlurableInput
              type="time"
              name="end_time"
              className="add-event-end-time"
              value={(this.state.end_time || new Date().toISOString())}
              onCommit={this.updateForm} />
          </Col>
        </Row>
        <button className="magenta button-like"
          onClick={() => this.props.save(this.state)}>
          {t("Save")}
        </button>
      </div>
    </div>;
  }
}
