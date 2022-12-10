# Team Lambda: Study Buddies (Fall 2022 Semester)
# Overview
Study Buddies is a web application to help UMass student find partners to study with. 
# Team Members
-   Andrew LaBelle ([https://github.com/alabelle127](https://github.com/alabelle127))
-   Gavin Cho ([https://github.com/gavin-k-cho](https://github.com/gavin-k-cho))
-   Chris Manning ([https://github.com/KaenCS](https://github.com/KaenCS))
# User Interface
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
## List of Compatible Partners (TODO)
## Return Incoming Matches for User (TODO)
## Sending Match request from user 1 to user 2 (TODO)
## Meeting Scheduling (TODO)
## Incoming Notifications/Match requests (TODO)
## User's Current Meetings (TODO)
# Database
# Authentication/Authorization
# Division of Labor
# Conclusion