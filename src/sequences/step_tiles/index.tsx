import * as React from "react";
import { changeStep, removeStep, pushStep } from "../actions";
import { assign } from "lodash";
import { Step, NUMERIC_FIELDS } from "../interfaces";
import { Help } from "../../ui";
import { ExecuteBlock } from "../execute_block";
import { Sequence } from "../interfaces";
import { defensiveClone } from "../../util";
import { t } from "i18next";
import { TileIfStatment } from "./tile_if_statement";
import { TileWait } from "./tile_wait";
import { TileMoveAbsolute } from "./tile_move_absolute";
import { TileMoveRelative } from "./tile_move_relative";
import { TileReadPin } from "./tile_read_pin";
import { TileSendMessage } from "./tile_send_message";
import { TileWritePin } from "./tile_write_pin";
import * as _ from "lodash";

interface CopyParams {
  dispatch: Function;
  step: Step;
}

export function copy({dispatch, step}: CopyParams) {
  let copy = assign<{}, Step>({}, step);
  dispatch(pushStep(copy));
};

interface RemoveParams {
  index: number;
  dispatch: Function;
}

export function remove({dispatch, index}: RemoveParams) {
  dispatch(removeStep(index));
}

interface UpdateStepParams {
  dispatch: Function;
  step: Step;
  index: number;
  field: string;
}

export function updateStep({ dispatch,
  step,
  index,
  field }: UpdateStepParams) {
  return (e: React.FormEvent<HTMLInputElement>) => {
    let copy = defensiveClone<Step>(step);
    let val = e.currentTarget.value;

    if (NUMERIC_FIELDS.indexOf(field) !== -1) {
      if (val == "-") { // Fix negative number issues.
        _.assign(copy.args, { [field]: "-" });
      } else {
        _.assign(copy.args, { [field]: parseInt(val, 10) });
      }
    } else {
      _.assign(copy.args, { [field]: val });
    };

    dispatch(changeStep(index, copy));
  };
};

export interface IStepInput {
  step: Step;
  field: "speed"
  | "pin_number"
  | "pin_value"
  | "pin_mode"
  | "operator"
  | "x"
  | "y"
  | "z"
  | "stub" // For unimplemented features.
  | "variable"
  | "data_label"
  | "milliseconds"
  | "message"
  | "lhs"
  | "op"
  | "rhs"
  | "sub_sequence_id";
  dispatch: Function;
  index: number;
  onChange?: any;
}

export interface StepParams {
  dispatch: Function;
  step: Step;
  index: number;
  sequence: Sequence;
  sequences: Sequence[];
}

export type StepTile = (input: StepParams) => JSX.Element;

interface StepDictionary {
  [stepName: string]: StepTile;
};

let Pending = ({ dispatch, index }: StepParams) => {
  return <div>
    <Help text="Not done yet :(" />
    Coming soon!
              Delete: <i className="fa fa-trash step-control"
      onClick={() => remove({ dispatch, index })} />
  </div>;
};

export let stepTiles: any = {
  emergency_stop: Pending,
  home_all: Pending,
  home_x: Pending,
  home_y: Pending,
  home_z: Pending,
  read_status: Pending,
  write_parameter: Pending,
  read_parameter: Pending,
  execute: ExecuteBlock,
  if_statement: TileIfStatment,
  move_relative: TileMoveRelative,
  move_absolute: TileMoveAbsolute,
  write_pin: TileWritePin,
  wait: TileWait,
  send_message: TileSendMessage,
  read_pin: TileReadPin,
};
