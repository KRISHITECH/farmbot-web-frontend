import { Everything } from "../interfaces";
import { Props } from "./interfaces";
import { selectAllPoints, selectAllPlants } from "../resources/selectors";

export function mapStateToProps(props: Everything): Props {

  return {
    dispatch: props.dispatch,
    designer: props.resources.consumers.farm_designer,
    points: selectAllPoints(props.resources.index),
    plants: selectAllPlants(props.resources.index)
  };
}
