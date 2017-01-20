import * as React from "react";
import { IStepInput } from "../step_tiles/index";
import { InputUnknown } from "./input_unknown";
import { InputDefault } from "./input_default";

type StatelessInput = (p: IStepInput) => JSX.Element;
type InputChoiceDict = { [name: string]: (StatelessInput | undefined) };

const CHOICES: InputChoiceDict = {
    speed: InputDefault,
    pin_number: InputDefault,
    pin_value: InputDefault,
    pin_mode: InputDefault,
    operator: InputDefault,
    x: InputDefault,
    y: InputDefault,
    z: InputDefault,
    stub: InputDefault,
    variable: InputDefault,
    label: InputDefault,
    milliseconds: InputDefault,
    message: InputDefault,
    lhs: InputDefault,
    op: InputDefault,
    rhs: InputDefault,
    sequence_id: InputDefault
};

export function StepInputBox({step,
    field,
    dispatch,
    index}: IStepInput) {
    let Comp = CHOICES[field] || InputUnknown;
    return <Comp step={step}
        field={field}
        dispatch={dispatch}
        index={index} />;
};
