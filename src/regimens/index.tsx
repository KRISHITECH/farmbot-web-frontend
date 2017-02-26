import * as React from "react";
import { BulkSchedulerWidget } from "./bulk_scheduler/index";
import { RegimensList } from "./list/index";
import { RegimenEditorWidget } from "./editor/index";
import { connect } from "react-redux";
import { Everything } from "../interfaces";
import { isMobile } from "../util";
import { MobileRegimensNav } from "./mobile_nav";
import { RegimenPropsWithParams } from "./interfaces";

@connect((state: Everything) => state)
export class Regimens extends React.Component<RegimenPropsWithParams, {}> {
  render() {
    let { bulkScheduler } = this.props;

    return <div className="all-content-wrapper">
      <div className="row">
        <div className="col-md-4 col-sm-12">
          <BulkSchedulerWidget editor={bulkScheduler}
            sequences={this.props.sequences.all}
            dispatch={this.props.dispatch} />
        </div>
        <div className="col-md-4 col-sm-12">
          <RegimenEditorWidget { ...this.props } />
        </div>
        {isMobile() && (
          <MobileRegimensNav { ...this.props} />
        )}
        <div className="col-md-4 col-sm-12">
          <RegimensList { ...this.props } />
        </div>
      </div>
    </div>;
  }
}
