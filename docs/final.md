# Team Lambda: Study Buddies (Fall 2022 Semester)
# Overview (TODO)
Study Buddies is a web application to help UMass student find partners to study with. 
# Team Members
-   Andrew LaBelle ([https://github.com/alabelle127](https://github.com/alabelle127))
-   Gavin Cho ([https://github.com/gavin-k-cho](https://github.com/gavin-k-cho))
-   Chris Manning ([https://github.com/KaenCS](https://github.com/KaenCS))
# User Interface (TODO)
# APIs/URL Routes

## Search

Search for classes

**URL** : `/api/classes/search`

**URL Parameters** : `q=[string]` where `q` is the search query.

**Method** : `GET`

### Response

A list of Class results

**Example**

```json
[
  {
    "_id": {
      "$oid": "6377d94b5a9fa1629b0b2c5b"
    },
    "class": {
      "subject": {
        "id": "ACCOUNTG",
        "name": "Accounting"
      },
      "number": "221",
      "name": "Principles of Financial Accounting"
    },
    "name": {
      "number": "01",
      "type": "LEC",
      "id": "42505"
    },
    "instructors": [
      {
        "name": "Kerri Bohonowicz",
        "email": "bohonowicz@isenberg.umass.edu"
      }
    ],
    "meeting_times": {
      "days": {
        "mon": false,
        "tue": true,
        "wed": false,
        "thu": true,
        "fri": false,
        "sat": false,
        "sun": false
      },
      "startTime": {
        "$numberInt": "1430"
      },
      "endTime": {
        "$numberInt": "1545"
      }
    },
    "room": "Mahar room 108"
  },
  {
    "_id": {
      "$oid": "6377d94b5a9fa1629b0b2c59"
    },
    "class": {
      "subject": {
        "id": "ACCOUNTG",
        "name": "Accounting"
      },
      "number": "196ISH",
      "name": "Honors Independent Study In Accounting"
    },
    "name": {
      "number": "01",
      "type": "IND",
      "id": "42545"
    },
    "instructors": [
      {
        "name": "Staff",
        "email": null
      }
    ],
    "meeting_times": null,
    "room": null
  }
]
```

## Login

Attempt to login a user

**URL** : `/api/login`

**Method** : `POST`

**Payload** :

```json
{
  "username": "[string]",
  "password": "[string]"
}
```

### Success Response

**Example**

```json
{
  "success": true,
  "userID": "6378117a2cf3373842d32b65"
}
```

### Error Response

**Example**

```json
{
  "success": false,
  "userID": null
}
```

## Logout

Logout a user

**URL** : `/api/logout`

**Method** : `POST`

## Me

Get the current logged in user

**URL** : `/api/me`

**Method** : `GET`

### Response

**Logged in example**

```json
{
  "loggedIn": true,
  "userID": "6378117a2cf3373842d32b65"
}
```

**Not logged in example**

```json
{
  "loggedIn": false,
  "userID": null
}
```

## Register

Attempt to register a new user

**URL** : `/api/register`

**Method** : `POST`

**Payload** :

```json
{
  "username": "[string]",
  "password": "[string]",
  "real_name": "[string]",
  "contact": "[string]",
  "description": "[string]",
  "classes": "[Array<ObjectId>]"
}
```

### Success Response

**Example**

```json
{
  "success": true
}
```

### Error Response

**Example**

```json
{
  "success": false
}
```

## Username Exists

Check database to see if user with the given username already exists.

**URL** : `/api/exists/:username`

**Method** : `GET`

**Example**

```json
{
  "exists": true
}
```

## User registered classes

Get user's registered classes. User requested must have a public profile or the user must be self.

**URL** : `/api/users/:userID/registered_classes`

**Method** : `GET`

### Success Response

**Example**

```json
{
  "success": true,
  "data": [
    {
      "_id": {
        "$oid": "6377d94c5a9fa1629b0b2c6c"
      },
      "class": {
        "subject": {
          "id": "ACCOUNTG",
          "name": "Accounting"
        },
        "number": "221",
        "name": "Principles of Financial Accounting"
      },
      "name": {
        "number": "01MS",
        "type": "LAB",
        "id": "42522"
      },
      "instructors": [
        {
          "name": "Staff",
          "email": null
        }
      ],
      "meeting_times": {
        "days": {
          "mon": false,
          "tue": false,
          "wed": false,
          "thu": false,
          "fri": true,
          "sat": false,
          "sun": false
        },
        "startTime": {
          "$numberInt": "1220"
        },
        "endTime": {
          "$numberInt": "1310"
        }
      },
      "room": "Sch of Management G31"
    }
  ]
}
```

### Error Response

**Example**

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

## User registered classes

Set user's registered classes

**URL** : `/api/users/:userID/registered_classes`

**Method** : `POST`

**Payload** :

```json
{
  "classes": "[Array<Class>]"
}
```

### Success Response

**Example**

```json
{
  "success": true
}
```

### Error Response

**Example**

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

## Get user

Get user data. If the user has a private profile and the requested user is not self, only returns username and profile picture instead of all the data.

**URL** : `/api/users/:userID`

**Method** : `GET`

### Success Response

**Example**

```json
{
  "success": true,
  "data": {
    "username": "gavin",
    "real_name": "Gavin Cho",
    "contact_info": "555-555-5555",
    "description": "CS & Math major senior",
    "profile_picture": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/512px-Circle-icons-profile.svg.png",
    "private_profile": false,
    "looking_for_partners": true,
    "currentCourses": [
      "6377da885a9fa1629b0b3447"
    ],
  }
}
```

### Success Response (Private profile)

**Example**

```json
{
  "success": true,
  "data": {
    "username": "gavin",
    "profile_picture": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/512px-Circle-icons-profile.svg.png",
  }
}
```

### Error Response

**Example**

```json
{
  "success": false,
  "message": "Student does not exist"
}
```

## Set user settings

Set user data. Requested user must be self.

**URL** : `/api/users/:userID`

**Method** : `POST`

**Payload** :

```json
{
    "profile_picture": "[URL]",
    "description": "[string]",
    "contact": "[string]",
    "looking_for_partners": "[boolean]",
    "private_profile": "[boolean]"
}
```

### Success Response

**Example**

```json
{
  "success": true
}
```

### Error Response

**Example**

```json
{
  "success": false,
  "message": "Not authorized"
}
```
## Get Google authentication URL

Get URL which allows user to login to their Google account so that a calendar can be created with their class schedule. After a user logs in, redirects to `/api/google_auth`.

**URL** : `/api/google_auth_url`

**Method** : `GET`

### Success Response

**Example**

```json
{
  "url": "https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?access_type=offline&prompt=consent&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar&response_type=code&client_id=(redacted)&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fapi%2Fgoogle_auth&service=lso&o2v=2&flowName=GeneralOAuthFlow" 
}
```

### Success Response (Private profile)

**Example**

```json
{
  "success": true,
  "data": {
    "username": "gavin",
    "profile_picture": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/512px-Circle-icons-profile.svg.png",
  }
}
```

### Error Response

**Example**

```json
{
  "success": false,
  "message": "Student does not exist"
}
```
## List of Compatible Partners (TODO)
## Return Incoming Matches for User (TODO)
## Sending Match request from user 1 to user 2 (TODO)
## Meeting Scheduling (TODO)
## Incoming Notifications/Match requests (TODO)
## User's Current Meetings (TODO)
# Database
## 2022 Fall Classes Collection
UMass Fall 2022 semester classes, scraped from SPIRE.
**Example document**
```json
{
  "_id": {
    "$oid": "6377d9545a9fa1629b0b2cbd"
  },
  "class": {
    "subject": {
      "id": "AEROSPAC",
      "name": "Aerospace Studies"
    },
    "number": "335",
    "name": "Leading People and Effective Communication I"
  },
  "name": {
    "number": "01LL",
    "type": "LAB",
    "id": "42602"
  },
  "instructors": [
    {
      "name": "Lucas Hall",
      "email": "lucashall@umass.edu"
    },
    {
      "name": "Darrick Dwyer",
      "email": "djdwyer@umass.edu"
    }
  ],
  "meeting_times": {
    "days": {
      "mon": true,
      "tue": false,
      "wed": false,
      "thu": false,
      "fri": false,
      "sat": false,
      "sun": false
    },
    "startTime": {
      "$numberInt": "830"
    },
    "endTime": {
      "$numberInt": "1130"
    }
  },
  "room": "Dickinson Hall room 216"
}
```
## Members Collection
Registered users.
**Example document**
```json
{
  "_id": {
    "$oid": "63940f91f47ae47dca683f1b"
  },
  "username": "gavin3000",
  "salt": "258044fec20da92826061dbb511b25a7",
  "hash": "3e97ec1f34c38b0225cc9e4c1e989a24a425227db5a0f50bfee280036e994998b33c9aaf5be13176cb46e86f7c588840c1fb0ebd9125130241173ab9cda04e7f",
  "real_name": "Gavin",
  "contact": "555-5555",
  "description": "CS & Math major",
  "profile_picture": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/512px-Circle-icons-profile.svg.png",
  "private_profile": false,
  "looking_for_partners": true,
  "classes": [
    "6377da885a9fa1629b0b3447"
  ],
  "google_credentials": {
    "access_token": "(redacted)",
    "refresh_token": "(redacted)",
    "scope": "https://www.googleapis.com/auth/calendar",
    "token_type": "Bearer",
    "expiry_date": {
      "$numberDouble": "1.6706512905580E+12"
    }
  }
}
```
## Session Collection
Currently logged in user sessions.
**Example document**
```json
{
  "_id": "qFUD6TxWCCjllyYm0W9PGvJodLamrvBz",
  "expires": {
    "$date": {
      "$numberLong": "1671313209536"
    }
  },
  "session": "{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2022-12-17T00:44:18.835Z\",\"httpOnly\":true,\"path\":\"/\"},\"userID\":\"6393d654edc7c4e145be02e7\"}"
}
```
## Matches Collection (TODO)
## Meetings Collection (TODO)
## Notifications Collection (TODO)
# Authentication/Authorization
Authentication for login is implemented with the miniCrypt.js library (ported to TypeScript), generally following the example provided from class. When a user is logged in a session is created in the database so if a user leaves the page and comes back they will still be logged in. The session is used to check what logged in user is making an API request. So sensitive API calls such as changing a user's profile picture only succeed if the user making the request is the same as the user whose profile picture is being changed. When viewing a user's profile, if the user has a private profile and the viewer is not the user itself, only the user's username and profile picture will be visible. No user has more permissions than any other user.
# Division of Labor
**Gavin:**
- User login (wireframes, frontend, and backend)
- Register new user (wireframes, frontend, and backend)
- Add/remove/search classes (wireframes, frontend, and backend)
- Create class schedule in Google Calendar (and handle Google authentication)
- Scrape SPIRE for class data

**Andrew: TODO**

**Chris: TODO**
# Conclusion (TODO)