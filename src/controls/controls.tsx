import * as React from "react";
import { Component } from "react";
import { changeStepSize, moveAbs, changeDevice } from "../devices/actions";
import { connect } from "react-redux";
import { ControlsState } from "./interfaces";
import { WebcamSaveBtn } from "./webcam_save_btn";
import { t } from "i18next";
import { Peripherals } from "./peripherals";
import { EStopButton } from "../devices/components/e_stop_btn";
import { API } from "../api";
import { JogButtons } from "./jog_buttons";
import { AxisInputBoxGroup } from "./axis_input_box_group";
import { PLACEHOLDER_FARMBOT } from "../images/index";
import { Row, Page, Col, Widget, WidgetBody, WidgetHeader } from "../ui";
import { mapStateToProps, Props } from "./state_to_props";
import { StepSizeSelector } from "./step_size_selector";
import { showUrl } from "./show_url";

@connect(mapStateToProps)
export class Controls extends Component<Props, ControlsState> {
  constructor() {
    super();
    this.state = { isEditingCameraURL: false };
  }

  toggleCameraURLEdit = () => {
    this.setState({ isEditingCameraURL: !this.state.isEditingCameraURL });
  }

  clearURL = () => {
    this.props.dispatch(changeDevice(this.props.account, { webcam_url: "http://" }));
    (document.querySelector(".webcam-url-input") as HTMLInputElement).focus();
  }

  render() {
    let fallback = PLACEHOLDER_FARMBOT;
    let custom = (this.props.account.body.webcam_url);
    let url = custom || fallback;
    let dirty = !!this.props.bot.dirty;
    let { isEditingCameraURL } = this.state;
    return <Page className="controls">
      <Row>
        <Col xs={12} sm={6} md={4} mdOffset={1}>
          <Widget>
            <WidgetHeader title="Move"
              helpText={`Use these manual control buttons to move FarmBot in
                    realtime. Press the arrows for relative movements or type in
                    new coordinates and press GO for an absolute movement. Tip:
                    Press the Home button when you are done so FarmBot is ready
                    to get back to work.`}>
              <EStopButton
                bot={this.props.bot}
                auth={this.props.auth} />
            </WidgetHeader>
            <WidgetBody>
              <label className="text-center">
                {t("MOVE AMOUNT (mm)")}
              </label>
              <StepSizeSelector
                choices={[1, 10, 100, 1000, 10000]}
                selector={(num: number) => this.props.dispatch(changeStepSize(num))}
                selected={this.props.bot.stepSize} />
              <JogButtons bot={this.props.bot} />
              <AxisInputBoxGroup
                bot={this.props.bot}
                onCommit={(input) => { moveAbs(input); }} />
            </WidgetBody>
          </Widget>
          <Peripherals
            bot={this.props.bot}
            peripherals={this.props.peripherals}
            dispatch={this.props.dispatch}
            resources={this.props.resources} />
        </Col>
        <Col xs={12} sm={6}>
          <Widget>
            <WidgetHeader title="Camera"
              helpText={`Press the edit button to update and save
                your webcam URL.`}>
              {isEditingCameraURL ?
                <WebcamSaveBtn dispatch={this.props.dispatch}
                  webcamUrl={url}
                  apiUrl={API.current.baseUrl}
                  updateState={this.toggleCameraURLEdit} />
                :
                <button
                  className="button-like gray"
                  onClick={this.toggleCameraURLEdit}>
                  {t("Edit")}
                </button>
              }
            </WidgetHeader>
            {isEditingCameraURL && (
              <div>
                <label>{t("Set Webcam URL:")}</label>
                <button
                  className="clear-webcam-url-btn"
                  onClick={this.clearURL}>
                  <i className="fa fa-times"></i>
                </button>
                <input type="text"
                  onChange={(e) => {
                    let update = { webcam_url: e.currentTarget.value };
                    this.props.dispatch(changeDevice(this.props.account, update));
                  }}
                  value={url}
                  className="webcam-url-input" />
              </div>
            )}
            {showUrl(url, dirty)}
          </Widget>
        </Col>
      </Row>
    </Page>;
  }
};
