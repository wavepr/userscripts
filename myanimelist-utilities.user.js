// ==UserScript==
// @name         MyAnimeList Utilities
// @namespace    https://github.com/wavepr/userscripts
// @version      0.2.2
// @description  try to take over the world!
// @author       wavepr
// @match        https://myanimelist.net/editprofile.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=myanimelist.net
// @downloadURL  https://github.com/wavepr/userscripts/raw/main/myanimelist-utilities.user.js
// @updateURL    https://github.com/wavepr/userscripts/raw/main/myanimelist-utilities.user.js
// @require      https://unpkg.com/dompurify@2.4.0/dist/purify.min.js
// @require      https://unpkg.com/marked@4.1.0/marked.min.js
// @require      https://unpkg.com/easymde/dist/easymde.min.js
// @resource     easymde_css https://unpkg.com/easymde/dist/easymde.min.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// ==/UserScript==


(function() {
    let meta_utf = document.createElement('meta');
    meta_utf.setAttribute("charset", "UTF-8");
    document.head.appendChild(meta_utf);
    
    const easymde_css = GM_getResourceText("easymde_css");
    GM_addStyle(easymde_css);

    const notesmde = new EasyMDE({element: document.querySelector('textarea[name="profile_mynotes"]'), spellChecker: false});


    let mn_elem = document.createElement('div');
    mn_elem.innerHTML = DOMPurify.sanitize(marked.parse(notesmde.value()));
    mn_elem.setAttribute('style', 'margin-bottom: 2rem;')

    document.querySelector('textarea[name="profile_mynotes"]').parentNode.prepend(mn_elem);

    notesmde.codemirror.on("change", () => {
        mn_elem.innerHTML = DOMPurify.sanitize(marked.parse(notesmde.value()));
    });
})();
