import { Log } from "../interfaces";
import { API } from "../api";
import * as axios from "axios";
import { Sequence } from "../sequences/interfaces";
import { Tool, ToolBay, ToolSlot } from "../tools/interfaces";
import { Regimen } from "../regimens/interfaces";
import { Peripheral } from "../controls/peripherals/interfaces";
import { FarmEvent, Plant, Point } from "../farm_designer/interfaces";
import { Image } from "../images/interfaces";
import { DeviceAccountSettings } from "../devices/interfaces";
import { ResourceName } from "../resources/tagged_resources";
import { error } from "../ui/index";
import { warning } from "../ui/logger";

export interface ResourceReadyPayl {
  name: ResourceName;
  data: object[];
}

export function fetchDeprecatedSyncData(dispatch: Function) {
  let fail = () => warning("Please try refreshing the page.",
    "Error downloading data");
  let fetch = <T>(name: ResourceName, url: string) => axios
    .get<T>(url)
    .then((r): T => dispatch({
      type: "RESOURCE_READY", payload: { name, data: r.data }
    }), fail);
  fetch<DeviceAccountSettings>("device", API.current.devicePath)
  fetch<FarmEvent[]>("farm_events", API.current.farmEventsPath);
  fetch<Image[]>("images", API.current.imagesPath);
  fetch<Log[]>("logs", API.current.logsPath);
  fetch<Peripheral[]>("peripherals", API.current.peripheralsPath);
  fetch<Plant[]>("plants", API.current.plantsPath);
  fetch<Point[]>("points", API.current.pointsPath);
  fetch<Regimen[]>("regimens", API.current.regimensPath);
  fetch<Sequence[]>("sequences", API.current.sequencesPath);
  fetch<ToolBay[]>("tool_bays", API.current.toolBaysPath);
  fetch<Tool[]>("tools", API.current.toolsPath);
  fetch<ToolSlot[]>("tool_slots", API.current.toolSlotsPath);
  axios
    .get<DeviceAccountSettings>(API.current.devicePath)
    .then((resp) => dispatch({ type: "FETCH_DEVICE_OK", payload: resp.data }));
}

export function fetchDeprecatedSyncDataOk(payload: {}) {
  return {
    type: "FETCH_SYNC_OK", payload
  };
}

export function fetchDeprecatedSyncDataNo(err: Error) {
  return {
    type: "FETCH_SYNC_NO",
    payload: {}
  };
}
