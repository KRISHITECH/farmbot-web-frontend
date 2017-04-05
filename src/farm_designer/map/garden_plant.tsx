import * as React from "react";
import { DraggableSvgImage } from "../draggable_svg_image";
import { GardenPlantProps } from "../interfaces";
import { cachedIcon, DEFAULT_ICON } from "../../open_farm/index";

export class GardenPlant extends React.Component<GardenPlantProps,
 { icon: string }> {
  constructor() {
    super();
    this.state = { icon: DEFAULT_ICON };
  }

  componentDidMount() {
    cachedIcon(this.props.plant.body.openfarm_slug)
      .then((icon: string) => this.setState({ icon }));
  }

  render() {
    let { plant, onUpdate, onDrop } = this.props;
    if (plant.body.id) {
      return <g>
        <circle className="map-plant-spread"
          cx={plant.body.x}
          cy={plant.body.y}
          r={(plant.body.spread || 0) * 10 / 2} />
        <DraggableSvgImage key={plant.body.id}
          plant={plant}
          x={plant.body.x - plant.body.radius}
          y={plant.body.y - plant.body.radius}
          height={plant.body.radius * 2}
          width={plant.body.radius * 2}
          id={plant.body.id}
          onUpdate={onUpdate}
          onDrop={onDrop}
          href={this.state.icon} />
      </g>;
    } else {
      throw new Error("Save plants before placing them on the map");
    }
  }
}
