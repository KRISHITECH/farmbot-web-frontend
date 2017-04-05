import * as React from "react";
import { IfParams, LHSOptions, operatorOptions, Operator } from "./index";
import { t } from "i18next";
import { StepInputBox } from "../../inputs/step_input_box";
import { NewFBSelect } from "../../../ui/new_fb_select";
import { DropDownItem } from "../../../ui/fb_select";
import { updateStep } from "../index";
import { defensiveClone } from "../../../util";
import { overwrite } from "../../../api/crud";
import { Col } from "../../../ui/index";

export function If_(props: IfParams) {
  let {
    dispatch,
    currentStep,
    index
  } = props;
  let step = props.currentStep;
  let sequence = props.currentSequence;
  let { op, lhs } = currentStep.args;
  function updateField(field: "lhs" | "op") {
    return (e: DropDownItem) => {
      console.log("TEST123");
      let stepCopy = defensiveClone(step);
      let seqCopy = defensiveClone(sequence).body;
      let val = e.value;
      seqCopy.body = seqCopy.body || [];
      if (_.isString(val)) { stepCopy.args[field] = val; }
      seqCopy.body[index] = stepCopy;
      dispatch(overwrite(sequence, seqCopy));
    };
  }

  return <div>
    <Col xs={12}>
      <h4 className="top">IF...</h4>
    </Col>
    <Col xs={4}>
      <label>{t("Variable")}</label>
      <NewFBSelect
        list={LHSOptions}
        placeholder="Left hand side"
        onChange={updateField("lhs")}
        selectedItem={{ label: lhs, value: lhs }}
      />
    </Col>
    <Col xs={4}>
      <label>{t("Operator")}</label>
      <NewFBSelect
        list={operatorOptions}
        placeholder="Operation"
        onChange={updateField("op")}
        selectedItem={{ label: op, value: op }} />
    </Col>
    <Col xs={4}>
      <label>{t("Right hand side")}</label>
      <StepInputBox dispatch={dispatch}
        step={currentStep}
        sequence={sequence}
        index={index}
        field="rhs" />
    </Col>
  </div>;
}
