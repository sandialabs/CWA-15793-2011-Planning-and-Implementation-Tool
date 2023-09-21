const low = require('lowdb') // import lowdb
const FileSync = require('lowdb/adapters/FileSync') // import filesync
const adapter = new FileSync('./evaldb.json') // instantiate db object
const db = low(adapter)
const moment = require("../node_modules/moment/min/moment.min.js")
// set database default objects: a timestamp of the database creation, a field for all comments to be added, and user
db.defaults({ file: []})
    .write()

///// NEW FILE /////

var newFile_readiness = false; // initialize variable to determine if a valid file name was entered and program can begin evaluation process

function newFile(fileName) {
    var regex = new RegExp("[^a-zA-Z0-9_-]"); // only letters, numbers, and _ are allowed as filename characters
        allNames = db.get('file').map('fileName').value().join('~').toLowerCase().split('~')    // retreive existing file names and make lowecase -- this ensures there will
                                                                                                // be case sensitivity visible in database but filenames are otherwise not case sensitive 
    if (allNames.includes(fileName.toLowerCase()) && fileName.length !== 0) { 
        alert("File name already exists; please pick another.\nFile names are not case sensitive.")
    }
    else if (fileName.length === 0 || regex.test(fileName)) {
        alert("Please only use letters, numbers, dashes, or underscore characters.\nFile names are not case sensitive.")
    }
    else {
        db.get('file')
        .push({ fileName: fileName, creationTime: moment().format('D MMM YYYY [at] h:mm:ss a'), evalData: [] }) // filename characters are all made lowercase
        .write()

        newFile_readiness = true; // ready to proceed
    }
}

//// LOAD AS NEW ////

var asNew_readiness = false; // initialize variable to determine if a valid file name was entered and program can begin evaluation process

function asNew(fileToClone, enteredFileName) {
    var regex = new RegExp("[^a-zA-Z0-9_-]"); // only letters, numbers, and _ are allowed as filename characters
        allNames = db.get('file').map('fileName').value().join('~').toLowerCase().split('~')    // retreive existing file names and make lowecase -- this ensures there will
                                                                                                // be case sensitivity visible in database but filenames are otherwise not case sensitive 
    if (allNames.includes(enteredFileName.toLowerCase()) && fileName.length !== 0) {
        alert("File name already exists; please pick another.\nFile names are not case sensitive.")
    }
    else if (enteredFileName.length === 0 || regex.test(enteredFileName)) {
        alert("Please only use letters, numbers, dashes, or underscore characters.\nFile names are not case sensitive.")
    }
    else {
        var copiedData = db.get('file').find({ fileName: fileToClone }).get('evalData').value() // initialize variable to holder User Answer from file to be cloned
        db.get('file')
        .push({ fileName: enteredFileName, creationTime: moment().format('D MMM YYYY [at] h:mm:ss a'), evalData: copiedData }) // push copiedData into database under the new name
        .write()

        asNew_readiness = true; // ready to proceed
    }
}

//// CHECK READINESS ////

function newFile_isReady() {
    return newFile_readiness
}

function asNew_isReady() {
    return asNew_readiness
}

///// WRITE USERANS /////
// this function pushes the userAns into the evalData object for each userAns submission, along with an ID (increments by one for each userAns) and timestamp MAYBE PUT USER ID HERE?

function writeData(userAns, enteredFileName) {
    
    if (db.get('file').find({ fileName : enteredFileName }).get('evalData').value() === undefined) {
        // if there is nothing in evalData, create a new field for evalData
        db.get('file').find({ fileName : enteredFileName }).get('evalData') // note that the variable "fileName" includes all file names in the db, while enteredFileName is the single just entered by user
        .push(userAns) // add the survey data into the database
        .write()
    }
    else {   
        // if there's already information in the evalData field for the file, write over existing
        db.get('file').find({ fileName : enteredFileName }).get('evalData')
        .splice(0, 1, userAns) // remove existing and add new
        .write()
    }
}

///// GET ALL FILE NAMES /////

function getFileNames() {
    fileNames = db.get('file').map('fileName').value()
    return fileNames
}

//// DELETE FILES ////

function deleteOne(enteredFileName) {
    db.get('file')
    .remove({ fileName : enteredFileName })
    .write()
}

function deleteAll() {
    db.assign({file: []})
    .write()
}

/* NOT IN USE


///// GET ALL FILE AGES /////
// this function returns an array containing the age in seconds of each file in the JSON database 
function getFileAges() {

    var fileSubmitTime = [] // initialize an array to hold all comment timestamps
        fileAge = [] // initialize an array to hold age calculation
        fileSubmitTime = db.get('file').map('creationTime').value() // get timestamps from database

        for (counter = 0; counter < fileSubmitTime.length; counter++){ // for each comment's timestamp
            fileAge.push(Math.round((Date.now() - fileSubmitTime[counter])/1000)); // push the difference between the current time and timestamp for each comment into array
        }
        return fileAge; // return age array
}
*/