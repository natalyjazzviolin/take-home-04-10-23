import { useEffect, useState } from "react";
import data from "@/json/sync_data.json"
import { createDateString, sortDates, getAverageTimeBetweenSyncs, estimateNextSync } from "@/utils"
import { SyncTime, AverageSyncTime } from "@/types"
import styles from "./Data.module.scss"

const Data = () => {

    const [syncTime, setSyncTime] = useState<SyncTime[]>([])
    const [recent, setRecent] = useState<Date>();
    const [previousFourSyncs, setPreviousFourSyncs] = useState<SyncTime[]>([]);
    const [averageSyncTime, setAverageSyncTime] = useState<AverageSyncTime>();
    const [nextSync, setNextSync] = useState<Date>();

    let options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "EDT",
    };

    useEffect(() => {
        setSyncTime(
          sortDates(
            data.map((d: any) => {
              let end: Date = createDateString(
                d.sync_end_date,
                d.sync_end_time
              );
              let start: Date = createDateString(
                d.sync_start_date,
                d.sync_start_time
              );

              return {
                start: start,
                end: end,
              };
            })
          )
        );
    }, [])

    useEffect(() => {

        if (syncTime != undefined) {
          setRecent(syncTime.slice(0)[0]?.end);
          setPreviousFourSyncs(syncTime.slice(1,5))
          setAverageSyncTime(getAverageTimeBetweenSyncs(syncTime));
        }
    }, [syncTime])

    useEffect(() => {
        if(recent != undefined && averageSyncTime?.milliseconds != undefined) {
            setNextSync(estimateNextSync(recent, averageSyncTime.milliseconds));
        }
    },[recent, averageSyncTime])

    return (
      <div className={styles.container}>
        <div className={styles.container__card}>
          <h2>Latest sync completed:</h2>
          <div className={styles.container__info}>
            <p>{recent?.toLocaleString()}</p>
          </div>
        </div>
        <div className={styles.container__card}>
          <h2>Previous four syncs:</h2>
          <div className={styles.container__info}>
            {previousFourSyncs.map((p) => {
              return <p key={p.end.toString()}>{p.end.toLocaleString()}</p>;
            })}
          </div>
        </div>
        <div className={styles.container__card}>
          <h2>Average sync time:</h2>
          <div className={styles.container__info}>
            <p>{averageSyncTime?.display}</p>
          </div>
        </div>
        <div className={styles.container__card}>
          <h2>Next sync estimate:</h2>
          <div className={styles.container__info}>
            <p>{nextSync?.toLocaleString("en-US")}</p>
          </div>
        </div>
      </div>
    );
}

export default Data;
