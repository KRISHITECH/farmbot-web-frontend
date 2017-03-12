import { Image } from "./interfaces";
import * as React from "react";
import { safeStringFetch } from "../util";
import { t } from "i18next";
import * as moment from "moment";

export interface ImageFlipperProps {
  images: Image[];
}

export interface ImageFlipperState {
  currentInx: number;
  isLoaded: boolean;
}
const NO_INDEX = new Error(`
Attempter getting this.state.currentInx and expected a number.
It was not a number.
`);

export class ImageFlipper extends React.Component<ImageFlipperProps, Partial<ImageFlipperState>> {
  constructor() {
    super();
    this.state = { currentInx: 0, isLoaded: false };
    this.down = this.down.bind(this);
    this.up = this.up.bind(this);
    this.imageJSX = this.imageJSX.bind(this);
  }

  current(): Image | undefined {
    return this.props.images[this.state.currentInx || 0];
  }

  imageJSX() {
    let i = this.current();
    if (i && this.props.images.length > 0) {
      let url: string;
      if (i.attachment_processed_at) {
        url = i.attachment_url;
      } else {
        url = "/placeholder_farmbot.jpg";
      }
      return <div>
        {!this.state.isLoaded && (
          <div className="no-flipper-image-container">
            <p>{t(`Image loading (try refreshing)`)}</p>
            <img
              className="image-flipper-image"
              src={"/placeholder_farmbot.jpg"} />
          </div>)}
        <img
          onLoad={() => this.setState({ isLoaded: true })}
          className={`image-flipper-image is-loaded-${this.state.isLoaded}`}
          src={url} />
      </div>;
    } else {
      return <div className="no-flipper-image-container">
        <p>{t(`You haven't yet taken any photos with your FarmBot.
          Once you do, they will show up here.`)}</p>
        <img
          className="image-flipper-image"
          src={"/placeholder_farmbot.jpg"} />
      </div>;
    }
  }

  /** Clever trick to avoid type check errors and report problems. */
  useIndex<T>(cb: (num: number) => T): T {
    if (_.isNumber(this.state.currentInx)) {
      return cb(this.state.currentInx);
    } else {
      throw NO_INDEX;
    }
  }

  get next() {
    return this.useIndex(n => this.props.images[n + 1]);
  }

  get prev() {
    return this.useIndex(n => this.props.images[n - 1]);
  }

  up() {
    if (this.next) {
      let num = this.useIndex(n => n + 1);
      this.setState({
        currentInx: _.min([this.props.images.length - 1, num]),
        isLoaded: false
      });
    }
  }

  down() {
    if (this.prev) {
      let num = this.useIndex(n => n - 1);
      this.setState({
        currentInx: _.max([0, num]),
        isLoaded: false
      });
    }
  }

  metaDatas() {
    let i = this.current();
    if (i) {
      let { meta, id } = i;
      return Object.keys(meta).sort().map(function (key, index) {
        return <MetaInfo key={id} attr={key} obj={meta} />;
      });
    } else {
      return <MetaInfo attr={"image"} obj={{ image: "No meta data." }} />;
    }
  }

  render() {
    let image = this.imageJSX();
    let i = this.current();
    return <div>
      <div className="row" >
        <div className="col-sm-12">
          <div className="image-flipper">
            {image}
            <button onClick={this.down} className="image-flipper-left">Prev</button>
            <button onClick={this.up} className="image-flipper-right">Next</button>
          </div>
        </div>
      </div>
      <div className="weed-detector-meta">
        {/** Separated from <MetaInfo /> for stylistic purposes. */}
        {i ?
          <div className="created-at">
            <label>{t("Created At")}</label>
            <span>
              {moment(i.created_at).format("MMMM Do, YYYY h:mma")}
            </span>
          </div>
          : ""}
        <div className="meta-coordinates">
          {this.metaDatas()}
        </div>
      </div>
    </div>;
  }
}

interface MetaInfoProps {
  /** Default conversion is `attr_name ==> Attr Name`.
   *  Setting a label property will over ride it to a differrent value.
   */
  label?: string;
  attr: string;
  obj: any; /** Really, it's OK here! See safeStringFetch */
}

function MetaInfo({ obj, attr, label }: MetaInfoProps) {
  let top = label || _.startCase(attr.split("_").join());
  let bottom = safeStringFetch(obj, attr);
  return <div className="coordinate">
    <label>{top}</label>
    <span>{bottom || "unknown"}</span>
  </div>;
}
