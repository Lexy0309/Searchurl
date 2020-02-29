function searchUrl(query) {

    var array = [];
    var sheet = SpreadsheetApp.getActiveSheet();
    var datarange = sheet.getDataRange();
    var numRows = datarange.getNumRows();
    var numColumns = datarange.getNumColumns();
    var nextRows = numRows + 1;

    var urlTemplate = "https://www.googleapis.com/customsearch/v1?key=%KEY%&cx=%CX%&alt=json&num=10&start=%INDEX%&q=%Q%";
    var array_result = [];
    var ApiKey = "APIKEY";
    var searchEngineID = "SEARCHENGINE_ID";
    var range = sheet.getDataRange();
    var values = range.getValues();
    var range_1 = sheet.getRange("Keywords!A1:A200");
    var range_2 = sheet.getRange("Sheet2!A1:A200");
    var values_2 = range_2.getValues();

    for (var n = 1; n < 11; n++) {
        // var query = "apple";
        var query = values[n][0];
        if ((query != "") && (query != undefined)) {

            var url = urlTemplate
                .replace("%KEY%", encodeURIComponent(ApiKey))
                .replace("%CX%", encodeURIComponent(searchEngineID))
                .replace("%Q%", encodeURIComponent(query))
                .replace("%INDEX%", encodeURIComponent(1));


            var response = UrlFetchApp.fetch(url);
            var respCode = response.getResponseCode();

            if (respCode !== 200) {
                throw new Error("Error " + respCode + " " + response.getContentText());
            } else {
                var result = JSON.parse(response.getContentText());
                for (var i = 0; i < 10; i++) {
                    var geturl = result.items[i].link
                    var domain = geturl.replace('http://', '').replace('https://', '').split(/[/?#]/)[0];
                    domain = domain.replace('www.', '');
                    array.push(domain);
                }
            }
        }
    }
    

    var array_duplicated = [];
    var array_temp = [];

    var curItemItem = array.indexOf(domain);
    
    for (var a = 0; a < array.length; a++){
        array_duplicated[a] = 0;
        for (var b = 0; b < array.length; b++){
            if(array[a] === array[b]){
                array_duplicated[a]++;
            }
        }
    }
    Logger.log(array_duplicated);                                                                                  
    for (var i= 0; i < array.length; i++){
        if((array_duplicated[i] > 1) && (array_temp.indexOf(array[i]) < 0)){
            array_temp.push(array[i]);
        }
    }
    
    var exlusion_domain = [];
    for (var i = 0; i < array_temp.length; i++){
        var temp = 0;
        for (var j = 1; j < values_2.length; j++) {
            exlusion_domain = values_2[j][0].replace('http://', '').replace('https://', '').replace('www.', '').split(/[/?#]/)[0];

            if ((values_2[j][0]) && (domain) && (values_2[j][0].indexOf(array_temp[i]) > 0 ) && (array_temp[i].indexOf(exlusion_domain) > 0 )) {
                temp++;
            }
        }
        if (temp == 0){
            array_result.push(array_temp[i]);
        }
    }                        
    

    return (array_result);
}