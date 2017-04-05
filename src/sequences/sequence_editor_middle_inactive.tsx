import * as React from "react";
import { SequenceEditorMiddleProps } from "./interfaces";
import { Widget, WidgetHeader, BlurableInput, WidgetBody, Row, Col } from "../ui/index";

export class SequenceEditorMiddleInactive extends React.Component<{}, {}> {
  render() {

    return <Widget className="sequence-editor-widget">
      <WidgetHeader title="Sequence Editor"
        helpText={`Drag and drop commands here to create
                    sequences for watering, planting seeds,
                    measuring soil properties, and more. Press the
                    Test button to immediately try your sequence
                    with FarmBot. You can also edit, copy, and delete
                    existing sequences; assign a color; and give
                    your commands custom names.`}>
      </WidgetHeader>
      <WidgetBody>
        <Row>
          <Col xs={12}>
            <p>No sequence selected.</p>
          </Col>
        </Row>
      </WidgetBody>
    </Widget>;
  }
}
