import * as React from "react";
import * as Axios from "axios";
import { Link } from "react-router";
import { DEFAULT_ICON } from "../../open_farm/index";
import { OpenFarm, CropSearchResult } from "../openfarm";
import { OFSearchProps, OFSearchState } from "../interfaces";

let STUB_IMAGE = DEFAULT_ICON;

let url = (q: string) => `${OpenFarm.cropUrl}?include=pictures&filter=${q}`;

let openFarmSearchQuery = _.throttle((q: string) =>
  Axios.get<CropSearchResult>(url(q)), 800);

export class OpenFarmSearch extends React.Component<OFSearchProps,
  OFSearchState> {
  constructor() {
    super();
    this.state = { results: [] };
  }

  componentWillReceiveProps() {
    _.debounce(this.search, 800)();
  }

  search = () => {
    openFarmSearchQuery(this.props.query)
      .then(resp => {
        // Pluck ID and URL of user-submitted OpenFarm crops...
        // EG: => { X1y3ZAA: "cabbage.png" }
        let images: { [key: string]: string } = {};

        _.get<OpenFarm.Included[]>(resp, "data.included", [])
          .map(item => {
            return {
              id: item.id,
              url: item.attributes.thumbnail_url
            };
          })
          .map((val, acc) => images[val.id] = val.url);

        let payload = resp.data.data.map(datum => {
          let crop = datum.attributes;
          let id = _.get<string>(datum, "relationships.pictures.data[0].id");
          return { crop, image: (images[id] || STUB_IMAGE) };
        });

        this.setState({ results: payload });

        this.props.dispatch({
          type: "OF_SEARCH_RESULTS_OK",
          payload
        });
      });
  }

  render() {
    return <div>
      {this.state.results.concat(this.props.cropSearchResults).map(resp => {
        let { crop, image } = resp;
        return <Link key={resp.crop.slug}
          draggable={false}
          to={`/app/designer/plants/crop_search/` + crop.slug.toString()}>
          <div className="plant-catalog-tile col-xs-6">
            <label>{crop.name}</label>
            <img className="plant-catalog-image" src={image}
              draggable={false} />
          </div>
        </Link>;
      })}
    </div>;
  }
}
