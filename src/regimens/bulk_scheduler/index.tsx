import * as React from "react";
import { BulkEditorProps } from "./interfaces";
import { AddButton } from "./add_button";
import { SequenceList } from "./sequence_list";
import { TimeInput } from "./time_input";
import { WeekGrid } from "./week_grid";
import { commitBulkEditor } from "./actions";
import { Widget, WidgetHeader, WidgetBody, Row, Col } from "../../ui/index";

export function BulkSchedulerWidget(props: BulkEditorProps) {
  let click = function () { dispatch(commitBulkEditor()); };
  let { resources, dispatch, sequences, selectedSequence } = props;
  let active = !!(sequences && sequences.length);
  return <Widget className="bulk-scheduler-widget">
    <WidgetHeader title="Scheduler"
      helpText={`Use this tool to schedule sequences to run on one or many
                days of your regimen.`}>
      <AddButton active={active} click={click} />
    </WidgetHeader>
    <WidgetBody>
      <Row>
        <Col xs={6}>
          <SequenceList sequences={sequences}
            current={selectedSequence}
            dispatch={dispatch} />
        </Col>
        <Col xs={6}>
          <TimeInput dispatch={dispatch}
            offset={props.dailyOffsetMs} />
        </Col>
      </Row>
      <WeekGrid weeks={props.weeks}
        dispatch={dispatch} />
    </WidgetBody>
  </Widget>;
}
