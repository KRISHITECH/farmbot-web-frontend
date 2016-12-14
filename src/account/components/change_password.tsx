import * as React from "react";
import { t } from "i18next";
import { BlurableInput, Row, Widget, WidgetHeader, WidgetBody } from "../../ui";
import { ChangePwPropTypes } from "../interfaces";

export class ChangePassword extends React.Component<ChangePwPropTypes, {}> {
    render() {
        let { set, save, password, new_password } = this.props;
        let npc = this.props.new_password_confirmation;
        let npcString = "new_password_confirmation";
        return <Row>
            <Widget>
                <WidgetHeader title="Change Password">
                    <button onClick={save}
                        className="green button-like"
                        type="button">
                        {t("SAVE")}
                    </button>
                </WidgetHeader>
                <WidgetBody>
                    <form>
                        <Row>
                            <label className="md-3">
                                {t("Old Password")}
                            </label>
                            <BlurableInput
                                allowEmpty={true}
                                onCommit={set}
                                name="password"
                                value={password || ""}
                                type="password"
                                />
                        </Row>
                        <Row>
                            <label className="md-3">
                                {t("New Password")}
                            </label>
                            <BlurableInput
                                allowEmpty={true}
                                onCommit={set}
                                name="new_password"
                                value={new_password || ""}
                                type="password"
                                />
                        </Row>
                        <Row>
                            <label className="md-3">
                                {t("New Password")}
                            </label>
                            <BlurableInput
                                allowEmpty={true}
                                onCommit={set}
                                name={npcString}
                                value={npc || ""}
                                type="password"
                                />
                        </Row>
                    </form>
                </WidgetBody>
            </Widget>
        </Row>;
    }
}
