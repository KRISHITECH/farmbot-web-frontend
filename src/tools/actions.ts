import * as axios from "axios";
import { t } from "i18next";
import { Thunk, ReduxAction } from "../redux/interfaces";
import { API } from "../api";
import {
    ToolBay,
    ToolSlot,
    Tool,
    ErrorPayl
} from "./interfaces";
import { success, error } from "../ui";
import * as _ from "lodash";
import { prettyPrintApiErrors, AxiosErrorResponse } from "../util";

/** Generic */
export function startEditingToolBays(): ReduxAction<{}> {
    return { type: "EDIT_TOOL_BAYS_START", payload: {} };
}

export function stopEditingToolBays(): ReduxAction<{}> {
    return { type: "EDIT_TOOL_BAYS_STOP", payload: {} };
}

export function startEditingTools(): ReduxAction<{}> {
    return { type: "EDIT_TOOLS_START", payload: {} };
}

export function stopEditingTools(): ReduxAction<{}> {
    return { type: "EDIT_TOOLS_STOP", payload: {} };
}

/** ToolBays */
export function saveToolBayNo(toolBays: AxiosErrorResponse): ErrorPayl {
    return { type: "SAVE_TOOL_BAY_NO", payload: error };
}

export function saveToolBayOk(toolBay: ToolBay): ReduxAction<{}> {
    return { type: "SAVE_TOOL_BAY_OK", payload: toolBay };
}

export function updateToolBay(id: number, value: string): ReduxAction<{}> {
    return { type: "UPDATE_TOOL_BAY", payload: { id, value } };
}

export function saveToolBay(id: number, toolBays: ToolBay[]): Thunk {
    let bay = _.findWhere(toolBays, { id });
    return (dispatch, getState) => {
        axios
            .patch<ToolBay>(API.current.toolBaysPath + id, bay)
            .then(resp => {
                dispatch(saveToolBayOk(resp.data));
            }, (e: Error) => {
                dispatch(saveToolBayNo(e));
                error(t(`ToolBay could not be updated: ${e.message}`));
            });
    };
}

/** ToolSlots */
export function updateToolSlot(id: number, name: string, value: number):
    ReduxAction<{}> {
    return { type: "UPDATE_TOOL_SLOT", payload: { id, name, value } };
}

export function addToolSlotOk(toolSlot: ToolSlot): ReduxAction<{}> {
    return { type: "ADD_TOOL_SLOT_OK", payload: toolSlot };
}

export function addToolSlotNo(error: AxiosErrorResponse): ErrorPayl {
    return { type: "ADD_TOOL_SLOT_NO", payload: error };
}

export function saveToolSlotOk(toolSlot: ToolSlot): ReduxAction<{}> {
    return { type: "SAVE_TOOL_SLOTS_OK", payload: toolSlot };
}

export function updateToolSlotOk(toolSlot: ToolSlot): ReduxAction<{}> {
    return { type: "UPDATE_TOOL_SLOT_OK", payload: toolSlot };
}

export function updateToolSlotNo(error: AxiosErrorResponse): ErrorPayl {
    return { type: "UPDATE_TOOL_SLOT_NO", payload: error };
}

export function destroyToolSlotOk(id: number): ReduxAction<{}> {
    return { type: "DESTROY_TOOL_SLOT_OK", payload: { id } };
}

export function destroyToolSlotNo(error: AxiosErrorResponse): ErrorPayl {
    return { type: "DESTROY_TOOL_SLOT_NO", payload: error };
}

export function addToolSlot(slot: ToolSlot, tool_bay_id: number): Thunk {
    let { x, y, z, tool_id } = slot;
    let data = { x, y, z, tool_id, tool_bay_id };
    return (dispatch, getState) => {
        axios
            .post<ToolSlot>(API.current.toolSlotsPath, data)
            .then(resp => {
                dispatch(addToolSlotOk(resp.data));
            }, (e: Error) => {
                dispatch(addToolSlotNo(e));
                error(prettyPrintApiErrors(e));
            });
    };
}

export function saveToolSlots(toolSlots: ToolSlot[]): Thunk {
    return (dispatch, getState) => {
        let dirtSlots = {
            tool_slots: toolSlots.filter(allSlots => !!allSlots.dirty)
        };
        let url = API.current.toolSlotsPath;
        axios.post<ToolSlot[]>(url, dirtSlots)
            .then(resp => {
                success(t("ToolBay saved."));
                dispatch(saveToolSlotOk(resp.data));
            }, (e: Error) => {
                error(prettyPrintApiErrors(e));
            });
    };
}

export function destroySlot(id: number): Thunk {
    return (dispatch, getState) => {
        axios
            .delete<ToolSlot>(API.current.toolSlotsPath + id)
            .then(resp => {
                dispatch(destroyToolSlotOk(id));
            }, (e: Error) => {
                dispatch(destroyToolSlotNo(e));
                error(prettyPrintApiErrors(e));
            });
    };
}

/** Tools */
export function updateTool(id: number, value: string): ReduxAction<{}> {
    return { type: "UPDATE_TOOL", payload: { id, value } };
}

export function saveToolsOk(tools: Tool[]): ReduxAction<{}> {
    return { type: "SAVE_TOOLS_OK", payload: tools };
}

export function saveToolNo(error: AxiosErrorResponse): ErrorPayl {
    return { type: "SAVE_TOOL_NO", payload: error };
}

export function addToolOk(tool: Tool): ReduxAction<{}> {
    return { type: "ADD_TOOL_OK", payload: tool };
}

export function addToolNo(error: AxiosErrorResponse): ErrorPayl {
    return { type: "ADD_TOOL_NO", payload: error };
}

export function destroyToolOk(id: number): ReduxAction<{}> {
    return { type: "DESTROY_TOOL_OK", payload: { id } };
}

export function destroyToolNo(error: AxiosErrorResponse): ErrorPayl {
    return { type: "DESTROY_TOOL_NO", payload: error };
}

export function saveTools(tools: Tool[]): Thunk {

    return (dispatch, getState) => {
        function finish() {
            success(t("Tools saved."));
            dispatch(stopEditingTools());
        }
        let dirtyTools = tools.filter(allTools => !!allTools.dirty);
        // Return early if API call not required.
        if (!dirtyTools.length) { return finish(); }
        axios.post<Tool[]>(API.current.toolsPath, { tools: dirtyTools })
            .then(resp => {
                finish();
                dispatch(saveToolsOk(resp.data));
            }, (e: Error) => {
                dispatch(saveToolNo(e));
                error(prettyPrintApiErrors(e));
            });
    };
}

export function destroyTool(id: number): Thunk {
    return (dispatch, getState) => {
        axios
            .delete<Tool>(API.current.toolsPath + id)
            .then(resp => {
                dispatch(destroyToolOk(id));
            }, (e: Error) => {
                dispatch(destroyToolNo(e));
                error(prettyPrintApiErrors(e));
            });
    };
}

export function addTool(name: string): Thunk {
    return (dispatch, getState) => {
        axios
            .post<Tool>(API.current.toolsPath, { name })
            .then(resp => {
                dispatch(addToolOk(resp.data));
            }, (e: Error) => {
                dispatch(addToolNo(e));
                error(prettyPrintApiErrors(e));
            });
    };
}
