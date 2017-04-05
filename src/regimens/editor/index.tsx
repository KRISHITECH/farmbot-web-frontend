import * as React from "react";
import { SaveButton } from "./save_button";
import { DeleteButton } from "./delete_button";
import { CopyButton } from "./copy_button";
import { EmptyEditor } from "./empty_editor";
import { ActiveEditor } from "./active_editor";
import { RegimenEditorWidgetProps } from "./interfaces";
import { Widget, WidgetHeader, WidgetBody } from "../../ui/index";
import { isTaggedRegimen, TaggedRegimen } from "../../resources/tagged_resources";
import { CalendarRow } from "../interfaces";

interface MiddleSectionProps {
  regimen: TaggedRegimen | undefined;
  calendar: CalendarRow[];
  dispatch: Function;
}

function MiddleSection({
  regimen,
  dispatch,
  calendar
}: MiddleSectionProps) {

  if (regimen && isTaggedRegimen(regimen) && calendar) {
    return <ActiveEditor dispatch={dispatch}
      regimen={regimen}
      calendar={calendar} />;
  } else {
    return <EmptyEditor />;
  }
}
export function RegimenEditorWidget({ current, dispatch, auth, calendar }:
  RegimenEditorWidgetProps) {
  if (auth) {
    let regimen = current;
    let saveButtonProps = {
      dispatch,
      regimen,
      token: auth.token,
      baseUrl: (auth.token && auth.token.unencoded.iss) ||
      "CANT_FETCH_TOKEN_ISS"
    };

    return <Widget className="regimen-editor-widget">
      <WidgetHeader title="Regimen Editor"
        helpText={`Regimens allow FarmBot
                to take care of a plant throughout its entire life. A
                regimen consists of many sequences that are scheduled to run
                based on the age of the plant. Regimens are applied to
                plants from the farm designer (coming soon) and can be
                re-used on many plants growing at the same or different
                times. Multiple regimens can be applied to any one plant.`}>
        <SaveButton regimen={regimen} dispatch={dispatch} />
        <CopyButton regimen={regimen} dispatch={dispatch} />
        <DeleteButton {...saveButtonProps} />
      </WidgetHeader>
      <WidgetBody>
        <MiddleSection
          regimen={regimen}
          dispatch={dispatch}
          calendar={calendar} />
      </WidgetBody>
    </Widget>;
  } else {
    throw new Error("Must log in first");
  }
}
