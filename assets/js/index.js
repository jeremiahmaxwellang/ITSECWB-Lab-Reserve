// How to run the NodeJS Server:
//  1. Make sure you installed NodeJS

//  2. On the command prompt, change directory to this project folder

//  3. To run the server, enter the command "node <filename>.js"
//     node index.js

//  4. On your browser, go to localhost:3000/
//     You will see the server responds with a message

//  5. To close the server on the command prompt, do CTRL+C


const http = require('http');

const server = http.createServer((req,res) => {

    // When user requests url: http://localhost:3000/ 
    // Route user to index.html
    if (req.url === '/') {
        //TODO: Change this so that it sends the index.html file
        res.write('../../index.html');
        res.end(); //end response
    }

});

// Server listens on port 3000
server.listen(3000);

console.log("Labyrinth Server is listening on port 3000...");

