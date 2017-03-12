import * as React from "react";
import { Point } from "../interfaces";
import { defensiveClone } from "../../util";

const POINT_STYLES = {
  stroke: "green",
  strokeOpacity: 0.3,
  strokeWidth: "2",
  fill: "none",
};

interface Props {
  point: Point;
}

export function GardenPoint(props: Props) {
  let { point } = props;
  let styles = defensiveClone(POINT_STYLES);
  styles.stroke = point.meta.color || "green";
  return <g>
    <circle cx={point.x}
      cy={point.y}
      r={point.radius}
      {...styles} />
    <circle cx={point.x}
      cy={point.y}
      r={2}
      {...styles} />
  </g>;
}
