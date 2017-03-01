import * as Axios from "axios";
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
export function toggleEditingToolBays(): ReduxAction<{}> {
  return { type: "TOGGLE_EDIT_TOOL_BAYS", payload: {} };
}

export function toggleEditingTools(): ReduxAction<{}> {
  return { type: "TOGGLE_EDIT_TOOLS", payload: {} };
}

/** ToolBays */
export function updateToolBayName(id: number, value: number): ReduxAction<{}> {
  return { type: "UPDATE_TOOL_BAY_NAME", payload: { id, value } };
}

export function saveToolBayOk(toolBay: ToolBay): ReduxAction<{}> {
  return { type: "SAVE_TOOL_BAY_OK", payload: toolBay };
}

export function saveToolBay(id: number, toolBays: ToolBay[]): Thunk {

  return (dispatch, getState) => {
    let dirtSlots = {
      tool_slots: getState().tools.tool_slots.filter(allSlots => !!allSlots.dirty)
    };
    let url = API.current.toolSlotsPath;
    Axios.post<ToolSlot[]>(url, dirtSlots)
      .then(resp => {
        if (resp instanceof Error) {
          error(prettyPrintApiErrors(resp));
          throw resp;
        }
        success(t("ToolBay saved."));
        updateToolBayAfterSlots();
        dispatch(saveToolSlotOk(resp.data));
      }, (e: Error) => {
        error(prettyPrintApiErrors(e));
      });

    function updateToolBayAfterSlots() {
      let bay = _.findWhere(toolBays, { id });
      return Axios
        .patch<ToolBay>(API.current.toolBaysPath + id, bay)
        .then(resp => {
          dispatch(saveToolBayOk(resp.data));
        }, (e: Error) => {
          error(prettyPrintApiErrors(e));
        });
    };
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

export function saveToolSlotOk(toolSlot: ToolSlot): ReduxAction<{}> {
  return { type: "SAVE_TOOL_SLOTS_OK", payload: toolSlot };
}

export function updateToolSlotOk(toolSlot: ToolSlot): ReduxAction<{}> {
  return { type: "UPDATE_TOOL_SLOT_OK", payload: toolSlot };
}

export function destroyToolSlotOk(id: number): ReduxAction<{}> {
  return { type: "DESTROY_TOOL_SLOT_OK", payload: { id } };
}

export function addToolSlot(slot: ToolSlot): Thunk {

  return (dispatch, getState) => {
    Axios
      .post<ToolSlot>(API.current.toolSlotsPath, slot)
      .then(resp => {
        if (resp instanceof Error) {
          error(prettyPrintApiErrors(resp));
          throw resp;
        }
        dispatch(addToolSlotOk(resp.data));
      }, (e: Error) => {
        error(prettyPrintApiErrors(e));
      });
  };
}

export function destroySlot(id: number): Thunk {
  return (dispatch, getState) => {
    Axios
      .delete<ToolSlot>(API.current.toolSlotsPath + id)
      .then(resp => {
        dispatch(destroyToolSlotOk(id));
      }, (e: Error) => {
        error(prettyPrintApiErrors(e));
      });
  };
}

/** Tools */
export function addToolOk(tool: Tool): ReduxAction<{}> {
  return { type: "ADD_TOOL_OK", payload: tool };
}

export function destroyToolOk(id: number): ReduxAction<{}> {
  return { type: "DESTROY_TOOL_OK", payload: id };
}

export function saveToolsOk(tools: Tool[]): ReduxAction<{}> {
  return { type: "SAVE_TOOLS_OK", payload: tools };
}

export function updateTool(id: number, value: string): ReduxAction<{}> {
  return { type: "UPDATE_TOOL", payload: { id, value } };
}

export function saveTools(tools: Tool[]): Thunk {
  return (dispatch, getState) => {

    function finish() {
      success(t("Tools saved."));
      dispatch(toggleEditingTools());
    }

    let dirtyTools = tools.filter(allTools => !!allTools.dirty);
    // Return early if API call not required.
    if (!dirtyTools.length) { return finish(); }

    Axios.post<Tool[]>(API.current.toolsPath, { tools: dirtyTools })
      .then(resp => {
        finish();
        dispatch(saveToolsOk(resp.data));
      }, (e: Error) => {
        error(prettyPrintApiErrors(e));
      });
  };
}

export function destroyTool(id: number): Thunk {
  return (dispatch, getState) => {
    Axios
      .delete<Tool>(API.current.toolsPath + id)
      .then(resp => {
        error("Tool has been deleted.", "Deleted");
        dispatch(destroyToolOk(id));
      }, (e: Error) => {
        error(prettyPrintApiErrors(e));
      });
  };
}

export function addTool(name: string): Thunk {
  return (dispatch, getState) => {
    Axios
      .post<Tool>(API.current.toolsPath, { name })
      .then(resp => {
        success("Tool has been saved.", "Success");
        dispatch(addToolOk(resp.data));
      })
      .catch((e: Error) => {
        error(prettyPrintApiErrors(e));
      });
  };
}

