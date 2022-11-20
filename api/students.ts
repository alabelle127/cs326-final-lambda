import { Request, Response } from "express";
import { MongoClient } from "mongodb";

export async function get_student(req: Request, res: Response) {
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
        return;
    }

    const client = req.app.locals.client;

    const entry = await helper(client, studentID);    

    if (entry === null) {
        res.status(404).json({
            success: false,
            message: "Student does not exist",
        });
        return;
    }

    const privateProfile = entry['privateProfile'];

    // even if the student profile is private if the logged in user is
    // the target student then they can still access the profile
    if (!privateProfile || req.session.userID === req.params.userID) {
        res.json({
            success: true,
            data: {
                username: studentID,
                real_name: entry['realName'],
                description: entry['bio'],
                contact_info: entry['contactInfo'],
                // looking_for_partners: entry['lookingForPartners'],
                currentCourses: entry['currentClasses'],
                previousCourses: entry['previousClasses'],
                partners: entry['partners'],
            },
        });
    } else {
        res.status(401).json({
            success: false,
            message: "Student's profile is private",
        });
    }
}

export async function helper(client: MongoClient, studentID: any) {

    const res = await client
    .db("users")
    .collection("profiles")
    .findOne({studentID: studentID});

    return res;
}
