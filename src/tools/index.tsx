import * as React from "react";
import { Everything } from "../interfaces";
import { ToolsState } from "./interfaces";
import { Col } from "../ui";
import { ToolBayList, ToolBayForm, ToolList, ToolForm } from "./components";
import { connect } from "react-redux";

@connect((state: Everything) => state)
export class Tools extends React.Component<Everything, ToolsState> {
  render() {
    let editing = this.props.tools.editorMode;
    let isEditingTools = this.props.tools.tools.isEditing;
    return <div className="all-content-wrapper tools">
      <Col md={8}>
        {!editing && (
          <ToolBayList
            all={this.props.tools}
            dispatch={this.props.dispatch}
          />
        )}
        {editing && (
          <ToolBayForm
            all={this.props.tools}
            dispatch={this.props.dispatch}
          />
        )}
      </Col>
      <Col md={4}>
        {!isEditingTools && (
          <ToolList
            all={this.props.tools}
            dispatch={this.props.dispatch}
          />
        )}
        {isEditingTools && (
          <ToolForm
            all={this.props.tools}
            dispatch={this.props.dispatch}
          />
        )}
      </Col>
    </div>;
  }
}
