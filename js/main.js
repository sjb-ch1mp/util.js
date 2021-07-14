class Utility{
    constructor(name, description, execute){
        this.name = name;
        this.description = description;
        this.execute = execute;
    }
    showDescription = () => {
        consoleLog("Utility: \"" + this.name + "\"", "head");
        consoleLog(this.description, "block");
    }
    executeUtility = () => {

        doPreUtilityCleanUp();

        consoleLog("Executing utility \"" + this.name + "\"", "head");

        try{
            let result = this.execute(getFileInput(), getTextInput())
            if(result.isCallback){
                consoleLog(result.query, "prompt");
            }else if(result.isErrorResult){
                consoleLog(result.message, "err");
            }else{
                RESULT = {"utility":this.name,"result":result};
                showResult();
                consoleLog("Utility completed successfully.");
            }
        }catch(err){
            consoleLog("Utility completed with error: " + err, "err");
        }

        doPostUtilityCleanUp();
    }
    render = () => {
        const utilities = document.getElementById('utilities');
        let utilityMenuItem = buildUtilityMenuItem(this);
        utilityMenuItem.classList.add('utility_button');
        utilities.appendChild(utilityMenuItem);
    }
}

function renderUtilities(){
    let utilities = getUtilities();

    for(let i in utilities){
        utilities[i].render();
    }
}

function buildUtilityMenuItem(utility){
    let button = document.createElement('button');
    button.onmousedown = (event) => {
        if(event.altKey){
            utility.showDescription();
        }else{
            utility.executeUtility();
        }
    };
    button.innerText = utility.name;
    return button;
}

function doPreUtilityCleanUp(){

    if(!(document.getElementById('user_input_form').onsubmit === null)){
        document.getElementById('user_input_form').onsubmit = null;
        focusUserInput(false);
        consoleLog("No user input detected. Utility callback aborted!", "err");
    }

    document.getElementById('results').value = "";
    document.getElementById('user_input').value = "";
    
    RESULTS = null;
}

function doPostUtilityCleanUp(){
    document.getElementById('text_input').value = "";
    document.getElementById('user_input').value = "";

    RESULTS = null;
    TEXT = null;
}

class ErrorResult{
    constructor(message){
        this.message = message;
    }

    isErrorResult(){
        return true;
    }
}

class CallbackResult{
    constructor(query){
        this.query = query;
    }

    isCallback(){
        return true;
    }
}

function showResult(){
    if(RESULT != null){
        let resultPanel = document.getElementById('results');
        resultPanel.value = RESULT.result;
    }
}

function downloadResult(){
    if(RESULT != null){
        consoleLog("Downloading results as text file.", "head");
        let fileName = (new Date().toLocaleDateString()) + "_" + RESULT.utility.replace(/\s+/, "-") + ".txt"
        consoleLog("Filename : " + fileName);
        let blob = new Blob([RESULT.result], {type: "text/plain"});
        if(window.navigator.msSaveOrOpenBlob){
            window.navigator.msSaveOrOpenBlob(blob, fileName);
        }else{
            let element = document.createElement('a');
            element.href = window.URL.createObjectURL(blob);
            element.download = fileName;
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }
        consoleLog("Done.");
    }else{
        consoleLog("No results to download.", "err");
    }
}

function consoleLog(message, type){
    let consolePanel = document.getElementById('console');
    if(type === "err"){
        message = "[x] " + message;
        consolePanel.innerText += '\n' + message;
    }else if(type === "head"){
        message = "[+] " + message;
        consolePanel.innerText += '\n' + message;
    }else if(type === "block"){
        let messageString = "";
        for(let i in message){
            messageString += "|__ " + message[i] + "\n";
        }
        message = messageString.replace(/\n$/, "");   
        consolePanel.innerText += '\n' + message;
    }else if(type === "prompt"){
        consolePanel.innerText += '\n|__ ' + message + '\n<<<';
    }else if(type === "input"){
        consolePanel.innerText += " " + message;
    }else{
        message = "|__ " + message;
        consolePanel.innerText += '\n' + message;
    }
    
    consolePanel.scrollTop = consolePanel.scrollHeight;
}

function getFileInput(){
    if(FILE == null){
        consoleLog("No file has been loaded. Ignoring file input.", "");
        return {"name":"","content":"","type":"","processed":false};
    }

    if(!FILE.processed){
        if(FILE.type === "text/csv" || (FILE.type === "application/vnd.ms-excel" && FILE.name.endsWith(".csv"))){
            FILE.content = processCSV(FILE.content);
            FILE.processed = true;
        }else if(FILE.type === "text/plain"){
            FILE.content = processTXT(FILE.content);
            FILE.processed = true;
        }
    }

    return FILE;
}

function processCSV(content){
    consoleLog("Processing CSV file.", "");
    try{
        let entities = [];
        let rows = content.split(/\r?\n/);
        let attributes = parseCSVRow(rows[0]);
        for(let i=1; i<rows.length; i++){
            if(rows[i].trim().length > 0){
                entities.push(new CsvEntity(attributes, parseCSVRow(rows[i])));
            }
        }
        return entities;
    }catch(err){
        consoleLog("Error parsing CSV file.", "err");
        consoleLog(err.message, "err");
    }
}

function parseCSVRow(row){
    let values = new Array();
    let inQuotes = false;
    let value = "";
    for(let i=0; i<row.length; i++){
        if(inQuotes){
            if(/"/.test(row[i])){
                if(/"/.test(row[i + 1])){
                    value += "\"";
                    i++;
                }else{
                    inQuotes = false;
                }
            }else{
                value += row[i];
            }
        }else if(/"/.test(row[i])){
            inQuotes = true;
        }else if(/,/.test(row[i])){
            values.push(value);
            value = "";
        }else{
            value += row[i];
        }
    }
    values.push(value);
    return values;
}

class CsvEntity{
    constructor(keys, values){
        this.attributes = {};
        for(let i=0; i<keys.length; i++){
            this.attributes[keys[i]] = values[i];
        }
    }
    getAttributes(){
        return Object.keys(this.attributes);
    }
}

function processTXT(content){
    consoleLog("Processing text file.", "");
    let lines = content.split(/\r?\n/);
    let cleanLines = [];
    for(let i in lines){
        if(lines[i].trim().length > 0){
            cleanLines.push(lines[i].trim());
        }
    }
    return cleanLines;
}

function getTextInput(){
    let text = document.getElementById('text_input').value;
    if(text.trim().length === 0){
        consoleLog("No text has been entered. Ignoring text input.", "");
        return "";
    }
    TEXT = text;
    return text;
}

function loadFile(event){
    if(event.target.files.length === 0){
        return;
    }

    let file = event.target.files[0];

    consoleLog("Loading file \"" + file.name + "\"", "head");
    consoleLog("File type: " + file.type, "");

    if(file.type !== "text/csv" && !(file.type === "application/vnd.ms-excel" && /\.csv$/.test(file.name)) && file.type !== "text/plain"){
        consoleLog("Sorry. util.js only accepts .txt and .csv files at the moment.", "err");
        return;
    }

    let reader = new FileReader();
    reader.onload = () => {
        FILE = {
            "name": file.name,
            "type": file.type,
            "content": reader.result,
            "processed":false
        };
        consoleLog("Success.", "");
    };
    reader.onerror = () => {
        consoleLog("Error reading file: " + file.name, "err");
        consoleLog(reader.error, "err");
    };
    reader.readAsText(file);
}

function welcome(){
    consoleLog("Welcome to util.js.", "head");
    consoleLog("Hold the ALT key while clicking on a utility to show its description and usage notes in this console.");
}

function promptUser(utilityName, query, callback){
    focusUserInput(true);
    document.getElementById('user_input_form').onsubmit = () => {
        focusUserInput(false);
        try{
            let userInput = document.getElementById('user_input').value;
            document.getElementById('user_input').value = "";
            consoleLog(userInput, "input");

            let result = callback(userInput);
            if(result.isErrorResult){
                consoleLog("Utility finished with error: " + result.message, "err");
            }else{
                RESULT = {"utility":utilityName, "result":result};
                showResult();
                consoleLog("Utility completed successfully.");
            }
        }catch(e){
            consoleLog("Utility finished with error: " + e.message, "err");
        }
        return false;
    };
    return new CallbackResult(query);
}

function focusUserInput(focus){
    let USER_INPUT = document.getElementById('user_input');
    let CONSOLE = document.getElementById('console');
    if(focus){
        USER_INPUT.classList.add('focus');
        CONSOLE.classList.add('focus');
    }else{
        USER_INPUT.classList.remove('focus');
        CONSOLE.classList.remove('focus');
    }
}