/** Like Dictionary<T>, except more cautious about null values. */
import { SequenceReducerState } from "../sequences/interfaces";
import { DesignerState } from "../farm_designer/interfaces";
import { CowardlyDictionary } from "../util";
import { TaggedResource, ResourceName } from "./tagged_resources";
import { Dictionary } from "farmbot/dist";
import { RegimenState } from "../regimens/reducer";

type UUID = string;

export interface ResourceIndex {
  all: UUID[];
  byKind: Record<ResourceName, UUID[]>;
  byKindAndId: CowardlyDictionary<UUID>;
  references: Dictionary<TaggedResource | undefined>;
}
export interface RestResources {
  /** Tells you if the sync finished yet. */
  loaded: ResourceName[];
  index: ResourceIndex;
  consumers: {
    sequences: SequenceReducerState;
    regimens: RegimenState;
    farm_designer: DesignerState;
  }
};
