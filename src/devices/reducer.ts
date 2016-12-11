import { error } from "../ui";
import * as _ from "lodash";
import {
    BotState,
    DeviceAccountSettings,
    HardwareState
} from "./interfaces";
import { generateReducer } from "../redux/generate_reducer";
import { ReduxAction } from "../redux/interfaces";
import * as i18next from "i18next";
import { ChangeSettingsBuffer } from "./interfaces";
import { Sequence } from "../sequences/interfaces";
import { Regimen } from "../regimens/interfaces";
import { Configuration } from "farmbot/dist/interfaces";
import { Sync } from "../interfaces";

let status = {
    NOT_READY: (): string => { return i18next.t("never connected to device"); },
    CONNECTING: (): string => { return i18next.t("initiating connection"); },
    AWAITING_API: (): string => {
        return i18next.t("downloading device credentials");
    },
    API_ERROR: (): string => {
        return i18next.t("Unable to download device credentials");
    },
    AWAITING_WEBSOCKET: (): string => {
        return i18next.t("calling FarmBot with credentials");
    },
    WEBSOCKET_ERR: (): string => {
        return i18next.t("Error establishing socket connection");
    },
    CONNECTED: (): string => {
        return i18next.t("Socket Connection Established");
    },
    READY: (): string => { return i18next.t("Bot ready"); }
};

let initialState: BotState = {
    account: { id: 0, name: "" },
    logQueueSize: 20,
    logQueue: [],
    status: status.NOT_READY(),
    stepSize: 1000,
    hardware: {
        mcu_params: {},
        location: [-1, -1, -1],
        pins: {},
        configuration: {},
        informational_settings: {},
        farm_scheduler: {
            process_info: [],
            sequence_log: [],
            current_sequence: null,
        }
    },
    axisBuffer: {},
    settingsBuffer: {},
    configBuffer: {},
    dirty: false,
    currentOSVersion: undefined,
    currentFWVersion: undefined,
};

export let botReducer = generateReducer<BotState>(initialState)
    .add<HardwareState>("SETTING_TOGGLE_OK",
    function (state: BotState, action: ReduxAction<HardwareState>) {

        let hardware = action.payload;
        return Object.assign({},
            state, {
                hardware: hardware
            }, {
                status: status.READY()
            });
    })
    .add<{}>("CLEAR_BOT_LOG", function (state, action) {
        state.logQueue = [];
        return state;
    })
    .add<{}>("COMMIT_SETTINGS_OK", function (state, action) {
        let nextState = Object.assign({}, state, {
            settingsBuffer: {}
        });
        return nextState;
    })
    .add<Sequence>("SAVE_SEQUENCE_OK", function (state, action) {
        state.dirty = false;
        return state;
    })
    .add<Sequence>("DELETE_SEQUENCE_OK", function (state, action) {
        state.dirty = false;
        return state;
    })
    .add<Regimen>("SAVE_REGIMEN_OK", function (state, action) {
        state.dirty = false;
        return state;
    })
    .add<Regimen>("DELETE_REGIMEN_OK", function (state, action) {
        state.dirty = false;
        return state;
    })
    .add<{}>("BOT_SYNC_OK", function (state, action) {
        state.dirty = false;
        return state;
    })
    .add<{}>("COMMIT_AXIS_CHANGE_OK", function (oldState, action) {
        let hardware = Object.assign({}, oldState.hardware, action.payload);
        let state = Object.assign<{}, BotState>({}, oldState);

        return Object.assign({}, state, {
            axisBuffer: {},
            hardware
        });
    })
    .add<{ key: "x" | "y" | "z", val: string }>("CHANGE_AXIS_BUFFER",
    function (state, action) {
        state.axisBuffer[action.payload.key] = action.payload.val;
        return Object.assign({}, state, {
            axisBuffer: state.axisBuffer
        });
    })
    .add<Configuration>("CHANGE_CONFIG_BUFFER", function (state, action) {
        let old_buffer = state.configBuffer;
        let new_buffer = action.payload;
        Object.assign(old_buffer, new_buffer);
        let new_state = Object.assign({}, state, { config_buffer: new_buffer });
        return new_state; // I am doing something wrong.
    })
    .add<ChangeSettingsBuffer>("CHANGE_SETTINGS_BUFFER",
    function (state, action) {
        let newVal = action.payload.val;
        if (newVal) {
            state.settingsBuffer[action.payload.key] = action.payload.val.toString();
        } else {
            delete state.settingsBuffer[action.payload.key];
        }
        return Object.assign({}, state, {
            settingsBuffer: state.settingsBuffer
        });
    })
    .add<number>("CHANGE_STEP_SIZE", function (state, action) {
        return Object.assign({}, state, {
            stepSize: action.payload
        });
    })
    .add<HardwareState>("BOT_CHANGE",
    function (state, action) {
        state.hardware = action.payload;
        return state;
    })
    .add<DeviceAccountSettings>("CHANGE_DEVICE", function (s, a) {
        Object.assign(s.account, a.payload, { dirty: true });
        return s;
    })
    .add<any>("FETCH_DEVICE", function (state, action) {
        return state;
    })
    .add<any>("FETCH_DEVICE_OK", function (state, { payload }) {
        return Object.assign({},
            state,
            payload, {
                status: status.AWAITING_WEBSOCKET
            });
    })
    .add<any>("FETCH_DEVICE_ERR", function (state, action) {
        // TODO: Toast messages do not belong in a reducer.
        return Object.assign({},
            state, {
                status: status.API_ERROR
            });
    })
    .add<any>("SAVE_DEVICE_ERR", function (state, action) {
        switch (action.payload.status) {
            case 422:
                let errors = _.map(action.payload.responseJSON, v => v)
                    .join(". ");
                error(errors, i18next.t("Couldn\'t save device."));
                break;
            default:
                error(i18next.t("Error while saving device."));
                break;
        }
        return state;
    })
    .add<any>("SAVE_DEVICE_OK", function (state, action) {
        return Object.assign({}, state, action.payload, {
            dirty: false
        });
    })
    .add<DeviceAccountSettings>("REPLACE_DEVICE_ACCOUNT_INFO", function (s, a) {
        s.account = a.payload;
        return s;
    })
    .add<Sync>("FETCH_SYNC_OK", function (s, a) {
        s.account = a.payload.device;
        return s;
    })
    .add<string>("CHANGE_WEBCAM_URL", function (s, a) {
        s.account.dirty = true;
        s.account.webcam_url = a.payload;
        return s;
    })
    .add<string>("FETCH_OS_UPDATE_INFO_OK", function (s, a) {
        s.currentOSVersion = a.payload;
        return s;
    })
    .add<string>("FETCH_FW_UPDATE_INFO_OK", function (s, a) {
        s.currentFWVersion = a.payload;
        return s;
    });
