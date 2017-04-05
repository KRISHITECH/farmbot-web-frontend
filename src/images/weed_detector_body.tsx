import * as React from "react";
import { HsvSlider } from "./hsv_slider";
import { FarmbotColorPicker } from "./farmbot_picker";
import { BlurableInput } from "../ui/index";
import { ImageFlipper } from "./image_flipper";
import { Image, HSV } from "./interfaces";
import { WeedDetectorSlider } from "./weed_detector_slider";
import { TaggedImage } from "../resources/tagged_resources";

const DEFAULTS = {
  H: {
    LOWEST: 0,
    HIGHEST: 179,
    FALLBACK_LO: 30,
    FALLBACK_HI: 90
  },
  S: {
    LOWEST: 0,
    HIGHEST: 255,
    FALLBACK_LO: 50,
    FALLBACK_HI: 255
  },
  V: {
    LOWEST: 0,
    HIGHEST: 255,
    FALLBACK_LO: 50,
    FALLBACK_HI: 255
  },
  BLUR: {
    LOWEST: 0,
    HIGHEST: 100,
    FALLBACK: 15
  },
  MORPH: {
    LOWEST: 0,
    HIGHEST: 100,
    FALLBACK: 6
  },
  ITERATION: {
    LOWEST: 0,
    HIGHEST: 100,
    FALLBACK: 4
  },
};

interface Props {
  images: TaggedImage[];
  H: undefined | (number | undefined)[];
  S: undefined | (number | undefined)[];
  V: undefined | (number | undefined)[];
  onSliderChange(key: keyof HSV<"">, values: [number, number]): void;
  // onSliderChange(key: keyof HSV<"">, values: [number, number]): void;
}

type BMI = "blur" | "morph" | "iteration";

function onCommit(BMI: BMI) {
  return () => console.log("ON COMMIT FOR " + BMI);
}

export function WeedDetectorBody({
  images,
  H,
  S,
  V,
  onSliderChange
}: Props) {
  let h_lo = (H || [])[0] || DEFAULTS.H.FALLBACK_LO;
  let h_hi = (H || [])[1] || DEFAULTS.H.FALLBACK_HI;
  let s_lo = (S || [])[0] || DEFAULTS.S.FALLBACK_LO;
  let s_hi = (S || [])[1] || DEFAULTS.S.FALLBACK_HI;
  let v_lo = (V || [])[0] || DEFAULTS.V.FALLBACK_LO;
  let v_hi = (V || [])[1] || DEFAULTS.V.FALLBACK_HI;

  function onChange(HSV: keyof HSV<"">) {
    return (values: [number, number]) => {
      onSliderChange && onSliderChange(HSV, values);
    };
  };

  return <div className="widget-content">
    <div className="row">
      <div className="col-md-6 col-sm-12">
        <h4>
          <i>Color Range</i>
        </h4>
        <label htmlFor="hue">HUE</label>
        <WeedDetectorSlider
          onChange={onChange("H")}
          onRelease={_.noop}
          lowest={DEFAULTS.H.LOWEST}
          highest={DEFAULTS.H.HIGHEST}
          lowValue={h_lo}
          highValue={h_hi} />
        <label htmlFor="saturation">SATURATION</label>
        <WeedDetectorSlider
          onChange={onChange("S")}
          onRelease={_.noop}
          lowest={DEFAULTS.S.LOWEST}
          highest={DEFAULTS.S.HIGHEST}
          lowValue={s_lo}
          highValue={s_hi} />
        <label htmlFor="value">VALUE</label>
        <WeedDetectorSlider
          onChange={onChange("V")}
          onRelease={_.noop}
          lowest={DEFAULTS.V.LOWEST}
          highest={DEFAULTS.V.HIGHEST}
          lowValue={v_lo}
          highValue={v_hi} />
      </div>
      <div className="col-md-6 col-sm-12">
        <FarmbotColorPicker
          h={[h_lo, h_hi]}
          s={[s_lo, s_hi]}
          v={[v_lo, v_hi]} />
      </div>
    </div>
    <div className="row">
      <div className="col-md-12 col-sm-12">
        <h4>
          <i>Processing Parameters</i>
        </h4>
      </div>

      <div className="col-md-4 col-sm-4">
        <label>BLUR</label>
        <BlurableInput type="number"
          min={DEFAULTS.BLUR.LOWEST}
          max={DEFAULTS.BLUR.HIGHEST}
          onCommit={onCommit("blur")}
          value={"" + DEFAULTS.BLUR.FALLBACK} />
      </div>

      <div className="col-md-4 col-sm-4">
        <label>MORPH</label>
        <BlurableInput type="number"
          min={DEFAULTS.MORPH.LOWEST}
          max={DEFAULTS.MORPH.HIGHEST}
          onCommit={onCommit("morph")}
          value={"" + DEFAULTS.MORPH.FALLBACK} />
      </div>
      <div className="col-md-4 col-sm-4">
        <label>ITERATION</label>
        <BlurableInput type="number"
          min={DEFAULTS.ITERATION.LOWEST}
          max={DEFAULTS.ITERATION.HIGHEST}
          onCommit={onCommit("iteration")}
          value={"" + DEFAULTS.ITERATION.FALLBACK} />
      </div>
    </div>
    <ImageFlipper images={images} />
  </div>;
}
