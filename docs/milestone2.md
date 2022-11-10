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
    success: true,
    // First two are examples, rest is filler
    data: [
      {
        name: "David Barrington",
        username: "dBKewper",
        compatible_classes: [
          "CS 326",
          "Math 471"
        ],
        major: "Computer Science",
        minor: "Mathematics",
        user_notes: "this stuff hard pls help :("
      },
      {
        name: "Michael Stevens",
        username: "Vsauce",
        compatible_classes: [
          "CS 576"
        ],
        major: "Physics",
        minor: "Computer Science",
        user_notes: "Unity is not my strongsuit"
      },
      {
        name: "NoName",
        username: "Nothing",
        compatible_classes: [
          "CS 453"
        ],
        major: "Computer Science",
        minor: "Mathematics",
        user_notes: "Nothing to see here"
      },
      {
        name: "NoName",
        username: "Nothing",
        compatible_classes: [
          "CS 453"
        ],
        major: "Computer Science",
        minor: "Mathematics",
        user_notes: "Nothing to see here"
      },
      {
        name: "NoName",
        username: "Nothing",
        compatible_classes: [
          "CS 453"
        ],
        major: "Computer Science",
        minor: "Mathematics",
        user_notes: "Nothing to see here"
      },
      {
        name: "NoName",
        username: "Nothing",
        compatible_classes: [
          "CS 453"
        ],
        major: "Computer Science",
        minor: "Mathematics",
        user_notes: "Nothing to see here"
      },
      {
        name: "NoName",
        username: "Nothing",
        compatible_classes: [
          "CS 453"
        ],
        major: "Computer Science",
        minor: "Mathematics",
        user_notes: "Nothing to see here"
      }
    ]
}
```

## Error Response

**Example**

```json
{
    res.status(400).json({
    success: false,
    message: "Invalid User ID"
}
```

### Return Incoming Matches for User

**Url**: `/api/users/:userID/matches`

**Method**: `GET`

## Success Response

**Example**

```json
{
      success: true,

      data: [
        {
          name: "NoName",
          username: "Nothing",
          compatible_classes: [
            "CS 453"
          ],
          major: "Computer Science",
          minor: "Mathematics",
          user_notes: "Nothing to see here"
        },
        {
          name: "NoName",
          username: "Nothing",
          compatible_classes: [
            "CS 453"
          ],
          major: "Computer Science",
          minor: "Mathematics",
          user_notes: "Nothing to see here"
        },
        {
          name: "NoName",
          username: "Nothing",
          compatible_classes: [
            "CS 453"
          ],
          major: "Computer Science",
          minor: "Mathematics",
          user_notes: "Nothing to see here"
        },
        {
          name: "NoName",
          username: "Nothing",
          compatible_classes: [
            "CS 453"
          ],
          major: "Computer Science",
          minor: "Mathematics",
          user_notes: "Nothing to see here"
        },
        {
          name: "NoName",
          username: "Nothing",
          compatible_classes: [
            "CS 453"
          ],
          major: "Computer Science",
          minor: "Mathematics",
          user_notes: "Nothing to see here"
        }
      ]
}
```

## Error Response

**Example**

```json
{
      success: false,
      message: "Unauthorized user"
}
```

### Sending Match request from user 1 to user 2

**Url**: `/api/notifications/:userID1/:userID2`

**Method**: `POST`

## Success Response

**Example**

```json
{
  success: true
}
```

## Error Response

**Example**

```json
{
  success: false,
  message: unauthorized
}
```

### Meeting Scheduling

**Url**: `/api/create_meeting`

**Method**: `POST`

**Payload**:

```json
const available_times = [
    {
      class: "CS 326",
      meeting_times: [
        {
          day: "Mon",
          start_time: 1900,
          end_time: 2100
        },
        {
          day: "Fri",
          start_time: 1300,
          end_time: 1500
        }
      ]
    }
  ];
```

## Success Response

**Example**

```json
{
      success: true,
      data: available_times
}
```

## Error Response

**Example**

```json
{
      success: false,
      message: "unable to find desired meeting time"
}
```


# Screenshots

# Heroku URL

https://young-inlet-68897.herokuapp.com/

# Division of Labor

Gavin:

- Initial express server setup
- Navbar with API
- Login/logout with API
- Register new account with API
- Class search with API
- Update account settings with API

Andrew:

- Finding list of Compatible Partners with API
- List of incoming matches for user with API
- Sending invite to match from user1 to user2 with API
- Meeting scheduling with API

Chris:
- fetching previous courses with API
- getting a users notifications with the API
- getting a users current study partners with API
- getting a users weekly scheduled meetings with the API
- setting up heroku deployment 
