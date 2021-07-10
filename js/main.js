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
        fileInput = getFileInput();
        textInput = getTextInput();
        this.execute(this.name);
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
        consoleLog("No file has been loaded. Ignoring file input.", "err");
        return null;
    }

    if(fileInput.type === "text/csv" || (fileInput.type === "application/vnd.ms-excel" && fileInput.name.endsWith(".csv"))){
        fileInput.content = processCSV(fileInput.content);
    }else if(fileInput.type === "text/plain"){
        fileInput.content = processTXT(fileInput.content);
    }

    return fileInput;
}

function processCSV(content){
    let entities = [];
    let rows = content.split(/\r?\n/);
    let attributes = parseCSVRow(rows[0]);
    for(let i=1; i<rows.length; i++){
        if(rows[i].trim().length > 0){
            entities.push(new CsvEntity(attributes, parseCSVRow(rows[i])));
        }
    }
    return entities;
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
    return content.split(/\r?\n/);
}

function getTextInput(){
    let text = document.getElementById('text_input').value;
    textInput = text; //save text in case something goes wrong
    return text;
}

function loadFile(event){
    if(event.target.files.length === 0){
        return;
    }

    let file = event.target.files[0];

    consoleLog("Loading file \"" + fileName + "\"", "head");
    consoleLog("File type: " + fileType, "");

    if(!(file.type === "text/csv" || (file.type === "application/vnd.ms-excel" && file.type.endsWith(".csv")) || file.type === "text/plain")){
        consoleLog("Sorry. util.js only accepts .txt and .csv files at the moment.", "err");
        return;
    }

    let reader = new FileReader();
    reader.onload = () => {
        fileInput = {
            "name": file.name,
            "type": file.type,
            "content": reader.result
        };
        consoleLog("Success.", "");
    };
    reader.onerror = () => {
        consoleLog("Error reading file: " + file.name, "err");
        consoleLog(reader.error, "err");
    };
    reader.readAsText(file);
}