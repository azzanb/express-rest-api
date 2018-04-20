# Create an API with MongoDB 
## An express app that creates an API through a MongoDB database, with the help of Postman to check the validity 

1. Make sure MongoDB and Postman are installed on your system.
2. Run ```npm install``` to install project dependencies. 
3. Open two tabs on the terminal, one to run the MongoDB shell, the other run project routes with ```npm start```
4. All routes are through `localhost:5000/`


### Postman Routes
- POST `/api/users/ - Create User (fullName, emailAddress, password, confirmPassword)
- GET `/api/user` - Users (make sure Authorization is set to Basic Auth. Username is emailAddress)
- POST `/api/courses/` - Must have title, description, steps, and user ID
- POST `/api/courses/course:id/reviews` - Create Review (rating, review, which is optional, and user._id)
- PUT `/api/courses/course:id` - Update course information


