import { Image } from "./interfaces";
import * as React from "react";
import { safeStringFetch } from "../util";

export interface ImageFlipperProps {
    images: Image[];
}

export interface ImageFlipperState {
    currentInx: number;
}

export class ImageFlipper extends React.Component<ImageFlipperProps, Partial<ImageFlipperState>> {
    constructor() {
        super();
        this.state = { currentInx: 0 };
        this.down = this.down.bind(this);
        this.up = this.up.bind(this);
        this.imageJSX = this.imageJSX.bind(this);
    }

    current(): Image | undefined {
        return this.props.images[this.state.currentInx || 0];
    }

    imageJSX() {
        let i = this.current();
        if (i) {
            let url: string;
            if (i.attachment_processed_at) {
                url = i.attachment_url;
            } else {
                url = "/app-resources/img/processing.png";
            }
            return <img
                className="image-flipper-image"
                src={url} />;
        } else {
            return <p>Please snap some photos in the sequence editor first.</p>;
        }
    }

    get next() {
        return this.props.images[this.state.currentInx + 1];
    }

    get prev() {
        return this.props.images[this.state.currentInx - 1];
    }

    up() {
        if (this.next) {
            let num = this.state.currentInx + 1;
            this.setState({ currentInx: _.min([this.props.images.length - 1, num]) });
        }
    }

    down() {
        if (this.prev) {
            let num = this.state.currentInx - 1;
            this.setState({ currentInx: _.max([0, num]) });
        }
    }

    metaTag(key: string, val: string) {

    }

    metaDatas() {
        let i = this.current();
        if (i) {
            let {meta, id} = i;
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
                <div>
                    {i ? <MetaInfo attr={"created_at"} obj={i} /> : ""}
                    {this.metaDatas()}
                </div>
            </div>
        </div >;
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

function MetaInfo({obj, attr, label}: MetaInfoProps) {
    let top = label || _.startCase(attr.split("_").join());
    let bottom = safeStringFetch(obj, attr);
    return <div>
        <label>{top}</label>
        <span>{bottom || "unknown"}</span>
    </div>;
}