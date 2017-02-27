import * as React from "react";
import { BackArrow } from "../../ui";
import { Everything } from "../../interfaces";
import { connect } from "react-redux";
import { t } from "i18next";
import { isMobile } from "../../util";

interface SpeciesInfoProps extends Everything {
  params: {
    species: string;
  };
}

interface DraggableEvent {
  currentTarget: HTMLImageElement;
  dataTransfer: {
    setDragImage: Function;
  };
}

@connect((state: Everything) => state)
export class SpeciesInfo extends React.Component<SpeciesInfoProps, {}> {
  handleDragStart(e: DraggableEvent) {
    let img = document.createElement("img");
    // Stub until we figure out dynamic drag images
    img.src = "/app-resources/img/icons/Sprout-96.png";
    // TS doesn't know setDragImage
    e.dataTransfer.setDragImage(img, 50, 50);
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
    let species = this.props.params.species.toString();
    let result = this.findCrop(species || "PLANT_NOT_FOUND");
    let addSpeciesPath = "/app/designer/plants/crop_search/" + species + "/add";

    /** rgba arguments are a more mobile-friendly way apply filters */
    let backgroundURL = isMobile() ? `linear-gradient(
      rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${result.image})` : "";

    return <div className="panel-container green-panel species-info-panel">
      <div className="panel-header green-panel"
        style={{ background: backgroundURL }}>
        <p className="panel-title">
          <BackArrow /> {result.crop.name}
          <a className="right-button mobile-only"
            onClick={() => this.props.router.push(addSpeciesPath)}>
            {t("Add to map")}
          </a>
        </p>
        <div className="panel-header-description">
          {result.crop.description}
        </div>
      </div>
      <div className="panel-content">
        <div className="crop-drag-info-tile">
          <img className="crop-drag-info-image"
            onDragStart={this.handleDragStart.bind(this)}
            draggable={true}
            src={result.image} />
          <div className="crop-info-overlay">
            {t("Drag and drop into map")}
          </div>
        </div>
        <div className="object-list">
          <label>
            {t("Crop Info")}
          </label>
          <ul>
            {
              _(result.crop)
                .omit(["slug", "processing_pictures", "description"])
                .pairs()
                .map(function (pair, i) {
                  let key = pair[0] as string;
                  let value = pair[1];
                  return <li key={i}>
                    <strong>
                      {_.startCase(key) + ": "}
                    </strong>
                    {value || "Not set"}
                  </li>;
                }).value()
            }
          </ul>
        </div>
      </div>
    </div>;
  }
}
