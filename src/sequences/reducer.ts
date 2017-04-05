import { SequenceReducerState } from "./interfaces";
import { generateReducer } from "../redux/generate_reducer";
import * as _ from "lodash";
import { TaggedResource } from "../resources/tagged_resources";

export const initialState: SequenceReducerState = {
  current: undefined
};

export let sequenceReducer = generateReducer<SequenceReducerState>(initialState)
  .add<TaggedResource>("DESTROY_RESOURCE_OK", function (state, action) {
    switch (action.payload.uuid) {
      case state.current:
        state.current = undefined;
        break;
    }
    return state;
  })
  .add<TaggedResource>("INIT_RESOURCE", function (state, action) {
    if (action.payload.kind === "sequences") {
      state.current = action.payload.uuid;
    }
    return state;
  })
  .add<string>("SELECT_SEQUENCE", function (s, a) {
    s.current = a.payload;
    return s;
  })
  .add<void>("RESOURCE_READY", function (s, a) {
    s.current = undefined;
    return s;
  })

function markDirty(s: SequenceReducerState) {
  // s.all[s.current].dirty = true;
};

/** HACK: TODO: If we were to iterate over sequence.body (using map()) and we
 * wrote `key={inx}` inside the iterator, React's diff algorithm would loose
 * track of which step has changed (and sometimes even mix up the state of
 * completely different steps). To get around this, we add a `uuid` property to
 * Steps that is guaranteed to be unique and allows React to diff the list
 * correctly. Let's refactor this out.
 */
function maybeAddMarkers(s: SequenceReducerState) {
  // s.all.map(function (seq) {
  //   (seq.body || []).map(function (step) {
  //     (step as any).uuid = (step as any).uuid || uuid();
  //   });
  // });
};
