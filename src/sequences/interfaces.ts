import {
  userVariables as FarmBotJsuserVariables
} from "farmbot/dist/interfaces";
// import { BasicNode } from "../ast/interfaces";
import { Color } from "../interfaces";

/** TODO: Move this into FarmBotjs or celery
 *  script NPM pacakge. */
export interface BasicNode {
  kind: string;
  args: {};
  body?: BasicNode[] | undefined;
  comment?: string;
};

export const NUMERIC_FIELDS = ["x", "y", "z", "speed", "pin_number",
  "pin_value", "pin_mode", "milliseconds",
  "sub_sequence_id", "rhs", "sub_sequence_id"];
type userVariables = FarmBotJsuserVariables;

export interface Sequence extends SequenceNode {
  color: Color;
  name: string;
  dirty?: boolean;
  id?: number;
  body: Step[];
}

type Steps = Step[];

// Typescript does not have subset types.
// If you are reading this in the future and subset types exist, 
// refactor this code.
export interface SequenceOptions {
  color?: Color;
  name?: string;
  body?: Step[];
  dirty?: boolean;
}

export type possibleKind = "move_absolute"
  | "move_relative"
  | "write_pin"
  | "read_pin"
  | "wait"
  | "send_message"
  | "execute"
  | "if_statement"
  | "sub_sequence_id";

export interface SequenceReducerState {
  all: Array<Sequence>;
  current: number;
};

interface MoveAbsoluteNode extends BasicNode {
  kind: "move_absolute";
  args: {
    x: number;
    y: number;
    z: number;
    speed: number;
  };
}

interface MoveRelativeNode extends BasicNode {
  kind: "move_relative";
  args: {
    x: number;
    y: number;
    z: number;
    speed: number;
  };
}

interface WritePinNode extends BasicNode {
  kind: "write_pin";
  args: {
    pin_number: number;
    pin_value: number;
    pin_mode: number;
  };
}

interface ReadPinNode extends BasicNode {
  kind: "read_pin";
  args: {
    pin_number: number;
    data_label: string;
  };
}

interface WaitNode extends BasicNode {
  kind: "wait";
  args: {
    milliseconds: number;
  };
}

export interface SendMessageNode extends BasicNode {
  kind: "send_message";
  args: {
    message: string;
    message_type: string;
  };
  body?: ChannelNode[] | undefined;
}

interface ExecuteNode extends BasicNode {
  kind: "execute";
  args: {
    sub_sequence_id: number;
  };
}

interface IfStatementNode extends BasicNode {
  kind: "if_statement";
  args: {
    lhs: userVariables | number
    op: ">" | "<" | "is" | "not";
    rhs: number;
    sub_sequence_id: number;
  };
}

export type Step = MoveAbsoluteNode
  | MoveRelativeNode
  | WritePinNode
  | ReadPinNode
  | WaitNode
  | SendMessageNode
  | ExecuteNode
  | IfStatementNode
  | ChannelNode;

export interface ChannelNode extends BasicNode {
  kind: "channel";
  args: {
    channel_name: string;
  };
}

export interface SequenceNode extends BasicNode {
  kind: "sequence";
  args: {};
  body: Step[] | undefined;
};

/** Used when dispatching ADD_CHANNEL / REMOVE_CHANNEL actions. */
export interface ChanParams {
  channel_name: string;
  index: number;
};

/** Used when dispatching an updated message type. */
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
