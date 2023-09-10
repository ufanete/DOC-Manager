module.exports.AppController = class AppController {

  constructor(DB) {
    console.log("App Controller Ready...")
    this.app = {};
    this.db = DB;// new DB(options);

    this.ADD_EDIT_DIV = "myModal";
    this.ADD_EDIT_SAVE_BUTTON = this.ADD_EDIT_DIV + "SaveButton";
    this.ARCHIVE_BUTTON = "deleteButton";


    this.appPage = 'Dash';
    this.selectedPage = this.homePage();

  }
  organisation() {
    return this.db.queryDB("SELECT * FROM Organisation LIMIT 1;", {})[0];
  }
  pages() {
    return this.db.queryDB("SELECT * FROM Page;", {});
  }
  homePage() {
    return this.db.queryDB("SELECT * FROM Page WHERE isHomePage = :isStart LIMIT 1;", { ':isStart': 1 })[0];
  }

  getPage(pageID) {
    console.log(pageID);
    var pageToLoad = this.db.queryDB(`SELECT * FROM Page WHERE pageID = ${pageID} LIMIT 1;`);
    console.log(pageToLoad);
    //, { ':pid': pageID });
    pageToLoad.pageDetails = this.db.queryDB(`SELECT * FROM PageDetails WHERE pageID =${pageID};`);
    
    console.log(pageToLoad);
    //, { ':idval': pageID });
    return pageToLoad;
  }

  loadPage(pageID) {
    var pageToLoad = this.getPage(pageID);
    this.loadPageHTML(pageToLoad);
    this.selectedPage = pageToLoad;
    return true;
  }
  reload() {
    this.loadPage(this.selectedPage.pageID);
  }
  archivePageEntry(rowIndex) {
    if (!confirm('check yourself fool! you sure that what you wanna do?')) {
      return false;
    }

    var isEdit = rowIndex && rowIndex >= 0;
    var emptyEntry = true;
    var pageDetails = this.selectedPage.pageDetails;
    var query = "";

    for (var i = 0; i < pageDetails.length; i++) {
      var pageDetail = pageDetails[i];
      query += "DELETE FROM PageEntries WHERE ";
      query += "pageID = " + pageDetail.pageID + " AND ";
      query += "rowIndex = " + rowIndex + ";";
    }

    this.dbexec(query);
    this.saveDB();
    return true;
  }
  saveNewPageEntry(rowIndex) {
    var isEdit = rowIndex && rowIndex >= 0;
    var emptyEntry = true;
    var pageDetails = this.selectedPage.pageDetails;
    var query = "";

    if (!isEdit) {
      rowIndex = this.dbqueryDB("SELECT MAX(rowIndex) AS maxIndex FROM PageEntries", {})[0]['maxIndex'];
      rowIndex = rowIndex == null ? 1 : rowIndex + 1;
    }

    for (var i = 0; i < pageDetails.length; i++) {
      var pageDetail = pageDetails[i];
      if (!isEdit) {

        query += "INSERT INTO PageEntries VALUES (";
        query += pageDetail.pageID + ",";
        query += pageDetail.columnIndex + ",";
        query += rowIndex + ",";
        query += "'" + window.$('#column_' + pageDetail.columnIndex).val() + "');";

      } else {

        query += "UPDATE PageEntries SET value =";
        query += " '" + window.$('#column_' + pageDetail.columnIndex).val() + "'";
        query += " WHERE pageID = " + pageDetail.pageID;
        query += " AND columnIndex = " + pageDetail.columnIndex;
        query += " AND rowIndex = " + rowIndex + ";";

      }
      // check if column value is empty
      emptyEntry &= /^\s*$/.test(window.$('#column_' + pageDetail.columnIndex).val());
    }

    // if at least one column entry, save and reload page
    if (!emptyEntry) {
      this.db.exec(query);
      this.saveDB();
    }
  }

  loadPageHTML(pageToLoad) {
    console.log("load page here")
    setHtml('docs-content-container', this.getPageHTML(pageToLoad))
    

    window.$('#' + this.ADD_EDIT_DIV).on('hide.bs.modal', function (event) {
      window.$(this).find('.modal-body [id^=column_]').val('');
    });

    var selectedPage = this.selectedPage;
    var controller = this;
    window.$('#' + this.ADD_EDIT_DIV).on('show.bs.modal', function (event) {
      // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
      // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
      var modal = window.$(this);
      var button = window.$(event.relatedTarget); // Button that triggered the modal
      //console.log(modal);
      console.log(button.data());
      var rowIndex = button.data('rowindex'); // Extract info from data-* attributes
      var isEdit = rowIndex && rowIndex >= 0;

      if (isEdit) {
        var row = controller.getPageEntriesByRow(selectedPage.pageID, rowIndex);

        for (var columnIndex in row) {
          modal.find('.modal-body #column_' + columnIndex).val(row[columnIndex].value);
        }
        window.$('#' + controller.ARCHIVE_BUTTON).removeClass('hidden');
        window.$('#' + controller.ARCHIVE_BUTTON).click(function () { controller.archivePageEntry(rowIndex); });
        window.$('#' + controller.ADD_EDIT_SAVE_BUTTON).click(function () { controller.saveNewPageEntry(rowIndex); });
      } else {
        window.$('#' + controller.ARCHIVE_BUTTON).addClass('hidden');
        window.$('#' + controller.ARCHIVE_BUTTON).click(function () { void (0); });
        window.$('#' + controller.ADD_EDIT_SAVE_BUTTON).click(function () { controller.saveNewPageEntry(); });
      }


      //modal.find('.modal-title').text('New message to ' + rowIndex);

    });
  }

  getPageHTML(pageToLoad) {
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
    pageHTML += this.getAddNewButton(pageToLoad.pageDetails);
    //pageHTML += '<p>Use contextual classes to color table rows or individual cells.</p>';
    pageHTML += '<div class="table-responsive docs-page-entries">';

    // add page data
    pageHTML += this.getPageContentHTML(pageToLoad);
    pageHTML += '</div>';
    pageHTML += '</div>';
    return pageHTML;
  }

  getAddNewButton(pageDetails) {
    var button = '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#' + this.ADD_EDIT_DIV + '" style="width:100%">';
    button += 'New entry</button>';
    button += '<div class="modal fade" id="' + this.ADD_EDIT_DIV + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">';
    button += '<div class="modal-dialog" role="document">';
    button += '<div class="modal-content">';
    button += '<div class="modal-header">';
    button += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    button += '<h4 class="modal-title" id="myModalLabel">Add new entry</h4>';
    button += '</div>';
    button += '<div class="modal-body">';
    button += this.getAddNewEntry(pageDetails);
    button += '</div>';
    button += '<div class="modal-footer">';
    button += '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
    button += '<button type="button" class="btn btn-primary" id="' + this.ADD_EDIT_SAVE_BUTTON + '" >Save changes</button>';
    button += '<button type="button" class="btn btn-danger hidden" id="' + this.ARCHIVE_BUTTON + '" >Archive</button>';
    button += '</div>';
    button += '</div>';
    button += '</div>';
    button += '</div>';
    return button;
  }

  getAddNewEntry(pageDetails) {
    console.log(pageDetails)
    var html = '<form> ';
    for (var i = 0; pageDetails && i < pageDetails.length; i++) {
      var pageDetail = pageDetails[i];
      var inputId = 'column_' + pageDetail.columnIndex;
      html += '<div class="form-group"> ';
      html += '<label for="' + inputId + '" class="control-label">' + pageDetail.columnName + '</label> ';

      if (pageDetail.dataType == 1) {
        html += '<input class="form-control" id="' + inputId + '">';
      } else {
        html += '<textarea class="form-control" id="' + inputId + '"></textarea>';
      }

      html += '</div> ';
    }

    html += '</form>';
    return html;
  }

  getPageContentHTML(pageToLoad) {
    var pageID = pageToLoad.pageID;
    var pageDetails = pageToLoad.pageDetails;
    var pageEntries = this.getPageEntriesByRow(pageID);
    var html = '<table class="table table-bordered table-striped">';

    // check if there are any page entries
    if (Object.keys(pageEntries == null ? {} : pageEntries).length > 0) {
      var html_colgroup = '<colgroup>';
      var html_head = '<thead><tr>';

      for (var i = 0; i < pageDetails.length; i++) {
        var pageDetail = pageDetails[i];
        html_colgroup += '<col class="col-xs-' + pageDetail.columnSize + '">';
        html_head += '<th>' + pageDetail.columnName + '</th>';
      }
      html_colgroup += '</colgroup>';
      html_head += '</tr></thead>';
      html += html_colgroup;
      html += html_head;
      html += '<tbody>';

      for (var rowIndex in pageEntries) {
        html += this.addRowEntry(pageEntries[rowIndex], rowIndex);
      }
      html += '</tbody>';
    }

    html += '</table>';

    return html;
  }

  getPageEntriesByRow(pageID, rowIndex) {
    var pageEntries = null;
    var rowMap = {};
    var columnMap = {};
    var isSingleRow = (rowIndex && rowIndex >= 0);
    if (isSingleRow) {
      pageEntries = this.db.queryDB("SELECT * FROM PageEntries WHERE pageID =:idval AND rowIndex=:ridxval;", { ':idval': pageID, ':ridxval': rowIndex });
    }

    else {
      pageEntries = this.db.queryDB("SELECT * FROM PageEntries WHERE pageID =:idval;", { ':idval': pageID });
    }

    for (var i = 0; i < pageEntries.length; i++) {
      // pageEntry is row i
      var pageEntry = pageEntries[i];
      if (rowMap[pageEntry.rowIndex] == null) {
        rowMap[pageEntry.rowIndex] = {};
      }
      rowMap[pageEntry.rowIndex][pageEntry.columnIndex] = pageEntry;
    }

    if (!isSingleRow) return rowMap;
    else return rowMap == null ? null : rowMap[rowIndex];
  }

  // remove rowindex param ?? causes valnurabilities
  addRowEntry(row, rowIndex) {
    var html = '<tr data-toggle="modal" data-target="#' + this.ADD_EDIT_DIV + '" data-rowindex="' + rowIndex + '">';

    for (var columnIndex in row) {
      html += '<td>' + row[columnIndex].value + '</td>';
    }

    html += '</tr>';
    return html;
  }

  saveDB() {
    this.db.saveDB();
    this.reload();
  }

} // end AppController

