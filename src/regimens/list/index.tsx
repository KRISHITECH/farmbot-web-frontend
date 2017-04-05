import * as React from "react";
import { RegimenListItem } from "./regimen_list_item";
import { AddRegimen } from "./add_button";
import { Widget, WidgetHeader, WidgetBody, Row, Col } from "../../ui/index";
import { RegimensListProps } from "../interfaces";
import { sortResourcesById } from "../../util";

export class RegimensList extends React.Component<RegimensListProps, {}> {
  rows = () => {
    return <Col xs={12}>
      {sortResourcesById(this.props.regimens)
        .map((regimen, index) => {
          return <RegimenListItem index={index}
            key={index}
            regimen={regimen}
            dispatch={this.props.dispatch} />;
        })}
    </Col>
  }

  render() {
    return <Widget className="regimen-list-widget">
      <WidgetHeader title="Regimens"
        helpText={`This is a list of all of your regimens.
                   Click one to begin editing it.`}>
        <AddRegimen dispatch={this.props.dispatch} />
      </WidgetHeader>
      <WidgetBody>
        <Row>
          {this.rows()}
        </Row>
      </WidgetBody>

      <AddRegimen className="plus-button"
        dispatch={this.props.dispatch}>
        <i className="fa fa-plus"></i>
      </AddRegimen>

    </Widget>;
  }
}
