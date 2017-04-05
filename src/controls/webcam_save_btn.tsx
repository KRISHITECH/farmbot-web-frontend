import * as React from "react";
import { save as saveDevice } from "../devices/actions";
import { t } from "i18next";
import { WebcamSaveBtnProps } from "./interfaces";

export function WebcamSaveBtn({ dispatch, webcamUrl, updateState }:
  WebcamSaveBtnProps) {
  let save = (e: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(saveDevice({ webcam_url: webcamUrl }));
    updateState();
  };
  return <button type="button"
    className="green button-like"
    onClick={save}>
    {t("SAVE")}
  </button>;
}
