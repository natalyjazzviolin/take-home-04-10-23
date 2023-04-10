import { useEffect, useState } from "react";
import data from "@/json/sync_data.json"
import { createDateString, sortDates, getAverageTimeBetweenSyncs, estimateNextSync } from "@/utils"
import { SyncTime, AverageSyncTime } from "@/types"
import styles from "./Data.module.scss"

const Data = () => {

    const [syncTime, setSyncTime] = useState<SyncTime[]>([]);
    const [recent, setRecent] = useState<Date>();
    const [previousFourSyncs, setPreviousFourSyncs] = useState<SyncTime[]>([]);
    const [averageSyncTime, setAverageSyncTime] = useState<AverageSyncTime>();
    const [nextSync, setNextSync] = useState<Date>();

    /**
     * Transforms the initial data array and returns it as JavaScript Date objects.
     */
    useEffect(() => {
        setSyncTime(
          sortDates(
            data.map((sync: any) => {
              let end: Date = createDateString(
                sync.sync_end_date,
                sync.sync_end_time
              );
              let start: Date = createDateString(
                sync.sync_start_date,
                sync.sync_start_time
              );

              return {
                start: start,
                end: end,
              };
            })
          )
        );
    }, [])

    /**
     * Sets and returns 3 variables to be displayed:
     * 1. The most recent completed sync time.
     * 2. The previous 4 completed sync times.
     * 3. The average time between the most recent 10 completed syncs.
     */
    useEffect(() => {
        if (syncTime != undefined) {
          setRecent(syncTime.slice(0)[0]?.end);
          setPreviousFourSyncs(syncTime.slice(1,5))
          setAverageSyncTime(getAverageTimeBetweenSyncs(syncTime));
        }
    }, [syncTime])

    /**
     * Sets and returns an educated estimation of the next completed sync time.
     * This variable depends on the most recent and average sync times.
     */
    useEffect(() => {
        if(recent != undefined && averageSyncTime?.milliseconds != undefined) {
            setNextSync(estimateNextSync(recent, averageSyncTime.milliseconds));
        }
    },[recent, averageSyncTime])

    /**
     * In a production environment, I would have:
     * - extracted the 'card' divs into their own component.
     * - put the relevant data into an array and mapped through it to display the cards.
     * - Extracted the displayed text into a .json file to support internationalization.
     */
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
            <p>{nextSync?.toLocaleString()}</p>
          </div>
        </div>
      </div>
    );
}

export default Data;
