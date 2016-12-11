import * as React from "react";
import { t } from "i18next";
import { BlurableInput, Row } from "../../ui";
import { ChangePwPropTypes } from "../interfaces";

export class ChangePassword extends React.Component<ChangePwPropTypes, {}> {
    render() {
        let { set, save, password, new_password } = this.props;
        let npc = this.props.new_password_confirmation;
        let npcString = "new_password_confirmation";
        return <Row>
            <div className={`col-xs-12 col-sm-10 col-sm-offset-1 col-md-6
                    col-md-offset-3`}>
                <div className="widget-wrapper">
                    <Row>
                        <div className="col-sm-12">
                            <button onClick={save}
                                className="green button-like widget-control"
                                type="button">{t("SAVE")}</button>
                            <div className="widget-header">
                                <h5>{t("Change Password")}</h5>
                            </div>
                        </div>
                    </Row>
                    <Row>
                        <form>
                            <div className="col-sm-12">
                                <div className="widget-content">
                                    <div className="form-group row">
                                        <label className="col-sm-4">
                                            {t("Old Password")}
                                        </label>
                                        <div className="col-sm-8">
                                            <BlurableInput
                                                allowEmpty={true}
                                                onCommit={set}
                                                name="password"
                                                value={password || ""}
                                                type="password"
                                                />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4">
                                            {t("New Password")}
                                        </label>
                                        <div className="col-sm-8">
                                            <BlurableInput
                                                allowEmpty={true}
                                                onCommit={set}
                                                name="new_password"
                                                value={new_password || ""}
                                                type="password"
                                                />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4">
                                            {t("New Password")}
                                        </label>
                                        <div className="col-sm-8">
                                            <BlurableInput
                                                allowEmpty={true}
                                                onCommit={set}
                                                name={npcString}
                                                value={npc || ""}
                                                type="password"
                                                />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Row>
                </div>
            </div>
        </Row>;
    }
}
