# nc-news
A restful API for a reddit-like news site for Northcoders using Nodejs, Express, MongoDB and Mongoose.

Deployed [here](https://serene-ocean-62601.herokuapp.com/)

# Setup:

### Check that node is installed

```node -v```

Install [here](https://nodejs.org/en/download/package-manager/)

### Check npm is installed

```npm -v```

Install [here](https://www.npmjs.com/get-npm)

### Check git is installed

```git --version```

Install [here](https://git-scm.com/)

Install Mongo [here](https://docs.mongodb.com/manual/installation/)

# To run:
In order to run this project you will need to clone onto your local machine and install all dependencies.

Navigate to your favoured directory and clone the repository using this link: 

```https://github.com/barks1212/nc-news.git```

Change into the project directory with:

```cd nc-news```

Open a seperate terminal window and run:

```mongod```

This will launch the database ready for connections, this needs to be left running in the background.

Install all project dependancies using:

```npm install``

### Note: The package.json includes a postinstall script which should seed the databases automatically upon installing. It is imperative to be running mongod BEFORE INSTALL or the seed will fail due to not being able to connect to the DB's

```node seed/seed.js``` - manually seeds main database

```node seed/test.seed.js``` - manually seeds test database

```npm run dev``` - starts dev server

```npm test``` - starts test server and runs test (server will d/c once tests have ran)

The server will run locally on http://localhost:3000. By default this route contains a guide to the various endpoints available with this API.


# Description
Back end portion for a reddit like news site. I've been very conscious of best practises when it comes to the file structure within the project directory, setting up index files when necessary and trying to keep everything seperate. At no point did I want the logical path to become obscure:

app - routes/api - routes/index - routes/articles - controllers/articles - models/models - models/articles

This practise is carried on even as far as testing with each controller having it's own spec file with tests for error handling seperated from the main batch of tests.

A challenge here was thinking ahead to components I might need when building the Front End of this application. The schema's, for the most part, are sufficient and I was able to write fairly straight forward functions to acquire the data I needed. However, as plans began to develop the need for more complex data arose. For example in controllers/users:

I wanted to implement a reputation/karma system similar to Reddit, which tallys each users total votes that they have accrued on both articles and comments they have posted. This involved creating a data structure by finding all current users and, using map, creating arrays of their articles and comments. For each user I then reduced over each of their articles and comments arrays to acquire a total and apply it to each users newly created totalVotes property. Given the length of the promise chain this function quickly became convoluted, I therefore extracted some of the logic into two outside, helper functions which deal with the reduction and creation of the new key/value pair for each user:



    function updateTotalVotes(user, votes) {
    return Object.assign({}, user, {
    totalVotes: user.totalVotes ? user.totalVotes + votes : votes
    })
    }

    function reduceToVoteCount(collection) {
    return collection.reduce((total, item) => total + item.votes, 0);
    }  