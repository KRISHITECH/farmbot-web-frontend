import * as React from "react";
import { CeleryNode as Step } from "../corpus";
import { addComment } from "../actions";

interface StepTitleBarProps {
  step: Step;
  index: number;
  dispatch: Function;
}

export class StepTitleBar extends React.Component<StepTitleBarProps, {}> {

  onChange(e: React.FormEvent<HTMLInputElement>) {
    let target = e.currentTarget;
    let { step, index, dispatch } = this.props;
    dispatch(addComment(step, index, target.value));
  }

  render() {
    return <input className="step-label"
      value={this.props.step.comment || ""}
      placeholder={this.props.step.kind}
      onChange={this.onChange.bind(this)} />;
  };
};
