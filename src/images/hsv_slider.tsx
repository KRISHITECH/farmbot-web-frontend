import * as React from "react";
import { HSV, HiLo } from "./interfaces";
import { RangeSlider } from "@blueprintjs/core";

/** Max HSV allowed by farmbot weed detector. */
const RANGE: HSV<HiLo> = {
  H: { lo: 0, hi: 179 },
  S: { lo: 0, hi: 255 },
  V: { lo: 0, hi: 255 }
};

/** Default HSV if none found on bot. */
const DEFAULTS: HSV<HiLo> = {
  H: { lo: 30, hi: 90 },
  S: { lo: 50, hi: 255 },
  V: { lo: 50, hi: 255 }
};

interface EnvSliderProps {
  name: keyof HSV<{}>;
  onChange?: (key: keyof HSV<{}>, val: [number, number]) => void;
}

type EnvSliderState = Partial<HiLo>;

export class HsvSlider extends React.Component<EnvSliderProps, EnvSliderState> {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.onRelease = this.onRelease.bind(this);
    this.state = {};
  }

  componentDidMount() {
    this.onRelease();
  }

  onChange(range: [number, number]) {
    this.setState({
      hi: range[1],
      lo: range[0]
    });
  }

  onRelease() {
    let cb = this.props.onChange;
    if (cb) {
      cb(this.props.name, [this.lo, this.hi]);
    }
  }

  get hi() {
    let { hi } = this.state;
    let { name } = this.props;
    return (hi === undefined) ? DEFAULTS[name].hi : hi;
  }

  get lo() {
    let { lo } = this.state;
    let { name } = this.props;
    return (lo === undefined) ? DEFAULTS[name].lo : lo;
  }

  render() {
    let { name } = this.props;

    return <RangeSlider
      onChange={this.onChange}
      onRelease={this.onRelease}
      labelStepSize={RANGE[name].hi}
      min={RANGE[name].lo}
      max={RANGE[name].hi}
      value={[this.lo, this.hi]} />;
  }
}
