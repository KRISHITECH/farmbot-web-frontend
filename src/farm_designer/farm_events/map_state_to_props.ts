import { Everything } from "../../interfaces";
import * as moment from "moment";
import { Dictionary } from "farmbot";
import { FarmEventProps, CalendarOccurrence, CalendarDay } from "../interfaces";
import {
  selectAllFarmEvents,
  indexSequenceById,
  indexRegimenById
} from "../../resources/selectors";

const MONTHS: Readonly<Dictionary<string>> = {
  "12": "Dec",
  "11": "Nov",
  "10": "Oct",
  "09": "Sep",
  "08": "Aug",
  "07": "Jul",
  "06": "Jun",
  "05": "May",
  "04": "Apr",
  "03": "Mar",
  "02": "Feb",
  "01": "Jan"
};

/** Prepares a FarmEvent[] for use with <FBSelect /> */
export function mapStateToProps(state: Everything): FarmEventProps {
  let r = state.resources;
  let farmEvents = selectAllFarmEvents(state.resources.index);

  let push = (state && state.router && state.router.push) || (() => { });

  let sequenceById = indexSequenceById(state.resources.index);
  let regimenById = indexRegimenById(state.resources.index);

  let farmEventByMMDD: Dictionary<CalendarOccurrence[]> = farmEvents
    .reduce(function (memo, farmEvent) {
      farmEvent.body.calendar && farmEvent.body.calendar.map(function (date) {
        let m = moment(date);
        let mmdd = m.format("MMDD");
        let executableId = farmEvent.body.executable_id;
        let executableName: string;
        switch (farmEvent.body.executable_type) {
          case "Sequence":
            let s = sequenceById[executableId];
            executableName = (s && s.body.name) || "Unknown sequence";
            break;
          case "Regimen":
            let r = regimenById[executableId];
            executableName = (r && r.body.name) || "Unknown regimen";
            break;
          default: throw new Error("Never");
        }
        let occur = {
          sortKey: m.unix(),
          timeStr: m.format("hh:mm a"),
          executableName,
          executableId,
          id: farmEvent.body.id || 0,
        };
        (memo[mmdd]) ? memo[mmdd].push(occur) : (memo[mmdd] = [occur]);
      });
      return memo;
    }, ({} as Dictionary<CalendarOccurrence[]>));

  let calendarRows: CalendarDay[] = _.chain(farmEvents)
    .map(y => y.body.calendar || [])
    .flatten()
    .uniq()
    .compact()
    .map(y => moment(y).format("MMDD"))
    .uniq()
    .map(function (mmdd) {
      let items = farmEventByMMDD[mmdd];
      return {
        sortKey: mmdd,
        month: MONTHS[mmdd.slice(0, 2)] || "???",
        day: parseInt(mmdd.slice(2, 4)),
        items
      };
    })
    .value();
  return { calendarRows, push };
}
