import * as React from "react";
import { Pin, Pins } from "farmbot";
import { Everything } from "../../interfaces";
import { TitleBar } from "./title_bar";
import { PeripheralItem } from "./peripheral_item";
import { Peripheral } from "./interfaces";
import { PeripheralForm } from "./peripheral_form";

export class Peripherals extends React.Component<Everything, {}> {
    getPin(p: Peripheral, pins: Pins): Pin {
        let pin = pins[p.pin];
        if (pin) {
            return pin;
        } else {
            return {
                mode: 0,
                value: -1
            };
        }
    }

    peripherals() {
        let { peripherals } = this.props;
        let pins = this.props.bot.hardware.pins;
        let all = this
            .props
            .peripherals
            .all;
        if (!all.length && peripherals.editorMode === "controlling") {
            return [
                <p key="foo">Click "Edit" to add new peripherals.</p>
            ];
        };
        return all
            .map((p, i) => {
                return <PeripheralItem key={i}
                    dispatch={this.props.dispatch}
                    index={i}
                    pin={this.getPin(p, pins)}
                    peripheral={p}
                    editorMode={this.props.peripherals.editorMode} />;
            });
    }
    render() {
        return (<div>
            <TitleBar {...this.props.peripherals}
                dispatch={this.props.dispatch} />
            <div className="col-sm-12">
                <div className="widget-content">
                    {this.peripherals.call(this)}
                    <PeripheralForm dispatch={this.props.dispatch}
                        editorMode={this.props.peripherals.editorMode} />
                </div>
            </div></div>);
    };
}