import { generateReducer } from "../redux/generate_reducer";
import {
    ToolsState,
    Tool,
    ToolBay,
    ToolSlot,
    UpdateToolSlotPayl
} from "./interfaces";
import { Sync } from "../interfaces";
import * as _ from "lodash";

let initialState: ToolsState = {
    editorMode: false,
    tool_bays: [],
    tool_slots: [],
    tools: {
        isEditing: false,
        all: []
    }
};

export let toolsReducer = generateReducer<ToolsState>(initialState)
    /** Generic */
    .add<Sync>("FETCH_SYNC_OK", function (s, a) {
        s.tool_bays = a.payload.tool_bays || [];
        s.tool_slots = a.payload.tool_slots || [];
        s.tools.all = a.payload.tools || [];
        return s;
    })
    .add<{}>("EDIT_TOOL_BAYS_START", function (s, a) {
        s.editorMode = true;
        return s;
    })
    .add<{}>("EDIT_TOOL_BAYS_STOP", function (s, a) {
        s.editorMode = false;
        return s;
    })
    .add<{}>("EDIT_TOOLS_START", function (s, a) {
        s.tools.isEditing = true;
        return s;
    })
    .add<{}>("EDIT_TOOLS_STOP", function (s, a) {
        s.tools.isEditing = false;
        return s;
    })
    /** ToolBays */
    .add<{ id: number, value: string }>("UPDATE_TOOL_BAY", function (s, a) {
        let { id, value } = a.payload;
        let bay = _.findWhere(s.tool_bays, { id });
        bay.name = value;
        bay.dirty = true;
        return s;
    })
    .add<ToolBay>("SAVE_TOOL_BAY_OK", function (s, a) {
        let { id, name } = a.payload;
        let bay = _.findWhere(s.tool_bays, { id });
        bay.name = name;
        bay.dirty = false;
        s.editorMode = false;
        return s;
    })
    /** ToolSlots */
    .add<ToolSlot>("ADD_TOOL_SLOT_OK", function (s, a) {
        s.tool_slots.push(a.payload);
        return s;
    })
    .add<ToolSlot>("SAVE_TOOL_SLOTS_OK", function (s, a) {
        let index = _.findIndex(s.tool_slots, { id: a.payload.id });
        s.tool_slots.splice(index, 1, a.payload);
        s.editorMode = false;
        return s;
    })
    .add<{ id: number }>("DESTROY_TOOL_SLOT_OK", function (s, a) {
        let { tool_slots } = s;
        let index = _.findIndex(tool_slots, { id: a.payload.id });
        tool_slots.splice(index, 1);
        return s;
    })
    .add<UpdateToolSlotPayl>("UPDATE_TOOL_SLOT", function (s, a) {
        let { id, name, value } = a.payload;
        let slot = _.findWhere(s.tool_slots, { id });
        let bay = _.findWhere(s.tool_bays, { id: slot.tool_bay_id });
        slot.dirty = true;
        bay.dirty = true;
        /** ??? TODO: Tried changing interfaces but can't seem to please TS */
        (slot as any)[name] = value;
        return s;
    })
    /** Tools */
    .add<{ id: number }>("DESTROY_TOOL_OK", function (s, a) {
        let index = _.findIndex(s.tools.all, { id: a.payload.id });
        s.tools.all.splice(index, 1);
        return s;
    })
    .add<{ id: number, value: string }>("UPDATE_TOOL", function (s, a) {
        let tool = _.findWhere(s.tools.all, { id: a.payload.id });
        tool.name = a.payload.value;
        tool.dirty = true;
        s.tools.dirty = true;
        return s;
    })
    .add<Tool>("ADD_TOOL_OK", function (s, a) {
        let { name, id } = a.payload;
        s.tools.all.push({ name, id });
        return s;
    })
    .add<Tool>("SAVE_TOOL_OK", function (s, a) {
        s.tools.dirty = false;
        s.tools.isEditing = false;
        return s;
    });

