import { AddEditFarmEventProps, ExecutableType } from "../interfaces";
import { Everything } from "../../interfaces";
import * as moment from "moment";
import { t } from "i18next";
import {
  selectAllFarmEvents,
  indexRegimenById,
  indexSequenceById,
  indexFarmEventById,
  findFarmEventById,
  selectAllRegimens,
  selectAllSequences,
  hasId,
  findSequenceById,
  findRegimenById
} from "../../resources/selectors";
import { TaggedFarmEvent, TaggedSequence, TaggedRegimen } from "../../resources/tagged_resources";
import { history } from "../../history";

/** TODO: Not a fan of this one, but don't have time to refactor today.
 *  DropDownItem[]s should not know what a Regimen is. - RC Apr '17.
 *
 * PROBLEM: Drop down item had an id of '6'. But that `id` could have been for a
 *          "regimen" or a "sequence". There's no way to diferentiate as a user
 *          of <NewFBSelect/>
 *
 * Fast Solution:  Tack extra information into DropDownItem. This results in
 *                 us needing to do type casts and coupling DropDownItem to
 *                 FarmEvent, which is unsafe and won't be totally obvious to
 *                 new devs.
 *
 * Ideal solution: Add a `parentHeading: string;` field to DropDownItem. It
 *                 would tell us which heading the DropDownItem came from. we
 *                 could infer the `executable_type` based on the heading it
 *                 was under. Then do a `groupBy` inside
 *                 of <NewFBSelect/>*/
export interface TightlyCoupledFarmEventDropDown {
  label: string;
  executable_type: "Regimen" | "Sequence";
  value: number;
  heading?: undefined | boolean;
}
export let formatTime = (input: string) => {
  let iso = new Date(input).toISOString();
  return moment(iso).format("HH:mm");
};

export let formatDate = (input: string) => {
  let iso = new Date(input).toISOString();
  return moment(iso).format("YYYY-MM-DD");
};

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

  let executableOptions: TightlyCoupledFarmEventDropDown[] = [];

  executableOptions.push({
    label: t("REGIMENS"),
    heading: true,
    value: 0,
    executable_type: "Regimen"
  });
  selectAllRegimens(props.resources.index).map(regimen => {
    // TODO: Remove executable_type from obj since it's
    // not declared in the interface.
    if (regimen.kind === "regimens" && regimen.body.id) {
      executableOptions.push({
        label: regimen.body.name,
        executable_type: "Regimen",
        value: regimen.body.id
      });
    }
  });

  executableOptions.push({
    label: t("SEQUENCES"),
    heading: true,
    value: 0,
    executable_type: "Sequence"
  });
  selectAllSequences(props.resources.index).map(sequence => {
    // TODO: Remove executable_type from obj since it's
    // not declared in the interface.
    if (sequence.kind === "sequences" && sequence.body.id) {
      executableOptions.push({
        label: sequence.body.name,
        executable_type: "Sequence",
        value: sequence.body.id
      });
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
  let findExecutable = (kind: ExecutableType, id: number):
    TaggedSequence | TaggedRegimen => {
    switch (kind) {
      case "Sequence": return findSequenceById(props.resources.index, id)
      case "Regimen": return findSequenceById(props.resources.index, id)
      default: throw new Error("GOT A BAD `KIND` STRING");
    }
  }
  return {
    dispatch: props.dispatch,
    regimensById,
    sequencesById,
    farmEventsById,
    executableOptions,
    repeatOptions,
    formatDate,
    formatTime,
    handleTime,
    farmEvents,
    getFarmEvent,
    findExecutable
  };
}
