import * as React from "react";
import { selectSequence } from "./actions";
import { SequencesListProps } from "./interfaces";
import { t } from "i18next";
import { isMobile, randomColor, sortResourcesById } from "../util";
import { Link } from "react-router";
import { Widget, WidgetHeader, WidgetBody, Row, Col } from "../ui/index";
import { TaggedSequence } from "../resources/tagged_resources";
import { init } from "../api/crud";

let buttonList = (dispatch: Function) =>
  (ts: TaggedSequence, index: number) => {
    let css = ["block-wrapper",
      "block",
      "full-width",
      "text-left",
      `${ts.body.color || "purple"}-block`,
      "block-header"].join(" ");
    let click = () => { dispatch(selectSequence(ts.uuid)); };
    let name = ts.body.name + (ts.dirty ? "*" : "");
    let { uuid } = ts;
    if (isMobile()) {
      return <Link
        to={`/app/sequences/${ts.body.name.replace(" ", "_").toLowerCase()}`}
        key={uuid}
        onClick={click}
        className={css}>
        {name}
      </Link>;
    } else {
      return <button key={uuid}
        onClick={click}
        className={css}>
        {name}
        <i className="fa fa-pencil block-control" />
      </button>;
    }
  };

export class SequencesList extends React.Component<SequencesListProps, {}> {
  emptySequence = (): TaggedSequence => {
    return {
      kind: "sequences",
      uuid: "REDUCER_MUST_CHANGE_THIS",
      body: {
        name: "new sequence " + (this.props.sequences.length + 1),
        args: { version: -999 },
        color: "gray",
        kind: "sequence",
        body: []
      }
    }
  }

  render() {
    let { sequences, dispatch } = this.props;
    return <Widget className="sequence-list-widget">
      <WidgetHeader title="Sequences"
        helpText={`Here is the list of all of your sequences.
                   Click one to edit.`}>
        <button className="green button-like"
          onClick={() => dispatch(init(this.emptySequence()))}>
          {t("Add")}
        </button>
      </WidgetHeader>
      <WidgetBody>
        <Row>
          <Col xs={12}>
            {sortResourcesById(sequences).map(buttonList(dispatch))}
          </Col>
        </Row>
      </WidgetBody>
      <i className="fa fa-plus plus-button"
        onClick={() => console.log("TODO: dispatch(addSequence())")}></i>
    </Widget>;
  }
}
