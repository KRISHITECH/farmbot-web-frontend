import * as React from "react";
import { GardenPointProps } from "../interfaces";
import { defensiveClone } from "../../util";

const POINT_STYLES = {
  stroke: "green",
  strokeOpacity: 0.3,
  strokeWidth: "2",
  fill: "none",
};

export function GardenPoint(props: GardenPointProps) {
  let { point } = props;
  let styles = defensiveClone(POINT_STYLES);
  styles.stroke = point.body.meta.color || "green";
  return <g>
    <circle cx={point.body.x}
      cy={point.body.y}
      r={point.body.radius}
      {...styles} />
    <circle cx={point.body.x}
      cy={point.body.y}
      r={2}
      {...styles} />
  </g>;
}
