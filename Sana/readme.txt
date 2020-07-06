Group 6: 
	
Wen, Yining     
	
Savani, Shivam
	
Barua, Siddhant
	
Gao, Xiaojie




Set up:

1. Start up MongoDB server

2. Execute "npm run seed" which runs the seed.js to initialize the database
Note:
The initialized database contains an administrator account: "admin", password: "123456" and "Michael", "Jeff", 	"Pablo", "Jess", "Emma", 5 common users and their passwords are "123456". It also contains 5 courses, 5 personal trainers and 17 recipes.

3. Execute "npm install" 

4. Execute "npm start" to start the server

5. Go to http://localhost:3000 in the browser to get into the website.

Core Functions: 

1. In "Login" page, besides login, user can create new account and set password by email if he/she forgot password. 

2. "About" navigation contains the basic information about this Website.

3. "Course" navigation display all the courses information and user can register/drop/comment courses after logged in.

4. "Trainer" navigation display all the coaches information and user can register/drop/comment trainers after logged in.

5. For common user, "Account" navigation display user's information, and provide change information/password, recommend courses and recipes according to user's height and weight and gives user links to register/drop/comment courses and trainers.

6. For administrator, "Account" navigation give admin links for displaying/adding/updating/deleting courses/trainers/recipes.

Features:

1. Active new account by email. 

2. Time conflict checking when register courses/trainers.

3. Restrict only user who has registered for the course/trainer can comment the course/trainer.

4. Recommend courses/recipes.
