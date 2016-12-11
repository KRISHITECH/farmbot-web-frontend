import {
  BotStateTree,
  Configuration,
  configKey
} from "farmbot/dist/interfaces";

/** How the device is stored in the API side.
 * This is what comes back from the API as JSON.
 */
export interface DeviceAccountSettings {
  id: number;
  name: string;
  webcam_url?: string;
  /** Must the deivce be saved? */
  dirty?: boolean;
};

/**
 * Rpc Log message from the bot.
 */
export interface RpcBotLog {
  /** The message to be displayed from the bot. */
  message: string;
  /** Unix timestamp of when the log was created. */
  created_at: number;
  /** Array of channels where this message is supposed to show up. */
  channels: RpcBotLogChannel[];
  /** Meta data about the message. */
  meta: Meta;
}

/** Meta information about a log message. */
interface Meta {
  type: RpcBotLogType;
  /** Bot Position X */
  x: number | undefined;
  /** Bot Position Y */
  y: number | undefined;
  /** Bot Position Z */
  z: number | undefined;
}

/** The different channels on which a notification can be sent. */
type RpcBotLogChannel = "toast";

/** Different types of messages. */
type RpcBotLogType = "success"
  | "busy"
  | "warn"
  | "error"
  | "info"
  | "fun"

/** Typescript does not have partial types yet.
 *  When it does, we can pull this out*/
export interface DeviceAccountSettingsUpdate {
  id?: number;
  name?: string;
  uuid?: string;
  webcam_url?: string;
  dirty?: boolean;
};

export interface BotState {
  account: DeviceAccountSettings;
  /** Maximum number of messages to cache. Excess is truncated. */
  logQueueSize: number;
  logQueue: RpcBotLog[];
  status: string;
  /** How many steps to move when the user presses a manual movement arrow */
  stepSize: number;
  /** The current os version on the github release api */
  currentOSVersion?: string;
  /** The current fw version on the github release api */
  currentFWVersion?: string;
  /** Is the bot in sync with the api */
  dirty: boolean;
  /** Holds coordinates that the user is currently editing, but has not sent */
  axisBuffer: {
    // x?: string;
    // y?: string;
    // z?: string;
    [name: string]: string | undefined;
  };
  /** Holds settings that the user is currently editing, but has not sent */
  settingsBuffer: {
    movement_max_spd_x?: string;
    movement_max_spd_y?: string;
    movement_max_spd_z?: string;
    movement_steps_acc_dec_x?: string;
    movement_steps_acc_dec_y?: string;
    movement_steps_acc_dec_z?: string;
    movement_timeout_x?: string;
    movement_timeout_y?: string;
    movement_timeout_z?: string;
    [name: string]: string | undefined;
  };
  configBuffer: Configuration;
  hardware: HardwareState;
}

/** Status registers for the bot's status */
export type HardwareState = BotStateTree;

export interface MqttMessage {
  error?: string | undefined;
  id?: string | undefined;
  result: HardwareState;
}

export interface GithubRelease {
  tag_name: string;
}

export interface ChangeSettingsBuffer {
  key: configKey;
  val: number;
}
