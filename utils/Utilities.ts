import { SyncTime, AverageSyncTime } from "@/types";

/**
 * Returns a Date object, created from the sync dat and sync time.
 */
export function createDateString(sync_date:string, sync_time:string):Date {
  let pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
  // Formats into: 2023-04-01
  let formatted_date = "0".concat(sync_date).replace(pattern, "$3-$2-$1");
  // Formats into 2023-04-01T06:00:29Z
  let dateString = `${formatted_date}T${sync_time}Z`; // Adding Z at the end to use UTC
  let dateObject = new Date(dateString);

  return dateObject;
}

/**
 * Sorts array of sync times.
 */
export function sortDates(array:SyncTime[]): SyncTime[] {
    const sorted_array = array.sort(function (a, b) {
      return b.start.getTime() - a.start.getTime();
    });
    return sorted_array;
}

/**
 * Calculates the average time between the latest 10 syncs.
 * Returns the result as a human-readable string.
 */
export function getAverageTimeBetweenSyncs(dateArray: SyncTime[]):AverageSyncTime {

  const totalIntervals = dateArray.length - 1;
  const totalTime = dateArray.reduce((total, date, i) => {
    if (i === totalIntervals) {
      return total;
    }
    const interval = date.end.getTime() - dateArray[i + 1].end.getTime();
    return total + interval;
  }, 0);

  const averageTime = totalTime / totalIntervals;

  function pad(i: any) {
    return ("0" + i).slice(-2);
  }

  let d = new Date(1000 * Math.round(averageTime / 1000)); // Rounding to the nearest second.
  let str =
    d.getUTCHours() +
    " hours " +
    pad(d.getUTCMinutes()) +
    " minutes " +
    pad(d.getUTCSeconds()) +
    " seconds.";

  const timeObject = {
    display: str,
    milliseconds: averageTime,
  };

  return timeObject;
}

/**
 * Calculates the next estimated sync time.
 */
export function estimateNextSync(latest_sync:Date, average_sync:number):Date {
    let latestInMilliseconds = latest_sync.getTime();
    const nextSyncTime = latestInMilliseconds + average_sync;
    const nextDate = new Date(nextSyncTime)
    return nextDate;
}