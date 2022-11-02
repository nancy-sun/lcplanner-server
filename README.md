# lcplanner-server
![logo](https://user-images.githubusercontent.com/99620863/199389894-aca03c24-4b36-4f05-b73a-4ad9bba04fc7.svg)

Frontend repo: https://github.com/nancy-sun/lcplanner

&nbsp;

## Description  
This is the server repo for LCPlanner. LCPLanner is a fullstack mobile app for leetcode users to keep a record of problems they have accomplished and problems they plan to do. The app also allow users to share their progress with peers to provide better peer learning experience.   

&nbsp;

## Installation  
      
### Set up Database (backend)
[Setup MongoDB Atlas](https://www.mongodb.com/docs/atlas/getting-started/)

### Download / clone source code locally   
```$ git clone https://github.com/nancy-sun/lcplanner-server```
   
### Install dependencies   
```$ npm install```   
   
### Create .env:   
Please refer to `example.env` for details
### Start running   
```$ nodemon index.js```
      
&nbsp;

## Tech Stack
- Node.js
- GraphQL
- ApolloServer
- JWT
- MongoDB

## Libraries & Resources  
- cors
- bcrypt
   
&nbsp;

## API Documentation 
### Overview 
- Default apollo server url: http://localhost:4000/

### Queries
- `myTasksList`: returns TaskList object.
- `getTasksList(id: ID!)`: requires TasksList `id`, returns TaskList object.
- `getUser(id: ID!)`: require user `id`, returns user object.
- `getAccessTasksList`: returns an arrays of TasksList objects.
- `getLCData(username: String!)`: requires leetcode username, returns object from leetcode graphql api.

### Mutations
- `signUp(input: SignUpInput!)`: requires sign up input object, returns user object and JWT token.
- `signIn(input: SignInInput!)`: requires sign in input object, returns user object and JWT token.
- `createTasksList(recap: String)`: returns TasksList object.
- `updateTasksList(id: ID!, recap: String)`: requires TasksList `id`, returns TasksList object.
- `deleteTasksList(id: ID!)`: requires TasksList `id`, return `true` if successfully deleted.
- `addTasksListUser(tasksListID: ID!, userEmail: String!)`: requries TasksList `id` and user's email to add, returns updated TasksList object.
- `createTask(title: String!, date: String!, deadline: String, note: String, tasksListID: ID!)`: requires task title, task date and TasksList `id`, returns Task object.
- `updateTask(id: ID!, title: String, date:String, deadline: String, note: String, isCompleted: Boolean)`: requires Task `id`, return Task object.
- `deleteTask(id: ID!)`: requires Task `id`, return `true` if successfully deleted.
   
&nbsp;

## Prototype 

https://user-images.githubusercontent.com/99620863/199389911-35757ac0-548a-4f54-ba62-0444f768cf61.mp4
   
&nbsp;

## Future Discussions
- Add autocomplete of leetcode problems on task inputs for better user experience.
- Allow users to set deadline for each task.
- cache tasks data offline.
- Add push notifications to remind users to complete tasks.
- Include more information in the contribution graph.
- Add passport.js login options.
   
&nbsp;

## Author  
[@Nancy Sun](https://github.com/nancy-sun)

