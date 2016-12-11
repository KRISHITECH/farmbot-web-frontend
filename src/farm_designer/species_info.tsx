import * as React from "react";
import { savePlant } from "./actions";
import { BackArrow } from "./back_arrow";
import { Everything } from "../interfaces";
import { Plant, PlantOptions } from "./plant";
import { API } from "../api";
import * as RR from "react-router";

export class SpeciesInfo extends React.Component<Everything, any> {
    drag(e: React.DragEvent<any>) {
        var img = document.createElement("img");
        img.src = "/img/icons/seed.png";
        (e.dataTransfer as any)["setDragImage"](img, 12, 48);
    }

    drop(e: React.MouseEvent<any>) {

        let el = document.querySelector("#drop-area > svg > rect");
        if (!el) {
            throw new Error("why");
        } else {
            let box = el.getBoundingClientRect();

            let p: PlantOptions = fromScreenToGarden(e.pageX, e.pageY, box.left, box.bottom);
            // TEMPORARY SOLUTION =======
            let OFEntry = this.findCrop(this.props.location.query["id"]);
            p.img_url = OFEntry.image;
            p.openfarm_slug = OFEntry.crop.slug;
            p.name = OFEntry.crop.name || "Mystery Crop";
            // END TEMPORARY SOLUTION =======

            let plant = Plant(p);
            let baseUrl: string = API.current.baseUrl;

            this.props.dispatch(savePlant(plant, baseUrl));
        }
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

    render() {
        let result = this.findCrop(this.props.location.query["id"] || "PLANT_NOT_FOUND");
        return <div className="panel-container green-panel">
            <div className="panel-header green-panel">
                <p className="panel-title">
                    <BackArrow /> {result.crop.name}
                </p>
            </div>
            <div className="panel-content">
                <div className="crop-drag-info-tile">
                    <img className="crop-drag-info-image"
                        src={result.image}
                        onDragStart={this.drag.bind(this)}
                        onDragEnd={this.drop.bind(this)} />
                    <div className="crop-info-overlay">
                        Drag and drop into map
          </div>
                </div>
                <div className="object-list">
                    <label>
                        Crop Info
          </label>
                    <span className="edit-link"><a href="#">Edit</a></span>
                    <ul>
                        {
                            _(result.crop)
                                .omit(["slug", "processing_pictures"])
                                .pairs()
                                .map(function (pair, i) {
                                    let key = pair[0] as string;
                                    let value = pair[1];
                                    return <li key={i}>
                                        <strong>{_.startCase(key) + ": "}</strong>
                                        {value || "Not set"}
                                    </li>;
                                })
                                .value()
                        }
                    </ul>
                </div>
            </div>
        </div>
    }
}

function fromScreenToGarden(mouseX: number, mouseY: number, boxX: number, boxY: number) {
    let rawX = mouseX - boxX;
    let rawY = boxY - mouseY;

    return { x: rawX, y: rawY };
};
