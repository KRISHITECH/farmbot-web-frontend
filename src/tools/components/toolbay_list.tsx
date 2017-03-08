import * as React from "react";
import { ListAndFormProps } from "../interfaces";
import { Col, Widget, WidgetBody, WidgetHeader } from "../../ui";
import { toggleEditingToolBays } from "../actions";
import * as _ from "lodash";
import { t } from "i18next";

export class ToolBayList extends React.Component<ListAndFormProps, {}> {
  renderTool(tool_id: number | undefined) {
    let { tools } = this.props.all;
    return tools.all.map((tool, index) => {
      if (tool_id === tool.id) {
        return <td key={index}>
          {tool.name}
        </td>;
      }
    });
  }

  renderSlots(tool_bay_id: number) {
    let { tool_slots, tools } = this.props.all;
    let currentSlots = _.where(tool_slots, { tool_bay_id });
    return _.sortBy((currentSlots || []), "id").map((slot, index) => {
      let { x, y, z, tool_id } = slot;
      return <tr key={index}>
        <td>{index + 1}</td>
        <td>{x}</td>
        <td>{y}</td>
        <td>{z}</td>
        {tools.all.length > 0 && (this.renderTool(tool_id))}
        {tools.all.length === 0 && (<td>---</td>)}
      </tr>;
    });
  }

  render() {
    let onClick = () => { this.props.dispatch(toggleEditingToolBays()); };
    let { tool_bays } = this.props.all;
    return <Col>
      {tool_bays.map((bay, index) => {
        let { id, name } = bay;
        return <Widget key={index}>
          <WidgetHeader
            helpText={t(`Toolbays are where you store your FarmBot
                          Tools. Each Toolbay has Slots that you can put your
                          Tools in, which should be reflective of your real
                          FarmBot hardware configuration.`)}
            title={name}>
            <button
              className="gray button-like"
              onClick={onClick}>
              {t("EDIT")}
            </button>
          </WidgetHeader>
          <WidgetBody>
            <table>
              <thead>
                <tr>
                  <th>{t("SLOT")}</th>
                  <th>{t("X")}</th>
                  <th>{t("Y")}</th>
                  <th>{t("Z")}</th>
                  <th>{t("TOOL")}</th>
                </tr>
              </thead>
              <tbody>
                {this.renderSlots(id)}
              </tbody>
            </table>
          </WidgetBody>
        </Widget>;
      })}
    </Col>;
  }
};
