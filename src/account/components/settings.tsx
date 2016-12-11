import * as React from "react";
import { t } from "i18next";
import { BlurableInput, Row } from "../../ui";
import { SettingsPropTypes } from "../interfaces";

export class Settings extends React.Component<SettingsPropTypes, {}> {
    render() {
        let { name, email, set, save } = this.props;
        return <Row>
            <div className={`col-xs-12 col-sm-10 col-sm-offset-1
                        col-md-6 col-md-offset-3`}>
                <div className="widget-wrapper">
                    <Row>
                        <div className="col-sm-12">
                            <button
                                className="green button-like widget-control"
                                type="button"
                                onClick={save}>
                                {t("SAVE")}
                            </button>
                            <div className="widget-header">
                                <h5>{t("Account Settings")}</h5>
                            </div>
                        </div>
                    </Row>
                    <Row>
                        <form>
                            <div className="col-sm-12">
                                <div className="widget-content">
                                    <div className="form-group row">
                                        <label className="col-sm-4">
                                            {t("Your Name")}
                                        </label>
                                        <div className="col-sm-8">
                                            <BlurableInput
                                                onCommit={set}
                                                name="name"
                                                value={name || ""}
                                                type="text"
                                                />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-4">
                                            {t("Email")}
                                        </label>
                                        <div className="col-sm-8">
                                            <BlurableInput
                                                onCommit={set}
                                                name="email"
                                                value={email || ""}
                                                type="email"
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
