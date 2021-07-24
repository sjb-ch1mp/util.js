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
        this.current = null;
    }

    parse(){

        //find version
        this.next();
        while(this.hasNext() && this.current !== PDFToken.PERCENT && this.peek(1, 3) !== PDFControlWord.PDF_VERSION){
            this.next();
        }
        if(!(this.hasNext())){
            throw new Error("PDF version not found. This does not appear to be a valid PDF file!");
        }

        this.next();
        let pdf = new PDFDocument(this.current);


        let leading = [];
        let purge = () => {leading = [];};
        while(this.hasNext()){
            this.next();
            switch(this.current){
                case PDFControlWord.START_OBJECT:
                    pdf.objects[leading[leading.length - 2]] = this.parsePDFObject(leading[leading.length - 1]);
                    purge();
                    break;
                default:
                    leading.push(this.current);
            }
            if(this.current === PDFControlWord.EOF){
                break;
            }
        }

        return pdf;
    }

    parsePDFObject(version){

        let pdfobj = new PDFObject(version);
        while(this.hasNext() && this.current !== PDFControlWord.END_OBJECT){
            this.next();
            switch(this.current){
                case PDFToken.OPEN_DICT:
                    pdfobj.dictionary = this.parsePDFDictionary();
                    break;
                case PDFToken.OPEN_BRACKET:
                    let array = this.parsePDFArray();
                    pdfobj.dictionary = this.convertArrayToDictionary(array);
                    break;
                case PDFControlWord.START_STREAM:
                    pdfobj.stream = this.parseObjectStream();
            }
        }

        if(Object.keys(pdfobj.dictionary.ref).length > 0){
            pdfobj.references = pdfobj.dictionary.ref;
        }
        delete pdfobj.dictionary.ref;

        return pdfobj;
    }

    convertArrayToDictionary(array){
        let dictionary = {"ref":[]};
        let key = null;
        
        for(let i = 0; i<array.length; i++){
            switch(array[i]){
                case PDFToken.SOLIDUS:
                    if(i + 2 >= array.length || array[i + 2] === PDFToken.SOLIDUS){
                        dictionary[array[i + 1]] = [true];
                        i++;
                        break;
                    }else{
                        key = array[i + 1];
                        dictionary[key] = [];
                        i++;
                        break;
                    }
                default:
                    if(/^[0-9]+$/.test(array[i]) && array[i + 2] === PDFControlWord.REFERENCE){
                        if(key != null && dictionary[key].length === 0){
                            dictionary[key] = [true];
                        }
                        dictionary.ref.push(array[i]);
                        i += 2;
                        break;
                    }else{
                        if(key != null){
                            dictionary[key].push(array[i]);
                            break;
                        }else{
                            if(!(Object.keys(dictionary).includes("__"))){
                                dictionary["__"] = [];
                            }
                            dictionary["__"].push(array[i]);
                        }
                    }
            }
        }

        return dictionary;
    }

    parseObjectStream(){
        let stream = "";
        while(this.hasNext() && this.current !== PDFControlWord.END_STREAM){
            this.buffer = this.buffer.substring(1);
            stream += this.buffer[0];
            if(this.peek(1, 9) === PDFControlWord.END_STREAM){
                this.buffer = this.buffer.substring(1);
                this.next();
            }
        }
        return stream;
    }

    parsePDFDictionary(){

        let dictionary = {"ref":[]};
        let nestedDictionary = false;
        let key = null;
        let val = [];
        while(this.hasNext() && (this.current !== PDFToken.CLOSE_DICT || (this.current === PDFToken.CLOSE_DICT && nestedDictionary))){
            
            this.next();
            nestedDictionary = false;

            if(this.current === PDFToken.CLOSE_DICT){
                if(key != null){
                    if(val.length > 0){
                        dictionary[key] = val;
                    }else{
                        dictionary[key] = [true];
                    }
                }
                break;
            }
            switch(this.current){
                case PDFToken.SOLIDUS:
                    if(key == null){
                        this.next();
                        key = this.current;
                        break;
                    }else{
                        if(val.length === 0){
                            dictionary[key] = [true];
                            this.next();
                            key = this.current;
                            break;
                        }else{
                            dictionary[key] = val;
                            val = [];
                            this.next();
                            key = this.current;
                            break;
                        }
                    }
                case PDFToken.OPEN_BRACKET:
                    val.push(this.parsePDFArray());
                    break;
                case PDFToken.OPEN_DICT:
                    nestedDictionary = true;
                    val.push(this.parsePDFDictionary());
                    break;
                case PDFToken.OPEN_PAREN:
                    val.push(this.parsePDFLiteralString());
                    break;
                case PDFToken.LESS_THAN:
                    val.push(this.parsePDFEncodedString());            
                    break;
                default:
                    val.push(this.current);
            }
        }

        dictionary.ref = this.parseDictionaryForReferences(dictionary);

        return dictionary;
    }

    parseDictionaryForReferences(dictionary){
        let refs = [];
        for(let key in dictionary){
            if(key !== "ref"){
                let valString=dictionary[key].join(",");
                valString = valString.replace(/R(,|$)/g, "REFERENCE===,");
                let splitByRef = valString.split(/EFERENCE===(,|$)/);
                for(let j in splitByRef){
                    if(/[0-9]+,[0-9]+,R$/.test(splitByRef[j])){
                        let splitByRefsAndCommas = splitByRef[j].split(/,/);
                        refs.push(splitByRefsAndCommas[splitByRefsAndCommas.length - 3]);
                    }
                }
            }
        }
        return refs;
    }

    parsePDFEncodedString(){
        let encodedString = this.carve(/\>/, 1, true);
        this.next();
        return encodedString;
    }

    parsePDFLiteralString(){

        let literalString = "";
        let chunk = "";
        while(this.hasNext() && /\\$/.test((chunk = this.carve(/\)/, 1, true)))){
            literalString += chunk;
        }
        literalString += chunk;
        this.next();
        return literalString;
    }

    parsePDFArray(){

        let pdfArray = [];
        let nestedArray = false;

        while(this.hasNext() && (this.current !== PDFToken.CLOSE_BRACKET || this.current === PDFToken.CLOSE_BRACKET && nestedArray)){

            this.next();
            nestedArray = false;

            if(this.current === PDFToken.CLOSE_BRACKET){
                break;
            }

            if(this.current === PDFToken.OPEN_BRACKET){
                nestedArray = true;
                pdfArray.push(this.parsePDFArray());
            }else if(this.current === PDFToken.LESS_THAN){
                pdfArray.push(this.parsePDFEncodedString());
            }else if(this.current === PDFToken.OPEN_PAREN){
                pdfArray.push(this.parsePDFLiteralString());
            }else{
                pdfArray.push(this.current);
            }
        }

        return pdfArray;
    }

    peek(absoluteStart, relativeEnd){
        if(this.buffer.substring(absoluteStart).length >= relativeEnd){
            return this.buffer.substring(absoluteStart, absoluteStart + relativeEnd);
        }
        return null;
    }

    next(){
        this.buffer = this.buffer.trim();
        switch(this.buffer[0]){
            case PDFToken.LESS_THAN:
                if(this.peek(0, 2) === PDFToken.OPEN_DICT){
                    this.current = PDFToken.OPEN_DICT;
                    break;
                }else{
                    this.current = PDFToken.LESS_THAN;
                    break;
                }
            case PDFToken.GREATER_THAN:
                if(this.peek(0, 2) === PDFToken.CLOSE_DICT){
                    this.current = PDFToken.CLOSE_DICT;
                }else{
                    this.current = PDFToken.LESS_THAN;
                }
                break;
            case PDFToken.SOLIDUS:
                this.current = PDFToken.SOLIDUS;
                break;
            case PDFToken.OPEN_BRACKET:
                this.current = PDFToken.OPEN_BRACKET;
                break;
            case PDFToken.CLOSE_BRACKET:
                this.current = PDFToken.CLOSE_BRACKET;
                break;
            case PDFToken.PERCENT:
                if(this.peek(0, 5) === PDFControlWord.EOF){
                    this.current = PDFControlWord.EOF;
                }else{
                    this.current = PDFToken.PERCENT;
                }
                break;
            case PDFToken.OPEN_PAREN:
                this.current = PDFToken.OPEN_PAREN;
                break;
            case PDFToken.CLOSE_PAREN:
                this.current = PDFToken.CLOSE_PAREN;
                break;
            default:
                this.current = this.carve(/(\s|\]|\>)/, 1, false);
        }

        this.buffer = this.buffer.substring(this.current.length);
    }

    carve(symbol, numSymbol, consume){
        let carved = "";
        let symbolCount = 0;
        let index = 0;
        while(this.hasNext() && symbolCount < numSymbol && index < this.buffer.length){
            if(symbol.test(this.buffer[index])){
                symbolCount++;
            }
            if(symbolCount < numSymbol){
                if(consume){
                    carved += this.buffer[0];
                    this.buffer = this.buffer.substring(1);
                }else{
                    carved += this.buffer[index++];
                }
            }
        }
        return (carved.length > 0)?carved:null;
    }

    hasNext(){
        return this.current != null;
    }
}

class PDFDocument{
    constructor(version){
        this.version = version;
        this.objects = {};
    }
}

class PDFObject{
    constructor(version){
        this.version = version;
        this.dictionary = null;
        this.stream = null;
        this.references = null;
    }
}

const PDFToken = {
    "LESS_THAN":"<",
    "OPEN_DICT":"<<",
    "GREATER_THAN":">",
    "CLOSE_DICT":">>",
    "SOLIDUS":"/",
    "OPEN_BRACKET":"[",
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
    "EOF":"%%EOF",
    "PDF_VERSION":"%PDF",
    "REFERENCE":"R"
}