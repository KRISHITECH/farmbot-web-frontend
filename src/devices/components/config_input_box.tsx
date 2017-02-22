import * as React from "react";
import { BotState } from "../interfaces";
import { safeStringFetch } from "../../util";
import { changeConfigBuffer } from "../actions";

interface Props {
    bot: BotState;
    setting: string;
    dispatch: Function;
}

export class ConfigInputBox extends React.Component<Props, {}> {
    primary() {
        let { bot, setting} = this.props;
        return safeStringFetch(bot.configBuffer, setting);
    }
    secondary() {
        let { bot, setting} = this.props;
        return safeStringFetch(bot.hardware.configuration, setting);
    }

    style() {
        return {
            border: (this.primary()) ? "1px solid red" : ""
        };
    }

    change(key: string, dispatch: Function) {
        return function (event: React.FormEvent<HTMLInputElement>) {
            let formInput = event.currentTarget.value;
            dispatch(changeConfigBuffer({ [key]: Number(formInput) }));
        };
    }

    render() {
        return (
            <td>
                <input type="text"
                    style={this.style()}
                    onChange={this.change(this.props.setting,
                        this.props.dispatch)}
                    value={this.primary() || this.secondary() || "---"} />
            </td>);
    }
}
