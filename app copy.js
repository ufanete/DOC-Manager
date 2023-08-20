//var AppController = new AppController();

module.exports = {
  
  printBalance: printBalance,
  getAtmAccounts: getAtmAccounts,
  getAtmNavBar: getAtmNavBar,
  initAtmKeyPad: initAtmKeyPad,
  PageViewManager: PageViewManager,
  PageList: PageList,
  AppController: AppController
}

  
module.exports.AppController = class AppController() {
  console.log("insode app controller");

  constructor(DB, options) {

    this.db = new DB(options);
  // EXPORTS
  this['organisation'] = db.queryDB("SELECT * FROM Organisation LIMIT 1;", {})[0];
  this['pages'] = db.queryDB("SELECT * FROM Page;", {});
  this['homePage'] = db.queryDB("SELECT * FROM Page WHERE isHomePage = :isStart LIMIT 1;", {':isStart':1})[0];
  this['appPage'] = 'Dash';
  this['selectedPage'] = this['homePage'];
  }


  function getPage(pageID) {
    var pageToLoad = db.queryDB("SELECT * FROM Page WHERE pageID = :pid LIMIT 1;", {':pid':pageID})[0];
    pageToLoad.pageDetails = db.queryDB("SELECT * FROM PageDetails WHERE pageID =:idval;", {':idval':pageID});
    return pageToLoad;
  }

  this['loadPage'] = function(pageID) {
    var pageToLoad = getPage(pageID);
    var pageHTML = loadPageHTML(pageToLoad);

    this['selectedPage'] = pageToLoad;
    return true;
  }

  this['reload'] = function() {
    this['loadPage'](this['selectedPage'].pageID);
  }

  this['archivePageEntry'] = function(rowIndex){
    if (!confirm('check yourself fool! you sure that what you wanna do?')) {
      return false;
    }

    var isEdit = rowIndex && rowIndex >= 0;
    var emptyEntry = true;
    var pageDetails = this['selectedPage'].pageDetails;
    var query = "";

    for (var i = 0; i < pageDetails.length; i++) {
      var pageDetail = pageDetails[i];
      query += "DELETE FROM PageEntries WHERE ";
      query += "pageID = " + pageDetail.pageID + " AND ";
      query += "rowIndex = "  + rowIndex + ";";
    }

    db.exec(query);
    saveDB();
    return true;
  }

  this['saveNewPageEntry'] = function(rowIndex) {
    var isEdit = rowIndex && rowIndex >= 0;
    var emptyEntry = true;
    var pageDetails = this['selectedPage'].pageDetails;
    var query = "";

    if (!isEdit) {
      rowIndex = db.queryDB("SELECT MAX(rowIndex) AS maxIndex FROM PageEntries", {})[0]['maxIndex'];
      rowIndex = rowIndex == null ? 1 : rowIndex + 1;
    }

    for (var i = 0; i < pageDetails.length; i++) {
      var pageDetail = pageDetails[i];
      if (!isEdit) {

        query += "INSERT INTO PageEntries VALUES (";
        query += pageDetail.pageID + ",";
        query += pageDetail.columnIndex + ",";
        query += rowIndex + ",";
        query += "'" + $('#column_' + pageDetail.columnIndex).val() + "');";

      } else {

        query += "UPDATE PageEntries SET value =";
        query += " '" + $('#column_' + pageDetail.columnIndex).val() + "'";
        query += " WHERE pageID = " + pageDetail.pageID;
        query += " AND columnIndex = " + pageDetail.columnIndex;
        query += " AND rowIndex = " + rowIndex + ";";

      }
      // check if column value is empty
      emptyEntry &= /^\s*$/.test($('#column_' + pageDetail.columnIndex).val());
    }

    // if at least one column entry, save and reload page
    if(!emptyEntry) {
      db.exec(query);
      saveDB();
    }
  }

  var ADD_EDIT_DIV = "myModal";
  var ADD_EDIT_SAVE_BUTTON = ADD_EDIT_DIV + "SaveButton";
  var ARCHIVE_BUTTON = "deleteButton";
  function loadPageHTML(pageToLoad) {
    $('.docs-content-container').html(getPageHTML(pageToLoad));
    $('#' + ADD_EDIT_DIV).on('hide.bs.modal', function (event) {
      $(this).find('.modal-body [id^=column_]').val('');
    });
    $('#' + ADD_EDIT_DIV).on('show.bs.modal', function (event) {
      // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
      // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
      var modal = $(this);
      var button = $(event.relatedTarget); // Button that triggered the modal
      //console.log(modal);
      console.log(button.data());
      var rowIndex = button.data('rowindex'); // Extract info from data-* attributes
      var isEdit = rowIndex && rowIndex >= 0;

      if (isEdit) {
        var row = getPageEntriesByRow(this['selectedPage'].pageID, rowIndex);

        for (var columnIndex in row) {
          modal.find('.modal-body #column_' + columnIndex).val(row[columnIndex].value);
        }
        $('#' + ARCHIVE_BUTTON).removeClass('hidden');
        $('#' + ARCHIVE_BUTTON).click(function(){this.archivePageEntry(rowIndex);});
        $('#' + ADD_EDIT_SAVE_BUTTON).click(function(){this.saveNewPageEntry(rowIndex);});
      } else {
        $('#' + ARCHIVE_BUTTON).addClass('hidden');
        $('#' + ARCHIVE_BUTTON).click(function(){void(0);});
        $('#' + ADD_EDIT_SAVE_BUTTON).click(function(){this.saveNewPageEntry();});
      }


      //modal.find('.modal-title').text('New message to ' + rowIndex);

    });
  }

  function getPageHTML(pageToLoad) {
    var pageHTML = '<div class="docs-section">';

    // add page header
    pageHTML += '<h1 id="tables" class="page-header">';
    pageHTML += '<a class="anchorjs-link " href="#tables" aria-label="Anchor link for: tables"';
    pageHTML += 'data-anchorjs-icon="" style="font-family: anchorjs-icons; ';
    pageHTML += 'font-style: normal; font-variant: normal; font-weight: normal; position: absolute; ';
    pageHTML += 'margin-left: -1em; padding-right: 0.5em;">';
    pageHTML += '</a>' + pageToLoad.name;
    pageHTML += '</h1>';

    /*
    // add page sub header
    pageHTML += '<h2 id="tables-contextual-classes"><a class="anchorjs-link " ';
    pageHTML += 'href="#tables-contextual-classes" aria-label="Anchor link for: tables contextual classes" ';
    pageHTML += 'data-anchorjs-icon="" style="font-family: anchorjs-icons; font-style: normal; ';
    pageHTML += 'font-variant: normal; font-weight: normal; position: absolute; margin-left: -1em; ';
    pageHTML += 'padding-right: 0.5em;"></a>Contextual classes';
    pageHTML += '</h2>';
    */
    // add new entry button
    pageHTML += getAddNewButton(pageToLoad.pageDetails);
    //pageHTML += '<p>Use contextual classes to color table rows or individual cells.</p>';
    pageHTML += '<div class="table-responsive docs-page-entries">';

    // add page data
    pageHTML += getPageContentHTML(pageToLoad);
    pageHTML += '</div>';
    pageHTML += '</div>';
    return pageHTML;
  }

  function getAddNewButton(pageDetails) {
    var button = '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#' + ADD_EDIT_DIV + '" style="width:100%">';
    button += 'New entry</button>';
    button += '<div class="modal fade" id="' + ADD_EDIT_DIV + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">';
    button += '<div class="modal-dialog" role="document">';
    button += '<div class="modal-content">';
    button += '<div class="modal-header">';
    button += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    button += '<h4 class="modal-title" id="myModalLabel">Add new entry</h4>';
    button += '</div>';
    button += '<div class="modal-body">';
    button += getAddNewEntry(pageDetails);
    button += '</div>';
    button += '<div class="modal-footer">';
    button += '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
    button += '<button type="button" class="btn btn-primary" id="' + ADD_EDIT_SAVE_BUTTON + '" >Save changes</button>';
    button += '<button type="button" class="btn btn-danger hidden" id="' + ARCHIVE_BUTTON + '" >Archive</button>';
    button += '</div>';
    button += '</div>';
    button += '</div>';
    button += '</div>';
    return button;
  }

  function getAddNewEntry(pageDetails) {
    var html = '<form> ';
    for(var i = 0; i < pageDetails.length; i++){
      var pageDetail = pageDetails[i];
      var inputId = 'column_' + pageDetail.columnIndex;
      html += '<div class="form-group"> ';
      html += '<label for="' + inputId + '" class="control-label">' + pageDetail.columnName + '</label> ';

      if (pageDetail.dataType == 1) {
        html += '<input class="form-control" id="' + inputId + '">';
      } else {
        html +=  '<textarea class="form-control" id="' + inputId + '"></textarea>';
      }

      html += '</div> ';
    }

    html += '</form>';
    return html;
  }

  function getPageContentHTML(pageToLoad) {
    var pageID = pageToLoad.pageID;
    var pageDetails = pageToLoad.pageDetails;
    var pageEntries = getPageEntriesByRow(pageID);
    var html = '<table class="table table-bordered table-striped">';

    // check if there are any page entries
    if(Object.keys(pageEntries == null ? {} : pageEntries).length > 0) {
      var html_colgroup = '<colgroup>';
      var html_head = '<thead><tr>';

      for(var i = 0; i < pageDetails.length; i++){
        var pageDetail = pageDetails[i];
        html_colgroup += '<col class="col-xs-'+ pageDetail.columnSize +'">';
        html_head += '<th>'+ pageDetail.columnName +'</th>';
      }
      html_colgroup += '</colgroup>';
      html_head += '</tr></thead>';
      html += html_colgroup;
      html += html_head;
      html += '<tbody>';

      for(var rowIndex in pageEntries){
        html += addRowEntry(pageEntries[rowIndex], rowIndex);
      }
      html += '</tbody>';
    }

    html += '</table>';

    return html;
  }

  function getPageEntriesByRow(pageID, rowIndex) {
    var pageEntries = null;
    var rowMap = {};
    var columnMap = {};
    var isSingleRow = (rowIndex && rowIndex >= 0);
    if(isSingleRow) {
      pageEntries = db.queryDB("SELECT * FROM PageEntries WHERE pageID =:idval AND rowIndex=:ridxval;", {':idval':pageID, ':ridxval':rowIndex});
    }

    else {
      pageEntries = db.queryDB("SELECT * FROM PageEntries WHERE pageID =:idval;", {':idval':pageID});
    }

    for(var i = 0; i < pageEntries.length; i++) {
      // pageEntry is row i
      var pageEntry = pageEntries[i];
      if(rowMap[pageEntry.rowIndex] == null) {
        rowMap[pageEntry.rowIndex] = {};
      }
      rowMap[pageEntry.rowIndex][pageEntry.columnIndex] = pageEntry;
    }

    if (!isSingleRow) return rowMap;
    else return rowMap == null ? null : rowMap[rowIndex];
  }

  // remove rowindex param ?? causes valnurabilities
  function addRowEntry(row, rowIndex){
    var html = '<tr data-toggle="modal" data-target="#'+ ADD_EDIT_DIV +'" data-rowindex="'+rowIndex+'">';

    for(var columnIndex in row){
      html += '<td>' + row[columnIndex].value + '</td>';
    }

    html += '</tr>';
    return html;
  }

  function saveDB() {
    db.saveDB();
    this['reload']();
  }

} // end AppController

/*Globals/CONSTANTS
*************/


/*parent container for the ATM*/
var ATM_UI_WINDOW = '.docs-main-container';

var confirmEnable = false;

var keepKeypadAlive = false;

var currAccount = '';
/*Page view manageer functions and variables
var viewController = new PageViewManager({
    pages : {
        login: '#atm_page_login',
        home: '#atm_account_select',
        account: '#atm_single_account_view',
        trans_withdraw: '#atm_withdraw',
        trans_deposit: '#atm_deposit',
        online_services_home: '#atm_online_services_home',
        success: '#success_page',
        quick_withdraw: '#atm_withdraw_quick'

    },
    navBar : {
        home: {
            logout: function(){
                goToPage('login');
            },
            account: function(){
                goToPage('trans_withdraw');
            }
        },
        account: {
            back: function(){goToPage('home')}
        },
        trans_withdraw: {
            back: function(){goToPage('account', currAccount)}
        },
        trans_deposit: {
            back:  function(){goToPage('account', currAccount)}
        },
        online_services_home: {
            back:  function(){goToPage('home')}
        },
        quick_withdraw: {
            back: function(){goToPage('home')}
        }


    },
    onPageShow : {

        home: showAtmAccounts,
        account : showAtmSingleAccount

    },
    homePage : 'login'

});
*/

function addString(input, targetId) {

    targetId = '#'+targetId;

	var value = $(targetId).val();
    var string = $(input).html();
    var max_len = $(targetId).attr('maxlength');

	if (value.length + 1 <= max_len){
		$(targetId).val(value + string);
		if (value.length + 1 == max_len){
		  $('#confirmButton').removeClass('btn-inverse').addClass('btn-success');
		  confirmEnable = true;
		}
	}

}

function correct(targetId) {
    targetId = '#'+targetId;
	var value = $(targetId).val();
	$(targetId).val(value.substring(0,value.length-1));
	 $('#confirmButton').addClass('btn-inverse').removeClass('btn-success');
}

function cancel (targetId) {
    targetId = '#'+targetId;
	$(targetId).val("");
	 $('#confirmButton').addClass('btn-inverse').removeClass('btn-success');
}



/*
End Globals/CONSTANTS
*************************************************************************************************************/


/*
******************************************************
Page navigation classes/functions
*******************************************************/

function PageViewManager(options) {
    var t = this;
    /*Current page*/
    t.currPage = options.homePage;
    t.nextPage = t.currPage;
    t.prevPage = t.currPage;
    t._pageList = new PageList(options.pages);
    t.homePage = options.homePage;

    t.goToPage = function(pageName, args) {
        console.log(pageName, args);
        var ret = undefined;

        if(options.pages && options.pages[pageName]){
            t.prevPage = t.currPage;
            t.currPage = pageName;

            $(options.pages[t.prevPage]).hide();//toggle('slide');
   	 	    $(options.pages[t.currPage]).show('slow').removeClass('atm_hide');

        }

        if(options.navBar && options.navBar[pageName]){
            showAtmNavBar(options.navBar[pageName]);
        }else{
            removeAtmNavBar();
        }

        if(options.onPageShow && typeof options.onPageShow[pageName] == 'function') {
            options.onPageShow[pageName](args);
        }

    };

    t.goBack = function(){
        t.goToPage(t.prevPage);
    }

}

function PageList(listItems) {
    var t = this;
    t.list = [];
    //t.listItems = listItems;

    /*Set list of pages*/
    t.setList = function(_listItems) {
        t.listItems = _listItems;
        if(typeof t.listItems == 'object') {
            for(key in t.listItems) {
                t.list[key] = t.listItems[key];
            }
        }
    };

    /*Get item by name or by index. TODO: fix bug when getting by age index*/
    t.getItem = function(item) {
        if(typeof item == 'number' && t.list.length > item) {
            var count = 0;
            for(key in t.list) {
                if(count == item) return t.list[key];
                count = count + 1;
            }
        }else {
            return t.list[item];
        }
    };

    t.setList(listItems);
}
/*
******************************************************************************************/


/*
********************************************************
HTML Object/Builder functions for dynamic content/behaviour
********************************************************/


/*
*  inputIDs = the ids for the html elements that you want to replace with account numbers
*  json = The json which will contain the account numbers, and balances. JSON should be ordered aligning with the inputIDs
*/

function addAttribute(inputIDs,json,attribute) {

    data = json.accounts;
    count = 0;
    for (id in inputIDs) {
        $(inputIDs[id]).html(data[count][attribute]);
        count++;
    }

}

function notify (message,type) {
    $('.top-right').notify({
                     message: { text: message },
                     fadeOut: { enabled: true, delay: 3000 },
                     type:type
                  }).show();
}

function showAtmKeyPad(elem, keypadClick) {
    removeAtmKeyPad();
    var keyPad = $(getKeyPad(elem));

    $(keyPad).click(keypadClick);

    $(elem).parent().append(keyPad);
}

function removeAtmKeyPad() {
    $('#atm_keypad_span').remove();
}

function showAtmNavBar(navItems/*object containing nav bar and callback function*/) {
    removeAtmNavBar();
    $('#atm_nav_bar').append(getAtmNavBar(navItems));
}

function removeAtmNavBar() {
    $('#atm_nav_bar').find('.navbar').remove();
}

function getKeyPad(elem) {
    /*the ID of the input elemnt to append keypad input to*/
    var targetElemId = $(elem).attr('id');

    var keyPad = $('<table class = ""/>');

    /*num is the key pad number starting from 1*/
    var num = 1;
    var row = undefined;

    /*For loop to define the first three columns ie 1-9*/
    for(var i = 0; i < 3; i++) {

        row = $('<tr />');

        for(var c = 0; c < 3; c++){
            var e = $('<td class="btn btn-info"/>');
            e.html(num);
            num = num + 1;
            $(e).click(function(){
                addString(this, targetElemId);
            });

            $(row).append(e);
        }

        $(keyPad).append(row);

    }

    /*add the last row: Cancel 0 Correct*/

    row = $('<tr  />');


    var e = $('<td class="btn btn-danger"/>');
    e.html("Clear");
    $(e).click(function(){
        cancel(targetElemId);
    });

    $(row).append(e);

    e = $('<td class="btn btn-info"/>');
    e.html(0);
    $(e).click(function(){
        addString(this, targetElemId);
    });

    $(row).append(e);

    e = $('<td class="btn btn-warning"/>');
    e.html("Correct");
    $(e).click(function(){
        correct(targetElemId);
    });

    $(row).append(e);

    $(keyPad).append(row);

   /* <div class="alert alert-danger alert-dismissible fade in" role="alert">
      <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
      <button type="button" class="btn btn-danger">Take this action</button>
      <button type="button" class="btn btn-default">Or do this</button>
    </div>*/

    var ret = $('<span id="atm_keypad_span"/>').append($('<div id="atm_keypad" class="alert"/>')
                                                       .append('<button type="button" class="close" onclick="removeAtmKeyPad()"><span >×&nbsp;&nbsp;</span><span class="sr-only">Close</span></button>')
                                                       .append(keyPad));

    //ret.offset().top = elem.offsetBottom;
    var _top = elem.offsetTop + ($(elem).outerHeight());
    var _left = $(ATM_UI_WINDOW).offset().left + 50; // atm window offset + 5px for padding;
    var _width = $(ATM_UI_WINDOW).outerWidth() - 100; //atm window width - 5 for padding  - 5 to correct for left offset

    $(ret).css({position: 'absolute', top: (_top+'px') , left: (_left+'px'), margin: '0', width: (_width+'px'), height: 'auto'});

    return  ret;
}


function initAtmKeyPad(inputIds/*array containing ids of input that require the key pad*/) {

    $(inputIds).each(function(key, value){
        $(value).focus(function(event){
            showAtmKeyPad(this, function () {
                //console.log('click keypad');
                //console.log(arguments);
                if(!keepKeypadAlive){
                    keepKeypadAlive = true;
                }
            });

            keepKeypadAlive = true;
        })
        .focusout(function(event){
            //console.log(event);
            keepKeypadAlive = false;
        });
    });

    $(document).click(function () {
        //console.log('click document');
        //console.log(arguments);
        if (!keepKeypadAlive){
            removeAtmKeyPad();
        }else{
            keepKeypadAlive = false;
        }
    });
}

/*ATM nav bar*/
function getAtmNavBar(navItems/*array of nav options*/) {

    var nav = $('<nav class="navbar navbar-default" role="navigation">');

    var temp_div_container = $('<div class="container">');

    var temp_div = $('<div class="navbar-header">')
        .append(
            $('<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-7">')
                .append('<span class="sr-only">Toggle navigation</span>')
                .append('<span class="icon-bar"></span>')
                .append('<span class="icon-bar"></span>')
                .append('<span class="icon-bar"></span>'))
        .append(
            $('<a class="navbar-brand" href="" title="logout"><span>CARD INSERTED - EJECT YOUR CARD</span></a>')
                .click(function(){


                    notify ('Ejecting card now','danger');
                    var delay=3000;//1 seconds
                    setTimeout(function(){
                   // goToPage('login');
                    },delay);


                })
                .mouseover(function(){$(this).css('color', 'green');})
                .mouseout(function(){$(this).css('color', '#FFF');})

               );

    temp_div_container.append(temp_div);

    temp_div = $('<div class="collapse navbar-collapse" >');
    var temp_list = $('<ul class="nav navbar-nav">');
                //.append('<li class="active"><a href="javascript:console.log(\'home\')">Home</a></li>')
                //.append('<li><a href="#">Link</a></li>'));

    for(var item in navItems){
        temp_list.append(
            $('<li class=""><a href="#" >'+item+'</a></li>').click(navItems[item])
        );
    }

    temp_div.append(temp_list);
    temp_div_container.append(temp_div);
    nav.append(temp_div_container);

    return nav;


}

function getAtmAccounts() {
    var acc = $('<div class="atm_account atm_account_chequing">');

    var acc_table_cheq = $('<table id="accounts_chequing" class="table table-hover">');


    var acc_table_sav = $('<table id="accounts_savings" class="table table-hover">');

    var acc_table_cheq_body = $('<tbody />');
    var acc_table_sav_body = $('<tbody />');
    var count = 0;

    for(var profile in jsonArray) {
        for(var account in jsonArray[profile]){
            var accNum = jsonArray[profile][account]['Number'];
            //console.log('accNum' + accNum);

            count = count + 1;
            var acc_table_body_tr = $('<tr id="tr'+count+'"/>');

            for(var prop in jsonArray[profile][account]){
                if(prop == 'Type') continue;
                acc_table_body_tr.append('<td>'+jsonArray[profile][account][prop]+'</td>').click(function(){

                    //console.log(account);
                    currAccount = $($(this).find('td')[0]).html();
                    //console.log('this is clicking');
                    //console.log($($(this).find('td')[0]).html());
                    goToPage('account', currAccount);

                });

            }
            acc_table_body_tr
            .append(
                $('<td><span class="btn btn-default btn-sml">Withdraw</td>')
                    .click(function(event){
                        currAccount = $($(this).parent().find('td')[0]).html();
                        goToPage('trans_withdraw');
                        event.stopPropagation();
                    })
            )
            .append(
                $('<td><span class="btn btn-default btn-sml">Deposit</td>')
                    .click(function(event){
                        currAccount = $($(this).parent().find('td')[0]).html();
                        goToPage('trans_deposit');
                        event.stopPropagation();
                    })
            ).append(
                $('<td><span class="btn btn-default btn-sml">Quick Withdraw</td>')
                    .click(function(event){
                        goToPage('quick_withdraw');
                        currAccount = $($(this).parent().find('td')[0]).html();
                        event.stopPropagation();
                    })
            );
                           // .append('<td><span class="btn btn-default btn-sml">Deposit</td> ')
                            //.append('<td><span class="btn btn-default btn-sml">Last Transaction</td>');
            //console.log('click'+accNum);

            //acc_table_body_tr.click(clicks);
            if(jsonArray[profile][account]['Type'] == 'Chequing') {
                acc_table_cheq_body.append(acc_table_body_tr);
            }else {
                acc_table_sav_body.append(acc_table_body_tr);
            }

            //$(acc_table_sav_body).find('#tr'+count).delegate('click',function(){goToPage('account', accNum);});
        }
    }

    acc_table_cheq.append('<thead><tr><th>Account #</th><th colspan="4">Account balance</th></tr></thead>')
                    .append(acc_table_cheq_body);

    acc_table_sav.append('<thead><tr><th>Account #</th><th colspan="4">Account balance</th></tr></thead>')
                    .append(acc_table_sav_body);

    acc.append('<span class="">Chequing</span>')
        .append(acc_table_cheq)
        .append('<span class="">Saving</span>')
        .append(acc_table_sav);

    return $('<div id="atm_account_select_wrap" />').append(acc);
}

function printBalance() {
    notify ('Printing Balance','success');
     var delay=3000;//1 seconds
    setTimeout(function(){
         goToPage('login');
    },delay);

}

/*
End HTML Object/Builder functions for dynamic content/behaviour
*************************************************************************************************************/
