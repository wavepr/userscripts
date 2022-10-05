// ==UserScript==
// @name         Library of Babel Utilities
// @namespace    https://github.com/wavepr/userscripts
// @version      1.0.0
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
		duration: 5000,
	});

	const notyf_nodissapear = new Notyf({
		ripple: false,
		dismissible: true,
		duration: 0,
	});

	const create_element = {
		hiddeninput: (name, value) => {
			const el = document.createElement("input");
			el.type = "hidden";
			el.name = name;
			el.value = value;
			return el;
		},
	};

	if (document.querySelector("ul.booksidebar")) {
		const sidecontainer = document.querySelector("ul.booksidebar");

		const copyel = document.createElement("li");
		copyel.style.fontFamily = "Courier";

		const copyel_a = document.createElement("a");
		copyel_a.href = "#clicktocopy";
		copyel_a.textContent = "Copy ID of this page";
		copyel_a.addEventListener("click", (ev) => {
			ev.preventDefault();
			let dataform_els = document.getElementById("post").elements;

			let id = dataform_els.hex.value + "-w" + dataform_els.wall.value + "-s" + dataform_els.shelf.value + "-v" + dataform_els.volume.value + ":" + dataform_els.page.value + "#" + dataform_els.title.value;

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
				let surl = "https://libraryofbabel.info/book.cgi?" + id.split("#")[0];

				if (surl.length > 2048) {
					notyf.error("Unfortunately, the ID is too long. (max. 2048 chars) Please choose another option for delivery");
				} else {
					window.open("https://ggff.io/" + encodeURI(surl), "_blank");
				}
			}
		};

		const openel = document.createElement("li");
		openel.style.fontFamily = "Courier";

		const openel_a = document.createElement("a");
		openel_a.href = "#clicktoopen";
		openel_a.textContent = "Open specific (copied) ID";
		openel_a.addEventListener("click", (ev) => {
			ev.preventDefault();
			let id = prompt("Copied ID:");
			if (id) {
				id = id.trim();
				// hexval438-w1-s2-v24:1
				let id_arr = id.split("-");

				const openform = document.createElement("form");
				openform.action = "/book.cgi";
				openform.method = "POST";
				openform.style.display = "none";

				openform.appendChild(create_element.hiddeninput("hex", id_arr[0]));
				openform.appendChild(create_element.hiddeninput("wall", id_arr[1].replace("w", "")));
				openform.appendChild(create_element.hiddeninput("shelf", id_arr[2].replace("s", "")));
				openform.appendChild(create_element.hiddeninput("volinp", id_arr[3].split(":")[0].replace("v", "")));
				openform.appendChild(create_element.hiddeninput("page", id_arr[3].split(":")[1].split("#")[0]));
				openform.appendChild(create_element.hiddeninput("title", id_arr[3].split("#")[1]));

				document.body.appendChild(openform);
				openform.submit();
			}
		});

		openel.appendChild(openel_a);
		sidecontainer.appendChild(openel);
	}
})();
