import { Request, Response } from "express";

export function search(req: Request, res: Response) {
  const query = req.query.q;
  console.log(`Received API request for search with q=${query}`);
  // Placeholder data
  const responseData = [
    {
      display_text: "CS 326 (Not current)",
      current: false,
      department: "CS",
      class_number: 326,
      class_perma_id: "NC-CS326",
    },
    {
      display_text: "CS 326 (Berger) TuTh 1:00-2:15 [44866]",
      current: true,
      department: "CS",
      class_number: 326,
      class_id: 44866,
      class_perma_id: "2022F-44866",
      professor: "Emery Berger",
      meeting_times: [
        {
          day: "Tu",
          start_time: 1300,
          end_time: 1415,
        },
        {
          day: "Th",
          start_time: 1300,
          end_time: 1415,
        },
      ],
    },
    {
      display_text: "CS 326 (Klemperer) TuTh 1:00-2:15 [57113]",
      current: true,
      department: "CS",
      class_number: 326,
      class_id: 57113,
      class_perma_id: "2022F-57113",
      professor: "Peter Klemperer",
      meeting_times: [
        {
          day: "Tu",
          start_time: 1300,
          end_time: 1415,
        },
        {
          day: "Th",
          start_time: 1300,
          end_time: 1415,
        },
      ],
    },
  ];
  res.json(responseData);
}
