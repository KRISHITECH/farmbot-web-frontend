import * as React from "react";
import { Component } from "react";
import { StepParams } from "../interfaces";
import { splice, remove } from "./index";
import { MoveAbsState } from "../interfaces";
import {
  Vector3,
  SequenceBodyItem,
  Tool,
  Coordinate,
  LegalSequenceKind
} from "farmbot";
import {
  Row,
  Col,
  BlurableInput,
  DropDownItem,
  NULL_CHOICE
} from "../../ui";
import { StepInputBox } from "../inputs/step_input_box";
import { t } from "i18next";
import { StepTitleBar } from "./step_title_bar";
import {
  isTaggedSequence,
  TaggedTool,
  TaggedToolSlot
} from "../../resources/tagged_resources";
import {
  toolsInUse,
  findToolById,
  findSlotByToolId
} from "../../resources/selectors";
import { defensiveClone } from "../../util";
import { overwrite } from "../../api/crud";
import { Xyz } from "../../devices/interfaces";
import { NewFBSelect } from "../../ui/new_fb_select";

interface Args {
  location: Tool | Coordinate;
  speed: number;
  offset: Coordinate;
}
type LocationArg = "location" | "offset";

export class TileMoveAbsolute extends Component<StepParams, MoveAbsState> {
  get resources() { return this.props.resources; }
  get step() { return this.props.currentStep; }
  get tool(): TaggedTool | undefined {
    return (this.args.location.kind === "tool") ?
      findToolById(this.resources, this.args.location.args.tool_id) : undefined;
  }
  get tool_id() { return this.tool && this.tool.body.id; }
  get slot(): TaggedToolSlot | undefined {
    return (this.tool_id) ?
      findSlotByToolId(this.resources, this.tool_id) : undefined;
  }
  get args() {
    // Incase we rename it later:
    const MOVE_ABSOLUTE: LegalSequenceKind = "move_absolute";
    if (this.step.kind === MOVE_ABSOLUTE) {
      return this.step.args;
    } else {
      throw new Error("Impossible celery node detected.");
    }
  }
  get location(): Tool | Coordinate { return this.args.location; }
  getOffsetValue = (val: Xyz) => {
    return (this.args.offset.args[val] || 0).toString();
  }

  updateArgs = (update: Partial<Args>) => {
    let copy = defensiveClone(this.props.currentSequence).body;
    let step = (copy.body || [])[this.props.index];
    if (step && step.kind === "move_absolute") {
      step.args = { ...step.args, ...update };
      this.props.dispatch(overwrite(this.props.currentSequence, copy));
    } else {
      throw new Error("Impossible condition.");
    }
  }

  getAxisValue = (axis: Xyz): string => {
    let number: number | undefined;
    switch (this.args.location.kind) {
      case "coordinate": number = this.args.location.args[axis];
        break;
      case "tool": number = (this.slot) ? this.slot.body[axis] : undefined;
        break;
    }
    return (number || 0).toString();
  }

  clearTool = () => {
    this.updateArgs({
      location: { kind: "coordinate", args: { x: 0, y: 0, z: 0 } }
    });
  }

  selectTool = (tool: DropDownItem) => {
    let tool_id = tool.value;
    if (_.isNumber(tool_id)) {
      this.updateArgs({ location: { kind: "tool", args: { tool_id } } });
    } else {
      this.clearTool();
    }
  }

  updateToolSelect = (tool: DropDownItem) => {
    (Object.is(NULL_CHOICE, tool)) ? this.clearTool() : this.selectTool(tool);
  }

  updateInputValue = (axis: Xyz, place: LocationArg) =>
    (e: React.SyntheticEvent<HTMLInputElement>) => {
      let num = parseInt(e.currentTarget.value, 10);
      let update = { [place]: { args: { [axis]: num } } };
      this.updateArgs(_.merge({}, this.args, update));
    }

  initialDropDownSequenceValue = () => {
    if (this.tool && this.tool_id) {
      return { label: this.tool.body.name, value: this.tool_id }
    }
    return { label: "---", value: 0 };
  }

  get options(): DropDownItem[] {
    let choices: DropDownItem[] = [];
    toolsInUse(this.props.resources).map(x => {
      if (_.isNumber(x.body.id)) {
        choices.push({ value: x.body.id, label: x.body.name })
      }
    })
    return choices;
  };

  render() {
    let { currentStep, dispatch, index, currentSequence } = this.props;
    if (currentSequence && !isTaggedSequence(currentSequence)) {
      throw new Error("WHOOPS!");
    }
    return <div className="step-wrapper">
      <Row>
        <Col sm={12}>
          <div className="step-header move-absolute-step">
            <StepTitleBar index={index} dispatch={dispatch} step={currentStep} />
            <i className="fa fa-arrows-v step-control" />
            <i className="fa fa-clone step-control"
              onClick={() => dispatch(splice({
                step: currentStep,
                index,
                sequence: currentSequence
              }))} />
            <i className="fa fa-trash step-control"
              onClick={() => remove({ dispatch, index, sequence: currentSequence })} />
            <div className="help">
              <i className="fa fa-question-circle help-icon" />
              <div className="help-text">
                {t(`The Move Absolute step instructs
                FarmBot to move to the specified coordinate
                regardless of the current position. For example,
                if FarmBot is currently at X=1000, Y=1000 and it
                receives a Move Absolute where X=0 and Y=3000,
                then FarmBot will move to X=0, Y=3000. If
                FarmBot must move in multiple directions, it
                will move diagonally. If you require straight
                movements along one axis at a time, use multiple
                Move Absolute steps. Coming soon: Offsets allow
                you to more easily instruct FarmBot to move to a
                location, but offset from it by the specified
                amount. For example moving to just above where a
                peripheral is located. Using offsets lets
                FarmBot do the math for you.`)}
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col sm={12}>
          <div className="step-content move-absolute-step">
            <Row>
              <Col md={12}>
                <label>Import coordinates from</label>
                <NewFBSelect
                  allowEmpty={true}
                  list={this.options}
                  selectedItem={this.initialDropDownSequenceValue()}
                  onChange={this.updateToolSelect} />
              </Col>
              <Col xs={3}>
                <label>
                  {t("X (mm)")}
                </label>
                <BlurableInput
                  onCommit={this.updateInputValue("x", "location")}
                  disabled={!!this.tool}
                  type="number"
                  name="location-x"
                  value={this.getAxisValue("x")} />
              </Col>
              <Col xs={3}>
                <label>
                  {t("Y (mm)")}
                </label>
                <BlurableInput
                  onCommit={this.updateInputValue("y", "location")}
                  type="number"
                  disabled={!!this.tool}
                  name="location-y"
                  value={this.getAxisValue("y")} />
              </Col>
              <Col xs={3}>
                <label>
                  {t("Z (mm)")}
                </label>
                <BlurableInput
                  onCommit={this.updateInputValue("z", "location")}
                  type="number"
                  name="location-z"
                  disabled={!!this.tool}
                  value={this.getAxisValue("z")} />
              </Col>
              <Col xs={3}>
                <label>
                  {t("Speed")}
                </label>
                <StepInputBox
                  field={"speed"}
                  step={this.step}
                  index={index}
                  dispatch={this.props.dispatch}
                  sequence={this.props.currentSequence} />
              </Col>
              <Col xs={3}>
                <label>
                  {t("X-Offset")}
                </label>
                <BlurableInput
                  onCommit={this.updateInputValue("x", "offset")}
                  type="number"
                  name="offset-x"
                  value={this.getOffsetValue("x")} />
              </Col>
              <Col xs={3}>
                <label>
                  {t("Y-Offset")}
                </label>
                <BlurableInput
                  onCommit={this.updateInputValue("y", "offset")}
                  type="number"
                  name="offset-y"
                  value={this.getOffsetValue("y")} />
              </Col>
              <Col xs={3}>
                <label>
                  {t("Z-Offset")}
                </label>
                <BlurableInput
                  onCommit={this.updateInputValue("z", "offset")}
                  type="number"
                  name="offset-z"
                  value={this.getOffsetValue("z")} />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>;
  }
}
