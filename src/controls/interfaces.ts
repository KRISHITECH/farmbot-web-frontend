import { BotState, Xyz } from "../devices/interfaces";
import { Vector3 } from "farmbot/dist";

export interface ControlsState {
  isEditingCameraURL: boolean;
}

export interface WebcamSaveBtnProps {
  dispatch: Function;
  webcamUrl: string;
  apiUrl: string;
  updateState: Function;
}

export interface DirectionButtonProps {
  axis: Xyz;
  direction: "up" | "down" | "left" | "right";
  steps: number;
}

export type Vector = Vector3;

export interface AxisInputBoxGroupProps {
  onCommit: (v: Vector) => void;
  bot: BotState;
}

export interface AxisInputBoxGroupState {
  x?: number | undefined;
  y?: number | undefined;
  z?: number | undefined;
}

export interface AxisInputBoxProps {
  axis: Xyz;
  label: string;
  value: number | undefined;
  onChange: (key: string, val: number | undefined) => void;
}

export interface AxisInputBoxState {
  value: string | undefined;
}

export interface StepSizeSelectorProps {
  choices: number[];
  selected: number;
  selector: (num: number) => void;
}

export interface JogMovementControlsProps {
  bot: BotState;
}

export interface ToggleButtonProps {
  /** Function that is executed when the toggle button is clicked */
  toggleAction: () => void;
  toggleval: number | string | undefined;
}


