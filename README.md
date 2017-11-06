# express-rest-api
## An express app that creates an API through a MongoDB database

1. Make sure MongoDB and Postman are installed on your system.
2. Run ```npm install``` to install project dependencies. 
3. Open two tabs on the terminal, one to run the MongoDB shell, the other run project routes with ```npm start```


### Postman Routes
- POST Create User (fullName, emailAddress, password, confirmPassword)
- GET Users (make sure Authorization is set to Basic Auth. Username is emailAddress)
- POST Create Course Minimum Data
- POST Create Review (rating, user._id)
