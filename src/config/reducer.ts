import { generateReducer } from "../redux/generate_reducer";
import { ChangeApiHost, ChangeApiPort, ConfigState } from "./interfaces";
import { API } from "../api";

let initialState: ConfigState = {
  host: location.hostname,
  // It gets annoying to manually change the port # in dev mode.
  // I automatically point to port 3000 on local.
  port: API.inferPort()
};

export let configReducer = generateReducer<ConfigState>(initialState)
  .add<ChangeApiPort>("CHANGE_API_PORT", function (s, a) {
    s.port = a.payload.port.replace(/\D/g, "");
    return s;
  })
  .add<ChangeApiHost>("CHANGE_API_HOST", function (s, a) {
    s.host = a.payload.host;
    return s;
  });

