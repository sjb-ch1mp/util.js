[![util.js](https://github.com/sjb-ch1mp/util.js/blob/master/img/logo.png)](https://github.com/sjb-ch1mp/util.js/blob/master/README.md)

[![Creative Commons License](https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png)](http://creativecommons.org/licenses/by-nc-sa/4.0/)

### Author 
Samuel Brookes ([@sjb-ch1mp](https://github.com/sjb-ch1mp))

### Attribution
Logo by [flaticon.com](https://flaticon.com).

### Summary
util.js provides a simple framework and interface for storing and running utility scripts. This was built because I often found myself writing scripts to expedite simple, but repetitive tasks at work; each time requiring me to rebuild some kind of simple web structure to hold and run them in. util.js has been designed to be flexible, enabling any kind of Javascript function to be fed inputs and executed with a button.

### User Interface
The util.js UI consists of 7 main components: 

1. **File Input:** users can upload a file of any kind by pressing here.
2. **Text Input:** users can enter text input here.
3. **Utility Panel:** a button is rendered here for each utility script.
4. **Download Result:** clicking this button will download the results of the last executed utility script as a .txt file. 
5. **Result Panel:** the result of the utility script is dumped here as Unicode text.
6. **Console Panel:** utilities can print errors and messages here.
7. **User Input:** the console can receive user input here when activated.

![util.js-ui](https://github.com/sjb-ch1mp/util.js/blob/master/img/readme/ui.png)

### Adding a Utility
In order to add a new utility to util.js, you must add a new Utility object to the array in function utilities.js::getUtilities(). util.js will render a utility button for each Utility object included in this array.

The Utility constructor takes three parameters: 

1. A name for the utility (string),
2. A description and/or instructions for using the utility (array of strings), and 
3. A reference to the utility function, or the function itself (function)

For example, the "\[General\] Defang" utility is defined in the following way: 
```
new Utility(
    "[General] Defang",
    [
        "This utility will modify URLs and email addresses so that they will no longer resolve.",
        "To use this utility, simply copy-paste your URLs or emails into the text input and click the utility button."
    ],
    defang
)
```

The utility function that is referenced in the Utility object will be executed when the user clicks on the utility button in the utility panel. util.js will process results returned by the utility function by dumping it to the Result Panel and storing it in case the user wishes to download them as a file.

A utility function should return 'results' (of any type) and it should be passed two parameters:

1. A reference to the current file in the file input, and
2. A reference to the current text in the text input. 

For example, the "\[General\] Defang" utility function (_that is referenced in the Utility object_) is defined in the following way:
```
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
```

**NOTE:** While you're obviously free to make any changes you want, you only need to modify the file 'utilities.js' in order to add Utilities to util.js.

### Programming Interface

## File Processing

# Text Files

# CSV Files

# PDF Files

# Clipboard HTML

## User Input

## Console