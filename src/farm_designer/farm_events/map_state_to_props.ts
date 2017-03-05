import { FarmEvent } from "../interfaces";
import { Everything } from "../../interfaces";
import * as moment from "moment";
import { Sequence } from "../../sequences/interfaces";
import { Regimen } from "../../regimens/interfaces";
import { Dictionary } from "farmbot";

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

/** One CalendarDay has many CalendarOccurrences. For instance, a FarmEvent
 * that executes every 8 hours will create 3 CalendarOccurrences in a single
 * CalendarDay */
interface CalendarOccurrence {
  sortKey: number;
  timeStr: string;
  executableName: string;
  executableId: number;
  id: number;
}

/** A group of FarmEvents for a particular day on the calendar. */
interface CalendarDay {
  /** Unix timestamp. Used as a unique key in JSX and for sorting. */
  sortKey: string;
  month: string;
  day: number;
  /** Every event that will execute on that day. */
  items: CalendarOccurrence[];
}


export interface FarmEventProps {
  /** Sorted list of the first (100?) events due on the calendar. */
  calendarRows: CalendarDay[];
  /** Call this function to navigate to different pages. */
  push: (url: string) => void;
}

/** Prepares a FarmEvent[] for use with <FBSelect /> */
export function mapStateToProps(state: Partial<Everything>): FarmEventProps {
  let farmEvents = state && state.sync && state.sync.farm_events || [];
  let sequences = state && state.sync && state.sync.sequences || [];
  let regimens = state && state.sync && state.sync.regimens || [];
  let push = (state && state.router && state.router.push) || (() => { });
  let sequenceById: Dictionary<Sequence> = _.indexBy(sequences, "id");
  let regimenById: Dictionary<Regimen> = _.indexBy(regimens, "id");
  let farmEventByMMDD: Dictionary<CalendarOccurrence[]> = farmEvents
    .reduce(function (memo, farmEvent) {
      farmEvent.calendar && farmEvent.calendar.map(function (date) {
        let m = moment(date);
        let mmdd = m.format("MMDD");
        let executableId = farmEvent.executable_id;
        let executableName: string;
        switch (farmEvent.executable_type) {
          case "Sequence":
            let s = sequenceById[executableId];
            executableName = (s && s.name) || "Unknown sequence";
            break;
          case "Regimen":
            let r = regimenById[executableId];
            executableName = (r && r.name) || "Unknown regimen";
            break;
          default: throw new Error("Never");
        }
        let occur = {
          sortKey: m.unix(),
          timeStr: m.format("hh:mm a"),
          executableName,
          executableId,
          id: farmEvent.id || 0,
        };
        (memo[mmdd]) ? memo[mmdd].push(occur) : (memo[mmdd] = [occur]);
      });
      return memo;
    }, ({} as Dictionary<CalendarOccurrence[]>));

  let calendarRows: CalendarDay[] = _.chain(farmEvents)
    .map(y => y.calendar || [])
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
