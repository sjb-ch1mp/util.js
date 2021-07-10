class Utility{
    constructor(name, description, execute){
        this.name = name;
        this.description = description;
        this.execute = execute;
    }
    showDescription = () => {
        consoleLog("USAGE: \"" + this.name.toUpperCase() + "\"", "head");
        consoleLog(this.description, "block");
    }
    executeUtility = () => {
        consoleLog("Executing utility \"" + this.name + "\"", "head");
        this.execute(getFileInput(), getTextInput());
        consoleLog("Done.");
    }
    render = () => {
        const utilities = document.getElementById('utilities');
        let utilityMenuItem = buildUtilityMenuItem(this);
        utilityMenuItem.classList.add('utility_button');
        utilities.appendChild(utilityMenuItem);
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

function showResults(results){
    let resultPanel = document.getElementById('results');
    resultPanel.innerText = results;
}

function consoleLog(message, type){
    let consolePanel = document.getElementById('console');
    if(type === "err"){
        message = "[x] " + message;
    }else if(type === "head"){
        message = "[+] " + message;
    }else if(type === "block"){
        let messageString = "";
        for(let i in message){
            messageString += "|__ " + message[i] + "\n";
        }
        message = messageString.replace(/\n$/, "");
    }else{
        message = "|__ " + message;
    }
    consolePanel.innerText += '\n' + message;
    consolePanel.scrollTop = consolePanel.scrollHeight;
}

function getFileInput(){
    if(fileInput == null){
        consoleLog("No file has been loaded. Ignoring file input.", "");
        return {"name":"","content":"","type":"","processed":false};
    }

    if(!fileInput.processed){
        if(fileInput.type === "text/csv" || (fileInput.type === "application/vnd.ms-excel" && fileInput.name.endsWith(".csv"))){
            fileInput.content = processCSV(fileInput.content);
            fileInput.processed = true;
        }else if(fileInput.type === "text/plain"){
            fileInput.content = processTXT(fileInput.content);
            fileInput.processed = true;
        }
    }

    return fileInput;
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
    textInput = text;
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
        fileInput = {
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