import * as React from "react";
import { Link } from "react-router";
import { BackArrow } from "../back_arrow";
import { CropLiveSearchResult } from "../interfaces";
import { Everything } from "../../interfaces";
import { openFarmSearchQuery } from "../actions";
import { connect } from "react-redux";

interface SpeciesCatalogTileProps {
  result: CropLiveSearchResult;
  dispatch: Function;
}

interface SearchBoxParams {
  query: string;
  dispatch: Function;
}

function SearchBox({query, dispatch}: SearchBoxParams) {
  return <input value={query}
    onChange={(e) => doSearch(e, dispatch)}
    className="search"
    placeholder="Search OpenFarm" />;
}

function doSearch(e: React.FormEvent<HTMLInputElement>,
  dispatch: Function) {
  dispatch(openFarmSearchQuery(e.currentTarget.value));
}

@connect((state: Everything) => state)
export class SpeciesCatalog extends React.Component<Everything, {}> {
  render() {
    let species = this.props.designer.cropSearchResults.map((resp, index) => {
      return <div className="plant-catalog-tile" key={index}>
        <div className="small-header-wrapper">
          <label>{resp.crop.name}</label>
        </div>
        <div>
          <p>
            <Link to={`/app/designer/plants/crop_search/${resp.crop.slug}`}>
              <img className="crop-drag-info-image" src={resp.image} />
            </Link>
          </p>
        </div>
      </div>;
    });

    return <div className="panel-container green-panel">
      <div className="panel-header green-panel">
        <p className="panel-title">
          <BackArrow /> Choose a Species
        </p>
      </div>
      <div className="panel-content">
        <div className="thin-search-wrapper">
          <i className="fa fa-search"></i>
          <div className="thin-search">
            <SearchBox query={this.props.designer.cropSearchQuery}
              dispatch={this.props.dispatch} />
          </div>
        </div>
        <div className="panel-content">
          <div className="crop-search-result-wrapper">
            {species}
          </div>
        </div>
      </div>
    </div>;
  }
}
