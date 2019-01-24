if(!localStorage.first){
    chrome.tabs.create({
       url : "http://hi.ru/?i50in"
    });
    localStorage.first = "true";
}