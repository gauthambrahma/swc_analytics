// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const fs=require("fs");
//var remote = require('remote'); 

 const {dialog} =require("electron").remote 

 const path = require("path");
 const csv = require('fast-csv');


 document.getElementById("open-attendance-csv-btn").addEventListener("click",()=>{
    dialog.showOpenDialog({ properties: ['openFile']},(filenames)=>{
        if(filenames == undefined){
            console.log("No files were selected");
            return;
        }
         attendanceCSVFile = getFile(filenames[0]);
         console.log(attendanceCSVFile);
        // var attendanceWithRelevantFields = removeIrrelaventFields(attendanceCSVFile);
     });
 },false);

 function removeIrrelaventFields(CSVFile){
    //  var output = CSVFile.filter(x=>{
         
    //  })
 }

 function getFile(fileName){
    var dataArr = [];
    csv.fromPath(fileName, {headers: true})
   .on("data", data => {
        dataArr.push(data);
    })
    .on("end", () => {
        console.log("Successfully read " + dataArr.length + " records");
    });
    return dataArr;
 }

