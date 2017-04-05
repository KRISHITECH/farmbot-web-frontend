import * as React from "react";
import { t } from "i18next";
import { devices } from "../../device";
import { CalibrationButtonProps, Axis } from "../interfaces";

function calibrate(axis: Axis) {
  devices
    .current
    .calibrate({ axis });
}

export function CalibrationButton({ axis }: CalibrationButtonProps) {
  return <button type="button"
    className="button-like yellow"
    onClick={() => calibrate(axis)}>
    {t("CALIBRATE {{axis}}", { axis })}
  </button>;
};

export function CalibrationRow() {
  return <tr>
    <td>
      <label>{t("CALIBRATION")}</label>
    </td>
    <td>
      <CalibrationButton axis="x" />
    </td>
    <td>
      <CalibrationButton axis="y" />
    </td>
    <td>
      <CalibrationButton axis="z" />
    </td>
  </tr>;
}
