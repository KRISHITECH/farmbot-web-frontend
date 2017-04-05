import { CropLiveSearchResult } from "./interfaces";
import { generateReducer } from "../redux/generate_reducer";
import { DesignerState } from "./interfaces";
import { cloneDeep } from "lodash";
import { HardwareState } from "../devices/interfaces";
import { TaggedResource } from "../resources/tagged_resources";

export let initialState: DesignerState = {
  x_size: 0,
  y_size: 0,
  cropSearchQuery: "",
  cropSearchResults: []
};

export let designer = generateReducer<DesignerState>(initialState)
  .add<HardwareState>("BOT_CHANGE", function (s, { payload }) {
    let state = cloneDeep(s);
    let [x, y] = [
      payload.mcu_params.movement_axis_nr_steps_x,
      payload.mcu_params.movement_axis_nr_steps_y
    ];
    if (x && y) {
      state.x_size = x;
      state.y_size = y;
    }
    return state;
  })
  .add<string>("SEARCH_QUERY_CHANGE", function (s, { payload }) {
    let state = cloneDeep(s);
    state.cropSearchQuery = payload;
    return state;
  })
  .add<CropLiveSearchResult[]>("OF_SEARCH_RESULTS_OK",
  function (s, { payload }) {
    let state = cloneDeep(s);
    state.cropSearchResults = payload;
    return state;
  })
  .add<TaggedResource>("DESTROY_RESOURCE_OK", function (state, action) {
    return state;
  });
