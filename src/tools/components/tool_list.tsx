import * as React from "react";
import { ListAndFormProps } from "../interfaces";
import { Col, Widget, WidgetBody, WidgetHeader } from "../../ui";
import { startEditingTools } from "../actions";
import { t } from "i18next";

export class ToolList extends React.Component<ListAndFormProps, {}> {
    render() {
        let onClick = () => { this.props.dispatch(startEditingTools()); };
        return <Col>
            <Widget>
                <WidgetHeader
                    helpText={t(`This is a list of all your FarmBot Tools.
                      Click the Edit button to add, edit, or delete tools.`)}
                    title="TOOLS">
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
                                <th>TOOL NAME</th>
                                <th>STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.all.tools.all.map((tool, index) => {
                                let { name } = tool;
                                index++;
                                return <tr key={index}>
                                    <td>{name}</td>
                                    <td>INACTIVE</td>
                                </tr>;
                            })}
                        </tbody>
                    </table>
                </WidgetBody>
            </Widget>
        </Col>;
    }
};
