import * as React from "react";
import { t } from "i18next";
import { devices } from "../../device";
type Axis = "x" | "y" | "z" | "all";

function calibrate(axis: Axis) {
  devices
    .current
    .calibrate({ axis });
}

interface CalibrationButtonProps {
  axis: Axis;
}
export function CalibrationButton({ axis }: CalibrationButtonProps) {
  return <button type="button"
    className="button-like yellow"
    onClick={() => calibrate(axis)}>
    {t("CALIBRATE {{axis}}", { axis })}
  </button>;
};
