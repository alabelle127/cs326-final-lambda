import dotenv from "dotenv";
import { Request, Response } from "express";
import { google } from 'googleapis';

dotenv.config();

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:8080/api/google_auth",
);

export function get_google_auth_url(req: Request, res: Response) {
    const scopes = ["https://www.googleapis.com/auth/calendar"];
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: scopes
    });
    console.log(url);
    res.json({
        url: url
    });
}

export async function handle_google_auth_redirect(req: Request, res: Response) {
    const code = req.query.code;
    if (typeof code !== "string") {
        return res.status(502).json({});
    }
    const { tokens } = await oauth2Client.getToken(code);
    if (tokens.refresh_token) {
        // store refresh token in db
    }
}