import * as React from "react";
import { BackArrow, error } from "../../ui";
import { connect } from "react-redux";
import * as moment from "moment";
import { t } from "i18next";
import { EditPlantInfoProps, PlantData } from "../interfaces";
import { history } from "../../history";
import { Everything } from "../../interfaces";
import { destroy } from "../../api/crud";
import { maybeFindPlantById } from "../../resources/selectors";
import { TaggedPlant } from "../../resources/tagged_resources";

function mapStateToProps(props: Everything): EditPlantInfoProps {
  let findPlant = (id: string | undefined) => {
    let num = parseInt(id || "NOPE", 10);
    if (_.isNumber(num) && !_.isNaN(num)) {
      return maybeFindPlantById(props.resources.index, num);
    }
  };

  return {
    findPlant,
    push: history.push,
    dispatch: props.dispatch,
  }
}

@connect(mapStateToProps)
export class EditPlantInfo extends React.Component<EditPlantInfoProps, {}> {
  get stringyID() {
    // TODO: ("We should put this into a query object incase the URL changes")
    return history.getCurrentLocation().pathname.split("/")[4] || "";
  }

  get plant() {
    return this.props.findPlant(this.stringyID);
  }
  destroy = (plantUUID: string) => {
    this.props.dispatch(destroy(plantUUID))
      .then(() => history.push("/app/designer/plants"))
      .catch(() => error("Could not delete plant.", "Error"))
  }

  fallback = () => {
    return <span>Redirecting...</span>
  }

  default = (plant_info: TaggedPlant) => {
    let { planted_at, name, x, y } = plant_info.body;
    let { uuid } = plant_info;
    let dayPlanted = moment();
    let daysOld = dayPlanted.diff(moment(planted_at), "days") + 1;
    let plantedAt = moment(planted_at).format("MMMM Do YYYY, h:mma");

    return <div className="panel-container green-panel" >
      <div className="panel-header green-panel">
        <p className="panel-title">
          <BackArrow />
          <span className="title">{t("Edit")} {name}</span>
        </p>
      </div>
      <div className="panel-content">
        <label>{t("Plant Info")}</label>
        <ul>
          <li>{t("Started")}: {plantedAt}</li>
          <li>{t("Age")}: {daysOld}</li>
          <li>{t("Location")}: ({x}, {y})</li>
        </ul>
        <label>{t("Regimens")}</label>
        <ul>
          <li>Soil Acidifier</li>
        </ul>
        <label>{t("Delete this plant")}</label>
        <div>
          <button className="red button-like left"
            onClick={() => this.destroy(uuid)}>
            {t("Delete")}
          </button>
        </div>
      </div>
    </div >;
  }

  render() {
    let plant_info = this.plant;
    return plant_info ? this.default(plant_info) : this.fallback();
  }
}
