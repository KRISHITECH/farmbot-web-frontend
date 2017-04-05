import * as React from "react";
import { RegimenNameInput } from "./regimen_name_input";
import { ActiveEditorProps } from "./interfaces";
import { t } from "i18next";
import { RegimenItem } from "../interfaces";
import { TaggedRegimen } from "../../resources/tagged_resources";
import { defensiveClone } from "../../util";
import { overwrite } from "../../api/crud";

/** The bottom half of the regimen editor panel (when there's something to
    actually edit). */
export function ActiveEditor(props: ActiveEditorProps) {
  return <div>
    <RegimenNameInput regimen={props.regimen} dispatch={props.dispatch} />
    <div>
      <hr />
      {props.calendar.map(function (group, index) {
        return <div className="regimen-day">
          <label> {t("Day {{day}}", { day: group.day })} </label>
          {group.items.map(function (row, index) {
            let { item, regimen } = row;
            let click = () => props.dispatch(removeRegimenItem(item, regimen));
            let klass = `${row.color}-block block-header regimen-event`
            return <div className={klass}>
              <span className="regimen-event-title">{row.name}</span>
              <span className="regimen-event-time">{row.hhmm}</span>
              <i className="fa fa-trash regimen-control" onClick={click} />
            </div>;
          })}
        </div>;
      })}
    </div>
  </div>;
}

function removeRegimenItem(item: RegimenItem, r: TaggedRegimen) {
  let copy = defensiveClone(r);
  copy.body.regimen_items = r.body.regimen_items.filter(x => x !== item);
  return overwrite(r, copy.body);
}
