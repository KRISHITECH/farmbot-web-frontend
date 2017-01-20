import * as React from "react";
import { StepParams } from "./index";
import { StepTitleBar } from "./step_title_bar";
import { copy, remove } from "./index";
import { Help } from "../../ui";
import { t } from "i18next";
import { StepInputBox } from "../inputs/step_input_box";

export function TileReadPin({dispatch, step, index}: StepParams) {
    return (<div>
        <div className="step-wrapper">
            <div className="row">
                <div className="col-sm-12">
                    <div className="step-header read-pin-step">
                        <StepTitleBar index={index}
                            dispatch={dispatch}
                            step={step} />
                        <i className="fa fa-arrows-v step-control" />
                        <i className="fa fa-clone step-control"
                            onClick={() => copy({ dispatch, step })} />
                        <i className="fa fa-trash step-control"
                            onClick={() => remove({ dispatch, index })} />
                        <Help text={(`The Read Pin step instructs FarmBot to
                      read the current value of the specified pin.
                      A Pin Mode of 0 is for on/off control, while
                      a Pin Mode of 1 is for PWM (pulse width modulation).`)} />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-12">
                    <div className="step-content read-pin-step">
                        <div className="row">
                            <div className="col-xs-6 col-md-3">
                                <label>{t("Pin Number")}</label>
                                <StepInputBox dispatch={dispatch}
                                    step={step}
                                    index={index}
                                    field="pin_number" />
                            </div>
                            <div className="col-xs-6 col-md-3">
                                <label>{t("Data Label")}</label>
                                <StepInputBox dispatch={dispatch}
                                    step={step}
                                    index={index}
                                    field="label" />
                            </div>
                            <div className="col-xs-6 col-md-3">
                                <label>{t("Pin Mode")}</label>
                                <StepInputBox dispatch={dispatch}
                                    step={step}
                                    index={index}
                                    field="pin_mode" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>);
};
