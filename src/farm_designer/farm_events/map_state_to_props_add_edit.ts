import { AddEditFarmEventProps } from "../interfaces";
import { Everything } from "../../interfaces";
import * as moment from "moment";
import { DropDownItem } from "../../ui";
import { t } from "i18next";
import {
  selectAllFarmEvents,
  indexRegimenById,
  indexSequenceById,
  indexFarmEventById,
  findFarmEventById,
  selectAllRegimens,
  selectAllSequences,
  hasId
} from "../../resources/selectors";
import { TaggedFarmEvent } from "../../resources/tagged_resources";
import { history } from "../../history";

export function mapStateToPropsAddEdit(props: Everything): AddEditFarmEventProps {
  let handleTime = (e: React.SyntheticEvent<HTMLInputElement>, currentISO: string) => {
    let incomingTime = e.currentTarget.value.split(":");
    let hours = parseInt(incomingTime[0]) || 0;
    let minutes = parseInt(incomingTime[1]) || 0;

    switch (e.currentTarget.name) {
      case "start_time":
        // Put the current ISO established by the date field into a var
        let currentStartISO = new Date((currentISO || "").toString())
          .toISOString();

        // Set the time of the already existing iso string
        let newStartISO = moment(currentStartISO)
          .set("hours", hours)
          .set("minutes", minutes)
          .toISOString();

        return newStartISO;

      case "end_time":
        let currentEndISO = new Date((currentISO || "").toString())
          .toISOString();

        let newEndISO = moment(currentEndISO)
          .set("hours", hours)
          .set("minutes", minutes)
          .toISOString();

        return newEndISO;

      default:
        throw new Error("Expected a name attribute from time field.");
    }
  };

  let formatTime = (input: string) => {
    let iso = new Date(input).toISOString();
    return moment(iso).format("HH:mm");
  };

  let formatDate = (input: string) => {
    let iso = new Date(input).toISOString();
    return moment(iso).format("YYYY-MM-DD");
  };

  let repeatOptions = [
    // Removing this for now until prod. deploy is over.
    //   - R.C. Mar 2017
    // { label: "Do not repeat", value: "never", name: "time_unit" },
    { label: "minutes", value: "minutely", name: "time_unit" },
    { label: "hours", value: "hourly", name: "time_unit" },
    { label: "days", value: "daily", name: "time_unit" },
    { label: "weeks", value: "weekly", name: "time_unit" },
    { label: "months", value: "monthly", name: "time_unit" },
    { label: "years", value: "yearly", name: "time_unit" }
  ];

  let selectOptions: DropDownItem[] = [];

  selectOptions.push({ label: t("REGIMENS"), heading: true, value: "Regimens" });
  selectAllRegimens(props.resources.index).map(regimen => {
    // TODO: Remove executable_type from obj since it's
    // not declared in the interface.
    if (regimen.kind === "regimens" && regimen.body.id) {
      let item = {
        label: regimen.body.name,
        executable_type: "Regimen",
        executable_id: regimen.body.id,
        value: regimen.body.id
      };
      selectOptions.push(item);
    }
  });

  selectOptions.push({ label: t("SEQUENCES"), heading: true, value: "Sequences" });
  selectAllSequences(props.resources.index).map(sequence => {
    // TODO: Remove executable_type from obj since it's
    // not declared in the interface.
    if (sequence.kind === "sequences" && sequence.body.id) {
      let item = {
        label: sequence.body.name,
        executable_type: "Sequence",
        executable_id: sequence.body.id,
        value: sequence.body.id
      };
      selectOptions.push(item);
    }
  });

  let regimensById = indexRegimenById(props.resources.index);
  let sequencesById = indexSequenceById(props.resources.index);
  let farmEventsById = indexFarmEventById(props.resources.index);

  let farmEvents = selectAllFarmEvents(props.resources.index);

  let getFarmEvent = (): TaggedFarmEvent | undefined => {
    let url = history.getCurrentLocation().pathname;
    let id = parseInt(url.split("/")[4]);
    if (id && hasId(props.resources.index, "farm_events", id)) {
      return findFarmEventById(props.resources.index, id);
    } else {
      history.push("/app/designer/farm_events");
    }
  }

  return {
    dispatch: props.dispatch,
    regimensById,
    sequencesById,
    farmEventsById,
    selectOptions,
    repeatOptions,
    formatDate,
    formatTime,
    handleTime,
    farmEvents,
    getFarmEvent
  };
}
