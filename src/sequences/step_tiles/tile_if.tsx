import * as React from "react";
import { StepParams } from "./index";
import { Help, FBSelect, DropDownItem } from "../../ui";
import { t } from "i18next";
import { copy, remove } from "./index";
import { changeStepSelect, updateSubSequence } from "../actions";
import { StepTitleBar } from "./step_title_bar";
import { StepInputBox } from "../inputs/step_input_box";
import { If } from "farmbot";

// This will need to go after consulting Rick with plan for testing
interface IfElseDropDownItem extends DropDownItem {
  field?: string;
  type?: string;
}

export function TileIf({ dispatch, step, index, all, current }:
  StepParams) {
  step = step as If;
  let args = step.args;
  let { lhs, op } = args;
  let then_optn: IfElseDropDownItem | undefined;
  let else_optn: IfElseDropDownItem | undefined;

  let LHSOptions: IfElseDropDownItem[] = [
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

  // let thenOptions: IfElseDropDownItem[] = all.map(seq => {
  //   if (args._then && args._then.kind === "execute") {
  //     then_optn = { label: seq.name, value: args._then.args.sequence_id };
  //   }
  //   return {
  //     label: seq.name ? seq.name : "SEQUENCE NAME NOT FOUND",
  //     value: seq.id ? seq.id : "SEQUENCE ID NOT FOUND",
  //     field: "sequence_id",
  //     type: "_then"
  //   };
  // });

  // let elseOptions: IfElseDropDownItem[] = all.map(seq => {
  //   if (args._else && args._else.kind === "execute") {
  //     else_optn = { label: seq.name, value: args._else.args.sequence_id };
  //   };
  //   return {
  //     label: seq.name ? seq.name : "SEQUENCE NAME NOT FOUND",
  //     value: seq.id ? seq.id : "SEQUENCE ID NOT FOUND",
  //     field: "sequence_id",
  //     type: "_else"
  //   };
  // });

  let operatorOptions: IfElseDropDownItem[] = [
    { value: "<", label: "is less than", field: "op" },
    { value: ">", label: "is greater than", field: "op" },
    { value: "is", label: "is equal to", field: "op" },
    { value: "not", label: "is not equal to", field: "op" }
  ];

  let update = (e: IfElseDropDownItem) => {
    let { field, value } = e;
    if (value && field) {
      dispatch(changeStepSelect(value, index, field));
    }
  };

  let updateSubSeq = (e: IfElseDropDownItem) => {
    let { field, value, type } = e;
    if (value && field && type) {
      dispatch(updateSubSequence(value, index, field, type));
    }
  };

  // Let user know one of their sub sequences is recursive
  let isRecursive = (then_optn && then_optn.value === current.id)
    || (else_optn && else_optn.value === current.id);

  return <div>
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
                &nbsp;Recursive sequence.
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <div className="step-content if-step">
            <div className="row">
              <div className="col-xs-12 col-md-12">
                <h4 className="top">IF...</h4>
              </div>
              <div className="col-xs-4 col-md-4">
                <label>{t("Variable")}</label>
                <FBSelect
                  list={LHSOptions}
                  placeholder="LHS..."
                  onChange={update}
                  initialValue={{ label: lhs, value: lhs }}
                />
              </div>
              <div className="col-xs-4 col-md-4">
                <label>{t("Operator")}</label>
                <FBSelect
                  list={operatorOptions}
                  placeholder="Condition..."
                  onChange={update}
                  initialValue={{ label: op, value: op }}
                />
              </div>
              <div className="col-xs-4 col-md-4">
                <label>{t("Value")}</label>
                <StepInputBox dispatch={dispatch}
                  step={step}
                  index={index}
                  field="rhs" />
              </div>
              <div className="col-xs-12 col-md-12">
                <h4>THEN...</h4>
              </div>
              <div className="col-xs-12 col-md-12">
                <label>{t("Execute Sequence")}</label>
                <FBSelect
                  list={[]}
                  placeholder="Sequence..."
                  onChange={updateSubSeq}
                  initialValue={then_optn}
                />
              </div>
              <div className="col-xs-12 col-md-12">
                <h4>ELSE...</h4>
              </div>
              <div className="col-xs-12 col-md-12">
                <label>{t("Execute Sequence")}</label>
                <FBSelect
                  list={[]}
                  placeholder="None (continue to next step)"
                  onChange={updateSubSeq}
                  initialValue={else_optn}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>;
}
