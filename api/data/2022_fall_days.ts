interface DAYS_CONST {
  start: Date;
  end: Date;
  daysOff: Array<string>;
  specialDays: Record<string, string>;
}

export const FALL_2022_DAYS: DAYS_CONST = {
  start: new Date(2022, 8, 6), // Sep 6 - First day of classes
  end: new Date(2022, 11, 12), // Dec 12 - Last day of classes
  daysOff: [
    "2022-10-10", // Indigenous Peoples Day
    "2022-11-11", // Veterans Day
    "2022-11-23", // Thanksgiving
    "2022-11-24",
    "2022-11-25",
  ],
  specialDays: {
    "2022-11-22": "fri", // Friday schedule
  },
};
