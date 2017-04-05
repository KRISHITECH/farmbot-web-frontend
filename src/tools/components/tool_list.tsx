import * as React from "react";
import { Row, Col, Widget, WidgetBody, WidgetHeader } from "../../ui";
import { t } from "i18next";
import { ToolListProps } from "../interfaces";
import { TaggedTool } from "../../resources/tagged_resources";

export class ToolList extends React.Component<ToolListProps, {}> {
  render() {
    let toggle = () => this.props.toggle();
    let { tools } = this.props;
    return <Widget>
      <WidgetHeader
        helpText={t(`This is a list of all your FarmBot Tools.
          Click the Edit button to add, edit, or delete tools.`)}
        title="Tools">
        <button
          className="gray button-like"
          onClick={toggle}>
          {t("Edit")}
        </button>
      </WidgetHeader>
      <WidgetBody>
        <Row>
          <Col xs={8}>
            <label>{t("Tool Name")}</label>
          </Col>
          <Col xs={4}>
            <label>{t("Status")}</label>
          </Col>
        </Row>
        {tools.map((tool: TaggedTool) => {
          return <Row key={tool.body.id}>
            <Col xs={8}>{tool.body.name || "Name not found"}</Col>
            <Col xs={4}>{this.props.isActive(tool) ? "active" : "inactive"}</Col>
          </Row>;
        })}
      </WidgetBody>
    </Widget>;
  }
};
