import * as React from "react";
import { t } from "i18next";
import { FarmEvent, AddEditFarmEventProps } from "../interfaces";
import {
  DeprecatedFBSelect,
  BlurableInput,
  Col,
  Row,
  BackArrow,
  DropDownItem,
  success
} from "../../ui";
import * as moment from "moment";
import { connect } from "react-redux";
import { mapStateToPropsAddEdit } from "./map_state_to_props_add_edit";
import { hasKey } from "../../util";
import { history } from "../../history";
import { TaggedFarmEvent } from "../../resources/tagged_resources";
import { edit, save, destroy } from "../../api/crud";

@connect(mapStateToPropsAddEdit)
export class EditFarmEvent extends React.Component<AddEditFarmEventProps, {}> {
  updateSequenceOrRegimen = (e: Partial<FarmEvent>) => (fe: TaggedFarmEvent) => {
    let { executable_id, executable_type } = e;
    this.props.dispatch(edit(fe, { executable_id, executable_type }));
  }

  /** Determine if its safe to use a string as a `keyof FarmEvent`.
   * Good for sanitizing user input and such.
   */
  isKeyofFarmEvent = hasKey<FarmEvent>([
    "start_time",
    "end_time",
    "repeat",
    "time_unit",
    "next_time"
  ]);

  updateForm = (e: React.SyntheticEvent<HTMLInputElement>) => {
    let { name, value } = e.currentTarget;
    if (this.isKeyofFarmEvent(name)) {
      return this.setState({ [name]: value });
    } else {
      throw new Error("Got bad key: " + name);
    };
  }

  updateRepeatSelect = (e: DropDownItem) =>
    (fe: TaggedFarmEvent) => {
      this.props.dispatch(edit(fe, { time_unit: e.value }));
    }

  updateTime = (e: React.SyntheticEvent<HTMLInputElement>) =>
    (fe: TaggedFarmEvent) => {
      let { handleTime } = this.props;
      switch (e.currentTarget.name) {
        case "start_time":
          let newStart = handleTime(e, (fe.body.start_time || "").toString());
          this.props.dispatch(edit(fe, { start_time: newStart }));
          break;
        case "end_time":
          let newEnd = handleTime(e, (fe.body.end_time || "").toString());
          this.props.dispatch(edit(fe, { end_time: newEnd }));
          break;
      }
    }

  handleDate = (e: React.SyntheticEvent<HTMLInputElement>) =>
    (fe: TaggedFarmEvent) => {
      switch (e.currentTarget.name) {
        case "start_date":
          let newStartDate = moment(e.currentTarget.value || "").toISOString();
          this.props.dispatch(edit(fe, { start_time: newStartDate }));
          break;
        case "end_date":
          let newEndDate = moment(e.currentTarget.value || "").toISOString();
          this.props.dispatch(edit(fe, { end_time: newEndDate }));
          break;
        default:
          throw new Error("Expected a name attribute from date field.");
      }
    }

  initialValue = (fe: TaggedFarmEvent) => {
    let iv = { label: "Loading...", value: "Loading..." };
    if (fe.body.executable_id && fe.body.executable_type) {
      switch (fe.body.executable_type) {
        case "Sequence":
          let seq = this.props.sequencesById[fe.body.executable_id];
          if (seq && seq.body.id) {
            iv.label = seq.body.name;
            iv.value = JSON.stringify(seq.body.id);
          }
          break;
        case "Regimen":
          let reg = this.props.regimensById[fe.body.executable_id];
          if (reg && reg.body.id) {
            iv.label = reg.body.name;
            iv.value = JSON.stringify(reg.body.id);
          }
          break;
      }
    }
    return iv;
  }

  noFe() {
    history.push("/app/designer/farm_events");
    return <div>Loading...</div>;
  }

  hasFe(fe: TaggedFarmEvent) {
    console.info("Not sure if it got this far or not.");
    let { formatDate, formatTime, repeatOptions, dispatch } = this.props;
    let { time_unit } = fe.body;
    let currentTimeUnit = _.findWhere(repeatOptions, { value: time_unit });

    return <div className={`panel-container magenta-panel
      add-farm-event-panel`}>
      <div className="panel-header magenta-panel">
        <p className="panel-title">
          <BackArrow /> {t("Edit Farm Event")}
        </p>
      </div>
      <div className="panel-content">
        <label>{t("Sequence or Regimen")}</label>
        <DeprecatedFBSelect
          list={this.props.selectOptions}
          onChange={(e) => this.updateSequenceOrRegimen(e)(fe)}
          initialValue={this.initialValue(fe)} />
        <label>{t("Starts")}</label>
        <Row>
          <Col xs={6}>
            <BlurableInput
              type="date"
              className="add-event-start-date"
              name="start_date"
              value={formatDate((fe.body.start_time ||
                new Date()).toString())}
              onCommit={(e) => this.handleDate(e)(fe)} />
          </Col>
          <Col xs={6}>
            <BlurableInput type="time"
              className="add-event-start-time"
              name="start_time"
              value={formatTime((fe.body.start_time ||
                new Date()).toString())}
              onCommit={(e) => this.updateTime(e)(fe)} />
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
              value={(fe.body.repeat || 0).toString()}
              onCommit={this.updateForm} />
          </Col>
          <Col xs={8}>
            <DeprecatedFBSelect
              list={this.props.repeatOptions}
              onChange={(e) => this.updateRepeatSelect(e)(fe)}
              initialValue={currentTimeUnit} />
          </Col>
        </Row>
        <label>{t("Until")}</label>
        <Row>
          <Col xs={6}>
            <BlurableInput
              type="date"
              className="add-event-end-date"
              name="end_date"
              value={formatDate((fe.body.end_time ||
                new Date()).toString())}
              onCommit={(e) => this.handleDate(e)(fe)} />
          </Col>
          <Col xs={6}>
            <BlurableInput
              type="time"
              name="end_time"
              className="add-event-end-time"
              value={formatTime((fe.body.end_time ||
                new Date()).toString())}
              onCommit={(e) => this.updateTime(e)(fe)} />
          </Col>
        </Row>
        <button className={`magenta button-like is-saving-${!!fe.saving}`}
          onClick={() => {
            dispatch(save(fe.uuid))
              .then(() => {
                history.push("/app/designer/farm_events");
                success("Saved farm event.", "Saved");
              });
          }}>
          {t("Save")}
        </button>
        <button className="red button-like"
          onClick={() => {
            dispatch(destroy(fe.uuid))
              .then(() => {
                history.push("/app/designer/farm_events");
                success("Deleted farm event.", "Deleted");
              });
          }}>
          {t("Delete")}
        </button>
      </div>
    </div>;
  }
  render() {
    let fe = this.props.getFarmEvent();
    return fe ? this.hasFe(fe) : this.noFe();
  }
}
