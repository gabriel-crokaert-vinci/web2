const { json } = require('express');
const fs = require('fs');

function serialize(filePath, object){
    const objectSerialized = JSON.stringify(object);
    createPotentialLastDirectory(filePath);
    fs.writeFileSync(filePath, objectSerialized);
}
function createPotentialLastDirectory(filePath) {
    const pathToLastDirectory = filePath.substring(0, filePath.lastIndexOf('/'));

    if(fs.existsSync(pathToLastDirectory)) return;

    fs.mkdirSync(pathToLastDirectory);
}

function parse(filePath, defaultArray = []) {
    if(!fs.existsSync(filePath)) return defaultArray;
    const fileData = fs.readFileSync(filePath);
    try{
        return JSON.parse(fileData);
    }
    catch (err){
        return defaultArray;
    }
}

module.exports = { parse, serialize };