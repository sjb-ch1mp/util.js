/*==== UTILITY OBJECT BOILERPLATE ===

    new Utility(
        "<utility-name>",
        [
            "<utility-description>",
            "<utility-instructions>"
        ],
        utilityFunction
    )

=====================================*/

function getUtilities(){
    return [
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
            "<utility-name>",
            [
                "<utility-description>",
                "<utility-instructions>"
            ],
            test
        )
    ];
}

/* ==== UTILITY FUNCTION BOILERPLATE ====

    function utilityFunction__noUserInput(file, text){
        let result = "";
        // your code here
        return result;
    }

    function utilityFunction__userInput(file, text){
        // your code here
        return promptUser(
            this.name,
            "<user-prompt>",
            utilityFunction__userInput__callback
        );
    }

    function utilityFunction__userInput__callback(userInput){
        let results = "";
        // your code here
        return results;
    }

=========================================*/ 

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

function test(file, text){
    file = new PDFParser(file).parse();
    console.log(file);
}