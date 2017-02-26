import * as React from "react";
import { selectSequence, addSequence } from "./actions";
import { Sequence, SequencesListProps } from "./interfaces";
import { t } from "i18next";
import { connect } from "react-redux";
import { Everything } from "../interfaces";
import { isMobile } from "../util";
import { Link } from "react-router";

let buttonList = (dispatch: Function) => (seq: Sequence, index: number) => {
  let css = ["block-wrapper",
    "block",
    "full-width",
    "text-left",
    `${seq.color || "purple"}-block`,
    "block-header"];
  let click = () => { dispatch(selectSequence(index)); };
  if (!isMobile()) {
    return <button key={seq.id || index}
      onClick={click}
      className={css.join(" ")}>
      {seq.name + (seq.dirty ? "*" : "")}
      <i className="fa fa-pencil block-control" />
    </button>;
  } else {
    return <Link
      to={`/app/sequences/${seq.name.replace(" ", "_").toLowerCase()}`}
      key={seq.id || index}
      onClick={click}
      className={css.join(" ")}>
      {seq.name + (seq.dirty ? "*" : "")}
    </Link>;
  }
};

@connect((state: Everything) => state)
export class SequencesList extends React.Component<SequencesListProps, {}> {
  render() {
    let { sequences, dispatch } = this.props;
    return <div>
      <div className="widget-wrapper sequences-widget">
        <div className="row">
          <div className="col-sm-12">
            <button className="green button-like widget-control"
              onClick={() => dispatch(addSequence())}>
              {t("Add")}
            </button>
            <div className="widget-header">
              <h5>{t("Sequences")}</h5>
              <i className="fa fa-question-circle widget-help-icon">
                <div className="widget-help-text">
                  {t(`Here is the list of all of your sequences.
                  Click one to edit.`)}
                </div>
              </i>
            </div>
          </div>
        </div>
        <div className="widget-content no-bottom-padding">
          <div className="row">
            <div className="col-sm-12">
              <div>
                {sequences.all.map(buttonList(dispatch))}
              </div>
            </div>
          </div>
        </div>
        <i className="fa fa-plus plus-button"
          onClick={() => dispatch(addSequence())}></i>
      </div>
    </div>;
  }
}
