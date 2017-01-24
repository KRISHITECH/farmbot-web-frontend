import * as React from "react";
import { Everything } from "../../interfaces";
import * as Snap from "snapsvg";
import { Plant, PlantOptions } from "../plant";
import { savePlant } from "../actions";
import { connect } from "react-redux";
import * as moment from "moment";

interface GardenMapProps extends Everything {
  params: {
    species: string;
  };
}

function fromScreenToGarden(mouseX: number, mouseY: number, boxX: number, boxY: number) {
  let rawX = mouseX - boxX;
  let rawY = mouseY - boxY;

  return { x: rawX, y: rawY };
}

@connect((state: Everything) => state)
export class GardenMap extends React.Component<GardenMapProps, {}> {
  handleDragOver(e: React.DragEvent<HTMLElement>) {
    // Perform drop availability here probably
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  handleDragEnter(e: React.DragEvent<HTMLElement>) {
    e.preventDefault();
  }

  findCrop(slug?: string) {
    let crops = this.props.designer.cropSearchResults;
    let crop = _(crops).find((result) => result.crop.slug === slug);
    return crop || {
      crop: {
        binomial_name: "binomial_name",
        common_names: "common_names",
        name: "name",
        row_spacing: "row_spacing",
        spread: "spread",
        description: "description",
        height: "height",
        processing_pictures: "processing_pictures",
        slug: "slug",
        sun_requirements: "sun_requirements"
      },
      image: "http://placehold.it/350x150"
    };
  }

  handleDrop(e: React.DragEvent<HTMLElement>) {
    e.preventDefault();

    let el = document.querySelector("#drop-area > svg");
    if (!el) {
      throw new Error("why");
    } else {
      let box = el.getBoundingClientRect();
      let p: PlantOptions = fromScreenToGarden(e.pageX, e.pageY, box.left, box.top);
      // TEMPORARY SOLUTION =======
      let OFEntry = this.findCrop(this.props.params.species);
      p.img_url = OFEntry.image;
      p.openfarm_slug = OFEntry.crop.slug;
      p.name = OFEntry.crop.name || "Mystery Crop";
      p.planted_at = moment().toISOString();
      // END TEMPORARY SOLUTION =======
      let plant = Plant(p);
      this.props.dispatch(savePlant(plant));
      this.renderPlants();
    }
  }

  renderPlants() {
    var s = Snap("#svg");

    let move = function (dx: number, dy: number) {
      this.attr({
        transform: this.data("origTransform") +
        (this.data("origTransform") ? "T" : "t") + [dx, dy]
      });
    };

    let start = function () {
      this.data("origTransform", this.transform().local);
    };

    let stop = function () {
      // this.props.dispatch(movePlant())
    };

    this.props.designer.plants.map(plant => {
      let plnt = s.image(plant.icon_url, plant.x, plant.y, 60, 60);
      plnt.attr({ "data-id": plant.id });
      plnt.drag(move, start, stop);
    });
  }

  componentDidMount() {
    this.renderPlants();
  }

  render() {
    return <div className="drop-area"
      id="drop-area"
      onDrop={this.handleDrop.bind(this)}
      onDragEnter={this.handleDragEnter}
      onDragOver={this.handleDragOver}>
      <svg id="svg"></svg>
    </div>;
  }
}
