import * as React from "react";
import { DirectionButton } from "./direction_button";
import {
    homeAll,
    changeStepSize,
    commitAxisChanges,
    changeAxisBuffer
} from "../devices/actions";
import { BotState } from "../devices/interfaces";
import { connect } from "react-redux";
import { Everything } from "../interfaces";
import { WebcamSaveBtn } from "./webcam_save_btn";
import { t } from "i18next";
import { Peripherals } from "./peripherals";
import { EStopButton } from "../devices/components/e_stop_btn";
import * as _ from "lodash";
import { API } from "../api";

interface AxisInputBoxProps {
    bot: BotState;
    axis: string;
    label: string;
    dispatch: Function;
};

export class AxisInputBox extends React.Component<AxisInputBoxProps, {}> {

    primary(): string {
        return this.props.bot.axisBuffer[this.props.axis] || "";
    }

    secondary(): string {
        const axisTranslation: { [axis: string]: number } = { x: 0, y: 1, z: 2 };
        let axisNumber = axisTranslation[this.props.axis];
        let num = this.props.bot.hardware.location[axisNumber];
        if (_.isNumber(num)) {
            return String(num); // Prevent 0 from being falsy.
        } else {
            return num;
        };
    }

    style() {
        return { border: (this.primary()) ? "1px solid red" : "" };
    }

    change(key: string, dispatch: Function):
        React.EventHandler<React.FormEvent<HTMLInputElement>> {
        return function (event) {
            let num = Number(event.currentTarget.value);
            dispatch(changeAxisBuffer(key, num));
        };
    }

    render() {
        return <div className="col-xs-3">
            <label>{this.props.label}</label>
            <input className="move-input"
                type="text"
                style={this.style()}
                onChange={this.change(this.props.axis, this.props.dispatch)}
                value={this.primary() || this.secondary() || "---"} />
        </div>;
    }
}

export class StepSizeSelector extends React.Component<any, any> {
    cssForIndex(num: number) {
        let choices = this.props.choices;
        let css = "move-amount no-radius ";
        if (num === _.first(choices)) {
            css += "leftmost ";
        }
        if (num === _.last(choices)) {
            css += "rightmost ";
        }
        if (num === this.props.selected) {
            css += "move-amount-selected ";
        }
        return css;
    }

    render() {
        return (<div className="move-amount-wrapper">
            {
                this.props.choices.map(
                    (item: number, inx: number) => <button
                        className={this.cssForIndex(item)}
                        onClick={() => this.props.selector(item)}
                        key={inx} >{item}</button>
                )
            }
        </div>);
    }
}

const showUrl = (url: string, dirty: boolean) => {
    if (dirty) {
        return <p>Press save to view.</p>;
    } else {
        if (url.indexOf("/webcam_url_not_set.jpeg") !== -1) {
            return <div className="webcam-stream-unavailable">
                <img src={url} />
                <text>Camera stream not available.
                <br />Press <b>EDIT</b> to add a stream.</text>
            </div>;
        } else {
            return <img className="webcam-stream" src={url} />;
        };
    };
};

const updateWebcamUrl = (dispatch: Function) => (
    event: React.KeyboardEvent<HTMLInputElement>) => {
    dispatch({
        type: "CHANGE_WEBCAM_URL",
        payload: event.currentTarget.value
    });
};

interface ControlsState {
    isEditingCameraURL: boolean;
}

@connect((state: Everything) => state)
export class Controls extends React.Component<Everything, ControlsState> {
    constructor() {
        super();
        this.state = {
            isEditingCameraURL: false
        };
    }

    toggleCameraURLEdit() {
        this.setState({ isEditingCameraURL: !this.state.isEditingCameraURL });
    }

    clearURL() {
        this.props.dispatch({
            type: "CHANGE_WEBCAM_URL",
            payload: "http://"
        });
        let urlInput = document
            .querySelector(".webcam-url-input") as HTMLInputElement;
        urlInput.focus();
    }

    render() {
        let fallback = "/webcam_url_not_set.jpeg";
        let custom = (this.props.bot.account && this.props.bot.account.webcam_url);
        let url = custom || fallback || "";
        let dirty = !!this.props.bot.account.dirty;
        let { isEditingCameraURL } = this.state;
        return (
            <div>
                <div className="all-content-wrapper">
                    <div>
                        <div className="row">
                            <div className={`col-md-4 col-sm-6 col-xs-12
                                col-md-offset-1`}>
                                <div>
                                    <div className="widget-wrapper">
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <EStopButton {...this.props} />
                                                <div className="widget-header">
                                                    <h5>Move</h5>
                                                    <i className={`fa
                                                        fa-question-circle
                                                        widget-help-icon`}>
                                                        <div
                                                            className={
                                                                `widget-help-text`
                                                            }>
                                                            {t(`Use these manual
                              control buttons to move FarmBot in realtime. Press
                              the arrows for relative movements or type in new
                              coordinates and press GO for an
                              absolute movement. Tip: Press the Home button when
                              you are done so FarmBot is ready to get back to
                              work.`)}
                                                        </div>
                                                    </i>
                                                </div>
                                            </div>
                                            <div className="col-sm-12">
                                                <div className="widget-content">
                                                    <label
                                                        className={`text-center`}>
                                                        {t("MOVE AMOUNT (mm)")}
                                                    </label>
                                                    <div className="row">
                                                        <div className={
                                                            `col-sm-12`}>
                                                            <StepSizeSelector
                                                                choices={[1, 10, 100, 1000, 10000]}
                                                                selector={(num: number) => this.props.dispatch(changeStepSize(num))}
                                                                selected={this.props.bot.stepSize} />
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <table className="jog-table" style={{ border: 0 }}>
                                                            <tbody>
                                                                <tr>
                                                                    <td />
                                                                    <td />
                                                                    <td />
                                                                    <td>
                                                                        <DirectionButton axis="y"
                                                                            direction="up"
                                                                            steps={this.props.bot.stepSize || 1000}
                                                                            {...this.props} />
                                                                    </td>
                                                                    <td />
                                                                    <td />
                                                                    <td>
                                                                        <DirectionButton axis="z"
                                                                            direction="up"
                                                                            steps={this.props.bot.stepSize || 1000}
                                                                            {...this.props} />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <button
                                                                            className="button-like i fa fa-home arrow-button"
                                                                            onClick={
                                                                                () => homeAll(100)
                                                                            } />
                                                                    </td>
                                                                    <td />
                                                                    <td>
                                                                        <DirectionButton axis="x"
                                                                            direction="left"
                                                                            steps={this.props.bot.stepSize || 1000}
                                                                            {...this.props} />
                                                                    </td>
                                                                    <td>
                                                                        <DirectionButton axis="y"
                                                                            direction="down"
                                                                            steps={this.props.bot.stepSize || 1000}
                                                                            {...this.props} />
                                                                    </td>
                                                                    <td>
                                                                        <DirectionButton axis="x"
                                                                            direction="right"
                                                                            steps={this.props.bot.stepSize || 1000}
                                                                            {...this.props} />
                                                                    </td>
                                                                    <td />
                                                                    <td>
                                                                        <DirectionButton axis="z"
                                                                            direction="down"
                                                                            steps={this.props.bot.stepSize || 1000}
                                                                            {...this.props} />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td />
                                                                </tr>
                                                            </tbody></table>
                                                    </div>
                                                    <div className="row">
                                                        <AxisInputBox axis="x" label="X AXIS" {...this.props} />
                                                        <AxisInputBox axis="y" label="Y AXIS" {...this.props} />
                                                        <AxisInputBox axis="z" label="Z AXIS" {...this.props} />
                                                        <div className="col-xs-3">
                                                            <button className="full-width green button-like go"
                                                                onClick={() => this.props.dispatch(commitAxisChanges())} >
                                                                GO
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="widget-wrapper peripherals-widget">
                                        <div className="row">
                                            <Peripherals {...this.props} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-sm-6 col-xs-12">
                                <div>
                                    <div className="widget-wrapper webcam-widget">
                                        <div className="row">
                                            <div className="col-sm-12">
                                                {isEditingCameraURL ?
                                                    <WebcamSaveBtn dispatch={this.props.dispatch}
                                                        webcamUrl={url}
                                                        apiUrl={API.current.baseUrl}
                                                        updateState={this.toggleCameraURLEdit.bind(this)}
                                                        />
                                                    :
                                                    <button
                                                        className="button-like widget-control gray"
                                                        onClick={this.toggleCameraURLEdit.bind(this)}>
                                                        {t("Edit")}
                                                    </button>
                                                }
                                                <div className="widget-header">
                                                    <h5>{t("Camera")}</h5>
                                                    <i className="fa fa-question-circle widget-help-icon">
                                                        <div className="widget-help-text">
                                                            {t(`Press the edit button to update
                                                                and save your webcam URL.`)}
                                                        </div>
                                                    </i>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div>
                                                    {isEditingCameraURL && (
                                                        <div>
                                                            <label>{t("Set Webcam URL:")}</label>
                                                            <button
                                                                className="clear-webcam-url-btn"
                                                                onClick={this.clearURL.bind(this)}>
                                                                <i className="fa fa-times"></i>
                                                            </button>
                                                            <input type="text"
                                                                onChange={updateWebcamUrl(this.props.dispatch)}
                                                                value={url}
                                                                className="webcam-url-input" />
                                                        </div>
                                                    )}
                                                </div>
                                                {showUrl(url, dirty)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};
