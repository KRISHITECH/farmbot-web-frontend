import * as React from "react";
import { updateStep } from "../step_tiles/index";
import * as _ from "lodash";
import { StepInputProps } from "../interfaces";

export function InputDefault({
  step,
  field,
  dispatch,
  sequence,
  index
}: StepInputProps) {
  let raw = (step.args as any)[field];
  let notUndefied = (_.isString(raw) || _.isNumber(raw));
  let val = notUndefied ? raw : "";

  return <input type="text"
    value={val}
    onChange={updateStep({ dispatch, step, field, index, sequence })} />;
}
