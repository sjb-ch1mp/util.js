function fitPanels(){
    let dim = getCurrentDimensions();

    let LOGO_CONTAINER = document.getElementById('logo_container');
    LOGO_CONTAINER.style.top = 0;
    LOGO_CONTAINER.style.left = 0;
    LOGO_CONTAINER.style.width = dim.MENU_WIDTH;
    LOGO_CONTAINER.style.height = dim.LOGO_CONTAINER_HEIGHT;

    let LOGO = document.getElementById('logo');
    LOGO.style.width = dim.LOGO_WIDTH;
    LOGO.style.height = dim.LOGO_HEIGHT;

    let FILE_INPUT = document.getElementById('file_input');
    FILE_INPUT.style.top = dim.FILE_INPUT_TOP;
    FILE_INPUT.style.left = 5;
    FILE_INPUT.style.width = dim.TEXT_INPUT_WIDTH;
    FILE_INPUT.style.height = dim.FILE_INPUT_HEIGHT;

    let TEXT_INPUT = document.getElementById('text_input');
    TEXT_INPUT.style.top = dim.TEXT_INPUT_TOP;
    TEXT_INPUT.style.left = 5;
    TEXT_INPUT.style.width = dim.TEXT_INPUT_WIDTH;
    TEXT_INPUT.style.height = dim.TEXT_INPUT_HEIGHT;

    let UTILITIES = document.getElementById('utilities');
    UTILITIES.style.top = dim.UTILITIES_TOP;
    UTILITIES.style.left = 5;
    UTILITIES.style.maxWidth = dim.UTILITIES_WIDTH;
    UTILITIES.style.maxHeight = dim.UTILITIES_HEIGHT;
    UTILITIES.style.width = dim.UTILITIES_WIDTH;
    UTILITIES.style.height = dim.UTILITIES_HEIGHT;

    let DOWNLOAD = document.getElementById('download');
    DOWNLOAD.style.top = dim.DOWNLOAD_TOP;
    DOWNLOAD.style.left = 5;
    DOWNLOAD.style.width = dim.DOWNLOAD_WIDTH;
    DOWNLOAD.style.height = dim.DOWNLOAD_HEIGHT;

    let RESULTS = document.getElementById('results');
    RESULTS.style.top = 5;
    RESULTS.style.left = dim.RESULTS_LEFT;
    RESULTS.style.width = dim.RESULTS_WIDTH;
    RESULTS.style.height = dim.RESULTS_HEIGHT;

    let CONSOLE = document.getElementById('console');
    CONSOLE.style.top = dim.CONSOLE_TOP;
    CONSOLE.style.left = dim.CONSOLE_LEFT;
    CONSOLE.style.width = dim.CONSOLE_WIDTH;
    CONSOLE.style.height = dim.CONSOLE_HEIGHT;

    let USER_INPUT = document.getElementById('user_input');
    USER_INPUT.style.top = dim.USER_INPUT_TOP;
    USER_INPUT.style.left = dim.USER_INPUT_LEFT;
    USER_INPUT.style.height = dim.USER_INPUT_HEIGHT;
    USER_INPUT.style.width = dim.USER_INPUT_WIDTH;

    let FOOTER = document.getElementById('footer');
    FOOTER.style.top = dim.FOOTER_TOP;
    FOOTER.style.left = 5;
    FOOTER.style.width = dim.FOOTER_WIDTH;
    FOOTER.style.height = dim.FOOTER_HEIGHT;
}

function getCurrentDimensions(){
    
    let WINDOW_HEIGHT = window.innerHeight - 5;
    let WINDOW_WIDTH = window.innerWidth - 5;
    let MENU_WIDTH = 0.20 * window.innerWidth;
    
    let LOGO_WIDTH = MENU_WIDTH;
    let LOGO_HEIGHT = LOGO_WIDTH / 4;
    let LOGO_CONTAINER_HEIGHT = LOGO_HEIGHT;
    
    let FILE_INPUT_TOP = LOGO_CONTAINER_HEIGHT + 10;
    let FILE_INPUT_HEIGHT = (0.05 * window.innerHeight) - 5;
    let FILE_INPUT_WIDTH = MENU_WIDTH - 15;
    
    let TEXT_INPUT_HEIGHT = 0.25 * window.innerHeight;
    let TEXT_INPUT_WIDTH = FILE_INPUT_WIDTH;
    let TEXT_INPUT_TOP = LOGO_CONTAINER_HEIGHT + FILE_INPUT_HEIGHT + 30;
    
    let RESULTS_HEIGHT = (0.80 * window.innerHeight) - 25;
    let RESULTS_WIDTH = (window.innerWidth - MENU_WIDTH) - 40;
    let RESULTS_LEFT = MENU_WIDTH + 15;
    
    let CONSOLE_HEIGHT = (0.14 * window.innerHeight) - 20;
    let CONSOLE_TOP = RESULTS_HEIGHT + 30;
    let CONSOLE_LEFT = RESULTS_LEFT;
    let CONSOLE_WIDTH = RESULTS_WIDTH;

    let USER_INPUT_HEIGHT = (0.01 * window.innerHeight);
    let USER_INPUT_WIDTH = CONSOLE_WIDTH;
    let USER_INPUT_LEFT = RESULTS_LEFT;
    let USER_INPUT_TOP = RESULTS_HEIGHT + CONSOLE_HEIGHT + 40;

    let DOWNLOAD_HEIGHT = FILE_INPUT_HEIGHT;
    let DOWNLOAD_WIDTH = FILE_INPUT_WIDTH;
    
    let UTILITIES_TOP = TEXT_INPUT_TOP + TEXT_INPUT_HEIGHT + 20;
    let UTILITIES_HEIGHT = (CONSOLE_HEIGHT + RESULTS_HEIGHT + USER_INPUT_HEIGHT) - (LOGO_CONTAINER_HEIGHT + FILE_INPUT_HEIGHT + TEXT_INPUT_HEIGHT + DOWNLOAD_HEIGHT + 30);
    let UTILITIES_WIDTH = MENU_WIDTH - 15;

    let DOWNLOAD_TOP = LOGO_HEIGHT + FILE_INPUT_HEIGHT + TEXT_INPUT_HEIGHT + UTILITIES_HEIGHT + 70;
    
    let FOOTER_TOP = RESULTS_HEIGHT + CONSOLE_HEIGHT + USER_INPUT_HEIGHT + 70;
    let FOOTER_WIDTH = WINDOW_WIDTH;
    let FOOTER_HEIGHT = (0.05 * window.innerHeight) - 15;

    

    return {
        "WINDOW_HEIGHT":WINDOW_HEIGHT + "px",
        "WINDOW_WIDTH":WINDOW_WIDTH + "px",
        "MENU_WIDTH":MENU_WIDTH + "px",
        "LOGO_CONTAINER_HEIGHT":LOGO_CONTAINER_HEIGHT + "px",
        "LOGO_WIDTH":LOGO_WIDTH + "px",
        "LOGO_HEIGHT":LOGO_HEIGHT + "px",
        "FILE_INPUT_HEIGHT":FILE_INPUT_HEIGHT + "px",
        "FILE_INPUT_WIDTH":FILE_INPUT_WIDTH + "px",
        "FILE_INPUT_TOP":FILE_INPUT_TOP + "px",
        "TEXT_INPUT_HEIGHT":TEXT_INPUT_HEIGHT + "px",
        "TEXT_INPUT_TOP":TEXT_INPUT_TOP + "px",
        "TEXT_INPUT_WIDTH":TEXT_INPUT_WIDTH + "px",
        "UTILITIES_HEIGHT":UTILITIES_HEIGHT + "px",
        "UTILITIES_TOP":UTILITIES_TOP + "px",
        "UTILITIES_WIDTH":UTILITIES_WIDTH + "px",
        "DOWNLOAD_HEIGHT":DOWNLOAD_HEIGHT + "px",
        "DOWNLOAD_WIDTH":DOWNLOAD_WIDTH + "px",
        "DOWNLOAD_TOP":DOWNLOAD_TOP + "px",
        "RESULTS_HEIGHT":RESULTS_HEIGHT + "px",
        "RESULTS_WIDTH":RESULTS_WIDTH + "px",
        "RESULTS_LEFT":RESULTS_LEFT + "px",
        "CONSOLE_HEIGHT":CONSOLE_HEIGHT + "px",
        "CONSOLE_WIDTH":CONSOLE_WIDTH + "px",
        "CONSOLE_LEFT":CONSOLE_LEFT + "px",
        "CONSOLE_TOP":CONSOLE_TOP + "px",
        "UTILITIES_HEIGHT":UTILITIES_HEIGHT + "px",
        "FOOTER_TOP":FOOTER_TOP + "px",
        "FOOTER_WIDTH":FOOTER_WIDTH + "px",
        "FOOTER_HEIGHT":FOOTER_HEIGHT + "px",
        "USER_INPUT_HEIGHT":USER_INPUT_HEIGHT + "px",
        "USER_INPUT_WIDTH":USER_INPUT_WIDTH + "px",
        "USER_INPUT_TOP":USER_INPUT_TOP + "px",
        "USER_INPUT_LEFT":USER_INPUT_LEFT + "px"
    };
}