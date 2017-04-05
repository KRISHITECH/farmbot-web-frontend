import { generateReducer } from "../redux/generate_reducer";
import { RestResources, ResourceIndex } from "./interfaces";
import {
  TaggedResource,
  ResourceName,
  sanityCheck,
  isTaggedResource
} from "./tagged_resources";
import { generateUuid } from "./util";
import { EditResourceParams } from "../api/interfaces";
import {
  initialState as sequenceState,
  sequenceReducer as sequences,
} from "../sequences/reducer";
import {
  initialState as regimenState,
  regimensReducer as regimens
} from "../regimens/reducer";
import { combineReducers } from "redux";
import { ReduxAction } from "../redux/interfaces";
import {
  designer as farm_designer,
  initialState as designerState
} from "../farm_designer/reducer";
import { ResourceReadyPayl } from "../sync/actions";

let consumerReducer = combineReducers({
  regimens,
  sequences,
  farm_designer
});

function emptyState(): RestResources {
  return {
    consumers: {
      sequences: sequenceState,
      regimens: regimenState,
      farm_designer: designerState
    },
    loaded: [],
    index: {
      all: [],
      byKind: {
        device: [],
        farm_events: [],
        images: [],
        logs: [],
        peripherals: [],
        plants: [],
        points: [],
        regimens: [],
        sequences: [],
        tool_bays: [],
        tool_slots: [],
        tools: [],
        users: []
      },
      byKindAndId: {},
      references: {}
    }
  };
}

let initialState: RestResources = emptyState();
let afterEach = (state: RestResources, a: ReduxAction<any>) => {
  state.consumers = consumerReducer({
    sequences: state.consumers.sequences,
    regimens: state.consumers.regimens,
    farm_designer: state.consumers.farm_designer
  }, a) as any;
  return state;
};

/** Responsible for all RESTful resources. */
export let resourceReducer = generateReducer
  <RestResources>(initialState, afterEach)
  .add<TaggedResource>("SAVE_RESOURCE_OK", function (state, action) {
    let resource = action.payload;
    resource.dirty = false;
    if (resource
      && resource.body) {
      switch (resource.kind) {
        case "device":
        case "farm_events":
        case "logs":
        case "peripherals":
        case "plants":
        case "regimens":
        case "sequences":
        case "tool_slots":
        case "tools":
          reindexResource(state.index, resource);
          state.index.references[resource.uuid] = resource;
          break;
        default:
          whoops("SAVE_RESOURCE_OK", action.payload.kind);
      }
    } else {
      throw new Error("Somehow, a resource was created without an ID?");
    }
    return state;
  })
  .add<TaggedResource>("DESTROY_RESOURCE_OK", function (state, action) {
    let resource = action.payload;
    switch (resource.kind) {
      case "device":
      case "farm_events":
      case "logs":
      case "peripherals":
      case "plants":
      case "regimens":
      case "sequences":
      case "tool_bays":
      case "tool_slots":
      case "tools":
        removeFromIndex(state.index, resource);
        break;
      default:
        whoops("DESTROY_RESOURCE_OK", action.payload.kind);
    }
    return state;
  })
  .add<TaggedResource>("UPDATE_RESOURCE_OK", function (s, a) {
    let uuid = a.payload.uuid;
    let tr = _.merge(findByUuid(s.index, uuid), a.payload);
    tr.dirty = false;
    tr.saving = false;
    sanityCheck(tr);
    return s;
  })
  .add<EditResourceParams>("EDIT_RESOURCE", function (s, a) {
    let uuid = a.payload.uuid;
    let { update } = a.payload;
    let source = _.merge<TaggedResource>(findByUuid(s.index, uuid),
      { body: update },
      { dirty: true });
    sanityCheck(source);
    a && isTaggedResource(source);
    return s;
  })
  .add<EditResourceParams>("OVERWRITE_RESOURCE", function (s, a) {
    let uuid = a.payload.uuid;
    let original = findByUuid(s.index, uuid);
    original.body = a.payload.update as typeof original.body;
    original.dirty = true;
    sanityCheck(original);
    a && isTaggedResource(original);
    return s;
  })
  .add<TaggedResource>("INIT_RESOURCE", function (s, a) {
    let tr = a.payload;
    let uuid = tr.uuid;
    reindexResource(s.index, tr);
    if (tr.kind === "logs") {
      // Since logs don't come from the API all the time, they are the only
      // resource (right now) that can have an id of `undefined` and not dirty.
      findByUuid(s.index, uuid).dirty = false;
    } else {
      findByUuid(s.index, uuid).dirty = true;
    }
    sanityCheck(tr);
    return s;
  })
  .add<TaggedResource>("SAVE_RESOURCE_START", function (s, a) {
    let resource = findByUuid(s.index, a.payload.uuid);
    resource.saving = true;
    if (!resource.body.id) { delete resource.body.id; }
    return s;
  })
  .add<ResourceReadyPayl>("RESOURCE_READY", function (state, action) {
    let { name } = action.payload;
    /** Problem:  Most API resources are plural (array wrapped) resource.
     *            A small subset are singular (`device` and a few others),
     *            making `.map()` and friends unsafe.
     *  Solution: wrap everything in an array on the way in. */
    let unwrapped = action.payload.data;
    let data = _.isArray(unwrapped) ? unwrapped : [unwrapped];
    let { index } = state;
    state.loaded.push(name);
    index.byKind[name].map(x => {
      let resource = index.references[x];
      resource && removeFromIndex(index, resource);
    });
    addAllToIndex(index, name, data);
    return state;
  });

interface HasID {
  id?: number | undefined;
}

function addAllToIndex<T extends HasID>(i: ResourceIndex,
  kind: ResourceName,
  all: T[]) {
  all.map(function (tr) {
    return addToIndex(i, kind, tr, generateUuid(tr.id, kind));
  });
}

function addToIndex<T>(index: ResourceIndex,
  kind: ResourceName,
  body: T,
  uuid: string) {
  let tr: TaggedResource = { kind, body, uuid } as any; // TODO: Fix this :(
  sanityCheck(tr);
  index.all.push(tr.uuid);
  index.byKind[tr.kind].push(tr.uuid);
  if (tr.body.id) { index.byKindAndId[tr.kind + "." + tr.body.id] = tr.uuid; }
  index.references[tr.uuid] = tr;
}

export function joinKindAndId(kind: ResourceName, id: number | undefined) {
  return `${kind}.${id || 0}`;
}

let filterOutUuid = (tr: TaggedResource) => (uuid: string) => uuid !== tr.uuid;
function removeFromIndex(index: ResourceIndex, tr: TaggedResource) {
  let { kind } = tr;
  let id = tr.body.id;
  index.all = index.all.filter(filterOutUuid(tr));
  index.byKind[tr.kind] = index.byKind[tr.kind].filter(filterOutUuid(tr));
  delete index.byKindAndId[joinKindAndId(kind, id)]
  delete index.byKindAndId[joinKindAndId(kind, 0)]
  delete index.references[tr.uuid];
}

function whoops(origin: string, kind: string) {
  let msg = `${origin}/${kind}: No handler written for this one yet.`
  throw new Error(msg);
}

export function findByUuid(index: ResourceIndex, uuid: string): TaggedResource {
  let x = index.references[uuid];
  if (x && isTaggedResource(x)) {
    return x;
  } else {
    throw new Error("BAD UUID- CANT FIND RESOURCE: " + uuid);
  }
}

function reindexResource(i: ResourceIndex, r: TaggedResource) {
  removeFromIndex(i, r);
  addToIndex(i, r.kind, r.body, r.uuid);
}
