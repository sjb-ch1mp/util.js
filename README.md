[![util.js](https://github.com/sjb-ch1mp/util.js/blob/master/img/logo.png)](https://github.com/sjb-ch1mp/util.js/blob/master/README.md)

[![Creative Commons License](https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png)](http://creativecommons.org/licenses/by-nc-sa/4.0/)

# Author 
Samuel Brookes ([@sjb-ch1mp](https://github.com/sjb-ch1mp))

# Attribution
Logo by [flaticon.com](https://flaticon.com).

# Summary
util.js provides a simple framework and interface for storing and running utility scripts. This was built because I often found myself writing scripts to expedite simple, but repetitive tasks at work; each time requiring me to rebuild some kind of simple web structure to hold and run them in. util.js has been designed to be flexible, enabling any kind of Javascript function to be fed inputs and executed with a button.

To get your brain juices flowing, here are some utility scripts that I have in my own instance of util.js.

- Script to format tables copied from Splunk as Jira-compatible markdown,
- Script to detect risky key words in PDF documents (inspired by Didier's [pdfid.py](https://blog.didierstevens.com/2009/03/31/pdfid/)),
- Script to transform Splunk JSON exports into [PivotDrill](https://github.com/sjb-ch1mp/PivotDrill)-compatible (read: 'correctly formatted') JSON files,
- Script to extract user accounts from [HIBP](https://haveibeenpwned.com/) CSV exports and format them for Splunk queries...

...and more and more. I have included a couple of simple example utilities in this distributed copy of util.js ("Defang" and "Refang"), which I also frequently use.

# User Interface
The util.js UI consists of 7 main components: 

1. **File Input:** users can upload a file of any kind by pressing here.
2. **Text Input:** users can enter text input here. When a user copy pastes anything into the Text Input area, if the clipboard contains HTML, this is stored in the global `RICH_TEXT` parameter.
3. **Utility Panel:** a button is rendered here for each utility script. If the user holds the `Alt` key while clicking a utility button, its description and instructions will be printed to the console panel.
4. **Download Result:** clicking this button will download the results of the last executed utility script as a `.txt` file. 
5. **Result Panel:** the result of the utility script is dumped here as Unicode text.
6. **Console Panel:** utilities can print errors and messages here.
7. **User Input:** the console can receive user input here when activated by the `promptUser()` function.

![util.js-ui](https://github.com/sjb-ch1mp/util.js/blob/master/img/readme/ui.png)

# Adding a Utility
In order to add a new utility to util.js, you must add a new Utility object to the array in function utilities.js::`getUtilities()`. util.js will render a utility button for each Utility object included in this array.

The Utility constructor takes three parameters: 

1. **utilityName:** a name for the utility (string),
2. **utilityDescription:** a description and/or instructions for using the utility (array of strings), and 
3. **utilityFunction:** a reference to the utility function, or the function itself (function)

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

1. **file:** a reference to the current file in the file input, and
2. **text:** a reference to the current text in the text input. 

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

While you're obviously free to make any changes you want, you only need to modify the file 'utilities.js' in order to add Utilities to util.js. This file contains templates that you can use to start writing your utilities.

# User Input
User input deserves a special mention as it changes the way in which you need to implement utilities. If you need to get user input, you need to implement two functions: the utility function, and a callback function that will be executed after util.js receives user input. 

The utility function must end by returning the results of the `promptUser()` function. This function will send a prompt to the user, activate the User Input field and highlight the console to warn them that the utility is awaiting their input. Again, this must the last statement in the utility function - one of the parameters passed to the `promptUser()` function is the callback function that will be passed the input from the user, thus continuing and completing the utility script.

The `promptUser()` function takes four parameters: 

1. **utilityName:** the name of the utility being executed. This can simply be passed with `this.name`.
2. **query:** the string that will be used to prompt the user. This can be a query or an insult. 
3. **callback:** a reference to the callback function, or if you like code spaghetti, this can be the function itself.
4. **params:** an object containing arbitrary parameters, e.g. the contents of the current file in the file input.

The callback function referenced in the call to `promptUser()` can be passed two parameters: 

1. **userInput:** this is the input from the user (mandatory - and kind of the point anyway).
2. **params:** this is an object containing arbitrary parameters (optional).

The following example demonstrates a simple utility which requires user input. I have also included template functions for 'user input' utility scripts in utilities.js. 

```
// First, I add a new Utility class to the array in utilities.js::getUtilities()..

function getUtilities(){
    return [
       new Utility(
           "Hey User! Yes or no?",
           [
               "This utility will ask the user a yes or no question.",
               "To use this utility, press the utility button"
           ],
           heyUser__yesOrNo
       )
    ];
}

// I then write the utility function, passing it the file and text parameters...

function heyUser__yesOrNo(file, text){
    let params = {
        "param1":"This is an arbitrary parameter",
        "param2":file.content,
        "param3":text
    }

    // If I want user input, I must complete the utility function by returning the results
    // of the promptUser function...

    return promptUser(
        this.name,                      //utilityName
        "Hey User! Yes or no?",         //query
        heyUser__yesOrNo__callback,     //callback
        params                          //params (optional)
    );
}

// I then must define the callback function, remembering to pass the userInput and params parameters...

function heyUser__yesOrNo__callback(userInput, params){
    let result = "Parameter 1 is \"" + params.param1 + "\"";
    result += "\n\nParameter 2 is:\n";
    result += params.param2;
    result += "\n\nParameter 3 is: " + params.param3;
    result += "\n\nFinally, you entered: " + userInput;
    return result;
}
```

# Useful Functions
The following are some functions that I have incorporated into util.js over time.

### processTXT(file)
The `processTXT()` function will split the file content at each new line character, returning an array of strings. It must be passed the current file in the file input. This can be done for any file type. 

### processCSV(file)
The `processCSV()` function will transform the content of a CSV file into an array in which each of the elements represents a row of the CSV table, and each element contains keys corresponding to the columns of the CSV table. It must be passed the current file in the file input. The file must be of type `text/csv`, or `application/vnd.ms-excel` with file extension `.csv`.

For example, it will change this CSV...
```
header_1,header_2,header_3
1,stuff,things
2,"more stuff","more things"
```
...into this...
```
[
    {
        "header_1":"1",
        "header_2":"stuff",
        "header_3":"things"
    },
    {
        "header_1":"2",
        "header_2":"more stuff",
        "header_3":"more things"
    }
]
```

### new PDFParser(file).parse()
The `PDFParser` will extract all the object dictionaries from a PDF file (but will skip the data streams). To use the PDF parser, you must pass the current file in the file input to the constructor of the `PDFParser` object and call the function `parse()`, e.g. `file = new PDFParser(file).parse()`. The file must be of type `application/pdf`.

For example, this was returned after parsing my gas bill: 

![pdf.png](https://github.com/sjb-ch1mp/util.js/blob/master/img/readme/pdf.png)

### consoleLog(message, messageType)
The `consoleLog()` function will print a message to the Console Panel. It should be passed two parameters: 

1. **message:** the message to be printed to the Console Panel.
2. **messageType:** the type of the message, which determines how it will be formatted. 

Four values are supported for the messageType parameter: 

1. **"head":** this will print a header, i.e. 
   
`[+] ...message...`

2. **"err":** this will print an error, i.e. 
   
`[x] ...message...`

3. **"block":** this will take an array of strings and format it appropriately, i.e. 
   
```
|__ ...message one...
|__ ...message two...
|__ ...message three...
```

4. **"":** if the messageType parameter is left out or blank, the default formatting will be applied, i.e. 

`|__ ...message...`

### return ErrorResult(message)
If you wish to explicitly exit your utility function on an error, you can return an `ErrorResult()` object so that the correct action is taken by util.js. The constructor of this object should be passed a message.

# Update Log
|Date|Version|Notes|
|---|---|---|
|25 July 2021|1.0.0|Committed version 1.|