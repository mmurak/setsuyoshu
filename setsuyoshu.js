class GlobalManager {
	constructor() {
		this.selPlate = document.getElementById("SelPlate");
		this.kan = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', ]
		this.imageArea = document.getElementById("ImageArea");
		this.defaultSize = document.getElementById("DefaultSize");
		this.magnifier = document.getElementById("Magnifier");
		this.toggler = document.getElementById("Toggler");
		this.currentPage = 0;
		this.pno = document.getElementById("Pno");		// for display purpose
		this.toggler = document.getElementById("Toggler");
		this.prevPage = document.getElementById("PrevPage");
		this.nextPage = document.getElementById("NextPage");
		this.magnifierSection = document.getElementById("MagnifierSection");
	}
}
const G = new GlobalManager();

if (window.innerWidth < 800) {
	G.magnifierSection.style = "float: right; display: none;";
} else {
	G.magnifierSection.style = "float: right; display: visible;";
}

G.defaultSize.addEventListener("click", (e) => {
	G.magnifier.value = 100;
	G.magnifier.dispatchEvent(new Event("input"));
});

G.magnifier.addEventListener("input", (e) => {
	G.imageArea.style.width = G.magnifier.value + "%";
});

G.toggler.addEventListener("click", (e) => {
	toggleIROHA(e.target);
});

G.prevPage.addEventListener("click", () => {
	prevPage();
});

G.nextPage.addEventListener("click", () => {
	nextPage();
});

G.imageArea.addEventListener("click", (e) => {
	if (e.offsetX < G.imageArea.width / 2) {
		nextPage();
	} else {
		prevPage();
	}
	e.preventDefault();
});

function charClicked(obj) {
	const bu = obj.innerHTML;
	G.selPlate.innerHTML = "";
	G.imageArea.src = "";
	if (prePostAmble(bu)) {
		return;
	}
	const bipassChecker = "ゐおえ".indexOf(bu);
	if (bipassChecker >= 0) {
		G.selPlate.innerHTML = "「" + ['い', 'を', 'ゑ'][bipassChecker] + "」ニ入ル";
		return;
	}
	G.selPlate.innerHTML = bu + "： 訓読（よミこゑ）の数";
	G.selPlate.appendChild(document.createElement("br"));
	for (let page of setsuyoshuData) {
		const num = page[0];
		const dataArray = page[1];
		for (let cluster of dataArray) {
			if (cluster[0] == bu) {
				for (let i = 1; i < cluster.length; i++) {
					const btn = document.createElement("button");
					btn.innerHTML = G.kan[cluster[i]];
					btn.value = num;
					btn.addEventListener("click", (e) => {
						collapseIROHA();
						G.currentPage = e.target.value;
						openPage(G.currentPage);
					});
					G.selPlate.appendChild(btn);
				}
			}
		}
	}
}

function openPage(page) {
	G.pno.innerHTML = page;
	document.getElementById("PageNavigator").style = "float: right; margin: 0 20px; display: visible;";
	G.imageArea.src = "./imageData/p" + String(page).padStart(3, '0') + ".jpg";
}

function ppInner(pno) {
	G.currentPage = pno;
	openPage(pno);
	return true;
}

function prePostAmble(bu) {
	let done = false;
	switch(bu) {
		case "丁附合文" : done = ppInner(3); break;
		case "序" : done = ppInner(3); break;
		case "凢例" : done = ppInner(4); break;
		case "文字引様" : done = ppInner(5); break;
		case "篇冠構字盡" : done = ppInner(132); break;
		case "男女名頭字盡" : done = ppInner(133); break;
		case "十干十二支" : done = ppInner(134); break;
		case "月の異名盡" : done = ppInner(135); break;
		default:
	}
	if (done) {
		collapseIROHA();
		return true;
	} else {
		return false;
	}
}

function displayPanel(flag) {
	if (flag) {
		document.getElementById("IROHAplate").style = "display: visible;"
		document.getElementById("PageNavigator").style = "float: right; margin: 0 20px; display: none;";
	} else {
		document.getElementById("IROHAplate").style = "display: none;"
		document.getElementById("PageNavigator").style = "float: right; margin: 0 20px; display: visible;";
	}
}

function toggleIROHA(param) {
	displayPanel(param.checked);
}

function collapseIROHA() {
	G.toggler.checked = false;
	toggleIROHA(G.toggler);
}

function prevPage() {
	if (G.currentPage > 1) {
		G.currentPage--;
		openPage(G.currentPage);
	}
}
function nextPage() {
	if (G.currentPage < 137) {
		G.currentPage++;
		openPage(G.currentPage);
	}
}

function tips() {
	alert("「いろは」部の下は「読み声の数」順に言葉が記されています。\n早稲田大学の高梨信博先生の研究によると、それ以降の配列は『蠡海節用集』や『字典節用集』における10門の意味分類（言語,時候,乾坤,器財,官位,人倫,支躰,衣食,草木,氣形）が概ね維持されているとのことです。\n\n参考文献： 『早引節用集の成立』https://waseda.repo.nii.ac.jp/record/4822/files/KokubungakuKenkyu_113_Takanashi.pdf");
}
