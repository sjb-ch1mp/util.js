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

    A utility function should be passed the name of the utility so that it can be accessed within
    the scope of the function. For example: 

    function utilityFunction(utilityName){
        //function body...
    }
   =================== */