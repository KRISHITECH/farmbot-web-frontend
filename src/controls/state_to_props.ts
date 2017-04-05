import { Everything } from "../interfaces";
import { BotState } from "../devices/interfaces";
import { AuthState } from "../auth/interfaces";
import {
  TaggedPeripheral,
  TaggedDevice
} from "../resources/tagged_resources";
import { selectAllPeripherals, getDeviceAccountSettings } from "../resources/selectors";
import { RestResources } from "../resources/interfaces";

export interface Props {
  dispatch: Function;
  bot: BotState;
  account: TaggedDevice;
  auth: AuthState | undefined;
  peripherals: TaggedPeripheral[];
  resources: RestResources;
}

export function mapStateToProps(props: Everything): Props {
  let peripherals = _.uniq(selectAllPeripherals(props.resources.index));
  let resources = props.resources;

  return {
    account: getDeviceAccountSettings(resources.index),
    dispatch: props.dispatch,
    bot: props.bot,
    auth: props.auth,
    resources,
    peripherals
  };
}

