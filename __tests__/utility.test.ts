import { estimateNextSync } from "../utils/Utilities";

describe("estimateNextSync()", () => {
    test("estimateNextSync returns a Date object", () => {
      const latest_sync = new Date("2023-04-01T06:00:29Z");
      const average_sync = 2000000;
      const nextSync = estimateNextSync(latest_sync, average_sync);

      expect(nextSync).toBeInstanceOf(Date);
    });
});
