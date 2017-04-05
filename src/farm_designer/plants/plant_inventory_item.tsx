import * as React from "react";
import { DEFAULT_ICON, cachedIcon } from "../../open_farm/index";
import * as moment from "moment";
import { t } from "i18next";
import { Plant } from "../interfaces";

interface Props {
  plant: Plant | undefined;
}

interface State {
  icon: string;
}

export class PlantInventoryItem extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = { icon: DEFAULT_ICON };
  }

  componentDidMount() {
    if (this.props.plant) {
      cachedIcon(this.props.plant.openfarm_slug)
        .then(icon => this.setState({ icon }))
    }
  }
  render() {
    let plant = this.props.plant;
    let planted_at = (plant && plant.planted_at) || moment();
    let dayPlanted = moment();
    let label = ((plant && plant.name) ||
      ("Unknown plant"));
    let daysOld = dayPlanted.diff(moment(planted_at), "days") + 1;
    return <div className="plant-search-item">
      <img className="plant-search-item-image" src={this.state.icon} />
      <span className="plant-search-item-name">{label}</span>
      <i className="plant-search-item-age">
        {daysOld} {t("days old")}</i>
    </div>;
  };
}
