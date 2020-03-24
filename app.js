var app = new Vue({
	el: "#app",
	data: function () {
		return {
			currentVersion: "",
			currentFile: "",
			isLoading: false,
			isProjectLoaded: false,
			projectId: "thaumcraft",
			projectInfo: {}
		};
	},
	methods: {
		loadProject: function () {
			app.currentVersion = "";
			app.currentFile = "";
			app.isLoading = true;
			app.isProjectLoaded = false;
			app.projectInfo = {};
			axios.get("https://api.cfwidget.com/mc-mods/minecraft/" + this.projectId)
				.then(function (response) {
					var data = response.data;

					if (data.error === "in_queue") {
						alert("数据更新中，请稍后再试");
					} else {
						app.projectInfo.title = data.title;
						app.projectInfo.desc = data.summary;
						app.projectInfo.post = data.urls.project;
						app.projectInfo.thumbnail = data.thumbnail;
						app.projectInfo.categories = data.categories;

						app.projectInfo.versions = new Array();
						app.projectInfo.files = {};
						for (ver in data.versions) {
							app.projectInfo.versions.push(ver);
							app.projectInfo.files[ver] = new Array();

							data.versions[ver].forEach((i) => {
								app.projectInfo.files[ver].push({
									name: i.name,
									url: "https://www.curseforge.com/minecraft/mc-mods/" + app.projectId + "/download/" + i.url.split("/").slice(-1).shift() + "/file"
								});
							});
							app.projectInfo.files[ver].sort((a, b) => {
								return a.name === b.name ? 0 :
									a.name < b.name ? -1 : 1;
							});
						}
						app.projectInfo.versions.sort();

						app.isProjectLoaded = true;
					}
				}).catch(function (error) {
					console.log(error);
					alert("请求失败\n" + error.toString());
				}).then(function () {
					app.isLoading = false;
				});
		},
		downloadUrl: function () {
			if (app.currentVersion === "" || app.currentFile === "") {
				return "";
			} else {
				var i = 0;
				for (; i < app.projectInfo.versions.length; i++) {
					if (app.currentVersion === app.projectInfo.versions[i]) {
						break;
					}
				}
				if (i === app.projectInfo.versions.length) {
					return "";
				}

				for (i in app.projectInfo.files[app.currentVersion]) {
					if (app.projectInfo.files[app.currentVersion][i].name === app.currentFile) {
						return app.projectInfo.files[app.currentVersion][i].url;
					}
				}

				return "";
			}
		},
		jumpToDownload: function () {
			window.open(app.downloadUrl());
		}
	}
});
