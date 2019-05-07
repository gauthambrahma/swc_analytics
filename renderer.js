// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


/*-------------------- Global variables ----------------*/
const fs=require("fs");
//var remote = require('remote'); 

 const {dialog} =require("electron").remote 

 const path = require("path");
 const csv = require('fast-csv');
 const relavantColumns = ["Order Date","First Name","Last Name","Email","Please Specify","Status","Department/Degree?","Affiliation"];
 var attendanceHeaders = [];

/*-------------------- Event handlers ----------------*/
 document.getElementById("import-report-csv-btn").addEventListener("click",()=>{
    dialog.showOpenDialog({ properties: ['openFile']},(filenames)=>{
        if(filenames === undefined){
            console.log("No files were selected");
            return;
        }
        getFile(filenames[0],cleanAttendanceData);
     });
 },false);

 document.getElementById("save-attendance-csv-btn").addEventListener("click",()=>{
    dialog.showSaveDialog({ filters: [
        { name: 'CSV files', extensions: ['csv'] }
       ]},(fileName)=> {
        if (fileName === undefined){
            console.log("You didn't save the file");
            return;
        }
        var ws = fs.createWriteStream(fileName);
        csv.write(cleanedAttendance, {headers: true}).pipe(ws);
    }); 
 });

 document.getElementById("open-attendance-csv-btn").addEventListener("click",()=>{
    dialog.showOpenDialog({ properties: ['openFile', 'multiSelections']},(filenames)=>{
        if(filenames === undefined){
            console.log("No files were selected");
            return;
        }
        appendDailyAttendanceHeadersToCSV(filenames);
     });
 },false);

 document.getElementById("save-marked-attendance-csv-btn").addEventListener("click",()=>{
    dialog.showSaveDialog({ filters: [
        { name: 'CSV files', extensions: ['csv'] }
       ]},(fileName)=> {
        if (fileName === undefined){
            console.log("You didn't save the file");
            return;
        }
        var ws = fs.createWriteStream(fileName);
        csv.write(cleanedAttendance, {headers: true}).pipe(ws);
    }); 
 });
/*-------------------- Functions ----------------*/

 function getFile(fileName,callbackFn){
    var dataArr = [];
    csv.fromPath(fileName, {headers: true})
   .on("data", data => {
        dataArr.push(data);
    })
    .on("end", () => {
        console.log("Successfully read " + dataArr.length + " records");
        callbackFn(dataArr);
    });
    return dataArr;
 }

 function cleanAttendanceData(inputCSV){
    //cleanedAttendance is a global variable
    cleanedAttendance = [];
    inputCSV.forEach(function(array){
        cleanedAttendance.push(Object.keys(array).filter(key => relavantColumns.includes(key)).reduce((obj,key) => {
            obj[key] = array[key];
            return obj;
        },{}));
    });
    cleanedAttendance.sort((a,b) => (a.Email > b.Email) ? 1 : ((b.Email > a.Email) ? -1 : 0)); 
    console.log(cleanedAttendance);
    createTableFromJson(cleanedAttendance,"tableContainer1");
 }

function appendDailyAttendanceHeadersToCSV(filenames){
    for(var i=0;i<filenames.length;i++){
        var headerName = "day "+i;
        cleanedAttendance.forEach(x =>{ 
            x[headerName] = null;
        });
        attendanceHeaders.push(headerName);
    }
    filenames.forEach(x=>getFile(x,appendAttendanceToCSV));
} 

function appendAttendanceToCSV(array){
    if(attendanceHeaders.length === 0){
        console.error("Something went wrong");
        return;
    }
    var header = attendanceHeaders[0];
    var names = array.map(x=>x.Name);
    cleanedAttendance.forEach(attendance_record=>{
        attendance_record[header] = names.includes(attendance_record["First Name"]+" "+attendance_record["Last Name"])? true : false;
    });
    attendanceHeaders.shift();
    document.getElementById("save-marked-attendance-csv-btn").classList.remove("disabled");
 }

/*----------------------DOM Manipulation functions-------------------------*/
function createTableFromJson(jsonData,tableContainer){
    table = "<table><thead><tr>";
    var headers = Object.keys(jsonData[0]);
    for(index in headers){
        table += "<th>"+ headers[index] +"</th>";
    }
    table+="</thead></tr><tbody>";
    for(data in jsonData){
        table += "<tr>";
        for(record in jsonData[data]){
            table+= "<td>" + jsonData[data][record] + "</td>";
        }
        table += "</tr>";
    }
    table += "<tbody></table>";
    document.getElementById(tableContainer).innerHTML = table;
    document.getElementById("save-attendance-csv-btn").classList.remove("disabled");
    document.getElementById("open-attendance-csv-btn").classList.remove("disabled");
}
