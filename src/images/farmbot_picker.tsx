import * as React from "react";
import { Hue, Saturation } from 'react-color/lib/components/common';

interface State {
}

interface Props {
    h: [number, number];
    s: [number, number];
    v: [number, number];
    hsv: { h: number, s: number, v: number };
    hsl: { h: number, s: number, l: number };
}

/** Wrapper class around `react-color`'s `<Saturation />` and `<Hue />`.
 *  Add an extra white box feature for showing user weed detection settings.
 */
export class FarmbotPicker extends React.Component<Props, State> {
    BASE_CSS: React.CSSProperties = {
        position: "absolute",
        border: "2px solid white",
        boxShadow: "0 0 2px 2px rgba(0, 0, 0, 0.3) inset"
    };

    constructor() {
        super();
        this.state = {};
        this.HueCSS = this.HueCSS.bind(this);
        this.SaturationCSS = this.SaturationCSS.bind(this);
        this.HueboxCss = this.HueboxCss.bind(this);
        this.SaturationboxCss = this.SaturationboxCss.bind(this);
    }

    HueCSS(): React.CSSProperties {
        let position = "relative";
        let width = "100%";
        let paddingBottom = '10%';
        let overflow = 'hidden'
        return { position, width, paddingBottom, overflow };
    }

    SaturationCSS(): React.CSSProperties {
        let position = "relative";
        let width = "100%";
        let paddingBottom = '35%';
        let overflow = 'hidden'
        return { position, width, paddingBottom, overflow };
    }

    HueboxCss(): React.CSSProperties {
        let l = ((this.props.h[0] * 2) / 360) * 100;
        let w = ((this.props.h[1] * 2) / 360) * 100 - l;

        let width = `${w}%`;
        let left = `${l}%`;
        let height = '100%';
        let top = 0;
        return { ...this.BASE_CSS, width, height, top, left };
    }

    SaturationboxCss(): React.CSSProperties {
        let l = ((this.props.s[0] / 255) * 100);
        let w = ((this.props.s[1] / 255) * 100) - l;
        let t = 100 - (this.props.v[1] / 255) * 100;
        let h = (100 - (this.props.v[0] / 255) * 100) - t;

        let width = `${w}%`;
        let left = `${l}%`;
        let height = `${h}%`;
        let top = `${t}%`;
        return { ...this.BASE_CSS, width, height, top, left };
    }

    render() {
        return <div>
            <div style={{ width: '100%', paddingBottom: '15%' }} />
            <div style={this.HueCSS()}>
                <Hue {...this.props} pointer={ 'none' }/>
                <div style={this.HueboxCss()} />
            </div>
            <div style={{ width: '100%', paddingBottom: '2%' }} />
            <div style={this.SaturationCSS()}>
                <Saturation {...this.props} />
                <div style={this.SaturationboxCss()} />
            </div>
        </div>;
    }
}
