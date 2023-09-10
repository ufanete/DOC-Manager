
const information = document.getElementById('info')
information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`

const onInit = async () => {
    try {

        const organisation = await window.versions.organisation()
        console.log(organisation)
        document.getElementById('title').innerText = organisation.name
        document.getElementById('namePlaceHolder').innerText = organisation.name
        const pages = await window.versions.pages()
        const selectedPage = await window.versions.selectedPage
        console.log(pages)
        let item = "";
        for (var i = 0; i < pages.length; i++) {
            var page = pages[i];
            var isActiveCss = (page.pageID == selectedPage.pageID) ? "active" : "";
            item += '<a class="navigation-item" href="#!" ';
            item += ` data-pageId = '${page.pageID}' class="list-group-item ${isActiveCss}"`;
            item += '>';
            item += '<span class="list-group-item-heading">' + page.name + '</span>';
            //item += '<p class="list-group-item-text">...</p>';
            item += '</a>';
        }
        document.getElementById('sideNavItems').outerHTML = item

        const navItems = document.getElementsByClassName('navigation-item');
        if ( navItems != null) for (let i = 0; i < navItems.length; i++) {
            navItems[i].addEventListener('click', async (event) => {
                console.log(event)
                const pageid = event.currentTarget.dataset.pageid;
                const page = await window.versions.getPage(pageid);
                const html = await window.versions.getPageHTML(page);
                loadPageHTML(html);
            })
        }

    } catch (e) {
        console.log(e)

    }
}
onInit()



function loadPageHTML(html) {
    console.log("load page here")
    $('#docs-content-container').html(html)
    

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
        window.$('#' + controller.ADD_EDIT_SAVE_BUTTON).click(function () { 
            controller.saveNewPageEntry(); 
        });
      }


      //modal.find('.modal-title').text('New message to ' + rowIndex);

    });
  }

