import * as React from "react";
import { RegimenListItem } from "./regimen_list_item";
import { Everything } from "../../interfaces";
import { AddRegimen } from "./add_button";
import { t } from "i18next";
import { connect } from "react-redux";

@connect((state: Everything) => state)
export class RegimensList extends React.Component<Everything, {}> {
  render() {
    return <div className="regimen-list-widget">
      <div className="widget-wrapper">
        <div className="row">
          <div className="col-sm-12">
            <AddRegimen dispatch={this.props.dispatch} />
            <div className="widget-header">
              <h5>Regimens</h5>
              <i className="fa fa-question-circle widget-help-icon">
                <div className="widget-help-text">{t(`This is a list of all of
                your regimens. Click one to begin editing it.`)}
                </div>
              </i>
            </div>
          </div>
        </div>
        <div className="widget-content no-bottom-padding">
          <div className="row">
            <div className="col-sm-12">
              {this
                .props
                .regimens
                .all
                .map((regimen, inx) => <RegimenListItem
                  dispatch={this.props.dispatch}
                  regimen={regimen}
                  index={inx}
                  key={inx} />)
              }
            </div>
          </div>
        </div>
      </div>

      <AddRegimen className="plus-button"
        dispatch={this.props.dispatch}>
        <i className="fa fa-plus"></i>
      </AddRegimen>

    </div>;
  }
}
