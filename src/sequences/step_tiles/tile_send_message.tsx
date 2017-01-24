import * as React from "react";
import {
    StepParams,
    copy,
    remove,
    CustomValueProps
} from "./index";
import { StepTitleBar } from "./step_title_bar";
import { Help, Select, Saucer } from "../../ui";
import { t } from "i18next";
import { StepInputBox } from "../inputs/step_input_box";
import { addChan, removeChan, updateMessageType } from "../actions";
import { SendMessage } from "farmbot";
import * as _ from "lodash";
import { Option } from "react-select";
import { CustomOptionProps } from "../../interfaces";

class OptionComponent extends React.Component<CustomOptionProps, {}> {
    handleMouseDown(e: React.SyntheticEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        this.props.onSelect(this.props.option, e);
    };

    handleMouseEnter(e: React.SyntheticEvent<HTMLDivElement>) {
        this.props.onFocus(this.props.option, e);
    };

    handleMouseMove(e: React.SyntheticEvent<HTMLDivElement>) {
        if (this.props.isFocused) { return; };
        this.props.onFocus(this.props.option, e);
    };
    render() {
        return (
            <div className={this.props.className}
                onMouseDown={this.handleMouseDown.bind(this)}
                onMouseEnter={this.handleMouseEnter.bind(this)}
                onMouseMove={this.handleMouseMove.bind(this)}>
                <Saucer color={this.props.option.value} />
                {this.props.children}
            </div>
        );
    }
};

// class ValueComponent needs this value from inside TileSendMessage.
let type = "";

class ValueComponent extends React.Component<CustomValueProps, {}> {
    render() {
        return (
            <div className="Select-value">
                <span className="Select-value-label">
                    <Saucer color={type} />
                    {this.props.children}
                </span>
            </div>
        );
    }
};

export function TileSendMessage({dispatch, step, index}: StepParams) {
    if (step.kind !== "send_message") {
        throw new Error("TileSendMessage expects send_message");
    } else {

    }
    step = step as SendMessage;
    let args = step.args;
    let message = args.message;

    // class ValueComponent needs this value from inside TileSendMessage.
    type = args.message_type;

    let channels = _.pairs<{}, string>({
        "toast": "Toast Notification",
        "email": "Email",
        "sms": "SMS",
        "twitter": "Twitter"
    });

    let options = [
        { value: "success", label: "Success" },
        { value: "busy", label: "Busy" },
        { value: "warn", label: "Warning" },
        { value: "error", label: "Error" },
        { value: "info", label: "Info" },
        { value: "fun", label: "Fun" }
    ];

    let handleOptionChange = (event: Option) => {
        let { value } = event;
        if (value) {
            dispatch(updateMessageType({ value, index }));
        } else {
            throw new Error("Must provide a value");
        }
    };

    let handleChannelChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
        let el = e.target as HTMLInputElement;
        let channel_name = el.id;
        let action = (el.checked) ? addChan : removeChan;
        dispatch(action({ channel_name, index }));
    };

    let choices = channels.map(function (pair, key) {
        let name_list = (step.kind === "send_message") ?
            (step.body || []).map(x => x.args.channel_name) : [];
        let [name, label] = pair;
        let isChecked = name_list.includes(name);
        /** TODO: Temporary. Once features are available, enable them. */
        let isDisabled = name == "email" || name == "sms" || name == "twitter";
        return <fieldset key={key}>
            <label htmlFor={name}> {label}</label>
            <input type="checkbox"
                id={name}
                disabled={isDisabled}
                onChange={(event: React.SyntheticEvent<HTMLInputElement>) => {
                    handleChannelChange(event);
                }}
                checked={isChecked}
            />
        </fieldset>;
    });

    return <div>
        <div className="step-wrapper">
            <div className="row">
                <div className="col-sm-12">
                    <div className="step-header send-message-step">
                        <StepTitleBar index={index}
                            dispatch={dispatch}
                            step={step} />
                        <i className="fa fa-arrows-v step-control" />
                        <i className="fa fa-clone step-control"
                            onClick={() => copy({ dispatch, step })} />
                        <i className="fa fa-trash step-control"
                            onClick={() => remove({ dispatch, index })} />
                        <Help text={(`The Send Message step instructs
                                FarmBot to send a custom message to the logs.
                                This can help you with debugging your sequences.
                                Eventually you will be able to receive push
                                notifications and email alerts of these
                                messages!`)} />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-12">
                    <div className="step-content send-message-step">
                        <div className="row">
                            <div className="col-xs-12">
                                <label>{t("Message")}</label>
                                <span className="char-limit">
                                    {message.length}/300
                                </span>
                                <StepInputBox dispatch={dispatch}
                                    step={step}
                                    index={index}
                                    field="message"
                                />
                                <div className="bottom-content">
                                    <div className="channel-options">
                                        <Select
                                            onChange={handleOptionChange}
                                            value={type}
                                            options={options}
                                            optionComponent={OptionComponent}
                                            valueComponent={ValueComponent}
                                        />
                                    </div>
                                    <div className="channel-fields">
                                        <fieldset>
                                            <label htmlFor="ticker">
                                                Status Ticker/Logs
                                                </label>
                                            <input type="checkbox"
                                                id="ticker"
                                                disabled
                                                checked
                                            />
                                        </fieldset>
                                        {choices}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>;
}
