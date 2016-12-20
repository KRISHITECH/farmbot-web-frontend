import * as React from "react";
import { StepParams } from "./index";
import { Help, Select } from "../../ui";
import { t } from "i18next";
import { copy, remove } from "./index";
import { changeStepSelect } from "../actions";
import { StepTitleBar } from "./step_title_bar";
import { StepInputBox } from "../inputs/step_input_box";
import { SelectOptionsParams } from "../../interfaces";

export function TileIfStatment({dispatch, step, index, sequences, sequence}:
    StepParams) {

    /** TODO: Hack?, is this node not getting the SendMessage interface? 
    * says step.args.* does not exist. */
    let args = step.args as any;
    let { lhs, op, sub_sequence_id } = args;

    let LHSOptions: SelectOptionsParams[] = [
        { value: "busy", label: "Busy Status (0, 1)", field: "lhs" },
        { value: "pin0", label: "Pin 0", field: "lhs" },
        { value: "pin1", label: "Pin 1", field: "lhs" },
        { value: "pin2", label: "Pin 2", field: "lhs" },
        { value: "pin3", label: "Pin 3", field: "lhs" },
        { value: "pin4", label: "Pin 4", field: "lhs" },
        { value: "pin5", label: "Pin 5", field: "lhs" },
        { value: "pin6", label: "Pin 6", field: "lhs" },
        { value: "pin7", label: "Pin 7", field: "lhs" },
        { value: "pin8", label: "Pin 8", field: "lhs" },
        { value: "pin9", label: "Pin 9", field: "lhs" },
        { value: "pin10", label: "Pin 10", field: "lhs" },
        { value: "pin11", label: "Pin 11", field: "lhs" },
        { value: "pin12", label: "Pin 12", field: "lhs" },
        { value: "pin13", label: "Pin 13", field: "lhs" },
        { value: "x", label: "X position", field: "lhs" },
        { value: "y", label: "Y Position", field: "lhs" },
        { value: "z", label: "Z position", field: "lhs" }
    ];

    let sequenceOptions: SelectOptionsParams[] = sequences.map(seq => {
        return {
            label: seq.name ? seq.name : "SEQUENCE NAME NOT FOUND",
            value: seq.id ? seq.id : "SEQUENCE ID NOT FOUND",
            field: "sub_sequence_id"
        };
    });

    let OperatorOptions: SelectOptionsParams[] = [
        { value: "<", label: "is less than", field: "op" },
        { value: ">", label: "is greater than", field: "op" },
        { value: "is", label: "is equal to", field: "op" },
        { value: "not", label: "is not equal to", field: "op" }
    ];

    // TODO: Anys coming from react-select events
    let update = (e: any) => {
        let { field, value } = e;
        dispatch(changeStepSelect(value, index, field));
    };

    let isRecursive = args.sub_sequence_id == sequence.id;
    return (<div>
        <div className="step-wrapper">
            <div className="row">
                <div className="col-sm-12">
                    <div className="step-header if-step">
                        <StepTitleBar index={index}
                            dispatch={dispatch}
                            step={step} />
                        <i className="fa fa-arrows-v step-control" />
                        <i className="fa fa-clone step-control"
                            onClick={() => copy({ dispatch, step })} />
                        <i className="fa fa-trash step-control"
                            onClick={() => remove({ dispatch, index })} />
                        <Help text={(`Detailed documentation coming soon`)} />
                        {isRecursive && (
                            <span>
                                <i className="fa fa-exclamation-triangle"></i>
                                &nbsp;Sub sequence is recursive.
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-12">
                    <div className="step-content if-step">
                        <div className="row">
                            <div className="col-xs-6 col-md-3">
                                <label>{t("LHS")}</label>
                                <Select
                                    options={LHSOptions}
                                    placeholder="LHS..."
                                    onChange={update}
                                    value={lhs}
                                    />
                            </div>
                            <div className="col-xs-6 col-md-3">
                                <label>{t("OPERATOR")}</label>
                                <Select
                                    options={OperatorOptions}
                                    placeholder="Condition..."
                                    onChange={update}
                                    value={op}
                                    />
                            </div>
                            <div className="col-xs-6 col-md-3">
                                <label>{t("RHS")}</label>
                                <StepInputBox dispatch={dispatch}
                                    step={step}
                                    index={index}
                                    field="rhs" />
                            </div>
                            <div className="col-xs-6 col-md-3">
                                <label>{t("Sub Sequence")}</label>
                                <Select
                                    options={sequenceOptions}
                                    placeholder="Sequence..."
                                    onChange={update}
                                    value={sub_sequence_id}
                                    />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>);
}
