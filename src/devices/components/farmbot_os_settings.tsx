import * as React from "react";
import { t } from "i18next";
import { BotState } from "../interfaces";
import { AuthState } from "../../auth/interfaces";
import {
    changeDevice,
    addDevice,
    saveAccountChanges,
    reboot,
    powerOff,
    factoryReset
} from "../actions";
import { FwUpdateButton } from "./fw_update_button";
import { OsUpdateButton } from "./os_update_button";

interface Props {
    bot: BotState;
    auth: AuthState;
    dispatch: Function;
}

export class FarmbotOsSettings extends React.Component<Props, {}> {
    changeBot(e: React.MouseEvent<HTMLInputElement>) {
        e.preventDefault();
        console.warn("If you are reading this method, refactor NOW! -RC");
        let updates =
            _.object([[e.currentTarget.name, e.currentTarget.value]]);
        this.props.dispatch(changeDevice(updates));
    }

    saveBot(e: React.MouseEvent<{}>) {
        e.preventDefault();
        let form = this.props.bot.account;
        this.props.dispatch(addDevice(form));
    }


    updateBot(e: React.MouseEvent<{}>) {
        this.props.dispatch(saveAccountChanges);
    }


    render() {
        return <div className="col-sm-12">
            <form onSubmit={this.saveBot.bind(this)}>
                <div className="row">
                    <div className="col-sm-12">
                        <button type="submit"
                            className={`button-like green widget-control`}
                            onClick={this.updateBot
                                .bind(this)}>
                            {t("SAVE")} {
                                this.props.bot.account
                                    .dirty ? "*" : ""}
                        </button>
                        <div className="widget-header">
                            <h5>{t("DEVICE")}</h5>
                            <i className={`fa 
                            fa-question-circle widget-help-icon`}>
                                <div className={`widget-help-text`}>
                                    {t(`This widget shows device information.`)}
                                </div>
                            </i>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="widget-content">
                            <table className="plain">
                                <tbody>
                                    <tr>
                                        <td>
                                            <label>
                                                {t("NAME")}
                                            </label>
                                        </td>
                                        <td colSpan={2}>
                                            <input name="name"
                                                onChange={this.changeBot.bind(this)}
                                                value={this.props.bot.account.name} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label>{t("NETWORK")}</label>
                                        </td>
                                        <td colSpan={2}>
                                            <p> {`mqtt://${this.props.auth.token.unencoded.mqtt}`} </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label>{t("CONTROLLER")}</label>
                                        </td>
                                        <td className="devices-pad">
                                            <p>
                                                {t("Version")} {String(this.props.bot.hardware
                                                    .informational_settings.controller_version)
                                                    || t("Not Connected to bot")}
                                            </p>
                                            <OsUpdateButton { ...this.props } />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label>{t("FIRMWARE")}</label>
                                        </td>
                                        <td className="devices-pad">
                                            <p>
                                                {t("Version")} {
                                                    String(this.props.bot.hardware.mcu_params.param_version)
                                                    || t("Not Connected to bot")
                                                }
                                            </p>
                                            <FwUpdateButton { ...this.props } />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label>{t("RESTART FARMBOT")} </label>
                                        </td>
                                        <td>
                                            <p>
                                                {t(`This will restart FarmBot's Raspberry
                                            Pi and controller software.`)}
                                            </p>
                                        </td>
                                        <td>
                                            <button type="button"
                                                className="button-like yellow"
                                                onClick={reboot}>
                                                {t("RESTART")}
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label>{t("SHUTDOWN FARMBOT")}</label>
                                        </td>
                                        <td>
                                            <p>
                                                {t(`This will shutdown FarmBot's Raspberry Pi.
                                              To turn it back on, unplug FarmBot
                                              and plug it back in.`)}
                                            </p>
                                        </td>
                                        <td>
                                            <button type="button"
                                                className="button-like red"
                                                onClick={powerOff} >
                                                {t("SHUTDOWN")}
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label>{t("Factory Reset")}</label>
                                        </td>
                                        <td>
                                            <p>
                                                {t(`
Factory resetting your FarmBot will destroy all data on the device, revoking your FarmBot's abilily to connect to your web app account and your home wifi. Upon factory resetting, your device will restart into Conflgurator mode. Factory resetting your FarmBot will not affect any data or settings from your web app account, allowing you to do a complete restore to your device once it is back online and paired with your web app account.`)}
                                            </p>
                                        </td>
                                        <td>
                                            <button type="button"
                                                className="button-like red"
                                                onClick={factoryReset} >
                                                {t("RESET")}
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </form>
        </div>;
    }
}