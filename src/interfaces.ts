import { AuthState, User } from "./auth/interfaces";
import { ConfigState } from "./config/interfaces";
import { BotState, DeviceAccountSettings } from "./devices/interfaces";
import { BulkSchedulerState } from "./regimens/bulk_scheduler/interfaces";
import {
    RegimensState,
    RegimenApiResponse,
    RegimenItem
} from "./regimens/interfaces";
import { SequenceReducerState, Sequence } from "./sequences/interfaces";
import { DesignerState, Plant } from "./farm_designer/interfaces";
import { Color as FarmBotJsColor } from "farmbot/dist/interfaces";
import { DragableState } from "./draggable/interfaces";
import { PeripheralState, Peripheral } from "./controls/peripherals/interfaces";
import { ToolsState, ToolBay, Tool, ToolSlot } from "./tools/interfaces";

/** Regimens and sequences may have a "color" which determines how it looks
    in the UI. Only certain colors are valid. */
export type Color = FarmBotJsColor;

export interface SelectOptionsParams {
    label: string;
    value: string | number;
    field?: string;
}

export interface Log {
    id: number;
    message: string;
    meta: {
        type: string;
    };
    channels: string;
    device_id: number;
    created_at: string;
    updated_at: string;
}

interface Location {
    /** EX: /app/designer */
    pathname: string;
    /** EX: ?id=twowing-silverbell&p1=SpeciesInfo */
    search: string;
    hash: string;
    // /** ¯\_(ツ)_/¯ */
    // state: void;
    /** EX: "PUSH" */
    action: string;
    /** EX:  jhedoi */
    key: string;
    /** URL ?Query=string, converted to JS object. */
    query: { [name: string]: string };
};

export interface Everything {
    config: ConfigState;
    auth: AuthState | undefined;
    designer: DesignerState;
    dispatch: Function;
    bot: BotState;
    sequences: SequenceReducerState;
    regimens: RegimensState;
    bulkScheduler: BulkSchedulerState;
    location: Location;
    draggable: DragableState;
    peripherals: PeripheralState;
    tools: ToolsState;
    sync: Sync;
};

/** A sync object, as returned by a GET request to `/api/sync` */
export interface Sync {
    /** Git commit hash of the revision that the server is running. */
    api_version: string;
    /** A number that, when incremented, alerts the bot that
     * its software is out of date */
    compat_num: number;
    device: DeviceAccountSettings;
    users: User[];
    sequences: Sequence[];
    regimens: RegimenApiResponse[];
    peripherals: Peripheral[];
    regimen_items: RegimenItem[];
    plants: Plant[];
    tool_bays: ToolBay[];
    tool_slots: ToolSlot[];
    tools: Tool[];
    logs: Log[];
}
