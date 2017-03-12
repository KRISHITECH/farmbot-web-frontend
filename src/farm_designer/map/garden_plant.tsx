import * as React from "react";
import { DraggableSvgImage } from "../draggable_svg_image";
import { Plant } from "../interfaces";
import * as Axios from "axios";
import { cachedIcon, DEFAULT_ICON } from "../../open_farm/index";

interface Props {
  plant: Plant;
  onUpdate: (deltaX: number, deltaY: number, idx: number) => void;
  onDrop: (id: number) => void;
}

export class GardenPlant extends React.Component<Props, { icon: string }> {
  constructor() {
    super();
    this.state = {
      icon: DEFAULT_ICON
    };
  }

  componentDidMount() {
    cachedIcon(this.props.plant.openfarm_slug)
      .then((icon: string) => this.setState({ icon }));
  }
  render() {
    let { plant, onUpdate, onDrop } = this.props;
    if (plant.id) {
      return <DraggableSvgImage key={plant.id}
        x={plant.x}
        y={plant.y}
        // 1px = 1mm, 1mm = 1cm
        // height={(plant.spread && plant.spread * 10) || 50}
        // width={(plant.spread && plant.spread * 10) || 50}
        height={50}
        width={50}
        id={plant.id}
        onUpdate={onUpdate}
        onDrop={onDrop}
        href={this.state.icon} />;
    } else {
      throw new Error("Save plants before placing them on the map");
    }
  }
}
