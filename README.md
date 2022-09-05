# Learn4Fund Web Application

Learn4Fund is a fictitious E-commerce portal that allows users to purchase and redeem digital vouchers for online courses in various industry certifications.

With a mission to empower the less privileged with education, a percentage of its profit would be donated to the charity. The website entails features that allow users (individuals or corporate members) to register, access, and manage their accounts, search for courses to purchase and enroll, make digital transactions, provide reviews, and store users' information. Users may opt to donate anonymously or be featured on the Donors Appreciation page. Attractive deals are offered to all donors, as a gesture of appreciation for their support of the Learn4Fund cause. Special offers are regularly sent to users via newsletter subscription service. 

The company behind Learn4Fund, Titans, shall ensure that its website, users' personal identifiable information(PII) and donations are safeguarded from adversaries and cyberattacks. 



## Installation

run npm install on first pull.

run yarn upgrade if there is new installation

install docker desktop to run the web with docker

## Run application
### Running application without docker

1. navigate to frontend folder and run **npm start** to start the frontend.

2. navigate to backend folder and run **nodemon server** to start the backend.

### Running application with docker
1. Navigate to the highest level directory
   - cd <>
2. To start both frontend and backend:
   - docker-compose -f docker-compose.dev.yml up --build
3. To shutdown entirely
   - Ctrl + C
   - docker-compose -f docker-compose.dev.yml down

## Git Workflow
- Normally, all PR from any branches should land in dev branch.
- Normally, only dev branch can PR to master branch.
- Good practice to always branch out of dev.
- git checkout -b feature/login-kevin dev (Example to always create a branch based on dev)
- git push -u origin <branchname> (set upstream to remote)

## Project set up steps using command lines & other useful commands
Clone project
- git clone https://github.com/ict3x03-Learn4Fund/Learn4Fund.git

**Checkout main branch**
- git checkout main

**Create and checkout branch**
- git checkout -b <branchname>

**Push your branch to GitHub**
- git push -u origin <branchname>

*Basic workflow*:
  - Checkout your branch
  - git checkout <branchname>

Code and test your code

Stage your changes to the branch (best practice to add the files that you modified only)
- git add <file name>

**Commit your changes**
- git commit -m “<commit message>”
or
- git commit Press enter and type the summary and description for the commit. Then press esc and type :wq

**Push your changes to Github**
- git push

**Get updates from master branch to your own branch**:
- Check out master branch
- git checkout master

**Pull updates from remote master branch to local master branch**
- git pull

**Change back to your branch**
- git checkout <branchname>

**Merge master branch code to your branch**
- git merge master

**Once your feature is completed, merge it to master branch**:
- You can create a pull request in Github to merge your branch to master branch

OR
**Checkout master branch**
- git checkout master

**Merge your branch to master branch**
- git merge <branchname>

**Push merged code to master branch in Github**
- git push

Note: Best practice to commit your changes regularly
