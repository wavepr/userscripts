// ==UserScript==
// @name         Library of Babel Utilities
// @namespace    https://github.com/wavepr/userscripts
// @version      0.0.1
// @description  Utilities for the Library of Babel
// @author       wavepr
// @match        https://libraryofbabel.info/*
// @icon         https://icons.duckduckgo.com/ip3/www.libraryofbabel.info.ico
// @downloadURL  https://github.com/wavepr/userscripts/raw/main/libraryofbabel-utilities.user.js
// @updateURL    https://github.com/wavepr/userscripts/raw/main/libraryofbabel-utilities.user.js
// @run-at       document-idle
// @require      https://unpkg.com/notyf@3.10.0/notyf.min.js
// @resource     notyf_css https://unpkg.com/notyf@3.10.0/notyf.min.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// ==/UserScript==

unsafeWindow.lobutils = { active: true };

(function () {
	"use strict";

	function copy_to_clipboard(text) {
		const type = "text/plain";
		const blob = new Blob([text], { type });
		const data = [new ClipboardItem({ [type]: blob })];

		navigator.clipboard.write(data);
	}

	GM_addStyle(GM_getResourceText("notyf_css"));

	const notyf = new Notyf({
		ripple: false,
		dismissible: true,
	});

	const notyf_nodissapear = new Notyf({
		ripple: false,
		dismissible: true,
		duration: 0,
	});

	const sidecontainer = document.querySelector("ul.booksidebar");

	const copyel = document.createElement("li");
	copyel.style.fontFamily = "Courier";

	const copyel_a = document.createElement("a");
	copyel_a.href = "#clicktocopy";
	copyel_a.textContent = "Copy ID of this page";
	copyel_a.addEventListener("click", (ev) => {
		ev.preventDefault();
		let dataform_els = document.getElementById("post").elements;

		let id = dataform_els.hex.value + "-w" + dataform_els.wall.value + "-s" + dataform_els.shelf.value + "-v" + dataform_els.volume.value + ":" + dataform_els.page.value;

		try {
			localStorage.setItem("lobutils_lastid", id);
		} catch (error) {}

		copy_to_clipboard(id);

		notyf.success("Copied to clipboard<br><button onclick='window.lobutils.generate_short()'>Get short URL</button>");

		// url must be shorter than 2083 chars

		// todo
	});

	copyel.appendChild(copyel_a);
	sidecontainer.appendChild(copyel);

	unsafeWindow.lobutils.generate_short = async () => {
		let id = localStorage.getItem("lobutils_lastid");

		if (id == null) {
			notyf.error("Could not generate Short URL");
		} else {
			let surl = "https:/libraryofbabel.info/book.cgi?" + id;

			if (surl.length > 2048) {
				notyf.error("Unfortunately, the ID is too long. (max. 2048 chars) Please choose another option for delivery");
			} else {
				let req = await fetch("https://ggff.io/" + encodeURI(surl), {
					mode: "no-cors",
					method: "GET",
				});
				// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
				if (req.redirected) {
					console.log("redir");
				}

				console.log(req.status, req.statusText);

				console.log(req);

				let data = await req.text();
				console.log(data);

				let urlid = data.match(/class="short-link" href="\/([^"]+)"/g);
				notyf_nodissapear.success(`Short URL (valid for 5 minutes): <a href="ggff.io/${urlid}">ggff.io/${urlid}</a>`);
			}
		}
	};
})();
