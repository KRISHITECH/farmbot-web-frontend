import * as React from "react";
import { copy, remove, StepParams } from "./step_tiles/index";
import { SequenceBodyItem as Step, Execute } from "farmbot";
import { Sequence } from "./interfaces";
import { changeStep } from "./actions";
import { t } from "i18next";
import * as _ from "lodash";
import { Select } from "../ui";
import { Option } from "react-select";

/** Removes un-executable sequences, such as "self" or unsaved ones */
function filterSequenceList(sequences: Sequence[], sequence: Sequence) {
    let isSaved = (s: Sequence) => !!s.id;
    let notRecursive = (me: Sequence, you: Sequence) => me !== you;
    return sequences
        .filter(function (seq) {
            // Can't function recurseCant use unsaved sequences.
            return isSaved(seq) && notRecursive(sequence, seq);
        });
}

interface SequenceSelectBoxParams {
    dispatch: Function;
    step: Step;
    sequence: Sequence;
    sequences: Sequence[];
    index: number;
}

function SequenceSelectBox({dispatch,
    step,
    sequence,
    sequences,
    index}: SequenceSelectBoxParams) {

    let eligibleSequences: Sequence[] = filterSequenceList(sequences, sequence);

    let finalOptions: {}[] = [];

    eligibleSequences.map((seq: Sequence) => {
        if (seq.id) {
            finalOptions.push({
                label: seq.name,
                value: seq.id.toString()
            });
        } else {
            throw new Error("Sequence must have ID.");
        }
    });

    function change(e: Option) {
        let val = e.value;
        if (val) {
            let sequence_id = parseInt(val.toString(), 10);
            let update = { args: { sequence_id } };
            let newStep = Object.assign({}, step, update);
            dispatch(changeStep(index, newStep));
        } else {
            throw new Error("Tried to set a non-existant sequence_id");
        }
    };

    let ssid = (step as Execute).args.sequence_id;

    let subSeq = _.find(eligibleSequences, (s) => s.id === ssid) || {
        id: ""
    };

    return <Select onChange={change}
        value={(subSeq.id || "").toString()}
        options={finalOptions}
        placeholder="Pick a sequence (or save a new one)">
    </Select>;
}

export function ExecuteBlock({dispatch, step, index, sequence, sequences}:
    StepParams) {
    return (<div>
        <div className="step-wrapper">
            <div className="row">
                <div className="col-sm-12">
                    <div className="step-header execute-step">
                        <input className="step-label" placeholder="Execute" />
                        <i className="fa fa-arrows-v step-control" />
                        <i className="fa fa-clone step-control"
                            onClick={() => copy({ dispatch, step })} />
                        <i className="fa fa-trash step-control"
                            onClick={() => remove({ dispatch, index })} />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-12">
                    <div className="step-content execute-step">
                        <div className="row">
                            <div className="col-xs-12">
                                <label>{t("Sequence")}</label>
                                <SequenceSelectBox dispatch={dispatch}
                                    step={step}
                                    sequence={sequence}
                                    sequences={sequences}
                                    index={index} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>);
}
