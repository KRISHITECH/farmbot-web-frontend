import * as React from "react";
import { StepTitleBar } from "./step_title_bar";
import { Help } from "../../ui";
import { splice, remove } from "./index";
import { t } from "i18next";
import { StepInputBox } from "../inputs/step_input_box";
import { StepParams } from "../interfaces";


export function TileMoveRelative({ dispatch, currentStep, index, currentSequence }: StepParams) {
  return (<div>
    <div className="step-wrapper">
      <div className="row">
        <div className="col-sm-12">
          <div className="step-header move-relative-step">
            <StepTitleBar index={index}
              dispatch={dispatch}
              step={currentStep} />
            <i className="fa fa-arrows-v step-control" />
            <i className="fa fa-clone step-control"
              onClick={() => dispatch(splice({
                step: currentStep,
                index,
                sequence: currentSequence
              }))} />
            <i className="fa fa-trash step-control"
              onClick={() => remove({ dispatch, index, sequence: currentSequence })} />
            <Help text={(`The Move Relative step instructs FarmBot \
                        to move the specified distance from its current \
                        location. For example, if FarmBot is currently at \
                        X=1000, Y=1000 and it receives a Move Relative where \
                        X=0 and Y=3000, then FarmBot will move to X=1000, \
                        Y=4000. If FarmBot must move in multiple directions, \
                        it will move diagonally. If you require straight \
                        movements along one axis at a time, use  multiple \
                        Move Relative steps. Move Relative steps should be \
                        preceded by a Move Absolute step to ensure you are \
                        starting from a known location.`)} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <div className="step-content move-relative-step">
            <div className="row">
              <div className="col-xs-6 col-md-3">
                <label>{t("X (mm)")}</label>
                <StepInputBox dispatch={dispatch}
                  step={currentStep}
                  sequence={currentSequence}
                  index={index}
                  field="x" />
              </div>
              <div className="col-xs-6 col-md-3">
                <label>{t("Y (mm)")}</label>
                <StepInputBox dispatch={dispatch}
                  step={currentStep}
                  sequence={currentSequence}
                  index={index}
                  field="y" />
              </div>
              <div className="col-xs-6 col-md-3">
                <label>{t("Z (mm)")}</label>
                <StepInputBox dispatch={dispatch}
                  step={currentStep}
                  sequence={currentSequence}
                  index={index}
                  field="z" />
              </div>
              <div className="col-xs-6 col-md-3">
                <label>{t("Speed")}</label>
                <StepInputBox dispatch={dispatch}
                  step={currentStep}
                  sequence={currentSequence}
                  index={index}
                  field="speed" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>);
}
