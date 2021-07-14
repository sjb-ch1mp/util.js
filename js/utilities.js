function getUtilities(){
    return [
        /* === EXAMPLE ===
        new Utility(
            "Utility Name",
            [
                "Description of what utility does...",
                "...and instructions for how to use it."
            ],
            utilityFunction
        )
        */
       new Utility(
           "[General] Defang",
           [
               "This utility will modify URLs and email addresses so that they will no longer resolve.",
               "To use this utility, simply copy-paste your URLs or emails into the text input and click the utility button."
           ],
           defang
       ),
       new Utility(
            "[General] Refang",
            [
                "This utility will modify previously defanged URLs and email addresses so that they can resolve.",
                "To use this utility, simply copy-paste your defanged URLs or emails into the text input and click the utility button."
            ],
            refang
        ),
        new Utility(
            "[TEST] Test user input",
            [
                "Testing user input"
            ],
            testUserInput
        )
    ];
}

/* ===================
    UTILITY FUNCTIONS

    The functions below are called by the execute() function in a Utility class. 

    When a function is defined below - it must appear in the Utility object declaration in the
    renderUtilities() function above. 

    A utility function should be passed the parameters 'file' and 'text' and should return a 'results' variable.

    If a terminal error occurs within the utility function, it should return an ErrorResult object with an error message.

    If you wish to get user input, you must use the promptUser() function and pass the code that will execute after the user input
    is returned as a callback function. The parameters passed to promptUser are the prompt for the user, the callback function, and the timeout counter in milliseconds.
    The last statement in a function with user input should be a return statement that returns the results of the promptUser() function. 
    
    Example without user input:
        function utilityFunction(file, text){    
            let result = "";
            console.log(file.content);
            console.log(text);
            try{
                //do something
            }catch(e){
                return new ErrorResult(e.message);
            }
            return result;
        }

    Example with user input: 
        == Utility declaration ==
        new Utility(
            "[TEST] Test user input",
            [
                "Testing user input"
            ],
            testUserInput
        )
        
        == utility functions ==
        function testUserInput(){
            return promptUser(
                "Enter anything in the user input text area:",
                testUserInput__callback,
                3000
            );
        }

        function testUserInput__callback(userInput){
            if(userInput == null || userInput == undefined || userInput.trim().length === 0){
                consoleLog("No user input detected! Aborting utility.", "err");
            }else{
                consoleLog("You entered the following into the user input: " + userInput);
            }
        }    
   =================== */
function defang(file, text){
    if(text === null || text.trim().length === 0){
        return new ErrorResult("Nothing detected in text input! Aborting utility.");
    }
    let defangedText = text.replace(/http/g, "hxxp");
    defangedText = defangedText.replace(/\./g, "[.]");
    defangedText = defangedText.replace(/@/g, "[at]");
    defangedText = defangedText.replace(/=/g, "\\=");
    return defangedText;
}

function refang(file, text){
    if(text === null || text.trim().length === 0){
        return new ErrorResult("Nothing detected in text input! Aborting utility.");
    }
    let refangedText = text.replace(/hxxp/g, "http");
    refangedText = refangedText.replace(/\[\.\]/g, ".");
    refangedText = refangedText.replace(/\[(at|@)\]/g, "@");
    refangedText = refangedText.replace(/\\/g, "");
    return refangedText;
}

function testUserInput(){
    return promptUser(
        this.name,
        "Enter anything in the user input text area:",
        testUserInput__callback
    );
}

function testUserInput__callback(userInput){
    if(userInput == null || userInput == undefined || userInput.trim().length === 0){
        consoleLog("No user input detected! Aborting utility.", "err");
    }else{
        consoleLog("You entered the following into the user input: " + userInput);
        return "These are the results";
    }
}  