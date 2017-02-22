import * as React from "react";
import { SequencesList } from "./sequences_list";
import { StepButtonCluster } from "./step_button_cluster";
import { SequenceEditorMiddle } from "./sequence_editor_middle";
import { MobileSequencesNav } from "./mobile_nav";
import { connect } from "react-redux";
import { Everything } from "../interfaces";
import { isMobile } from "../util";

@connect((state: Everything) => state)
export class Sequences extends React.Component<any, Everything> {
  render() {
    return (
      <div className="all-content-wrapper">
        <div className="col-md-3 col-sm-4">
          <StepButtonCluster { ...this.props } />
        </div>
        <div className="col-md-6 col-sm-8">
          <SequenceEditorMiddle { ...this.props } />
        </div>
        {isMobile() && (
          <MobileSequencesNav { ...this.props} />
        )}
        <div className="col-md-3 col-sm-12">
          <SequencesList { ...this.props } />
        </div>
      </div>
    );
  }
};
