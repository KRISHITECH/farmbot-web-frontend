import { Color } from "../interfaces";
import { SelectOptionsParams } from "../interfaces";
import {
  Sequence as CeleryScriptSequence,
  MoveAbsolute,
  MoveRelative,
  WritePin,
  ReadPin,
  Wait,
  SendMessage,
  If,
  Execute
} from "farmbot";
export type CHANNEL_NAME = "toast" | "ticker";

export const NUMERIC_FIELDS = ["x", "y", "z", "speed", "pin_number",
  "pin_value", "pin_mode", "milliseconds",
  "sequence_id", "rhs", "sequence_id"];

/** CeleryScript nodes allowed within a Sequence node's `body` attr. */
export type SequenceBodyMember = MoveAbsolute
  | MoveRelative
  | WritePin
  | ReadPin
  | Wait
  | SendMessage
  | If
  | Execute;

export interface Sequence extends CeleryScriptSequence {
  color: Color;
  name: string;
  dirty?: boolean;
  id?: number;
}

export type SequenceOptions = {[P in keyof Sequence]?: Sequence[P]; };

export interface SequenceReducerState {
  all: Array<Sequence>;
  current: number;
};

export interface UpdateAbsoluteStepPayl {
  data: {
    label?: string;
    tool_id: number;
    value: string | number;
    options: [
      {
        label: string;
        value: string | number;
        x: number;
        y: number;
        z: number;
      }
    ],
    offsetX?: number;
    offsetY?: number;
    offsetZ?: number;
    x: number;
    y: number;
    z: number;
    speed: number;
  };
  index: number;
}

/** Used when dispatching ADD_CHANNEL / REMOVE_CHANNEL actions. */
export interface ChanParams {
  channel_name: string;
  index: number;
};

// /** Used when dispatching an updated message type. */
export interface MessageParams {
  value: string | number;
  index: number;
};

export interface PickerProps {
  current: Color;
  onChange?: (color: Color) => any;
}

export interface PickerState {
  isOpen: boolean;
}

export interface MoveAbsState {
  options?: SelectOptionsParams[];
  value?: string | number;
  x?: number;
  y?: number;
  z?: number;
  speed?: number;
}
