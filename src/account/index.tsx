import * as React from "react";
import { connect } from "react-redux";
import { Everything } from "../interfaces";
import { updateUser, deleteUser } from "./actions";
import { Settings, DeleteAccount, ChangePassword } from "./components";
import { UserAccountUpdate } from "./interfaces";
import { Page, Row, Col } from "../ui";

@connect((state: Everything) => state)
export class Account extends React.Component<Everything, UserAccountUpdate> {
  constructor(props: Everything) {
    super();
    this.state = {};
  }

  componentDidMount() {
    if (this.props.auth) {
      let { name, email } = this.props.auth.user;
      this.setState({ name, email });
    }
  }

  set(event: React.FormEvent<HTMLInputElement>) {
    let { name, value } = event.currentTarget;
    this.setState({ [name]: value });
  }

  saveUser() {
    this.props.dispatch(updateUser(this.state));
  }

  savePassword() {
    this
      .props
      .dispatch(updateUser(this.state));

    this.setState({
      password: "",
      new_password: "",
      new_password_confirmation: ""
    });
  }

  // Hear ye, hear ye!
  enactDeletion() {
    let password = this.state.deletion_confirmation || "NEVER SET";
    this.props.dispatch(deleteUser({ password }));
  }

  render() {
    return (
      <Page className="account">
        <Col sm={8} smOffset={2}>
          <Row>
            <Settings name={this.state.name || ""}
              email={this.state.email || ""}
              set={this.set.bind(this)}
              save={this.saveUser.bind(this)} />
          </Row>
          <Row>
            <ChangePassword
              password={this.state.password || ""}
              new_password={this.state.new_password || ""}
              new_password_confirmation=
              {this.state.new_password_confirmation || ""}
              set={this.set.bind(this)}
              save={this.savePassword.bind(this)} />
          </Row>
          <Row>
            <DeleteAccount
              deletion_confirmation=
              {this.state.deletion_confirmation || ""}
              set={this.set.bind(this)}
              save={this.enactDeletion.bind(this)} />
          </Row>
        </Col>
      </Page>
    );
  }
}
