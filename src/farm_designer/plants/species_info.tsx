import * as React from "react";
import { BackArrow } from "../back_arrow";
import { Everything } from "../../interfaces";
import { connect } from "react-redux";

interface SpeciesInfoProps extends Everything {
    params: {
        species: string;
    };
}

@connect((state: Everything) => state)
export class SpeciesInfo extends React.Component<SpeciesInfoProps, {}> {
    handleDragStart(e: DragEvent) {
        var img = document.createElement("img");
        img.src = "";
        (e as any).dataTransfer.setDragImage(img, 0, 0);
        console.log("starting drag...currentTarget", e.currentTarget);
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
        let result = this.findCrop(this.props.params.species || "PLANT_NOT_FOUND");
        return <div className="panel-container green-panel">
            <div className="panel-header green-panel">
                <p className="panel-title">
                    <BackArrow /> {result.crop.name}
                </p>
            </div>
            <div className="panel-content">
                <div className="crop-drag-info-tile"
                    onDragStart={this.handleDragStart.bind(this)}
                    draggable={true} >
                    <img className="crop-drag-info-image"
                        src={result.image} />
                    <div className="crop-info-overlay">
                        Drag and drop into map
                    </div>
                </div>
                <div className="object-list">
                    <label>
                        Crop Info
                    </label>
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
        </div>;
    }
}
