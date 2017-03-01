import * as React from "react";
import { ListAndFormProps, ToolFormState } from "../interfaces";
import { t } from "i18next";
import { Widget, WidgetBody, WidgetHeader, BlurableInput } from "../../ui";
import {
  toggleEditingTools,
  addTool,
  destroyTool,
  updateTool,
  saveTools
} from "../actions";

export class ToolForm extends React.Component<ListAndFormProps,
  Partial<ToolFormState>> {
  constructor() {
    super();
    this.state = {};
  }

  setNewToolName = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ newToolName: e.currentTarget.value });
  }

  update = (e: React.FormEvent<HTMLInputElement>) => {
    let { id, value } = e.currentTarget;
    this.props.dispatch(updateTool(parseInt(id), value));
  }

  destroy = (tool_id: number | undefined) => {
    if (tool_id) {
      this.props.dispatch(destroyTool(tool_id));
    } else {
      throw new Error("Tool ID could not be found.");
    }
  }

  add = (e: React.FormEvent<HTMLButtonElement>) => {
    this.props.dispatch(addTool(this.state.newToolName || ""));
    this.setState({ newToolName: "" });
  }

  toggleEdit = () => {
    this.props.dispatch(toggleEditingTools());
  }

  render() {
    return <Widget>
      <WidgetHeader
        helpText={t(`This is a list of all your FarmBot Tools.
          Click the Edit button to add, edit, or delete tools.`)}
        title="TOOLS">
        <button
          className="green button-like"
          onClick={() =>
            this.props.dispatch(saveTools(this.props.all.tools.all))
          }>
          {t("SAVE")}
          {this.props.all.tools.dirty && ("*")}
        </button>
        <button
          className="gray button-like"
          onClick={this.toggleEdit}>
          {t("BACK")}
        </button>
      </WidgetHeader>
      <WidgetBody>
        <table>
          <thead>
            <tr>
              <th>{t("TOOL NAME")}</th>
            </tr>
          </thead>
          <tbody>
            {(this.props.all.tools.all || []).map((tool, index) => {
              let isDeleted = tool.isDeleted || false;
              return <tr key={index} className={"is-deleted-" + isDeleted}>
                <td>
                  <BlurableInput
                    id={(tool.id || "Error getting ID").toString()}
                    value={tool.name || "Error getting Name"}
                    onCommit={this.update}
                  />
                </td>
                <td>
                  <button
                    className="button-like red"
                    onClick={() => this.destroy(tool.id)}>
                    <i className="fa fa-times"></i>
                  </button>
                </td>
              </tr>;
            })}
            <tr>
              <td>
                <BlurableInput
                  value={this.state.newToolName || ""}
                  onCommit={this.setNewToolName}
                  type="text"
                />
              </td>
              <td>
                <button
                  className="button-like green"
                  onClick={this.add}>
                  <i className="fa fa-plus"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </WidgetBody>
    </Widget>;
  }
};
