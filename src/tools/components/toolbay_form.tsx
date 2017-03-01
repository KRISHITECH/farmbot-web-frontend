import * as React from "react";
import { ListAndFormProps, ToolBayFormState } from "../interfaces";
import { Widget, WidgetBody, WidgetHeader, FBSelect } from "../../ui";
import { Col, Row, BlurableInput, DropDownItem } from "../../ui";
import { Everything } from "../../interfaces";
import {
  toggleEditingToolBays,
  saveToolBay,
  destroySlot,
  addToolSlot,
  updateToolSlot
} from "../actions";
import { t } from "i18next";
import { connect } from "react-redux";

@connect((state: Everything) => state)
export class ToolBayForm extends React.Component<ListAndFormProps,
Partial<ToolBayFormState>> {
  constructor() {
    super();
    this.state = {
      new_slot_x: 0,
      new_slot_y: 0,
      new_slot_z: 0,
      new_slot_tool_id: null
    };
  }

  resetState = () => {
    this.setState({
      new_slot_x: 0,
      new_slot_y: 0,
      new_slot_z: 0,
      new_slot_tool_id: null
    });
  }

  set = (e: React.SyntheticEvent<HTMLInputElement>) => {
    let { name, value } = e.currentTarget;
    this.setState({ [name]: parseInt(value) });
  }

  destroy = (id: number | undefined) => {
    if (id) {
      this.props.dispatch(destroySlot(id));
    } else {
      throw new Error("Could not find tool slot ID.");
    }
  }

  add = (tool_bay_id: number) => {
    let slot = {
      x: this.state.new_slot_x,
      y: this.state.new_slot_y,
      z: this.state.new_slot_z,
      tool_id: this.state.new_slot_tool_id,
      tool_bay_id
    };
    this.props.dispatch(addToolSlot(slot));
    this.resetState();
  }

  updateBayName = (e: React.SyntheticEvent<HTMLInputElement>) => {
    // let { id, value } = e.currentTarget;
    // this.props.dispatch(updateToolBayName(parseInt(id), value));
  }

  update = (e: React.SyntheticEvent<HTMLInputElement>) => {
    let { id, name, value } = e.currentTarget;
    this.props.dispatch(updateToolSlot(parseInt(id), name, parseInt(value)));
  }

  updateTool = (slot_id: number | undefined) => {
    let tools = _.indexBy(this.props.all.tools.all, "id");
    return (item: DropDownItem) => {
      if (item.value) {
        let tool = tools[item.value];
        if (tool && tool.id && slot_id) {
          let id = tool.id;
          this.props.dispatch(updateToolSlot(slot_id, "tool_id", id));
        } else {
          // Keeping an eye on this for Rollbar
          throw new Error(`Should never happen: No Tool ID.
          tool_id: ${tool.id}
          slot_id: ${slot_id}`);
        }
      }
    };
  }

  updateNewSlotTool = (item: DropDownItem) => {
    let tools = _.indexBy(this.props.all.tools.all, "id");
    if (item.value) {
      let tool = tools[item.value];
      if (tool && tool.id) {
        let id = tool.id;
        this.setState({ new_slot_tool_id: id });
      } else {
        // Keeping an eye on this for Rollbar
        throw new Error(`Should never happen: No Tool ID.
          tool_id: ${tool.id}`);
      }
    } else {
      // Handle "none" selection...
    }
  }

  saveAll = () => {
    // TODO: This is NOT scalable. Temp solution for just having one toolbay.
    if (this.props.all.tool_bays && this.props.all.tool_bays[0]) {
      let tool_bay_id = this.props.all.tool_bays[0].id;
      this.props.dispatch(saveToolBay(tool_bay_id, this.props.all.tool_bays));
    }
  }

  renderSlots = (tool_bay_id: number) => {
    return _.sortBy((this.props.all.tool_slots || []), "id").map((slot, index) => {
      let { x, y, z, tool_id, id } = slot;

      let toolOptions = (this.props.all.tools.all || []).map(tool => {
        if (tool.id && id) {
          return { label: tool.name, value: tool.id, slot_id: id };
        } else {
          throw new Error("Thought tool.id would be there. It was not.");
        }
      });

      let chosenTool = tool_id ?
        _.indexBy(toolOptions, "value")[tool_id].label : undefined;

      let newSlotToolOptions = (this.props.all.tools.all || []).map(tool => {
        if (tool.id) {
          return { label: tool.name, value: tool.id };
        } else {
          // TODO: Filter out unsave tools in MapStateToProps.
          throw new Error("Saved tools only.");
        }
      });

      return <div key={id}>
        <Row>
          <Col xs={1}>
            <label>{index + 1}</label>
          </Col>
          <Col xs={2}>
            <BlurableInput
              id={(id || "Error getting slot ID.").toString()}
              value={(x || 0).toString()}
              type="number"
              name="x"
              onCommit={this.update}
            />
          </Col>
          <Col xs={2}>
            <BlurableInput
              id={(id || "Error getting slot ID.").toString()}
              value={(y || 0).toString()}
              type="number"
              name="y"
              onCommit={this.update}
            />
          </Col>
          <Col xs={2}>
            <BlurableInput
              id={(id || "Error getting slot ID.").toString()}
              value={(z || 0).toString()}
              type="number"
              name="z"
              onCommit={this.update}
            />
          </Col>
          <Col xs={4}>
            <FBSelect
              allowEmpty={true}
              onChange={this.updateNewSlotTool}
              list={newSlotToolOptions} />
          </Col>
          <Col xs={1}>
            <button
              onClick={() => this.destroy(slot.id)}
              className="button-like red">
              <i className="fa fa-times"></i>
            </button>
          </Col>
        </Row>
      </div>;
    });
  }

  render() {
    let toggleEdit = () => { this.props.dispatch(toggleEditingToolBays()); };
    let { new_slot_x, new_slot_y, new_slot_z } = this.state;
    let { tool_bays, tool_slots } = this.props.all;

    let newSlotToolOptions = (this.props.all.tools.all || [])
      .map(tool => {
        if (tool.id) {
          return { label: tool.name, value: tool.id };
        } else {
          throw new Error("We thought tool.id would be there.");
        }
      });

    return <Widget className="toolbay-form-widget">
      <WidgetHeader
        helpText={t(`Toolbays are where you store your FarmBot Tools. Each
          Toolbay has Slots that you can put your Tools in, which should be
          reflective of your real FarmBot hardware configuration.`)}

        /** Make [0] index dynamic once we support multiple bays */
        title={tool_bays && tool_bays[0] && tool_bays[0].name || "Name not found"}>
        <button
          className="green button-like"
          onClick={this.saveAll}>
          {t("SAVE")}
        </button>
        <button
          className="gray button-like"
          onClick={toggleEdit}>
          {t("BACK")}
        </button>
      </WidgetHeader>

      {(tool_bays || []).map((tool_bay, index) => {

        return <div key={tool_bay.id}>
          <WidgetBody>
            <Row>
              <Col xs={3}>
                <label>{t("TOOLBAY NAME")}</label>
              </Col>
              <Col xs={9}>
                <BlurableInput
                  value={tool_bay.name}
                  onCommit={this.updateBayName}
                  id={(tool_bay.id || "").toString()}
                />
              </Col>
            </Row>

            <Row>
              <Col xs={1}>
                <label>{t("SLOT")}</label>
              </Col>
              <Col xs={2}>
                <label>{t("X")}</label>
              </Col>
              <Col xs={2}>
                <label>{t("Y")}</label>
              </Col>
              <Col xs={2}>
                <label>{t("Z")}</label>
              </Col>
              <Col xs={4}>
                <label>{t("TOOL")}</label>
              </Col>
            </Row>

            {this.renderSlots(tool_bay.id)}

            <Row>
              <Col xs={1}>
                <label>
                  {tool_slots && tool_slots.length + 1 || 0}
                </label>
              </Col>
              <Col xs={2}>
                <BlurableInput
                  value={(new_slot_x || 0).toString()}
                  type="number"
                  name="new_slot_x"
                  onCommit={this.set}
                />
              </Col>
              <Col xs={2}>
                <BlurableInput
                  value={(new_slot_y || 0).toString()}
                  type="number"
                  name="new_slot_y"
                  onCommit={this.set}
                />
              </Col>
              <Col xs={2}>
                <BlurableInput
                  value={(new_slot_z || 0).toString()}
                  type="number"
                  name="new_slot_z"
                  onCommit={this.set}
                />
              </Col>
              <Col xs={4}>
                <FBSelect
                  allowEmpty={true}
                  onChange={this.updateNewSlotTool}
                  list={newSlotToolOptions} />
              </Col>
              <Col xs={1}>
                <button
                  className="button-like green"
                  onClick={() => this.add(tool_bay.id)}>
                  <i className="fa fa-plus"></i>
                </button>
              </Col>
            </Row>
          </WidgetBody>
        </div>;
      })}
    </Widget>;
  }
};
