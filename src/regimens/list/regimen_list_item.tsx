import * as React from "react";
import { RegimenListItemProps } from "../interfaces";
import { randomColor, isMobile, fancyDebug } from "../../util";
import { selectRegimen } from "../actions";
import { Link } from "react-router";
import { TaggedRegimen, isTaggedRegimen } from "../../resources/tagged_resources";

export function RegimenListItem({
  regimen,
  dispatch,
  index
}: RegimenListItemProps) {
  let color = (regimen.body.color) || "gray";
  let style = `block block-wrapper full-width text-left ${color}-block
        block-header`;
  let dirty = (regimen.dirty) ? "*" : "";
  let name = (regimen.body.name || "-") + dirty;
  let key = regimen.uuid;
  let link = (regimen.body.name) ?
    regimen.body.name.replace(/ /g, "_").toLowerCase() : "-";
  if (isMobile()) {
    return <Link
      to={`/app/regimens/${link}`}
      key={key}
      onClick={select(dispatch, regimen)}
      className={style}>
      {name}
    </Link>;
  } else {
    return <button className={style}
      onClick={select(dispatch, regimen)}>
      {name}{dirty}
      <i className="fa fa-pencil block-control" />
    </button>;
  }
}

function select(dispatch: Function, regimen: TaggedRegimen) {
  return function (event: React.MouseEvent<{}>) {
    if (regimen && isTaggedRegimen(regimen)) {
      dispatch(selectRegimen(regimen));
    } else {
      console.warn("No regimen ??")
    }
  };
}
