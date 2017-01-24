import { OpenFarm } from "./openfarm";

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
  planted_at: string;
  img_url: string;
  name: string;
  x: number;
  y: number;
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
  plants: Plant[];
  cropSearchQuery: string;
  cropSearchResults: CropLiveSearchResult[];
}
