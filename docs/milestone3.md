# API Documentation

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
    "display_text": "CS 326 (Not current)",
    "current": false,
    "department": "CS",
    "class_number": 326,
    "class_perma_id": "NC-CS326"
  },
  {
    "display_text": "CS 326 (Berger) TuTh 1:00-2:15 [44866]",
    "current": true,
    "department": "CS",
    "class_number": 326,
    "class_id": 44866,
    "class_perma_id": "2022F-44866",
    "professor": "Emery Berger",
    "meeting_times": [
      {
        "day": "Tu",
        "start_time": 1300,
        "end_time": 1415
      },
      {
        "day": "Th",
        "start_time": 1300,
        "end_time": 1415
      }
    ]
  },
  {
    "display_text": "CS 326 (Klemperer) TuTh 1:00-2:15 [57113]",
    "current": true,
    "department": "CS",
    "class_number": 326,
    "class_id": 57113,
    "class_perma_id": "2022F-57113",
    "professor": "Peter Klemperer",
    "meeting_times": [
      {
        "day": "Tu",
        "start_time": 1300,
        "end_time": 1415
      },
      {
        "day": "Th",
        "start_time": 1300,
        "end_time": 1415
      }
    ]
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
  "userID": 1001
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
  "userID": 1001
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
  "classes": "Array(Class)"
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
  "message": "Username already exists"
}
```

## User registered classes

Get user's registered classes

**URL** : `/api/users/:userID/registered_classes`

**Method** : `GET`

### Success Response

**Example**

```json
{
  "success": true,
  "data": [
    {
      "display_text": "CS 453 (Not current)",
      "current": false,
      "department": "CS",
      "class_number": 453,
      "class_perma_id": "NC-CS453"
    },
    {
      "display_text": "CS 326 (Berger) TuTh 1:00-2:15 [44866]",
      "current": true,
      "department": "CS",
      "class_number": 326,
      "class_id": 44866,
      "class_perma_id": "2022F-44866",
      "professor": "Emery Berger",
      "meeting_times": [
        {
          "day": "Tu",
          "start_time": 1300,
          "end_time": 1415
        },
        {
          "day": "Th",
          "start_time": 1300,
          "end_time": 1415
        }
      ]
    },
    {
      "display_text": "MATH 551 (Johnston) MoWeFr 10:10-11:00 [01001]",
      "current": true,
      "department": "MATH",
      "class_number": 551,
      "class_id": 1001,
      "class_perma_id": "2022F-01001",
      "professor": "Hans Johnston",
      "meeting_times": [
        {
          "day": "Mo",
          "start_time": 1010,
          "end_time": 1100
        },
        {
          "day": "We",
          "start_time": 1010,
          "end_time": 1100
        },
        {
          "day": "Fr",
          "start_time": 1010,
          "end_time": 1100
        }
      ]
    }
  ]
}
```

### Error Response

**Example**

```json
{
  "success": false,
  "message": "User's profile is private"
}
```

## User registered classes

Set user's registered classes

**URL** : `/api/users/:userID/registered_classes`

**Method** : `POST`

**Payload** :

```json
{
  "classes": "Array(Class)"
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

## User

Get user data

**URL** : `/api/users/:userID`

**Method** : `GET`

### Success Response

**Example**

```json
{
  "success": true,
  "data": {
    "username": "gkcho",
    "real_name": "Gavin Cho",
    "userID": 1001,
    "profile_picture": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/512px-Circle-icons-profile.svg.png",
    "description": "Senior CS & Math major",
    "contact_info": "Call or text me 413-555-5555",
    "looking_for_partners": true,
    "private_profile": true
  }
}
```

### Error Response

**Example**

```json
{
  "success": false,
  "message": "User's profile is private"
}
```

## User

Set user data

**URL** : `/api/users/:userID`

**Method** : `POST`

**Payload** :

```json
{
    "username": "[string]",
    "real_name": "[string]",
    "userID": "[number]",
    "profile_picture": "[URL]",
    "description": "[string]",
    "contact_info": "[string]",
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

### List of Compatible Parters

**Url** : `/api/users/:userID/compatible_partners`

**Method** : `GET`

## Success Response

**Example**

```json
{
    "success" true,
    "data": [
      {
        "name": "David Barrington",
        "username": "dBKewper",
        "compatible_classes": [
          "CS 326",
          "Math 471"
        ],
        "major": "Computer Science",
        "minor": "Mathematics",
        "user_notes": "this stuff hard pls help :("
      },
      {
        "name": "Michael Stevens",
        "username": "Vsauce",
        "compatible_classes": [
          "CS 576"
        ],
        "major": "Physics",
        "minor": "Computer Science",
        "user_notes": "Unity is not my strongsuit"
      },
      {
        "name": "NoName",
        "username": "Nothing",
        "compatible_classes": [
          "CS 453"
        ],
        "major": "Computer Science",
        "minor": "Mathematics",
        "user_notes": "Nothing to see here"
      },
      {
        "name": "NoName",
        "username": "Nothing",
        "compatible_classes": [
          "CS 453"
        ],
        "major": "Computer Science",
        "minor": "Mathematics",
        "user_notes": "Nothing to see here"
      },
      {
        "name": "NoName",
        "username": "Nothing",
        "compatible_classes": [
          "CS 453"
        ],
        "major": "Computer Science",
        "minor": "Mathematics",
        "user_notes": "Nothing to see here"
      },
      {
        "name": "NoName",
        "username": "Nothing",
        "compatible_classes": [
          "CS 453"
        ],
        "major": "Computer Science",
        "minor": "Mathematics",
        "user_notes": "Nothing to see here"
      },
      {
        "name": "NoName",
        "username": "Nothing",
        "compatible_classes": [
          "CS 453"
        ],
        "major": "Computer Science",
        "minor": "Mathematics",
        "user_notes": "Nothing to see here"
      }
    ]
}
```

## Error Response

**Example**

```json
{
    "success": false,
    "message": "Invalid User ID"
}
```

### Return Incoming Matches for User

**Url**: `/api/users/:userID/matches`

**Method**: `GET`

## Success Response

**Example**

```json
{
      "success": true,

      "data": [
        {
          "name": "NoName",
          "username": "Nothing",
          "compatible_classes": [
            "CS 453"
          ],
          "major": "Computer Science",
          "minor": "Mathematics",
          "user_notes": "Nothing to see here"
        },
        {
          "name": "NoName",
          "username": "Nothing",
          "compatible_classes": [
            "CS 453"
          ],
          "major": "Computer Science",
          "minor": "Mathematics",
          "user_notes": "Nothing to see here"
        },
        {
          "name": "NoName",
          "username": "Nothing",
          "compatible_classes": [
            "CS 453"
          ],
          "major": "Computer Science",
          "minor": "Mathematics",
          "user_notes": "Nothing to see here"
        },
        {
          "name": "NoName",
          "username": "Nothing",
          "compatible_classes": [
            "CS 453"
          ],
          "major": "Computer Science",
          "minor": "Mathematics",
          "user_notes": "Nothing to see here"
        },
        {
          "name": "NoName",
          "username": "Nothing",
          "compatible_classes": [
            "CS 453"
          ],
          "major": "Computer Science",
          "minor": "Mathematics",
          "user_notes": "Nothing to see here"
        }
      ]
}
```

## Error Response

**Example**

```json
{
      "success": false,
      "message": "Unauthorized user"
}
```

### Sending Match request from user 1 to user 2

**Url**: `/api/notifications/:userID1/:userID2`

**Method**: `POST`

## Success Response

**Example**

```json
{
  "success": true
}
```

## Error Response

**Example**

```json
{
  "success": false,
  "message": "unauthorized"
}
```

### Meeting Scheduling

**Url**: `/api/create_meeting`

**Method**: `POST`

**Payload**:

```json
{
      "class": "CS 326",
      "meeting_times": [
        {
          "day": "Mon",
          "start_time": 1900,
          "end_time": 2100
        },
        {
          "day": "Fri",
          "start_time": 1300,
          "end_time": 1500
        }
      ]
}
```

## Success Response

**Example**

```json
{
      "success": true,
      "data": "available_times"
}
```

## Error Response

**Example**

```json
{
      "success": false,
      "message": "unable to find desired meeting time"
}
```

### incoming Notifications/Match requests 

**Url**: `/api/notifications/:userID`

## Success Response

**Example**

```json
{
      "success": true,
      "data": {
        "matchReqs": ["CSMajor123", "MathMajor456"]
      },
}
```

## Error Response

**Example**

```json
{
      "success": false,
      "message": "User's profile is private"
}
```

### Users' Current Meetings

**Url**: `/api/users/:userID/meeting`

## Success Response

**Example**

```json
{
      "success": true,
      "data": {
        "meetings": [
          {
            "day": "Mo",
            "start_time": 1430,
            "end_time": 1530,
          },
          {
            "day": "We",
            "start_time": 1500,
            "end_time": 1600,
          },
          {
            "day": "Fr",
            "start_time": 1430,
            "end_time": 1530,
          }
        ]
      },
}
```

## Error Response

**Example**

```json
{
      "success": false,
      "message": "User's profile is private"
}
```


## Student

get_student

**URL** : `/api/student?studentID`

**URL Parameters** : `studentID=[string]` where `studentID` is the search query.

**Method** : `GET`

### Response

A student profile info to display, only displays if the current logged in user is the requested student or the profile is not private

**Example**

if the requested student exists

```json
[
  "_id": "ObjectId('63796db00d2cb3075765f4db')"
  "studentID": "Student0"
  "realName": "J Doe"
  "currentClasses": "[CS 326]"
  "previousClasses": "[CS 311]"
  "bio": "man/woman of mystery"
  "contactInfo": "123-456-7890"
  "privateProfile": "false"
  "lookingForPartners": "false"
  "partners": "[Chris Manning, Andrew LaBelle, Gavin Cho]"
]
```

if the requested student does not exist

```json
[
  "success": "false",
  "message": "Student does not exist",
]
```

# Deployment

(https://young-inlet-68897.herokuapp.com/)

# Division of Labor

Gavin:

- implemented back-end functionality for registering/creating accounts for students
- implemented back-end functionality logging in and logging out
- implemented algorithm for scraping class data from spire with spireScraper.mjs
- refactored original index.ts into multiple ts files in the api folder
- implemented back-end functionality for searching
- setup minicrypt.ts and multiple library imports for future use of mongodb
- setup backbone for implenting mongodb function calls into project
- implemented "me" API call

Andrew:

- implemented get_matches API call
- implemented get_meetings API call
- implemented get_compatible_partners API call
- implemented back-end functionality for creating/reading meetings
- aggregated functionality of creating meetings to send_meeting_requests
- implemented back-end functionality for reading matches 
- implemented algorithm for automatic meeting scheduling

Chris:
- created Student API which serves as a collection of previous API calls that were unsorted
- aggregated previousCourses api call functionality to get_student API call
- implemented back-end functionality to the database for getting a users notifications
- aggregated getting current study partners API call functionality to get_student API call
- implemented back-end functionality for getting a students information
- reformatting heroku deployment to coincide with the transition to an actual database (MongoDB) 
- created the MongoDB database and connected it to the Heroku app for use in deployment
