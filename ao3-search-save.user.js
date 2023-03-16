// ==UserScript==
// @name         AO3 Search Save
// @namespace    https://github.com/wavepr/userscripts
// @version      1.0.0
// @description  Utility to save searches for AO3
// @author       wavepr
// @match        https://archiveofourown.org/works*
// @icon         https://external-content.duckduckgo.com/ip3/archiveofourown.org.ico
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @downloadURL  https://github.com/wavepr/userscripts/raw/main/ao3-search-saver.user.js
// @updateURL    https://github.com/wavepr/userscripts/raw/main/ao3-search-saver.user.js
// @grant        none
// ==/UserScript==

(function() {
	'use strict';
	const LS_KEY = "tm_saved_searches";
	let saved_searches = [];

	if (localStorage && localStorage.getItem(LS_KEY)) {
		saved_searches = JSON.parse(localStorage.getItem(LS_KEY));
	}

	function save_searches(searches) {
		saved_searches = searches;
		localStorage.setItem(LS_KEY, JSON.stringify(searches));
	}


	window.tm_saved_searches_rename = (id) => {
		const original = saved_searches.find(v => v.id == id);

		const answer = prompt(`Rename saved search "${original.name}"`, original.name);

		if (answer) {
			const new_searches = saved_searches.map(v => {
				if (v.id == id) {
					v.name = answer;
				}
				return v;
			});


			save_searches(new_searches);
			document.querySelector(`#saved_searches_container dt[data-sid="${id}"]`).textContent = answer;
		}

	};

	window.tm_saved_searches_export = () => {
		const blob = new Blob([JSON.stringify(saved_searches)], {type: "application/json;charset=utf-8"});
		window.saveAs(blob, `ao3-search-export-${Date.now()}.json`);
	};

	window.tm_saved_searches_import = () => {
		const answer = prompt(`Paste the string you got from a previous export\nWARNING: Make sure you have a backup before importing!\n IMPROPER USE MAY LEAD TO DATA LOSS!`);
		if (answer) {
			try {
				const new_data = JSON.parse(answer);
				save_searches(new_data);
				window.location.reload();
			} catch(err) { alert("Invalid Import String") }
		}
	};

	window.tm_saved_searches_remove = (id) => {
		const original = saved_searches.find(v => v.id == id);
		if (confirm(`Are you sure you want to delete the search "${original.name}"?`)) {
			const new_searches = saved_searches.filter(v => v.id != id);
			save_searches(new_searches);
			document.querySelectorAll(`#saved_searches_container [data-sid="${id}"]`).forEach(el => el.remove());
		}
	};


	window.tm_saved_searches_save = () => {
		const answer = prompt(`Give your search a name`);

		if (answer) {

			const entry = {
				id: crypto.randomUUID(),
				name: answer,
				link: (new URLSearchParams(window.location.search)).toString() || null,
			};

			const new_searches = [entry, ...saved_searches];

			save_searches(new_searches);

			const l_el = document.getElementById('saved_searches_container');
			l_el.innerHTML = `<dt data-sid="${entry.id}">${entry.name}</dt>
<dd class="actions" data-sid="${entry.id}">
<a href="/works?${entry.link}">Open</a>
<a href="javascript:window.tm_saved_searches_rename('${entry.id}')">Rename</a>
<a href="javascript:window.tm_saved_searches_remove('${entry.id}')">Remove</a>
</dd>` + l_el.innerHTML;
		}

	};

	const ss_el = document.createElement("dt");

	ss_el.classList.add("filter-toggle", "collapsed");
	ss_el.id = "toggle_saved_searches";
	ss_el.innerHTML = '<button type="button" class="expander" aria-expanded="false" aria-controls="saved_searches">Saved Searches</button>';

	const ss_del = document.createElement("dd");
	ss_del.classList.add("expandable", "hidden");
	ss_del.id = "saved_searches";

	let saved_html = "";
	saved_searches.forEach(el => {
		saved_html += `
		<dt data-sid="${el.id}">${el.name}</dt>
		<dd class="actions" data-sid="${el.id}">
		<a href="/works?${el.link}">Open</a>
		<a href="javascript:window.tm_saved_searches_rename('${el.id}')">Rename</a>
		<a href="javascript:window.tm_saved_searches_remove('${el.id}')">Remove</a>
		</dd>`

	})

	ss_del.innerHTML = `<dl class="range" id="saved_searches_container" style="margin-bottom: 1rem">${saved_html}</dl>
	<div class="actions">
	<a href="javascript:window.tm_saved_searches_save()">Save this Search</a>
	<a href="javascript:window.tm_saved_searches_export()">Export</a>
	<a href="javascript:window.tm_saved_searches_import()">Import</a>
	</div>`;

	document.querySelector("#work-filters > fieldset > dl").appendChild(ss_el);
	document.querySelector("#work-filters > fieldset > dl").appendChild(ss_del);

	ss_el.addEventListener("click", () => {
		ss_el.classList.toggle("collapsed");
		ss_el.classList.toggle("expanded");
		ss_del.classList.toggle("hidden");
	});
})();
