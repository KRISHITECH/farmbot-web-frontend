import * as React from "react";
import { selectSequence, addSequence } from "./actions";
import { SequenceReducerState } from "./interfaces";
import { Sequence } from "./interfaces";
import { AuthState } from "../auth/interfaces";
import { t } from "i18next";

let buttonList = (dispatch: Function) => (seq: Sequence, index: number) => {
  let css = ["block-wrapper",
    "block",
    "full-width",
    "text-left",
    `${seq.color || "purple"}-block`,
    "block-header"];
  let click = () => { dispatch(selectSequence(index)); };
  return <button key={seq.id || index}
    onClick={click}
    className={css.join(" ")}>
    {seq.name + (seq.dirty ? "*" : "")}
    <i className="fa fa-pencil block-control" />
  </button>;
};

interface SequencesListProps {
  sequences: SequenceReducerState;
  dispatch: Function;
  auth: AuthState;
}

export function SequencesList({sequences, dispatch}: SequencesListProps) {
  return (<div>
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
    </div>
  </div>);
}
