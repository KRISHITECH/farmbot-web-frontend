import * as React from "react";
import { t } from "i18next";
import { BlurableInput, Row, Widget, WidgetHeader, WidgetBody } from "../../ui";
import { SettingsPropTypes } from "../interfaces";

export class Settings extends React.Component<SettingsPropTypes, {}> {
    render() {
        let { name, email, set, save } = this.props;
        return <Row>
            <Widget>
                <WidgetHeader title="Account Settings">
                    <button
                        className="green button-like"
                        type="button"
                        onClick={save}>
                        {t("SAVE")}
                    </button>
                </WidgetHeader>
                <WidgetBody>
                    <form>
                        <Row>
                            <label className="md-3">
                                {t("Your Name")}
                            </label>
                            <BlurableInput
                                onCommit={set}
                                name="name"
                                value={name || ""}
                                type="text"
                                />
                        </Row>
                        <Row>
                            <label className="md-3">
                                {t("Email")}
                            </label>
                            <BlurableInput
                                onCommit={set}
                                name="email"
                                value={email || ""}
                                type="email"
                                />
                        </Row>
                    </form>
                </WidgetBody>
            </Widget>
        </Row>;
    }
}
