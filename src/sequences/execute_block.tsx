import * as React from "react";
import { copy, remove, StepParams } from "./step_tiles/index";
import { CeleryNode as Step } from "./corpus";
import { Sequence } from "./interfaces";
import { changeStep } from "./actions";
import { t } from "i18next";
import * as _ from "lodash";
import { Select } from "../ui";

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

    // TODO: Take care of this any
    function change(e: any) {
        let val = e.value;
        let sub_sequence_id = parseInt(val.toString(), 10);
        let update = { args: { sub_sequence_id } };
        let newStep = Object.assign({}, step, update);

        dispatch(changeStep(index, newStep));
    };

    let ssid: number;

    if (step.kind === "execute") {
        ssid = step.args.sub_sequence_id;
    }
    if (step.kind === "_if" && step.args._then.kind === "execute") {
        ssid = step.args._then.args.sub_sequence_id;
    } else {
        // TODO: CHRIS- this is a stub. Let's talk about it.
        ssid = -999;
    };

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
