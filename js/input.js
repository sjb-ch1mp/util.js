function getFileInput(){
    if(FILE == null){
        consoleLog("No file has been loaded. Ignoring file input.", "");
        return {"name":null,"content":null,"type":null,"processed":false};
    }

    if(!FILE.processed){
        if(FILE.type === "text/csv" || (FILE.type === "application/vnd.ms-excel" && FILE.name.endsWith(".csv"))){
            FILE.content = processCSV(FILE.content);
            FILE.processed = true;
        }else if(FILE.type === "application/json"){
            try{
                FILE.content = JSON.parse(FILE.content);
                FILE.process = true;
            }catch(err){
                consoleLog("An error occurred when attempting to parse the json file: " + err.message, "err");
                FILE.content = null;
            }
        }else{
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

class PDFParser{
    constructor(dcmnt){
        this.buffer = dcmnt;
    }

    parse(){

        //find version
        while(this.hasNext() && this.current() != PDFToken.PERCENT){
            this.next();
        }
        if(!(this.hasNext())){
            throw new Error("PDF version not found. This does not appear to be a valid PDF file!");
        }

    }

    next(){
        this.buffer = this.buffer.substring(1).trim();
    }

    peek(distance){
        return (this.buffer.length >= distance)?this.buffer.substring(0, distance):null;
    }

    carve(symbol){
        let carved = "";
        while(this.hasNext && this.current() !== symbol){
            carved += this.buffer[0];
            this.buffer = this.buffer.substring(1);
        }
        return carved;
    }

    hasNext(){
        return this.buffer.length > 1;
    }

    current(){
        switch(this.buffer[0]){
            case PDFToken.LESS_THAN:
                if(this.peek(2) === PDFToken.OPEN_DICT){
                    this.next();
                    return PDFToken.OPEN_DICT;
                }else{
                    return PDFToken.LESS_THAN;
                }
            case PDFToken.GREATER_THAN:
                if(this.peek(2) === PDFToken.CLOSE_DICT){
                    this.next();
                    return PDFToken.CLOSE_DICT;
                }else{
                    return PDFToken.LESS_THAN;
                }
            case PDFToken.SOLIDUS:
                this.next();

        }
    }
}

class PDFDocument{
    constructor(version){
        this.version = version;
        this.objects = {};
    }
}

class PDFObject{
    constructor(id, version, dictionary, stream){
        this.id = id;
        this.version = version;
        this.dictionary = dictionary;
        this.stream = stream;
    }
}

const PDFToken = {
    "LESS_THAN":"<",
    "OPEN_DICT":"<<",
    "GREATER_THAN":">",
    "CLOSE_DICT":">>",
    "SOLIDUS":"/",
    "OPEN_BRACKET":"]",
    "CLOSE_BRACKET":"]",
    "PERCENT":"%",
    "OPEN_PAREN":"(",
    "CLOSE_PAREN":")"
}

const PDFControlWord = {
    "START_OBJECT":"obj", 
    "END_OBJECT":"endobj", 
    "START_STREAM":"stream", 
    "END_STREAM":"endstream", 
    "START_XREF":"xref", 
    "XREF_POINTER":"startxref", 
    "START_TRAILER":"trailer",
    "EOF":"%EOF",
    "PDF_VERSION":"%PDF"
}