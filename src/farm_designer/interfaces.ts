import { OpenFarm } from "./openfarm";

export interface UpdateSequenceOrRegimenProps {
  label: string;
  value: number;
  kind: string;
  farm_event_id: number;
}

export type FarmEventForm = Partial<Record<keyof FarmEvent, string | number>>;

export type TimeUnit = "never"
  | "minutely"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly";

export interface FarmEvent {
  id?: number | undefined;
  start_time: string;
  end_time?: string | undefined;
  repeat?: number | undefined;
  time_unit: TimeUnit;
  next_time: string;
  executable_id: number;
  executable_type: string;
  readonly calendar?: string[] | undefined;
};

export interface MovePlantProps {
  deltaX: number;
  deltaY: number;
  plantId: number;
}

export interface ScheduledEvent {
  time: Date;
  desc: string;
  icon: string;
};

/** OFCrop bundled with corresponding profile image from OpenFarm API. */
export interface CropLiveSearchResult {
  crop: OpenFarm.OFCrop;
  image: string;
}

export interface Plant {
  id?: number;
  dirty?: boolean | undefined;
  planted_at: string;
  img_url: string;
  name: string;
  x: number;
  y: number;
  spread?: number | undefined;
  planting_area_id: string;
  icon_url: string; // ? Maybe this will change.
  openfarm_slug: string; // ? Maybe this will change.
}

export interface Specimen {
  id: number;
  name: string;
  imgUrl: string;
}

export interface DesignerState {
  x_size: number;
  y_size: number;
  /** This causes too much data denormalization-
   *  let's just use state.sync.plants moving forward.
   */
  deprecatedPlants: Plant[];
  cropSearchQuery: string;
  cropSearchResults: CropLiveSearchResult[];
}

export interface Point {
  id: number;
  x: number;
  y: number;
  z: number;
  radius: number;
  created_at: string;
  meta: { [key: string]: (string | undefined) };
}
