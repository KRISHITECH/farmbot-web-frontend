import { Color } from "../interfaces";
import { SelectOptionsParams } from "../interfaces";
import { AuthState } from "../auth/interfaces";
import {
  Sequence as CeleryScriptSequence,
  SequenceBodyItem,
  MoveAbsolute,
  Vector3
} from "farmbot";
import { Tool } from "../tools/interfaces";
import { DropDownItem } from "../ui/index";

export type CHANNEL_NAME = "toast" | "ticker";

export const NUMERIC_FIELDS = ["x", "y", "z", "speed", "pin_number",
  "pin_value", "pin_mode", "milliseconds",
  "sequence_id", "rhs", "sequence_id"];

/** CeleryScript nodes allowed within a Sequence node's `body` attr. */
export type SequenceBodyMember = SequenceBodyItem;

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

export interface SequencesListProps {
  sequences: SequenceReducerState;
  dispatch: Function;
  auth: AuthState;
}

export interface NamedVector3 extends Vector3 {
  name: string;
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
  isToolSelected: boolean;
}

export interface ChangeMoveAbsSelect {
  index: number;
  tool: DropDownItem;
  step: MoveAbsolute;
}

export interface ChangeMoveAbsInput {
  kind: string;
  index: number;
  value: string;
}
