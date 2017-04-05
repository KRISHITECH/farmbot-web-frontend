import * as React from "react";
import { t } from "i18next";
import { AddRegimenProps } from "../interfaces";
import { newRegimen } from "../actions";

export function AddRegimen(props: AddRegimenProps) {
  props.className ? props.className : "";
  let classes = "green button-like " + props.className;
  let { dispatch } = props;
  return <button className={classes}
    onClick={() => dispatch(newRegimen())}>
    {props.children || t("Add")}
  </button>;
}

