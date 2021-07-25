[![util.js](https://github.com/sjb-ch1mp/util.js/blob/master/img/logo.png)](https://github.com/sjb-ch1mp/util.js/blob/master/README.md)

[![Creative Commons License](https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png)](http://creativecommons.org/licenses/by-nc-sa/4.0/)

# Author 
Samuel Brookes ([@sjb-ch1mp](https://github.com/sjb-ch1mp))

# Attribution
Logo by [flaticon.com](https://flaticon.com).

# Summary
util.js provides a simple framework and interface for storing and running utility scripts. This was built because I often found myself writing scripts to expedite simple, but repetitive tasks at work; each time requiring me to rebuild some kind of simple web structure to hold and run them in. util.js has been designed to be flexible, enabling any kind of Javascript function to be fed inputs and executed with a button.

# User Interface
The util.js UI consists of 7 main components: 

1. **File Input:** users can upload a file of any kind by pressing here.
2. **Text Input:** users can enter text input here.
3. **Utility Panel:** a button is rendered here for each utility script. If the user holds the `Alt` key while clicking a utility button, its description and instructions will be printed to the console panel.
4. **Download Result:** clicking this button will download the results of the last executed utility script as a `.txt` file. 
5. **Result Panel:** the result of the utility script is dumped here as Unicode text.
6. **Console Panel:** utilities can print errors and messages here.
7. **User Input:** the console can receive user input here when activated.

![util.js-ui](https://github.com/sjb-ch1mp/util.js/blob/master/img/readme/ui.png)

# Adding a Utility
In order to add a new utility to util.js, you must add a new Utility object to the array in function utilities.js::`getUtilities()`. util.js will render a utility button for each Utility object included in this array.

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

While you're obviously free to make any changes you want, you only need to modify the file 'utilities.js' in order to add Utilities to util.js.

# Programming Interface

## File Processing
util.js provides some functions that you can use to process certain types of files. I intend to add more processing options for different file types over time. The supported file types and the way in which they are processed are listed below. 

Files are stored in util.js as an object with the file name, file type and file content, e.g. 
```
file = {
    "name":"my-csv-file.csv",
    "type":"application/vnd.ms-excel",
    "content":<actual-file-content>
}
```

### Text Files
util.js can process text files by splitting them into new lines.

To do so, call the `processTXT()` function and pass it a reference to the current file in file input, e.g. `processTXT(file)`.

This function will return a new file object, in which the `file.content` key references an array of strings.

In truth, any type of file can be processed this way, but I've found this most useful for text files. 

### CSV Files
util.js can process a CSV file by turning each row into an object in which each column is a key. For example, the CSV file...

```
header_1,header_2,header_3
1,stuff,things
2,"more stuff","more things"
```

...would be transformed into the following array: 
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

To do so, call the `processCSV()` function and pass it a reference to the current file in the file input, e.g. `processCSV(file)`.

This function will return a new file object, in which the `file.content` key references an array of objects as described above.

### PDF Files
util.js can parse a PDF file and return an object that contains the dictionaries of all of that documents PDF objects.

For example, using the PDFParser to extract object information from my gas bill returns the following object: 

![pdf.png](https://github.com/sjb-ch1mp/util.js/blob/master/img/readme/pdf.png)

To do so, create a new `PDFParser` object, passing it a reference to the current file in the file input, and then call the `parse()` function e.g. `file = new PDFParser(file).parse();`.

The `PDFParser.parse()` function will return a new file object in which the `file.content` key references a `PDFDocument` object. This object is of the form: 

```
{
    "version":<pdf-version>,
    "objects":{...}
}
```
...where the elements of the `objects` object are of the form: 
```
{
    "id":<pdf-object-id>,
    "version":<pdf-object-version>,
    "hasStream":<true|false>, //indication of whether or not this PDF object contains an object stream
    "dictionary":{...}, //key value pairs from the PDF Object dictionary
    "references":[...] //list of other PDF objects referenced by this PDF object
}
```

### Clipboard HTML
When a user copy pastes anything into the Text Input area, if the clipboard contains HTML, this is stored in the global `RICH_TEXT` parameter, if you wish to use this instead of the plain text.

## User Input

## Console

## Handling Errors