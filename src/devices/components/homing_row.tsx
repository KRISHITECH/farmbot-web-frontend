import * as React from "react";
import { t } from "i18next";
import { devices } from "../../device";
import { CalibrationButtonProps, Axis } from "../interfaces";
import { Farmbot } from "farmbot/dist";

const speed = Farmbot.defaults.speed;
let calibrate = (axis: Axis) => devices.current.home({ speed, axis });

export function HomingButton({ axis }: CalibrationButtonProps) {
  return <button type="button"
    className="button-like yellow"
    onClick={() => calibrate(axis)}>
    {t("HOME {{axis}}", { axis })}
  </button>;
};

export function HomingRow() {
  return <tr>
    <td>
      <label>{t("HOMING")}</label>
    </td>
    <td>
      <HomingButton axis="x" />
    </td>
    <td>
      <HomingButton axis="y" />
    </td>
    <td>
      <HomingButton axis="z" />
    </td>
  </tr>;
}
