import { Request, Response } from "express";
import { MongoClient } from "mongodb";

export function get_student(req: Request, res: Response) {
    console.log(
        `Received API request to get student info for ${req.params.userID}, by user ${req.session.userID}`
    );
    const studentID = parseInt(req.params.userID);
    if (isNaN(studentID) || studentID <= 0) {
    // Invalid userID in request
    res.status(400).json({
        success: false,
        message: "Invalid student ID",
    });
    }

    const client = req.app.locals.client;

    const entry = client
        .db("users")
        .collection("profile")
        .findOne({studentID: studentID});

    const privateProfile = entry.privateProfile;
    if (!privateProfile || req.session.userID === req.params.userID) {
        res.json({
        success: true,
        data: {
            
        },
        });
    } else {
        res.status(401).json({
        success: false,
        message: "Student's profile is private",
    });
  }
}