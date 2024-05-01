# Read the Readme file before run the code

## INSTRUCTIONS
# Make sure your system have the Docker and git(optional) if you use clone the project then git will be must
 ## for git user
    - git clone https://github.com/RishabhSingh4872962/todo-docker-app.git 
 ## for not git user   
 - if don't want to install git then download the zip file
 - extract the code from the file use  ## Winrar 
 - open unzip folder in any code editor

 ## Installation
 - search .env.example file   (#Rename the file) remove the  .example  from the .env.example file
 - make sure file name should be .env
 - copy PORT ,MONGO_URL ,JWT_SECRET_KEY ,JWT_EXPIRE and their values to .env file
![Screenshot 2024-04-23 224747](https://github.com/RishabhSingh4872962/todo-docker-app/assets/109566428/c39aeb98-4bda-4d7a-ad0b-0f993722438d)
   - it should be looks like 
     - PORT=3001
     - MONGO_URL=mongodb://localhost:27017/chatify
     - JWT_SECRET_KEY=$Sh_rIsH@639542
     - JWT_EXPIRE=3Days

## RUN
 - open terminal in code editor
### run
    docker compose up

  - open any browser  enter this url http://localhost:3001/docs/
