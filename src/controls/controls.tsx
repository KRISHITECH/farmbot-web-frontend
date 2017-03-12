import * as React from "react";
import { changeStepSize, moveAbs } from "../devices/actions";
import { connect } from "react-redux";
import { Everything } from "../interfaces";
import { ControlsState } from "./interfaces";
import { WebcamSaveBtn } from "./webcam_save_btn";
import { t } from "i18next";
import { Peripherals } from "./peripherals";
import { EStopButton } from "../devices/components/e_stop_btn";
import * as _ from "lodash";
import { API } from "../api";
import { JogButtons } from "./jog_buttons";
import { AxisInputBoxGroup } from "./axis_input_box_group";

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
    if (url.includes("placeholder_farmbot")) {
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
    let fallback = "/placeholder_farmbot.jpg";
    let custom = (this.props.bot.account && this.props.bot.account.webcam_url);
    let url = custom || fallback || "";
    let dirty = !!this.props.bot.account.dirty;
    let { isEditingCameraURL } = this.state;
    return <div className="all-content-wrapper">
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
                        <JogButtons bot={this.props.bot} />
                      </div>
                      <div className="row">
                        <AxisInputBoxGroup
                          bot={this.props.bot}
                          onCommit={(input) => {
                            moveAbs(input);
                          }} />
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
    </div>;
  }
};
