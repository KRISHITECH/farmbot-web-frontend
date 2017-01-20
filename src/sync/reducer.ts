import { generateReducer } from "../redux/generate_reducer";
import { Sync } from "../interfaces";
import { Log } from "../interfaces";

const initialState: Sync = {
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
    logs: [],
    images: []
};

export let syncReducer = generateReducer<Sync>(initialState)
    .add<Log>("BOT_LOG", function (state, { payload }) {
        state.logs.unshift(payload);
        state.logs = _.take(_.uniq(state.logs, JSON.stringify), 50);
        return state;
    })
    .add<Sync>("FETCH_SYNC_OK", function (s, a) {
        s = a.payload;
        return s;
    });
