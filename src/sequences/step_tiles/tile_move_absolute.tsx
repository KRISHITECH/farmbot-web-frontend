import * as React from "react";
import { Component } from "react";
import { StepParams } from "./index";
import { StepTitleBar } from "./step_title_bar";
import { Help, Select, BlurableInput } from "../../ui";
import { copy, remove, CustomOptionProps } from "./index";
import { MoveAbsState } from "../interfaces";
import { t } from "i18next";
import { updateMoveAbsStep } from "../actions";

export class TileMoveAbsolute extends Component<StepParams, MoveAbsState> {
    constructor() {
        super();
        this.update = this.update.bind(this);
        this.updateSelect = this.updateSelect.bind(this);
        // this.updateReducer = this.updateReducer.bind(this);
        this.state = {
            options: [{ label: "---", value: "---", x: 0, y: 0, z: 0 }],
            value: "---", x: 0, y: 0, z: 0, speed: 0
        };
    }

    componentDidMount() {
        let raw = this.props.step;

        if (raw.kind === "move_absolute") {
            let location = raw.args.location;
            let currSlot: { x?: number, y?: number, z?: number } = {};
            this.props.tools.tools.all.map(tool => {
                this.props.tools.tool_slots.map(slot => {
                    if (tool.id === slot.tool_id && this.state.options) {
                        if (location.kind === "tool" &&
                            location.args.tool_id === slot.tool_id) {
                            currSlot = slot;
                        }
                        this.state.options.push({
                            label: tool.name,
                            value: tool.id,
                            x: slot.x,
                            y: slot.y,
                            z: slot.z
                        });
                    }
                });
            });

            let { speed } = raw.args;
            switch (location.kind) {
                case "tool":
                    this.setState({
                        value: location.args.tool_id, speed,
                        x: currSlot.x, y: currSlot.y, z: currSlot.z
                    });
                    break;
                case "coordinate":
                    // CHRIS: This is a quick stub while I fix if_statement.
                    //          - Rick, 12/29/16
                    let wow = { ...location.args };
                    let ok = { ...this.state };
                    this.setState({
                        x: wow.x || ok.x,
                        y: wow.x || ok.y,
                        z: wow.z || ok.z,
                        speed
                    });
                    break;
                default:
                    throw new Error("Error getting node kind.");
            }
        } else {
            console.warn(`Expected a move_absolute block, but got ${raw.kind}`);
        }
    }

    // TODO: React-select anys
    updateSelect(event: any) {
        let { x, y, z, value } = event;
        this.setState({ x, y, z, value, options: this.state.options }, () => {
            this.props.dispatch(updateMoveAbsStep(this.state, this.props.index));
        });
    }

    update(event: React.SyntheticEvent<HTMLInputElement>) {
        let { name, value } = event.currentTarget;
        let state: { [name: string]: string | number } = {};
        state[name] = parseInt(value);
        this.setState(state, () => {
            this.props.dispatch(updateMoveAbsStep(this.state, this.props.index));
        });
    }

    render() {
        let { update, updateSelect } = this;
        let { index, dispatch, step } = this.props;
        let { options, value } = this.state;

        let raw = step as any;
        let args = raw.args.location.args;

        let optionComponent = (props: CustomOptionProps) => {
            let handleMouseDown = (e: React.SyntheticEvent<HTMLDivElement>) => {
                e.preventDefault();
                e.stopPropagation();
                props.onSelect(props.option, e);
            };

            let handleMouseEnter = (e: React.SyntheticEvent<HTMLDivElement>) => {
                props.onFocus(props.option, e);
            };

            let handleMouseMove = (e: React.SyntheticEvent<HTMLDivElement>) => {
                if (props.isFocused) { return; };
                props.onFocus(props.option, e);
            };

            let params = props.option.value === "---" ? "" :
                `(${props.option.x}, ${props.option.y}, ${props.option.z})`;

            return (
                <div className={props.className}
                    onMouseDown={handleMouseDown}
                    onMouseEnter={handleMouseEnter}
                    onMouseMove={handleMouseMove}>
                    {props.children}
                    <span className="Select-value-params">
                        {params}
                    </span>
                </div>
            );
        };

        let isTool = this.state.value !== "---";
        let x = this.state.x || "0";
        let y = this.state.y || "0";
        let z = this.state.z || "0";
        let speed = this.state.speed || "0";

        return <div>
            <div className="step-wrapper">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="step-header move-absolute-step">
                            <StepTitleBar index={index}
                                dispatch={dispatch}
                                step={step} />
                            <i className="fa fa-arrows-v step-control" />
                            <i className="fa fa-clone step-control"
                                onClick={() => copy({ dispatch, step })} />
                            <i className="fa fa-trash step-control"
                                onClick={() => remove({ dispatch, index })} />
                            <Help text={(`The Move Absolute step instructs
                                FarmBot to move to the specified coordinate
                                regardless of the current position. For example,
                                if FarmBot is currently at X=1000, Y=1000 and it
                                receives a Move Absolute where X=0 and Y=3000,
                                then FarmBot will move to X=0, Y=3000. If
                                FarmBot must move in multiple directions, it
                                will move diagonally. If you require straight
                                movements along one axis at a time, use multiple
                                Move Absolute steps. Coming soon: Offsets allow
                                you to more easily instruct FarmBot to move to a
                                location, but offset from it by the specified
                                amount. For example moving to just above where a
                                peripheral is located. Using offsets lets
                                FarmBot do the math for you.`)} />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="step-content move-absolute-step">
                            <div className="row">
                                <div className="col-md-12">
                                    <label>
                                        {t("Inherit coordinates from")}
                                    </label>
                                    <Select
                                        options={options}
                                        optionComponent={optionComponent}
                                        onChange={updateSelect}
                                        value={value}
                                        />
                                </div>
                                <div className="col-xs-3 col-md-3">
                                    <label>{t("X (mm)")}</label>
                                    <BlurableInput
                                        value={x.toString()}
                                        onCommit={update}
                                        type="number"
                                        name="x"
                                        disabled={isTool} />
                                </div>
                                <div className="col-xs-3 col-md-3">
                                    <label>{t("Y (mm)")}</label>
                                    <BlurableInput
                                        value={y.toString()}
                                        onCommit={update}
                                        type="number"
                                        name="y"
                                        disabled={isTool} />
                                </div>
                                <div className="col-xs-3 col-md-3">
                                    <label>{t("Z (mm)")}</label>
                                    <BlurableInput
                                        value={z.toString()}
                                        onCommit={update}
                                        type="number"
                                        name="z"
                                        disabled={isTool} />
                                </div>
                                <div className="col-xs-3 col-md-3">
                                    <label>{t("Speed")}</label>
                                    <BlurableInput
                                        onCommit={update}
                                        value={speed.toString()}
                                        type="number"
                                        name="speed" />
                                </div>
                                <div className="col-xs-3 col-md-3">
                                    <label>{t("X-Offset")}</label>
                                    <BlurableInput
                                        onCommit={update}
                                        value={raw.args.offset.args.x}
                                        type="number"
                                        name="offset-x" />
                                </div>
                                <div className="col-xs-3 col-md-3">
                                    <label>{t("Y-Offset")}</label>
                                    <BlurableInput
                                        onCommit={update}
                                        value={raw.args.offset.args.y}
                                        type="number"
                                        name="offset-y" />
                                </div>
                                <div className="col-xs-3 col-md-3">
                                    <label>{t("Z-Offset")}</label>
                                    <BlurableInput
                                        onCommit={update}
                                        value={raw.args.offset.args.z}
                                        type="number"
                                        name="offset-z" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    }
}
