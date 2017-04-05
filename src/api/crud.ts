import {
  TaggedResource,
  ResourceName,
  isTaggedResource,
} from "../resources/tagged_resources";
import { GetState, ReduxAction } from "../redux/interfaces";
import { API } from "./index";
import * as Axios from "axios";
import {
  createOK,
  createNO,
  updateOK,
  updateNO,
  destroyOK,
  destroyNO
} from "../resources/actions";
import { UnsafeError } from "../interfaces";
import { findByUuid } from "../resources/reducer";
import { generateUuid } from "../resources/util";
import { defensiveClone } from "../util";
import { EditResourceParams } from "./interfaces";

export function edit(tr: TaggedResource, update: Partial<typeof tr.body>):
  ReduxAction<EditResourceParams> {
  return {
    type: "EDIT_RESOURCE",
    payload: { uuid: tr.uuid, update: update }
  };
}

/** Rather than update (patch) a TaggedResource, this method will overwrite
 * everything within the `.body` property. */
export function overwrite(tr: TaggedResource, update: typeof tr.body):
  ReduxAction<EditResourceParams> {
  return {
    type: "OVERWRITE_RESOURCE",
    payload: { uuid: tr.uuid, update: update }
  };
}

/** Initialize (but don't save) an indexed / tagged resource. */
export function init(resource: TaggedResource): ReduxAction<TaggedResource> {
  resource.body.id = 0;
  resource.dirty = true;
  /** Technically, this happens in the reducer, but I like to be extra safe. */
  resource.uuid = generateUuid(resource.body.id, resource.kind);
  return { type: "INIT_RESOURCE", payload: resource }
}

export function initSave(resource: TaggedResource) {
  return function (dispatch: Function, getState: GetState) {
    let action = init(resource);
    if (resource.body.id === 0) { delete resource.body.id; }
    dispatch(action);
    let nextState = getState().resources.index;
    let tr = findByUuid(nextState, action.payload.uuid);
    return dispatch(save(tr.uuid));
  }
}

export function save(uuid: string) {
  return function (dispatch: Function, getState: GetState) {
    let resource = findByUuid(getState().resources.index, uuid);
    dispatch({ type: "SAVE_RESOURCE_START", payload: resource });
    return dispatch(((resource.body.id) ? update : create)(uuid));
  }
}

function create(uuid: string) {
  return function (dispatch: Function, getState: GetState) {
    let resource = findByUuid(getState().resources.index, uuid);
    return Axios
      .post<typeof resource.body>(urlFor(resource.kind), resource.body)
      .then(function (resp) {
        let r1 = defensiveClone(resource);
        let r2 = { body: defensiveClone(resp.data) };
        let newTR = _.merge({}, r1, r2);
        if (isTaggedResource(newTR)) {
          dispatch(createOK(newTR));
        } else {
          throw new Error("Just saved a malformed TR.");
        }
      })
      .catch(function (err: UnsafeError) {
        dispatch(createNO(err));
        return Promise.reject(err);
      });
  }
}

function update(uuid: string) {
  return function (dispatch: Function, getState: GetState) {
    let resource = findByUuid(getState().resources.index, uuid);
    let { body, kind } = resource;
    return Axios
      .patch<typeof resource.body>(urlFor(kind) + body.id, body)
      .then(function (resp) {
        let r1 = defensiveClone(resource);
        let r2 = { body: defensiveClone(resp.data) };
        let newTR = _.merge({}, r1, r2);
        if (isTaggedResource(newTR)) {
          dispatch(updateOK(newTR));
        } else {
          throw new Error("Just saved a malformed TR.");
        }
      })
      .catch(function (err: UnsafeError) {
        dispatch(updateNO(err));
        return Promise.reject(err);
      });
  }
}

export function destroy(uuid: string) {
  return function (dispatch: Function, getState: GetState) {
    let resource = findByUuid(getState().resources.index, uuid);
    if (resource.body.id) {
      return Axios
        .delete<typeof resource.body>(urlFor(resource.kind) + resource.body.id)
        .then(function (resp) {
          dispatch(destroyOK(resource));
        })
        .catch(function (err: UnsafeError) {
          dispatch(destroyNO(err));
          return Promise.reject(err);
        });
    } else {
      dispatch(destroyOK(resource))
      return Promise.resolve("");
    }
  }
}

export function saveAll(input: TaggedResource[],
  callback: () => void = _.noop,
  errBack: (err: UnsafeError) => void = _.noop) {
  return function (dispatch: Function, getState: GetState) {
    /** Perf issues maybe? RC - Mar 2017 */
    let p = input.filter(x => x.dirty).map(tts => dispatch(save(tts.uuid)));
    Promise.all(p).then(callback, errBack);
  }
}

export function urlFor(tag: ResourceName) {
  const OPTIONS: Partial<Record<ResourceName, string>> = {
    sequences: API.current.sequencesPath,
    tools: API.current.toolsPath,
    tool_slots: API.current.toolSlotsPath,
    plants: API.current.plantsPath,
    farm_events: API.current.farmEventsPath,
    regimens: API.current.regimensPath,
    peripherals: API.current.peripheralsPath,
    points: API.current.pointsPath,
    tool_bays: API.current.toolBaysPath,
    users: API.current.usersPath,
    device: API.current.devicePath,
    images: API.current.imagesPath,
    logs: API.current.logsPath
  }
  let url = OPTIONS[tag];
  if (url) {
    return url;
  } else {
    throw new Error(`No resource/URL handler for ${tag} yet.
    Consider adding one to crud.ts`);
  }
}
