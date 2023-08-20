
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
            var isActive = (page.pageID == selectedPage.pageID);
            item += '<a href="javascript:window.versions.loadPage(' + page.pageID + ');" class="list-group-item ' + (isActive ? '' : '') + '"';
            item += '>';
            item += '<span class="list-group-item-heading">' + page.name + '</span>';
            //item += '<p class="list-group-item-text">...</p>';
            item += '</a>';
        }
        document.getElementById('sideNavItems').outerHTML = item
    } catch (e) {
        console.log(e)

    }


}



onInit()


