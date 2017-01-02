import * as React from "react";
import { t } from "i18next";
import { BlurableInput, Widget, WidgetHeader, WidgetBody } from "../../ui";
import { DeleteAccountPropTypes } from "../interfaces";

export class DeleteAccount extends React.Component<DeleteAccountPropTypes, {}> {
    render() {
        let { set, deletion_confirmation } = this.props;
        return <Widget>
            <WidgetHeader title="Delete Account" />
            <WidgetBody>
                <div>
                    WARNING! Deleting your account will permanently delete
                        all of your Sequences , Regimens, Events, and Farm
                        Designer data. Upon deleting your account, FarmBot will
                        cease to function and become inaccessible until it is
                        paired with another web app account. To do this, you
                        will need to reboot your FarmBot so that is goes back
                        into configuration mode for pairing with another user
                        account. When this happens, all of the data on your
                        FarmBot will be overwritten with the new account's data.
                        If the account is brand new, then FarmBot will become a
                        blank slate.
                        <br /><br />
                    If you are sure you want to delete your account, type in
                        your password below to continue.
                        <br /><br />
                </div>
                <form>
                    <label className="md-5">
                        {t("Enter Password")}
                    </label>
                    <BlurableInput
                        onCommit={set}
                        name="deletion_confirmation"
                        allowEmpty={true}
                        value={deletion_confirmation || ""}
                        type="password" />
                    <button onClick={this.props.save}
                        className="red button-like"
                        type="button">
                        {t("DELETE ACCOUNT")}
                    </button>
                </form>
            </WidgetBody>
        </Widget>;
    }
}
