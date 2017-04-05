import * as React from "react";
import { Plant } from "../plant";
import { movePlant } from "../actions";
import * as moment from "moment";
import { GardenMapProps, GardenMapState } from "../interfaces";
import { GardenPlant } from "./garden_plant";
import { GardenPoint } from "./garden_point";
import { Link } from "react-router";
import { history } from "../../history";
import { initSave, save } from "../../api/crud";
import { TaggedPlant } from "../../resources/tagged_resources";

function fromScreenToGarden(mouseX: number, mouseY: number, boxX: number, boxY: number) {
  /** The offset of 50px is made for the setDragImage to make it in the
   * center of the mouse for accuracy which is why this is being done.
   * Once we get more dynamic with the values (different size plants),
   * we can tweak this accordingly.
   */
  let newMouseX = mouseX - 25;
  let newMouseY = mouseY - 25;
  /* */

  let rawX = newMouseX - boxX;
  let rawY = newMouseY - boxY;

  return { x: rawX, y: rawY };
}

export class GardenMap extends React.Component<GardenMapProps, GardenMapState> {
  state = { activePlant: undefined, tempX: undefined, tempY: undefined };

  handleDragOver(e: React.DragEvent<HTMLElement>) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  handleDragEnter(e: React.DragEvent<HTMLElement>) {
    e.preventDefault();
  }

  findCrop(slug?: string) {
    let crops = this.props.designer.cropSearchResults || [];
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
    if (el) {
      let box = el.getBoundingClientRect();
      let { x, y } = fromScreenToGarden(e.pageX, e.pageY, box.left, box.top);
      let species = history.getCurrentLocation().pathname.split("/")[5];
      let OFEntry = this.findCrop(species);
      let p: TaggedPlant = {
        kind: "plants",
        uuid: "--never",
        dirty: true,
        body: Plant({
          x,
          y,
          openfarm_slug: OFEntry.crop.slug,
          name: OFEntry.crop.name || "Mystery Crop",
          planted_at: moment().toISOString(),
          spread: OFEntry.crop.spread,
        })
      }
      this.props.dispatch(initSave(p));
    } else {
      throw new Error("never");
    }
  }

  render() {
    let { dispatch } = this.props;
    let updater = (plant: TaggedPlant) => (deltaX: number, deltaY: number) => {
      dispatch(movePlant({ deltaX, deltaY, plant }));
    };

    let dropper = (p: TaggedPlant) => () => dispatch(save(p.uuid));

    return <div className="drop-area"
      id="drop-area"
      onDrop={this.handleDrop.bind(this)}
      onDragEnter={this.handleDragEnter.bind(this)}
      onDragOver={this.handleDragOver.bind(this)}>
      <svg id="svg">
        {this.props.points.map(function (p) {
          return <GardenPoint point={p} key={p.body.id} />;
        })}
        {
          this
            .props
            .plants
            .filter(x => !!x.body.id)
            .map((p, inx) => {
              let pathname = history.getCurrentLocation().pathname;
              if (p.body.id) {
                let isActive = (pathname.includes(p.body.id.toString()) &&
                  pathname.includes("edit")) ? "active" : "";

                return <Link to={`/app/designer/plants/${p.body.id}`}
                  className={`plant-link-wrapper ` + isActive.toString()}
                  key={p.body.id}>
                  <GardenPlant plant={p}
                    onUpdate={updater(p)}
                    onDrop={dropper(p)} />
                </Link>;
              } else {
                throw new Error("Never.");
              }
            })
        }
      </svg>
    </div>;
  }
}
