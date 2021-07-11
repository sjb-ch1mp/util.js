function renderUtilities(){
    let utilities = [
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
           "Defang",
           [
               "The defang utility will modify URLs and email addresses so that they will no longer resolve.",
               "To use this utility, simply copy-paste your URLs or emails into the text input and click the utility button."
           ],
           defang
       ),
       new Utility(
        "Refang",
        [
            "The refang utility will modify previously defanged URLs and email addresses so that they can resolve.",
            "To use this utility, simply copy-paste your defanged URLs or emails into the text input and click the utility button."
        ],
        refang
    )
    ];

    for(let i in utilities){
        utilities[i].render();
    }
}

/* ===================
    UTILITY FUNCTIONS

    The functions below are called by the execute() function in a Utility class. 

    When a function is defined below - it must appear in the Utility object declaration in the
    renderUtilities() function above. 

    A utility function should be passed the parameters 'file' and 'text' and should return a 'results' variable.

    If a terminal error occurs within the utility function, it should return an ErrorResult object with an error message.
    
    For example: 

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