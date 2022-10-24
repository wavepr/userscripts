// ==UserScript==
// @name         Steam Add More Links
// @namespace    https://github.com/wavepr/userscripts
// @version      0.2.0
// @author       wavepr
// @match        https://store.steampowered.com/app/*
// @grant        none
// @icon         https://icons.duckduckgo.com/ip2/store.steampowered.com.ico
// @downloadURL  https://github.com/wavepr/userscripts/raw/main/steam-add-more-links.user.js
// @updateURL    https://github.com/wavepr/userscripts/raw/main/steam-add-more-links.user.js
// ==/UserScript==

let imagesArray = document.querySelectorAll("body");
let imageLinkArray = [];
let linkHolder = document.querySelector("body");

window.displayImageLinks = () => {
	document.getElementById("link-remove-las").remove();

	[...imageLinkArray].forEach((el, i) => {
		let ca = document.createElement("a");
		ca.classList.add("linkbar");
		ca.href = el;
		ca.target = "_blank";
		ca.rel = "noreferrer noopener";

		ca.innerHTML = `Image ${i}&nbsp;<img src="https://steamstore-a.akamaihd.net/public/images/v5/ico_external_link.gif" border="0" align="bottom">`;

		linkHolder.appendChild(ca);
	});
};

// window.downloadFile = (path, filename) => {
// 	// Create a new link
// 	const anchor = document.createElement("a");
// 	anchor.href = path;
// 	anchor.download = filename;

// 	// Append to the DOM
// 	document.body.appendChild(anchor);

// 	// Trigger `click` event
// 	anchor.click();

// 	// Remove element from DOM
// 	document.body.removeChild(anchor);
// };

// window.downloadMovie = async (url, filename) => {
// 	let req = await fetch(url, {
// 		mode: "no-cors",
// 	});
// 	// let fblob = await req.blob();

// 	// let dl = URL.createObjectURL(fblob);

// 	// window.downloadFile(dl, filename);

// 	console.log(req, await req.text());
// };

(function () {
	"use strict";
	const appID = window.location.href.match(/(\/app\/)([0-9]+)/g)[0].replace("/app/", "");

	// ADD STEAMDB LINKS
	linkHolder = document.querySelector("div.details_block:nth-child(2)");

	linkHolder.innerHTML += `
		<a class="linkbar" href="https://store.steampowered.com/dlc/${appID}" target="_blank" rel="noreferrer noopener">
			View DLCs
		</a>
		<a class="linkbar" href="https://steamdb.info/app/${appID}" target="_blank" rel="noreferrer noopener">
			View Game on SteamDB&nbsp;
			<img src="https://steamstore-a.akamaihd.net/public/images/v5/ico_external_link.gif" border="0" align="bottom">
		</a>
		<a class="linkbar" href="https://steamdb.info/app/${appID}/info/" target="_blank" rel="noreferrer noopener">
			View Images on SteamDB&nbsp;
			<img src="https://steamstore-a.akamaihd.net/public/images/v5/ico_external_link.gif" border="0" align="bottom">
		</a>
		<a class="linkbar" href="javascript:displayImageLinks(this);" id="link-remove-las">
			List all Screenshots
		</a>
		`;
	// VIDEO DOWNLOAD

	try {
		document.querySelector(".highlight_player_item.highlight_movie").style.display = "block";
	} catch (e) {}

	function setAttributesOnVideo() {
		if (document.getElementById("video-downloadlinks")) {
			document.getElementById("video-downloadlinks").parentNode.removeChild(document.getElementById("video-downloadlinks"));
		}

		let eID = document.querySelector(".highlight_strip_item.highlight_strip_movie.focus").id.replace("thumb_movie_", "");
		let evhID = "highlight_movie_" + eID;

		const videoHolder = document.getElementById(evhID);
		//console.log(videoHolder);

		const videoControlsHolder = videoHolder.querySelector(".html5_video_overlay .control_container");
		try {
			document.getElementById("video-downloadlinks-" + evhID).parentNode.removeChild(document.getElementById("video-downloadlinks-" + evhID));
		} catch (e) {}

		const videoTags = {
			webm: videoHolder.getAttribute("data-webm-source"),
			webm_hd: videoHolder.getAttribute("data-webm-hd-source"),
			mp4: videoHolder.getAttribute("data-mp4-source"),
			mp4_hd: videoHolder.getAttribute("data-mp4-hd-source"),
			poster: videoHolder.getAttribute("data-poster"),
		};

		Object.entries(videoTags).forEach(([k, v]) => {
			let urlp = new URL(v);
			videoTags[k] = urlp.origin + urlp.pathname;
		});

		videoControlsHolder.innerHTML += `
				<div class="autoplay_label video-downloadlinks" id="video-downloadlinks-${evhID}">
					| Download
					<a href="${videoTags.webm}" target="_blank" rel="noreferrer noopener" download="movie480_vp9_${eID}.webm">WebM</a>&nbsp;
					<a href="${videoTags.webm_hd}" target="_blank" rel="noreferrer noopener" download="movie_max_vp9_${eID}.webm">WebM-HD</a>&nbsp;
					<a href="${videoTags.mp4}" target="_blank" rel="noreferrer noopener" download="movie480_${eID}.mp4">MP4</a>&nbsp;
					<a href="${videoTags.mp4_hd}" target="_blank" rel="noreferrer noopener" download="movie_max_${eID}.mp4">MP4-HD</a>&nbsp;
					<a href="${videoTags.poster}" target="_blank" rel="noreferrer noopener" download="movie_poster_${eID}.jpg">IMG</a>&nbsp;
					<a href="#all" data-dl-all style="display:none">DL-ALL</a>&nbsp;
				</div>
			`;

		// videoControlsHolder.querySelectorAll("a[download]").forEach((el) => {
		// 	el.addEventListener("click", (ev) => {
		// 		ev.preventDefault();
		// 		ev.stopPropagation();
		// 		window.downloadMovie(el.href, el.getAttribute("download"));
		// 	});
		// });

		// let dlall = videoControlsHolder.querySelector("a[data-dl-all]");
		// dlall.addEventListener("click", (ev) => {
		// 	ev.preventDefault();
		// 	ev.stopPropagation();

		// 	videoControlsHolder.querySelectorAll("a[download]").forEach((el) => window.downloadMovie(ev.href, el.getAttribute("download")));
		// });
	}
	setInterval(() => {
		setAttributesOnVideo();
	}, 1000);

	// IMAGE CAROUSEL

	imagesArray = document.querySelectorAll(".highlight_player_item.highlight_screenshot");

	imageLinkArray = [];

	[...imagesArray].forEach((el) => {
		imageLinkArray.push(el.querySelector(".screenshot_holder a.highlight_screenshot_link").href);
	});
})();
