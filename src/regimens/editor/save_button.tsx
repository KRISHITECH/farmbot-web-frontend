import * as React from "react";
import { saveRegimen } from "../actions";
import { t } from "i18next";
import { RegimenProps } from "../interfaces";

function save({ regimen, dispatch }: RegimenProps) {
  if (regimen) {
    return (event: React.FormEvent<{}>) => { dispatch(saveRegimen(regimen.uuid)); };
  } else {
    throw new Error("Tried to save regimen, but there was no regimen.");
  };
}

export function SaveButton({ regimen, dispatch }: RegimenProps) {
  if (regimen) {
    return <button className="green button-like"
      onClick={save({ dispatch, regimen })}>
      {t("Save") + (regimen.dirty ? "*" : "")}
    </button>;
  } else {
    return <span />;
  };
}
