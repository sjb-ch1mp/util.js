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
            "Utility Name",
            [
                "Description of what utility does...",
                "...and instructions for how to use it."
            ],
            utilityFunction
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

    A utility function should be passed the parameters 'file' and 'text'.
    
    For example: 

    function utilityFunction(file, text){    
        console.log(file.content);
        console.log(text);
    }
   =================== */
function utilityFunction(file, text){
    console.log(file.content);
    console.log(text);
}