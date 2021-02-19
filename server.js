const express = require("express");
const app = express();

const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

const port = process.env.PORT || 5000;

// Start listening on port 5000
app.listen(port, () => console.log(`Listening on port ${port}`));

// Person includes:
// firstName, lastName, dateOfBirth, emailAddress, socialSecurityNumber

// Returns appropriate http response codes
// 200 -- success for GET, PUT and DELETE
// 201 -- success  for POST
// 400 -- client side errors. Include a message to the user about what the error is
// 500 -- unknown server side errors. Probably use try/catch

function checkPersonFields(person) {
    var emailRegex = /\S+@\S+\.\S+/;
    var ssnRegex = /^(?!000|666)[0-8][0-9]{2}-(?!00)[0-9]{2}-(?!0000)[0-9]{4}$/;
    
    if (!person.firstName ||
        !person.lastName ||
        !person.dateOfBirth ||
        !person.emailAddress ||
        !person.socialSecurityNumber) {
        return false;
    }

    if ((!isNaN(Date.parse(person.dateOfBirth))) &&
        (ssnRegex.test(person.socialSecurityNumber)) &&
        (emailRegex.test(person.emailAddress.toLowerCase()))) {
        return true;
    } else {
        return false;
    }
}

function ssnExists(ssn) {
    for ( i = 0; i < people.length; i++) {
        console.log(people[i]);
        if (people[i].socialSecurityNumber === ssn) {
            return true;
        }
    }
    return false;
}

var people = [];

// GET /person
// Return all of the person objects in the running app
app.get("/person", function (req, res) {
    try {
        res.statusCode = 200;
        res.json(people)
    } catch (error) {
        console.log(error);
        res.statusCode = 500;
        res.send({    
            message: "Server Error"
        });
    }
});

// POST /person
// Create a new person in the running app and return that person as JSON in the POST result
// All person fields are required
// Don't allow missing or badly formatted fields (ie DOB and email address should be correctly formatted)
// No duplicate persons (with same SSN)
app.post("/person", function (req, res) {
    try {
        var person = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dateOfBirth: req.body.dateOfBirth,
            emailAddress: req.body.emailAddress,
            socialSecurityNumber: req.body.socialSecurityNumber            
        }
        if (!checkPersonFields(person)) {
            res.statusCode = 400;
            res.send({    
                message: "Incorrect data format"
            });
        } else if (ssnExists(person.socialSecurityNumber)) {
            res.statusCode = 400,
            res.send({
                
                message: "Person with that SSN already exists"
            });
        } else {
            people.push(person);
            res.statusCode = 201;
            res.json(person);
        }
    } catch (err) {
        console.log(err);
        res.statusCode = 500;
        res.send({
            message: "Server Error"
        });
        return;
    }
});

// GET /person/:socialSecurityNumber
// Return the single person in the running app (if a person with that SSN exists)
app.get("/person/:socialSecurityNumber", function (req, res) {
    try {
        for (i = 0; i < people.length; i++) {
            if (people[i].socialSecurityNumber === req.params.socialSecurityNumber) {
                res.statusCode = 200;
                res.json(people[i]);
                return;
            }
        }
        res.statusCode = 400;
        res.send({
            message: "Social security number not found"
        });
    } catch (error) {
        console.log(error);
        res.statusCode = 500;
        res.send({    
            message: "Server Error"
        });
    }
});

// PUT /person/:socialSecurityNumber
// // Update an existing person and return the person as JSON
app.put("/person/:socialSecurityNumber", function (req, res) {
    try {
        var person = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dateOfBirth: req.body.dateOfBirth,
            emailAddress: req.body.emailAddress,
            socialSecurityNumber: req.params.socialSecurityNumber            
        }
        if (!checkPersonFields(person)) {
            res.statusCode = 400;
            res.send({    
                message: "Incorrect data format"
            });
        } else if (!ssnExists(person.socialSecurityNumber)) {
            res.statusCode = 400,
            res.send({  
                message: "Social security number not found"
            });
        } else {
            for (i = 0; i < people.length; i++) {
                if (people[i].socialSecurityNumber === req.params.socialSecurityNumber) {
                    people[i] = person;
                }
            }
            res.statusCode = 201;
            res.json(person);
        }

    } catch (err) {
        console.log(err);
        res.statusCode = 500;
        res.send({    
            message: "Server Error"
        });
    }
});

// DELETE /person/:socialSecurityNumber
// Delete the existing person (if person with that SSN exists)
app.delete('/person/:socialSecurityNumber', function (req, res) {
    try {
        for (i = 0; i < people.length; i++) {
            if (people[i].socialSecurityNumber === req.params.socialSecurityNumber) {
                people.splice(i, 1);
            }
        }
        res.statusCode = 200;
        res.send();
    } catch (err) {
        console.log(err);
        res.statusCode = 500;
        res.send({    
            message: "Server Error"
        });

    }
});
