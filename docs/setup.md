# Requirements
- Node.js and npm installed.
- an existing Node.js app.
- a free Heroku account.
- the Heroku CLI.
- a copy of the this repo.

## to setup and deploy this locally:
in the terminal use the commands 
- npm install
- heroku local web

## to setup and deploy to heroku:
in the terminal run these commands
- heroku login
- heroku create
- git push heroku main

packages and dependencies should already be included in the repo and thus the above commands should suffice in deploying

## Heroku-less approach:
in the terminal run
- npm install
- npm run build 
- npm run dev
