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
            if(result == null){
                consoleLog("Uh oh. The utility is returning a null result.", "err");
            }else if(result.isCallback){
                consoleLog(result.query, "prompt");
            }else if(result.isErrorResult){
                consoleLog(result.message, "err");
            }else{
                RESULT = {"utility":this.name,"result":result};
                showResult();
                consoleLog("Utility completed successfully.");
            }
        }catch(err){
            console.log(err);
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
    
    document.getElementById('user_input_form').onsubmit = () => {return false;};
    focusUserInput(false);

    document.getElementById('results').value = "";
    document.getElementById('user_input').value = "";
    
    RESULTS = null;
}

function doPostUtilityCleanUp(){
    document.getElementById('text_input').value = "";
    document.getElementById('user_input').value = "";

    RESULTS = null;
    TEXT = null;
	RICH_TEXT = null;
}

class ErrorResult{
    constructor(message){
        this.message = message;
        this.isErrorResult = true;
    }
}

class CallbackResult{
    constructor(query){
        this.query = query;
        this.isCallback = true;
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
            if(result == null){
                consoleLog("Uh oh. The utility is returning a null result.", "err");
            }else if(result.isErrorResult){
                consoleLog("Utility finished with error: " + result.message, "err");
            }else{
                RESULT = {"utility":utilityName, "result":result};
                showResult();
                consoleLog("Utility completed successfully.");
            }
        }catch(e){
            consoleLog("Utility finished with error: " + e.message, "err");
	        document.getElementById('user_input_form').onsubmit = () => {return false;};
        }
        document.getElementById('user_input_form').onsubmit = () => {return false;};
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
