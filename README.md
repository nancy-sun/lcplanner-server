# lcplanner-server

Frontend repo: https://github.com/nancy-sun/lcplanner-server
## Description  
This is the server repo for LCPlanner. LCPLanner is a fullstack mobile app for leetcode users to keep a record of problems they have accomplished and problems they plan to do. The app also allow users to share their progress with peers to provide better peer learning experience.   

&nbsp;

## Installation  
### Requirement
- Node.js
- npm
- Redis
      
Download / clone source code locally   
```$ git clone https://github.com/nancy-sun/lcplanner-server```
   
Install dependencies   
```$ npm install```   
   
Start running   
```$ npm start```
      
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
- default apollo server url: http://localhost:4000/

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
- 
   
&nbsp;

## Future Discussions
- 
   
&nbsp;

## Author  
[@Nancy Sun](https://github.com/nancy-sun)

