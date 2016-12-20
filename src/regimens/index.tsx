import * as React from "react";
import { BulkSchedulerWidget } from "./bulk_scheduler/index";
import { RegimensList } from "./list/index";
import { RegimenEditorWidget } from "./editor/index";
import { connect } from "react-redux";
import { Everything } from "../interfaces";

// TODO: Why is @connect broke? SEE: compile errors.
class XRegimens extends React.Component<Everything, {}> {
    render() {
        let { bulkScheduler } = this.props;
        return (
            <div>
                <div className="all-content-wrapper">
                    <div className="row">
                        <div className={`col-md-3 col-sm-12 col-md-offset-1`}>
                            <BulkSchedulerWidget editor={bulkScheduler}
                                sequences={this.props.sequences.all}
                                dispatch={this.props.dispatch} />
                        </div>
                        <div className="col-md-4 col-sm-12">
                            <RegimenEditorWidget { ...this.props } />
                        </div>
                        <div className="col-md-3 col-sm-12">
                            <RegimensList { ...this.props } />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export let Regimens = connect((state: Everything) => state)(XRegimens);
