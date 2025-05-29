# Labyrinth: Lab Reservation System
As part of our ITSECWB Case Study, this project aims to add security controls to a lab reservation system. 
This application allows students to reserve seats in a desired computer laboratory.

## Description
Labyrinth is a lab reservation web application where students can view availability of lab slots and reserve them. Lab technicians are also able to reserve for walk-in students and modify any reservations.

## Getting Started

### Dependencies

* NodeJS
* MongoDB

### Installation

* Download ZIP of main branch on GitHub
* Extract to desired folder (ex: C:\Users\Me\Downloads)
* On command prompt, change directory to the path of the project folder. Example command below:
```
cd Downloads/ITSECWB-main
``` 

* Use the package manager [npm] to initialize the folder as a NodeJS project.

```
npm init -y
```

* Use [npm] to install the required Node libraries
```
npm install express hbs path express-fileupload express-session mongoose cookie-parser
```

### Executing program

* Go to command prompt
* Change directory to the path of the project folder. Example command below:
```
cd Downloads/CCAPDEV_MCO-main
```

* Populate the database by executing the populateDB script with this command:
```
node populateDB.js
```
* Run the Node.js server locally using the command:
```
node index.js
```
* On your browser, enter the URL "localhost:3000" to access the Labyrinth homepage

## Help

Ensure port 3000 is free on your device before running the server

## Original Authors
Jeremiah Maxwell Ang
[@jeremiahmaxwellang](https://github.com/jeremiahmaxwellang)

Lianne Maxene Balbastro
[@LianneMax](https://github.com/LianneMax)

Charles Kevin Duelas
[@Duelly01](https://github.com/Duelly01)

Kyle de Jesus
[@ikyledj](https://github.com/ikyledj)

## ITSECWB Group 10 Members

Jeremiah Maxwell Ang
[@jeremiahmaxwellang](https://github.com/jeremiahmaxwellang)

Charles Kevin Duelas
[@Duelly01](https://github.com/Duelly01)

Justin Lee
[@juicetice](https://github.com/juiceticedlsu)

## Acknowledgments
* Miss Katrina Solomon - ITSECWB Professor
* Sir Arturo Caronongan - CCAPDEV Professor
* [techie delight](https://www.techiedelight.com/generate-sha-256-hash-javascript/)
