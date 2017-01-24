import * as React from "react";
import { connect } from "react-redux";
import { Everything } from "../../interfaces";
import { Select } from "../../ui";
import { t } from "i18next";
import { ChromePicker } from "react-color";
import { DetectorState } from "../interfaces";

// No "import" support for this lib :(
let Slider = require("rc-slider");
require("rc-slider/assets/index.css");

// let DELETEMEOPTIONS = [
//     { label: 1, value: 1 },
//     { label: 2, value: 2 },
//     { label: 3, value: 3 },
// ];

@connect((state: Everything) => state)
export class WeedDetector extends React.Component<Everything, DetectorState> {
    constructor() {
        super();
        this.state = {
            isEditing: true,
            HUELow: 10,
            HUEHigh: 20,
            saturationLow: 30,
            saturationHigh: 40,
            valueLow: 50,
            valueHigh: 60,
            blur: 1,
            morph: 2,
            iterations: 3,
            time: "12:34pm",
            location: "230, 489, -6,890"
        };
    }

    onSliderChange(val: number) {
        console.log(val);
    }

    onAfterChange() {
        console.log("done");
    }

    componentDidMount() {
        let img = document.querySelector(".weed-detector-widget img");

    }

    handleColorChange() { }

    toggleEdit() {
        this.setState({ isEditing: !this.state.isEditing });
    }

    render() {
        let isEditing = this.state.isEditing;
        return <div>
            <div className="widget-wrapper weed-detector-widget">
                <div className="row">
                    <div className="col-sm-12">
                        {isEditing && (
                            <div className="widget-header">
                                <button
                                    className="green button-like">
                                    {t("SAVE")}
                                </button>
                                <button
                                    className="yellow button-like">
                                    {t("TEST")}
                                </button>
                                <button
                                    className="gray button-like"
                                    onClick={this.toggleEdit.bind(this)}>
                                    {t("BACK")}
                                </button>
                                <h5>{t("Weed Detector")}</h5>
                                <i className={`fa fa-question-circle
                                            widget-help-icon`}>
                                    <div className={`widget-help-text`}>
                                        {t(`Detect Weeds`)}
                                    </div>
                                </i>
                            </div>
                        )}
                        {!isEditing && (
                            <div className="widget-header">
                                <button
                                    className="gray button-like"
                                    onClick={this.toggleEdit.bind(this)}>
                                    {t("EDIT")}
                                </button>
                                <h5>{t("Weed Detector")}</h5>
                                <i className={`fa fa-question-circle
                                            widget-help-icon`}>
                                    <div className={`widget-help-text`}>
                                        {t(`Detect Weeds`)}
                                    </div>
                                </i>
                            </div>
                        )}
                        <div className="row">
                            <div className="col-sm-12">
                                {isEditing && (
                                    <div className="widget-content">
                                        <div className="row">
                                            <div className="col-md-6 col-sm-12">
                                                <h4>
                                                    <i>Color Range</i>
                                                </h4>

                                                <label htmlFor="hue">HUE</label>
                                                <Slider onChange={this.onSliderChange}
                                                    onAfterChange={this.onAfterChange}
                                                    range={true} allowCross={true}
                                                    defaultValue={[this.state.HUELow,
                                                    this.state.HUEHigh]} />

                                                <label htmlFor="saturation">SATURATION</label>
                                                <Slider onChange={this.onSliderChange}
                                                    onAfterChange={this.onAfterChange}
                                                    range={true} allowCross={true}
                                                    defaultValue={[this.state.saturationLow,
                                                    this.state.saturationHigh]} />

                                                <label htmlFor="value">VALUE</label>
                                                <Slider onChange={this.onSliderChange}
                                                    onAfterChange={this.onAfterChange}
                                                    range={true} allowCross={true}
                                                    defaultValue={[this.state.valueLow,
                                                    this.state.valueHigh]} />
                                            </div>
                                            <div className="col-md-6 col-sm-12">
                                                <ChromePicker
                                                    color="#fff"
                                                    onChangeComplete={this.handleColorChange} />
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
                                                {/*<Select
                                                    options={DELETEMEOPTIONS}
                                                    value={this.state.blur} />*/}
                                            </div>

                                            <div className="col-md-4 col-sm-4">
                                                <label>MORPH</label>
                                                {/*<Select
                                                    options={DELETEMEOPTIONS}
                                                    value={this.state.blur} />*/}
                                            </div>

                                            <div className="col-md-4 col-sm-4">
                                                <label>ITERATION</label>
                                                {/*<Select
                                                    options={DELETEMEOPTIONS}
                                                    value={this.state.blur} />*/}
                                            </div>
                                        </div>
                                        <img className="temp-plant" src="/plant.jpg" />
                                        <div className="weed-detector-meta">
                                            <div className="time">
                                                <label>Time:</label>
                                                <span>{this.state.time}</span>
                                            </div>
                                            <div className="location">
                                                <label>Location:</label>
                                                <span>{this.state.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {!isEditing && (
                                    <div className="widget-content">
                                        <div className="row">
                                            <div className="col-md-12 col-sm-12">
                                                <img className="temp-plant" src="/plant.jpg" />
                                                <div className="weed-detector-meta">
                                                    <div className="time">
                                                        <label>Time:</label>
                                                        <span>{this.state.time}</span>
                                                    </div>
                                                    <div className="location">
                                                        <label>Location:</label>
                                                        <span>{this.state.location}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    }
}
