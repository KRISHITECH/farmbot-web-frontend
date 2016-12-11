import * as React from "react";
import { Everything } from "./interfaces";
import { ConfigState } from "./config/interfaces";
import { BotState } from "./devices/interfaces";
import { PeripheralState } from "./controls/peripherals/interfaces";
import { ToolsState } from "./tools/interfaces";
import { Log } from "./interfaces";

export class Wrapper extends React.Component<any, any> {
    render() {
        return <div> {this.props.children} </div>;
    }
}

/** Factory function for empty state object. */
export function fakeState(dispatcher?: Function): Everything {
    let query = {} as { [name: string]: string };
    let sequences = {
        all: [],
        current: 0
    };
    let location = {
        pathname: "/testsuite",
        search: "?foo=bar",
        hash: "??????",
        action: "PUSH",
        key: "jhedoi",
        query
    };

    let auth = undefined;

    let designer = {
        x_size: 200,
        y_size: 200,
        plants: [],
        cropSearchQuery: "?foo=bar",
        cropSearchResults: []
    };
    let bot: BotState = {
        account: {
            id: 1,
            name: "wow"
        },
        /** Maximum number of messages to cache. Excess is truncated. */
        logQueueSize: 0,
        logQueue: [],
        status: "???",
        dirty: false,
        /** How many steps to move when the user presses a manual movement arrow */
        stepSize: 100,
        /** Holds coordinates that the user is currently editing, but hasn't sent */
        axisBuffer: {
            x: "",
            y: "",
            z: "",
        },
        /** Holds settings that the user is currently editing, but has not sent */
        settingsBuffer: {
            movement_max_spd_x: "",
            movement_max_spd_y: "",
            movement_max_spd_z: "",
            movement_steps_acc_dec_x: "",
            movement_steps_acc_dec_y: "",
            movement_steps_acc_dec_z: "",
            movement_timeout_x: "",
            movement_timeout_y: "",
            movement_timeout_z: "",
        },
        configBuffer: {
            os_auto_update: false,
            fw_auto_update: true
        },
        hardware: {
            mcu_params: {},
            informational_settings: {},
            configuration: {},
            location: [-1, -1, -1],
            pins: {},
            farm_scheduler: {
                current_sequence: null,
                process_info: [],
                sequence_log: []
            }
        },
    };

    let regimens = {
        current: 0,
        all: []
    };

    let bulkScheduler = {
        currentRegimen: 0,
        form: {
            dailyOffsetMs: 1,
            weeks: []
        }
    };
    let dispatch = dispatcher || function (p: any) { };
    let config: ConfigState = {
        host: "localhost",
        port: "5555"
    };

    let peripherals: PeripheralState = {
        editorMode: "controlling",
        all: []
    };

    let sync = {
        api_version: "",
        compat_num: 0,
        device: {
            id: 0,
            name: "",
            webcam_url: "",
            dirty: false
        },
        users: [],
        sequences: [],
        regimens: [],
        peripherals: [],
        regimen_items: [],
        tool_bays: [],
        tool_slots: [],
        tools: [],
        plants: [],
        logs: []
    };

    let draggable = { dataTransfer: {} };

    let tools: ToolsState = {
        editorMode: false,
        tool_bays: [
            {
                name: "toolbay 1",
                id: 1234,
            }
        ],
        tool_slots: [
            {
                id: 333,
                tool_bay_id: 1234,
                created_at: "SOME UTC STRING",
                tool_id: 1,
                x: 10,
                y: 20,
                z: 30
            },
        ],
        tools: {
            isEditing: false,
            all: [{
                id: 1,
                name: "tool1"
            }]
        }
    };

    return {
        location
        , auth
        , designer
        , dispatch
        , bot
        , sequences
        , regimens
        , bulkScheduler
        , config
        , draggable
        , peripherals
        , sync
        , tools
    };
}
