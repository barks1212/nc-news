# nc-news
A reddit-like news site for Northcoders - Back end

# To seed:
node seed/seed.js - seeds main database

node seed/test.seed.js - seeds test database

# To run:
npm i

npm run dev - starts dev server

npm test - starts test server and runs test (server will d/c once tests have ran)

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