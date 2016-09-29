define("app/src/share_explorer/main", ["lib/jquery-lib", "lib/util", "lib/ztree/js/ztree", "lib/contextMenu/jquery-contextMenu", "lib/artDialog/jquery-artDialog", "lib/picasa/picasa", "./ui", "./fileSelect", "../../share_common/rightMenu", "../../common/taskTap", "../../common/core", "../../tpl/copyright.html", "../../tpl/search.html", "../../tpl/search_list.html", "../../tpl/upload.html", "../../common/tree", "../../common/pathOperate", "../../tpl/fileinfo/file_info.html", "../../tpl/fileinfo/path_info.html", "../../tpl/fileinfo/path_info_more.html", "../../tpl/share.html", "../../tpl/app.html", "../../common/pathOpen", "../../common/CMPlayer", "./path", "../../share_common/topbar"], function (e) {
    Config = {
        BodyContent: ".bodymain",
        FileBoxSelector: ".fileContiner",
        FileBoxClass: ".fileContiner .file",
        FileBoxClassName: "file",
        FileBoxTittleClass: ".fileContiner .title",
        SelectClass: ".fileContiner .select",
        SelectClassName: "select",
        TypeFolderClass: "folderBox",
        TypeFileClass: "fileBox",
        HoverClassName: "hover",
        FileOrderAttr: "number",
        TreeId: "folderList",
        pageApp: "explorer",
        treeAjaxURL: "vis.go?share/treeList&app=folder&user=" + G.user + "&sid=" + G.sid,
        AnimateTime: 200
    }, Global = {
        fileListAll: "",
        fileListNum: 0,
        fileRowNum: 0,
        frameLeftWidth: 200,
        treeSpaceWide: 10,
        topbar_height: 40,
        ctrlKey: !1,
        shiftKey: !1,
        fileListSelect: "",
        fileListSelectNum: "",
        isIE: !-[1],
        isDragSelect: !1,
        historyStatus: {back: 1, next: 0}
    }, e("lib/jquery-lib"), e("lib/util"), e("lib/ztree/js/ztree"), e("lib/contextMenu/jquery-contextMenu"), e("lib/artDialog/jquery-artDialog"), e("lib/picasa/picasa"), ui = e("./ui"), rightMenu = e("../../share_common/rightMenu"), TaskTap = e("../../common/taskTap"), core = e("../../common/core"), ui.tree = e("../../common/tree"), ui.path = e("./path"), fileSelect = e("./fileSelect"), fileLight = fileSelect.fileLight;
    var t = e("../../share_common/topbar");
    $(document).ready(function () {
        t.init(), Global.topbar_height = "none" == $(".topbar").css("display") ? 0 : $(".topbar").height(), ui.init(), ui.tree.init(), TaskTap.init(), core.update("check_status"), fileSelect.init(), rightMenu.initExplorer(), $(".init_loading").fadeOut(450).addClass("pop_fadeout"), $(".path_tips").tooltip({
            placement: "bottom",
            html: !0
        })
    })
}), define("app/src/share_explorer/ui", ["./fileSelect"], function (require, exports) {
    var fileSelect = require("./fileSelect"), fileLight = fileSelect.fileLight, MyPicasa = new Picasa;
    PicasaOpen = !1;
    var _ajaxLive = function () {
        fileLight.init(), ui.setStyle(), PicasaOpen = !1, MyPicasa.initData(), $(".fileContiner .picture img").lazyload({container: $(".bodymain")})
    }, _initListType = function (e) {
        $(".tools-right button").removeClass("active"), $("#set_" + e).addClass("active"), "list" == e ? ($(Config.FileBoxSelector).removeClass("fileList_icon").addClass("fileList_list"), $("#list_type_list").html('<div id="main_title"><div class="filename" field="name">' + LNG.name + "<span></span></div>" + '<div class="filetype" field="ext">' + LNG.type + "<span></span></div>" + '<div class="filesize" field="size">' + LNG.size + "<span></span></div>" + '<div class="filetime" field="mtime">' + LNG.modify_time + "<span></span></div>" + '<div style="clear:both"></div>' + "</div>"), $(Config.FileBoxSelector + " textarea").autoTextarea({
            minHeight: 19,
            padding: 4
        })) : ($(Config.FileBoxSelector).removeClass("fileList_list").addClass("fileList_icon"), $("#list_type_list").html(""), $(Config.FileBoxSelector + " textarea").autoTextarea({
            minHeight: 32,
            padding: 4
        })), $(".menu_seticon").removeClass("selected"), $(".set_set" + G.list_type).addClass("selected")
    }, _setListType = function (e, t) {
        G.list_type = e, _initListType(e), Cookie.set("list_type", e), void 0 == t ? _f5(!1, !1) : _f5(!1, !0)
    }, _sortBy = function (e, t) {
        var t = "down" == t ? -1 : 1;
        return function (a, i) {
            return a = a[e], i = i[e], i > a ? -1 * t : a > i ? 1 * t : void 0
        }
    }, _setListSort = function (e, t) {
        0 != e && (G.sort_field = e, $(".menu_set_sort").removeClass("selected"), $(".set_sort_" + e).addClass("selected")), 0 != t && (G.sort_order = t, $(".menu_set_desc").removeClass("selected"), $(".set_sort_" + t).addClass("selected")), _f5(!1, !0), Cookie.set("sort_field", G.sort_field), Cookie.set("sort_order", G.sort_order)
    }, _jsonSortTitle = function () {
        var up = '<i class="font-icon icon-chevron-up"></i>', down = '<i class="font-icon icon-chevron-down"></i>';
        $("#main_title .this").toggleClass("this").attr("id", "").find("span").html(""), $("#main_title div[field=" + G.sort_field + "]").addClass("this").attr("id", G.sort_order).find("span").html(eval(G.sort_order))
    }, _bindEventSort = function () {
        $("#main_title div").die("click").live("click", function () {
            "up" == $(this).attr("id") ? $(this).attr("id", "down") : $(this).attr("id", "up"), _setListSort($(this).attr("field"), $(this).attr("id"))
        })
    }, _bindEventTools = function () {
        $(".tools a,.tools button,.tools_list button").bind("click", function () {
            var e = $(this).attr("id");
            _toolsAction(e)
        })
    }, _bindEventTheme = function () {
        $('.dropdown-menu-theme li[theme="' + G.theme + '"]').addClass("this"), $(".dropdown-menu-theme li").click(function () {
            var e = $(this).attr("theme");
            Cookie.set("theme", e), $(".dropdown-menu li").removeClass("this"), $(this).addClass("this"), core.setSkin(e, "app_explorer.css")
        })
    }, _bindFrameSizeEvent = function () {
        var e = !1, t = 0, a = 0, i = 0, n = $(".frame-left"), o = $(".frame-left .bottom_box"), s = $(".frame-resize"), r = $(".frame-right");
        s.die("mousedown").live("mousedown", function (e) {
            return 1 != e.which ? !0 : (l(e), this.setCapture && this.setCapture(), $(document).mousemove(function (e) {
                c(e)
            }), $(document).one("mouseup", function (e) {
                return d(e), this.releaseCapture && this.releaseCapture(), stopPP(e), !1
            }), void 0)
        });
        var l = function (i) {
            e = !0, t = i.pageX, a = $(".frame-left").width(), s.addClass("active")
        }, c = function (l) {
            if (!e)return !0;
            var c = l.pageX - t, d = a + c;
            i > d && (d = i), d > $(document).width() - 200 && (d = $(document).width() - 200), n.css("width", d), o.css("width", d), s.css("left", d - 5), r.css("left", d + 1), ui.setStyle()
        }, d = function () {
            return e ? (e = !1, s.removeClass("active"), Global.frameLeftWidth = $(".frame-left").width(), void 0) : !1
        }
    }, _bindHotKey = function () {
        var e = 91;
        Global.ctrlKey = !1, $(document).keydown(function (t) {
            if ("none" != $("#PicasaView").css("display"))return !0;
            if (ui.isEdit())return !0;
            if (rightMenu.isDisplay())return !0;
            var a = !1;
            if (Global.ctrlKey || t.keyCode == e || t.ctrlKey)switch (a = !0, Global.ctrlKey = !0, t.keyCode) {
                case 65:
                    fileSelect.selectPos("all");
                    break;
                case 83:
                    break;
                case 70:
                    core.search($(".header-right input").val(), G.this_path);
                    break;
                default:
                    a = !1
            } else if (t.shiftKey)Global.shiftKey = !0; else switch (t.keyCode) {
                case 8:
                    ui.path.back(), a = !0;
                    break;
                case 35:
                    fileSelect.selectPos("end");
                    break;
                case 36:
                    fileSelect.selectPos("home");
                    break;
                case 37:
                    fileSelect.selectPos("left"), a = !0;
                    break;
                case 38:
                    fileSelect.selectPos("up"), a = !0;
                    break;
                case 39:
                    fileSelect.selectPos("right"), a = !0;
                    break;
                case 40:
                    fileSelect.selectPos("down"), a = !0;
                    break;
                case 13:
                    ui.path.open(), a = !1;
                    break;
                default:
                    a = !1
            }
            return a && (stopPP(t), t.keyCode = 0, t.returnValue = !1), !0
        }).keyup(function (t) {
            t.shiftKey || (Global.shiftKey = !1), t.keyCode != e && t.ctrlKey || (Global.ctrlKey = !1)
        })
    };
    this._hover_title = function (e) {
        return void 0 == e.size_friendly && (e.size_friendly = "0B"), ' data-path="' + e.path + '" data-name="' + e.name + '" title="' + LNG.name + ":" + e.name + "&#10;" + LNG.size + ":" + e.size_friendly + "&#10;" + LNG.permission + ":" + e.mode + "&#10;" + LNG.create_time + ":" + e.ctime + "&#10;" + LNG.modify_time + ":" + e.mtime + '" '
    }, this._getFolderBox = function (e) {
        var t = "";
        return t += "<div class='file folderBox menufolder' data-name='" + e.name + "'" + _hover_title(e) + ">", t += "<div class='folder ico' filetype='folder'></div>", t += "<div id='" + e.name + "' class='titleBox'><span class='title' title='" + LNG.double_click_rename + "'>" + e.name + "</span></div></div>"
    }, this._getFileBox = function (e) {
        var t = "";
        if ("oexe" == e.ext && void 0 != e.icon) {
            var a = e.icon;
            -1 == e.icon.search(G.static_path) && "http" != e.icon.substring(0, 4) && (a = G.static_path + "images/app/" + e.icon);
            var i = urlEncode(json_encode(e)), n = e.name.replace(".oexe", "");
            t = "<div class='file fileBox menufile' data-app=" + i + " data-name='" + e.name + "'" + _hover_title(e) + ">", "app_link" == e.type ? (t += 0 == e.content.search("ui.path.open") ? "<div class='" + core.pathExt(n) + " ico'" : "<div class='folder ico'", t += ' filetype="oexe"></div><div class="app_link"></div>') : t += "<div class='ico' filetype='oexe' style='background-image:url(" + a + ")'></div>", t += "<div id='' class='titleBox'><span class='title' title='" + LNG.double_click_rename + "'>" + n + "</span></div></div>"
        } else if (inArray(core.filetype.image, e.ext)) {
            var o = core.path2url(G.this_path + e.name), s = "vis.go?share/image&user=" + G.user + "&sid=" + G.sid + "&path=" + urlEncode(G.this_path + e.name);
            t += "<div class='file fileBox menufile' " + _hover_title(e) + ">", t += "<div picasa='" + o + "' thumb='" + s + "' title='" + e.name + "' class='picasaImage picture ico' filetype='" + e.ext + "' style='margin:3px 0 0 8px;background:#fff url(\"" + s + "\") no-repeat center center;'></div>", t += "<div id='" + e.name + "' class='titleBox'><span class='title' title='" + LNG.double_click_rename + "'>" + e.name + "</span></div></div>"
        } else t += "<div class='file fileBox menufile' " + _hover_title(e) + ">", t += "<div class='" + e.ext + " ico' filetype='" + e.ext + "'></div>", t += "<div id='" + e.name + "' class='titleBox'><span class='title' title='" + LNG.double_click_rename + "'>" + e.name + "</span></div></div>";
        return t
    }, this._getFolderBoxList = function (e) {
        var t = "<div class='file folderBox menufolder' " + _hover_title(e) + ">";
        return t += "	<div class='folder ico' filetype='folder'></div>", t += "	<div id='" + e.name + "' class='titleBox'><span class='title' title='" + LNG.double_click_rename + "'>" + e.name + "</span></div>", t += "	<div class='filetype'>" + LNG.folder + "</div>", t += "	<div class='filesize'></div>", t += "	<div class='filetime'>" + e.mtime + "</div>", t += "	<div style='clear:both'></div>", t += "</div>"
    }, this._getFileBoxList = function (e) {
        var t = "", a = e.name;
        if ("oexe" == e.ext) {
            var i = urlEncode(json_encode(e));
            a = e.name.replace(".oexe", ""), t = "<div class='file fileBox menufile' data-app=" + i + _hover_title(e) + ">", "app_link" == e.type ? (t += 0 == e.content.search("ui.path.open") ? "<div class='" + core.pathExt(a) + " ico'" : "<div class='folder ico'", t += ' filetype="oexe"></div><div class="app_link"></div>') : t += "<div class='oexe ico' filetype='oexe'></div>"
        } else if (inArray(core.filetype.image, e.ext)) {
            var n = core.path2url(G.this_path + e.name), o = "vis.go?share/image&user=" + G.user + "&sid=" + G.sid + "&path=" + urlEncode(G.this_path + e.name);
            t += "<div picasa='" + n + "' thumb='" + o + "' class='picasaImage file fileBox menufile'" + _hover_title(e) + ">", t += "	<div class='" + e.ext + " ico' filetype='" + e.ext + "'></div>"
        } else t += "<div class='file fileBox menufile'" + _hover_title(e) + ">", t += "	<div class='" + e.ext + " ico' filetype='" + e.ext + "'></div>";
        return t += "	<div id='" + e.name + "' class='titleBox'><span class='title' title='" + LNG.double_click_rename + "'>" + a + "</span></div>", t += "	<div class='filetype'>" + e.ext + "  " + LNG.file + "</div>", t += "	<div class='filesize'>" + e.size_friendly + "</div>", t += "	<div class='filetime'>" + e.mtime + "</div>", t += "	<div style='clear:both'></div>", t += "</div>"
    };
    var pathTypeChange = function () {
        var e = $(".html5_drag_upload_box");
        e.removeClass("menuBodyMain").addClass("menuBodyMain"), $(".tools-left>.btn-group").addClass("hidden").parent().find(".kod_path_tool").removeClass("hidden")
    }, _mainSetData = function (e) {
        G.json_data && G.json_data.filelist && G.json_data.folderlist || _mainSetDataShare();
        var t = "", a = G.json_data.folderlist, i = G.json_data.filelist;
        a = "size" == G.sort_field || "ext" == G.sort_field ? a.sort(_sortBy("name", G.sort_order)) : a.sort(_sortBy(G.sort_field, G.sort_order)), i = i.sort(_sortBy(G.sort_field, G.sort_order)), G.json_data.folderlist = a, G.json_data.filelist = i;
        var n = "_getFileBox", o = "_getFolderBox", s = "", r = "";
        "list" == G.list_type && (n = "_getFileBoxList", o = "_getFolderBoxList");
        for (var l = 0; i.length > l; l++)s += this[n](i[l]);
        for (var l = 0; a.length > l; l++)r += this[o](a[l]);
        t = "up" == G.sort_order ? r + s : s + r, "" == t && (t = '<div style="text-align:center;color:#aaa;">' + LNG.path_null + "</div>"), t += "<div style='clear:both'></div>", e ? $(Config.FileBoxSelector).hide().html(t).fadeIn(Config.AnimateTime) : $(Config.FileBoxSelector).html(t), "list" == G.list_type && $(Config.FileBoxSelector + " .file:nth-child(2n)").addClass("file2"), _ajaxLive()
    }, _f5 = function (e, t, a) {
        if (void 0 == e && (e = !0), void 0 == t && (t = !1), _jsonSortTitle(), e)$.ajax({
            url: "vis.go?share/pathList&user=" + G.user + "&sid=" + G.sid + "&path=" + urlEncode(G.this_path),
            dataType: "json",
            beforeSend: function () {
                $(".tools-left .msg").stop(!0, !0).fadeIn(100)
            },
            success: function (e) {
                return $(".tools-left .msg").fadeOut(100), e.code ? (G.json_data = e.data, _f5_time_user(), Global.historyStatus = G.json_data.history_status, _mainSetData(t), pathTypeChange(), ui.header.addressSet(), "function" == typeof a && a(e), void 0) : (core.tips.tips(e), $(Config.FileBoxSelector).html(""), !1)
            },
            error: function (e, t, a) {
                $(".tools-left .msg").fadeOut(100), $(Config.FileBoxSelector).html(""), core.ajaxError(e, t, a)
            }
        }); else {
            var i = fileLight.getAllName();
            _mainSetData(t), pathTypeChange(), ui.path.setSelectByFilename(i)
        }
    }, _f5_callback = function (e) {
        _f5(!0, !1, e)
    }, _f5_time_user = function () {
        if (G.json_data && G.json_data.filelist && G.json_data.folderlist) {
            for (var e = 0; G.json_data.filelist.length > e; e++)G.json_data.filelist[e].atime = date(LNG.time_type, G.json_data.filelist[e].atime), G.json_data.filelist[e].ctime = date(LNG.time_type, G.json_data.filelist[e].ctime), G.json_data.filelist[e].mtime = date(LNG.time_type, G.json_data.filelist[e].mtime);
            for (var e = 0; G.json_data.folderlist.length > e; e++)G.json_data.folderlist[e].atime = date(LNG.time_type, G.json_data.folderlist[e].atime), G.json_data.folderlist[e].ctime = date(LNG.time_type, G.json_data.folderlist[e].ctime), G.json_data.folderlist[e].mtime = date(LNG.time_type, G.json_data.folderlist[e].mtime)
        }
    }, _toolsAction = function (e) {
        switch (e) {
            case"refresh":
                ui.f5(!0, !0);
                break;
            case"selectAll":
                fileSelect.selectPos("all");
                break;
            case"down":
                ui.path.download();
                break;
            case"set_icon":
                $("#set_icon").hasClass("active") || _setListType("icon");
                break;
            case"set_list":
                $("#set_list").hasClass("active") || _setListType("list");
                break;
            default:
        }
    };
    return {
        f5: _f5,
        f5_callback: _f5_callback,
        picasa: MyPicasa,
        setListSort: _setListSort,
        setListType: _setListType,
        setTheme: function (e) {
            core.setSkin(e, "app_explorer.css"), FrameCall.top("OpenopenEditor", "Editor.setTheme", '"' + e + '"'), FrameCall.top("Opensetting_mode", "Setting.setThemeSelf", '"' + e + '"'), FrameCall.father("ui.setTheme", '"' + e + '"')
        },
        isEdit: function () {
            var e = $(document.activeElement).get(0);
            if (e)return e = e.tagName, "INPUT" == e || "TEXTAREA" == e ? !0 : !1
        },
        init: function () {
            Cookie.get("theme") && (G.theme = Cookie.get("theme")), Cookie.get("list_type") && (G.list_type = Cookie.get("list_type")), Cookie.get("sort_field") && (G.sort_field = Cookie.get("sort_field")), Cookie.get("sort_order") && (G.sort_order = Cookie.get("sort_order")), Cookie.set("theme", G.theme), Cookie.set("list_type", G.list_type), Cookie.set("sort_field", G.sort_field), Cookie.set("sort_order", G.sort_order), _f5_callback(function () {
                _setListType(G.list_type, !0), ui.path.history.add()
            }), _bindEventSort(), _bindEventTheme(), _bindEventTools(), _bindHotKey(), _bindFrameSizeEvent(), ui.header.bindEvent(), $(window).bind("resize", function () {
                ui.setStyle(), ui.header.set_width(), 0 != PicasaOpen && MyPicasa.setFrameResize()
            }), $("html").bind("click", function () {
                rightMenu.hidden(), Global.isIE && Global.isDragSelect
            }), Mousetrap.bind(["ctrl+s", "command+s"], function (e) {
                e.preventDefault()
            });
            var e, t = 0, a = "", i = 200;
            Mousetrap.bind(["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "`", "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "=", "+", "[", "{", "]", "}", "|", "/", "?", ".", ">", ",", "<", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"], function (n) {
                var o = String.fromCharCode(n.charCode);
                return 0 == t ? (t = time(), a = o, e = setTimeout(function () {
                    ui.path.setSelectByChar(a), t = 0
                }, i), void 0) : o == a.substr(-1) ? (ui.path.setSelectByChar(a), t = 0, void 0) : (i > time() - t && (t = time(), a += o, clearTimeout(e), e = setTimeout(function () {
                    ui.path.setSelectByChar(a), t = 0
                }, i)), void 0)
            }), Mousetrap.bind(["f5"], function (e) {
                stopPP(e), ui.f5(!0, !0)
            }), Mousetrap.bind(["alt+i", "alt+i"], function (e) {
                stopPP(e), ui.path.info()
            }), PicasaOpen = !1, MyPicasa.init(".picasaImage"), MyPicasa.initData()
        },
        setStyle: function () {
            Global.fileRowNum = "list" == G.list_type ? 1 : function () {
                var e = $(Config.FileBoxSelector).width(), t = $sizeInt($(Config.FileBoxClass).css("width")) + $sizeInt($(Config.FileBoxClass).css("border-left-width")) + $sizeInt($(Config.FileBoxClass).css("border-right-width")) + $sizeInt($(Config.FileBoxClass).css("margin-right"));
                return parseInt(e / t)
            }()
        },
        header: {
            bindEvent: function () {
                $("#yarnball li a").die("click").live("click", function (e) {
                    var t = $(this).attr("title");
                    $("input.path").val(t), ui.header.gotoPath(), stopPP(e)
                }), $("#yarnball").die("click").live("click", function () {
                    return $("#yarnball").css("display", "none"), $("#yarnball_input").css("display", "block"), $("#yarnball_input input").focus(), !0
                }), $("#yarnball_input input").die("blur").live("blur", function () {
                    ui.header.gotoPath()
                }), $("#yarnball_input input").keyEnter(function () {
                    ui.header.gotoPath()
                }), $(".header-right input").keyEnter(function () {
                    core.search($(".header-right input").val(), G.this_path)
                }), $(".header-right input").die("keyup").live("keyup", function () {
                    ui.path.setSearchByStr($(this).val())
                }), $(".header-content a,.header-content button").click(function () {
                    var e = $(this).attr("id");
                    switch (e) {
                        case"history_next":
                            ui.path.history.next();
                            break;
                        case"history_back":
                            ui.path.history.back();
                            break;
                        case"refresh":
                            ui.f5(!0, !0), ui.tree.init();
                            break;
                        case"home":
                            ui.path.list("/");
                            break;
                        case"up":
                            ui.header.gotoFather();
                            break;
                        case"search":
                            core.search($(".header-right input").val(), G.this_path);
                            break;
                        default:
                    }
                    return !0
                })
            }, addressSet: function () {
                var e = G.this_path;
                $("input.path").val(e), $("#yarnball_input").css("display", "none"), $("#yarnball").css("display", "block");
                var t = function (e) {
                    var t = '<li class="yarnlet first"><a title="@1@" style="z-index:{$2};"><span class="left-yarn"></span>{$3}</a></li>\n', a = '<li class="yarnlet "><a title="@1@" style="z-index:{$2};">{$3}</a></li>\n';
                    e = e.replace(/\/+/g, "/");
                    var i = e.split("/");
                    "" == i[i.length - 1] && i.pop(), void 0 == i[0] && (i[0] = "");
                    var n = i[0] + "/", o = t.replace(/@1@/g, n), s = i[0];
                    o = o.replace("{$2}", i.length), o = o.replace("{$3}", s);
                    for (var r = o, l = 1, c = i.length - 1; i.length > l; l++, c--)n += i[l] + "/", o = a.replace(/@1@/g, n), o = o.replace("{$2}", c), o = o.replace("{$3}", i[l]), r += o;
                    return '<ul class="yarnball">' + r + "</ul>"
                };
                $("#yarnball").html(t(e)), ui.header.set_width()
            }, set_width: function () {
                $(".yarnball").stop(!0, !0);
                var e = $("#yarnball").innerWidth(), t = 0;
                $("#yarnball li a").each(function () {
                    t += $(this).outerWidth() + $sizeInt($(this).css("margin-left")) + 5
                });
                var a = e - t;
                0 >= a ? $(".yarnball").css("width", t + "px").css("left", a + "px") : $(".yarnball").css({
                    left: "3px",
                    width: e + "px"
                })
            }, gotoPath: function () {
                var e = $("input.path").val();
                e = e.replace(/\\/g, "/"), $("input.path").val(e), "/" != e.substr(e.length - 1, 1) && (e += "/"), ui.path.list(e), ui.header.addressSet()
            }, gotoFather: function () {
                var e = $("input.path").val(), t = e.length - 1, a = "", i = e.split("/").length - 1;
                if (1 == i)a = e; else {
                    "/" == e.substr(t, 1) && (t -= 1);
                    for (var n = t; n > 0 && "/" != e.substr(t, 1); n--)t--;
                    a = e.substr(0, t + 1)
                }
                $("input.path").val(a), ui.header.gotoPath()
            }
        }
    }
}), define("app/src/share_explorer/fileSelect", [], function () {
    var e = !1, t = !1, a = !1, i = function () {
        o(), n(), s()
    }, n = function () {
        $(Config.FileBoxClass).die("touchstart").live("touchstart", function () {
            $(this).hasClass("select") ? ui.path.open() : (d.clear(), $(this).removeClass("select"), $(this).addClass("select"), d.select())
        }), $(".fileContiner .download .btn").die("click").live("click", function (e) {
            return ui.path.download(), stopPP(e), !1
        }), $(Config.FileBoxClass).live("mouseenter", function () {
            t && $(this).hasClass(Config.TypeFolderClass) && !$(this).hasClass(Config.SelectClassName) && $(this).addClass("selectDragTemp"), e || t || $(this).addClass(Config.HoverClassName), $(this).unbind("mousedown").mousedown(function (e) {
                if (rightMenu.hidden(), e.ctrlKey || e.shiftKey || $(this).hasClass(Config.SelectClassName) || (d.clear(), $(this).addClass(Config.SelectClassName), d.select()), 3 != e.which || $(this).hasClass(Config.SelectClassName) || (d.clear(), $(this).addClass(Config.SelectClassName), d.select()), e.ctrlKey && ($(this).hasClass(Config.SelectClassName) ? a = !0 : (d.setMenu($(this)), $(this).addClass(Config.SelectClassName)), d.select()), e.shiftKey) {
                    var t = parseInt($(this).attr(Config.FileOrderAttr));
                    if (0 == Global.fileListSelectNum)c(0, t); else {
                        var i = parseInt(Global.fileListSelect.first().attr(Config.FileOrderAttr)), n = parseInt(Global.fileListSelect.last().attr(Config.FileOrderAttr));
                        i > t ? c(t, i) : t > n ? c(n, t) : t > i && n > t && c(i, t)
                    }
                }
            })
        }).die("mouseleave").live("mouseleave", function () {
            $(this).removeClass(Config.HoverClassName), $(this).removeClass("selectDragTemp")
        }).die("click").live("click", function (e) {
            stopPP(e), e.ctrlKey || e.shiftKey || (d.clear(), $(this).addClass(Config.SelectClassName), d.select()), e.ctrlKey && a && (a = !1, d.resumeMenu($(this)), $(this).removeClass(Config.SelectClassName), d.select())
        }), $(Config.FileBoxClass).die("dblclick").live("dblclick", function (e) {
            stopPP(e), e.altKey ? ui.path.info() : ui.path.open()
        })
    }, o = function () {
        var a, i, n, o = 100, s = 50, r = 80 - Global.topbar_height, l = 0, c = !1, d = 0, p = 0;
        $(Config.FileBoxClass).die("mousedown").live("mousedown", function (t) {
            return Global.shiftKey ? void 0 : ui.isEdit() ? !0 : 1 != t.which || e ? !0 : (a = $(this), u(t), this.setCapture && this.setCapture(), $(document).mousemove(function (e) {
                h(e)
            }), $(document).one("mouseup", function (e) {
                f(e), this.releaseCapture && this.releaseCapture()
            }), stopPP(t), !1)
        });
        var u = function (e) {
            rightMenu.hidden(), t = !0, l = $.now(), d = e.pageY, p = e.pageX, i = $(document).height(), n = $(document).width()
        }, h = function (e) {
            if (!t)return !0;
            $.now() - l > o && !c && m();
            var a = e.clientX >= n - 50 ? n - 50 : e.clientX, d = e.clientY >= i - 50 ? i - 50 : e.clientY;
            a = 0 >= a ? 0 : a, d = 0 >= d ? 0 : d, a -= s, d -= r, $(".draggable-dragging").css("left", a), $(".draggable-dragging").css("top", d), Global.isIE && $("." + Config.TypeFolderClass).each(function () {
                var t = e.pageX, a = e.pageY, i = $(this).offset(), n = $(this).width(), o = $(this).height();
                t > i.left && i.left + n > t && a > i.top && i.top + o > a ? $(this).addClass("selectDragTemp") : $(this).removeClass("selectDragTemp")
            })
        }, f = function () {
            return t ? (t = !1, c = !1, $("body").css("cursor", "auto"), $(".draggable-dragging").fadeOut(200, function () {
                $(this).remove()
            }), void 0) : !1
        }, m = function () {
            c = !0, $("body").css("cursor", "move"), a.find(".ico").attr("filetype"), $('<div class="file draggable-dragging"><div class="drag_number">' + Global.fileListSelectNum + "</div>" + '<div class="ico" style="background:' + a.find(".ico").css("background") + '"></div>' + "</div>").appendTo("body")
        }
    }, s = function () {
        var a = null, i = null, n = null, o = 85 + Global.topbar_height, s = 0, r = 0;
        $(Config.BodyContent).die("mousedown").live("mousedown", function (e) {
            if (!($(e.target).hasClass("bodymain") && 20 > $(document).width() - e.pageX)) {
                if (ui.isEdit())return !0;
                if (1 != e.which || t)return !0;
                l(e), this.setCapture && this.setCapture(), $(document).unbind("mousemove").mousemove(function (e) {
                    c(e)
                }), $(document).one("mouseup", function (e) {
                    p(e), Global.isDragSelect = !0, this.releaseCapture && this.releaseCapture()
                })
            }
        });
        var l = function (t) {
            s = $(Config.BodyContent).scrollTop(), r = o - s, $(t.target).parent().hasClass(Config.FileBoxClassName) || $(t.target).parent().parent().hasClass(Config.FileBoxClassName) || $(t.target).hasClass("fix") || (rightMenu.hidden(), t.ctrlKey || t.shiftKey || d.clear(), 0 == $(t.target).hasClass("ico") && (0 == $("#selContainer").length && ($('<div id="selContainer"></div>').appendTo(Config.FileBoxSelector), n = $("#selContainer")), a = t.pageX - Global.frameLeftWidth, i = t.pageY + $(Config.BodyContent).scrollTop() - o, e = !0))
        }, c = function (t) {
            if (!e)return !0;
            "none" == n.css("display") && n.css("display", "");
            var o = $(Config.BodyContent).scrollTop() - s, l = t.pageX - Global.frameLeftWidth, c = t.pageY - r + o;
            n.css({left: Math.min(l, a), top: Math.min(c, i), width: Math.abs(l - a), height: Math.abs(c - i)});
            for (var p = n.offset().left - Global.frameLeftWidth, u = n.offset().top - r + o, h = n.width(), f = n.height() + Math.abs(o), m = Global.fileListNum, v = 0; m > v; v++) {
                var _ = Global.fileListAll[v], g = $(Global.fileListAll[v]), b = _.offsetWidth + _.offsetLeft, y = _.offsetHeight + _.offsetTop;
                if (b > p && y > u && p + h > _.offsetLeft && u + f > _.offsetTop) {
                    if (!g.hasClass("selectDragTemp")) {
                        if (g.hasClass("selectToggleClass"))continue;
                        if (g.hasClass(Config.SelectClassName)) {
                            g.removeClass(Config.SelectClassName).addClass("selectToggleClass"), d.resumeMenu(g);
                            continue
                        }
                        g.addClass("selectDragTemp")
                    }
                } else g.removeClass("selectDragTemp"), g.hasClass("selectToggleClass") && g.addClass(Config.SelectClassName).removeClass("selectToggleClass")
            }
        }, p = function () {
            return e ? (n.css("display", "none"), $(".selectDragTemp").addClass(Config.SelectClassName).removeClass("selectDragTemp"), $(".selectToggleClass").removeClass("selectToggleClass"), d.select(), e = !1, a = null, i = null, void 0) : !1
        }
    }, r = function (e) {
        var t = 0, a = Global.fileListSelect;
        Global.fileListSelectNum;
        var i = Global.fileListNum, n = function () {
            if (1 == Global.fileListSelectNum) {
                var n = parseInt(a.attr(Config.FileOrderAttr));
                switch (e) {
                    case"up":
                    case"left":
                        t = 0 >= n ? n : n - 1;
                        break;
                    case"down":
                    case"right":
                        t = n >= i - 1 ? n : n + 1;
                        break;
                    default:
                }
            } else if (Global.fileListSelectNum > 1) {
                var o = parseInt(a.first().attr(Config.FileOrderAttr)), s = parseInt(a.last().attr(Config.FileOrderAttr));
                switch (e) {
                    case"up":
                    case"left":
                        t = 0 >= o ? o : o - 1;
                        break;
                    case"down":
                    case"right":
                        t = s >= i ? s : s + 1;
                        break;
                    default:
                }
            }
        }, o = function () {
            var n = Global.fileRowNum;
            if (1 == Global.fileListSelectNum) {
                var o = parseInt(a.attr(Config.FileOrderAttr));
                switch (e) {
                    case"up":
                        t = n > o ? 0 : o - n;
                        break;
                    case"left":
                        t = 0 >= o ? o : o - 1;
                        break;
                    case"down":
                        t = o + n >= i - 1 ? i - 1 : o + n;
                        break;
                    case"right":
                        t = o >= i - 1 ? o : o + 1;
                        break;
                    default:
                }
            } else if (Global.fileListSelectNum > 1) {
                var s = parseInt(a.first().attr(Config.FileOrderAttr)), r = parseInt(a.last().attr(Config.FileOrderAttr));
                switch (e) {
                    case"up":
                        t = n >= s ? s : s - n;
                        break;
                    case"left":
                        t = 0 >= s ? s : s - 1;
                        break;
                    case"down":
                        t = r + n >= i ? r : r + n;
                        break;
                    case"right":
                        t = r >= i ? r : r + 1;
                        break;
                    default:
                }
            }
        };
        return "list" == G.list_type ? n() : o(), Global.fileListAll.eq(t)
    }, l = function (e) {
        var t;
        switch (e) {
            case"home":
                t = Global.fileListAll.first();
                break;
            case"end":
                t = Global.fileListAll.last();
                break;
            case"left":
            case"up":
            case"right":
            case"down":
                t = r(e);
                break;
            case"all":
                t = Global.fileListAll;
                break;
            default:
        }
        d.clear(), t.addClass(Config.SelectClassName), d.select(), d.setInView()
    }, c = function (e, t) {
        d.clear();
        for (var a = e; t >= a; a++)$(Global.fileListAll[a]).addClass(Config.SelectClassName);
        d.select()
    }, d = {
        init: function () {
            var e = $(Config.FileBoxClass);
            e.each(function (e) {
                $(this).attr(Config.FileOrderAttr, e)
            }), Global.fileListSelect = "", Global.fileListAll = e, Global.fileListNum = e.length, Global.fileListSelectNum = 0, d.menuAction("clear")
        }, select: function () {
            var e = $(Config.SelectClass);
            Global.fileListSelect = e, Global.fileListSelectNum = e.length, e.length > 1 && d.setMenu(e), d.menuAction("menufile")
        }, setInView: function () {
            var e = Global.fileListSelect;
            if (e && e.length >= 1) {
                var t = $(".bodymain"), a = $(e[e.length - 1]);
                t.scrollTop(a.offset().top - t.offset().top - t.height() / 2 + t.scrollTop())
            }
        }, name: function (e) {
            return e.attr("data-name")
        }, type: function (e) {
            return e.find(".ico").attr("filetype")
        }, setMenu: function (e) {
            if ("*recycle*/" != G.this_path) {
                if ("*share*/" == G.this_path)return e.removeClass("menuSharePath").addClass("menuSharePathMore"), void 0;
                e.removeClass("menufile menufolder").addClass("menuMore"), d.menuAction()
            }
        }, resumeMenu: function (e) {
            if ("*share*/" == G.this_path)return e.removeClass("menuSharePathMore").addClass("menuSharePath"), void 0;
            var t = {fileBox: "menufile", folderBox: "menufolder"};
            for (var a in t)e.hasClass(a) && e.removeClass("menuMore").addClass(t[a]);
            d.menuAction()
        }, getAllName: function () {
            var e = [];
            if (0 != Global.fileListSelectNum) {
                var t = Global.fileListSelect;
                return t.each(function (t) {
                    e[t] = d.name($(this))
                }), e
            }
        }, clear: function () {
            if (0 != Global.fileListSelectNum) {
                var e = Global.fileListSelect;
                e.removeClass(Config.SelectClassName), e.each(function () {
                    d.resumeMenu($(this))
                }), Global.fileListSelect = "", Global.fileListSelectNum = 0, d.menuAction()
            }
        }, menuAction: function () {
            0 == Global.fileListSelectNum ? $(".kod_path_tool #down").addClass("disabled") : Global.fileListSelectNum >= 1 && $(".kod_path_tool #down").removeClass("disabled")
        }
    };
    return {init: i, selectPos: l, fileLight: d}
}), define("app/share_common/rightMenu", [], function () {
    var e = ".menufile", t = ".menufolder", a = ".menuMore", i = ".menuTreeRoot", n = ".menuTreeFolder", o = ".menuTreeFile", s = {
        listIcon: {
            name: LNG.list_type,
            icon: "eye-open",
            items: {
                seticon: {name: LNG.list_icon, className: "menu_seticon set_seticon"},
                setlist: {name: LNG.list_list, className: "menu_seticon set_setlist"}
            }
        },
        sortBy: {
            name: LNG.order_type,
            accesskey: "y",
            icon: "sort",
            items: {
                set_sort_name: {name: LNG.name, className: "menu_set_sort set_sort_name"},
                set_sort_ext: {name: LNG.type, className: "menu_set_sort set_sort_ext"},
                set_sort_size: {name: LNG.size, className: "menu_set_sort set_sort_size"},
                set_sort_mtime: {name: LNG.modify_time, className: "menu_set_sort set_sort_mtime"},
                set_sort_up: {name: LNG.sort_up, className: "menu_set_desc set_sort_up line_top"},
                set_sort_down: {name: LNG.sort_down, className: "menu_set_desc set_sort_down"}
            }
        }
    }, r = function () {
        $('<div id="rightMenu" class="hidden"></div>').appendTo("body"), $(".context-menu-list").die("click").live("click", function (e) {
            return stopPP(e), !1
        }), c(), d(), p(), u(), m(), v(), x(), y(), b(), $(".set_set" + G.list_type).addClass("selected"), $(".set_sort_" + G.sort_field).addClass("selected"), $(".set_sort_" + G.sort_order).addClass("selected"), $(".context-menu-root").addClass("fadein")
    }, l = function () {
        $('<div id="rightMenu" class="hidden"></div>').appendTo("body"), $(".context-menu-list").die("click").live("click", function (e) {
            return stopPP(e), !1
        }), m(), y(), x(), _(), g(), b(), $(".context-menu-root").addClass("fadein")
    }, c = function () {
        $.contextMenu({
            selector: ".menuBodyMain",
            className: "fileContiner_menu",
            zIndex: 9999,
            callback: function (e, t) {
                h(e, t)
            },
            items: {
                refresh: {name: LNG.refresh + "<b>F5</b>", className: "refresh", icon: "refresh", accesskey: "e"},
                sep1: "--------",
                listIcon: s.listIcon,
                sortBy: s.sortBy,
                sep10: "--------",
                info: {name: LNG.info + "<b>Alt+I</b>", className: "info", icon: "info", accesskey: "i"}
            }
        })
    }, d = function () {
        $('<i class="' + t.substr(1) + '"></i>').appendTo("#rightMenu"), $.contextMenu({
            zIndex: 9999,
            selector: t,
            className: t.substr(1),
            callback: function (e) {
                f(e)
            },
            items: {
                open: {name: LNG.open + "<b>Enter</b>", className: "open", icon: "folder-open-alt", accesskey: "o"},
                down: {name: LNG.download, className: "down", icon: "download", accesskey: "x"},
                sep1: "--------",
                search: {
                    name: LNG.search_in_path + "<b>Ctrl+F</b>",
                    className: "search",
                    icon: "search",
                    accesskey: "s"
                },
                openProject: {name: LNG.openProject, className: "openProject", icon: "edit"},
                sep2: "--------",
                info: {name: LNG.info + "<b>Alt+I</b>", className: "info", icon: "info", accesskey: "i"}
            }
        })
    }, p = function () {
        $('<i class="' + e.substr(1) + '"></i>').appendTo("#rightMenu"), $.contextMenu({
            zIndex: 9999,
            selector: e,
            className: e.substr(1),
            callback: function (e) {
                f(e)
            },
            items: {
                open: {name: LNG.open + "<b>Enter</b>", className: "open", icon: "external-link", accesskey: "o"},
                open_text: {name: LNG.edit + "<b>Ctrl+E</b>", className: "open_text", icon: "edit", accesskey: "e"},
                down: {name: LNG.download, className: "down", icon: "download", accesskey: "x"},
                show_file: {name: LNG.show_file, className: "show_file", icon: "globe", accesskey: "b"},
                sep1: "--------",
                info: {name: LNG.info + "<b>Alt+I</b>", className: "info", icon: "info", accesskey: "i"}
            }
        })
    }, u = function () {
        $('<i class="' + a.substr(1) + '"></i>').appendTo("#rightMenu"), $.contextMenu({
            zIndex: 9999,
            selector: a,
            className: a.substr(1),
            callback: function (e) {
                f(e)
            },
            items: {
                down: {name: LNG.download, className: "down", icon: "download", accesskey: "x"},
                sep1: "--------",
                playmedia: {name: LNG.add_to_play, className: "playmedia", icon: "music", accesskey: "p"},
                info: {name: LNG.info, className: "info", icon: "info", accesskey: "i"}
            }
        })
    }, h = function (e) {
        switch (e) {
            case"refresh":
                ui.f5(!0, !0);
                break;
            case"seticon":
                ui.setListType("icon");
                break;
            case"setlist":
                ui.setListType("list");
                break;
            case"set_sort_name":
                ui.setListSort("name", 0);
                break;
            case"set_sort_ext":
                ui.setListSort("ext", 0);
                break;
            case"set_sort_size":
                ui.setListSort("size", 0);
                break;
            case"set_sort_mtime":
                ui.setListSort("mtime", 0);
                break;
            case"set_sort_up":
                ui.setListSort(0, "up");
                break;
            case"set_sort_down":
                ui.setListSort(0, "down");
                break;
            case"info":
                ui.path.info();
                break;
            case"open":
                ui.path.open();
                break;
            case"open_new":
                ui.path.open_new();
                break;
            default:
        }
    }, f = function (e) {
        switch (e) {
            case"open":
                ui.path.open();
                break;
            case"down":
                ui.path.download();
                break;
            case"open_text":
                ui.path.openEditor();
                break;
            case"playmedia":
                ui.path.play();
                break;
            case"search":
                ui.path.search();
                break;
            case"show_file":
                ui.path.show_file();
                break;
            case"openProject":
                ui.path.openProject();
                break;
            case"info":
                ui.path.info();
                break;
            default:
        }
    }, m = function () {
        $('<i class="' + i.substr(1) + '"></i>').appendTo("#rightMenu"), $.contextMenu({
            zIndex: 9999,
            selector: i,
            callback: function (e) {
                w(e)
            },
            items: {
                search: {name: LNG.search_in_path, className: "search", icon: "search", accesskey: "s"},
                sep2: "--------",
                quit: {name: LNG.close_menu, className: "quit", icon: "remove", accesskey: "q"}
            }
        })
    }, v = function () {
        $('<i class="' + n.substr(1) + '"></i>').appendTo("#rightMenu"), $.contextMenu({
            zIndex: 9999,
            selector: n,
            callback: function (e) {
                w(e)
            },
            items: {
                download: {name: LNG.download, className: "down", icon: "download", accesskey: "x"},
                refresh: {name: LNG.refresh_tree, className: "refresh", icon: "refresh", accesskey: "e"},
                sep1: "--------",
                search: {name: LNG.search_in_path, className: "search", icon: "search", accesskey: "s"},
                explorer: {name: LNG.manage_folder, className: "explorer", icon: "laptop", accesskey: "v"},
                openProject: {name: LNG.openProject, className: "openProject", icon: "edit"},
                sep2: "--------",
                info: {name: LNG.info, className: "info", icon: "info", accesskey: "i"}
            }
        })
    }, _ = function () {
        $('<i class="' + n.substr(1) + '"></i>').appendTo("#rightMenu"), $.contextMenu({
            zIndex: 9999,
            selector: n,
            callback: function (e) {
                w(e)
            },
            items: {
                download: {name: LNG.download, className: "down", icon: "download", accesskey: "x"},
                refresh: {name: LNG.refresh_tree, className: "refresh", icon: "refresh", accesskey: "e"},
                sep1: "--------",
                search: {name: LNG.search_in_path, className: "search", icon: "search", accesskey: "s"},
                explorer: {name: LNG.manage_folder, className: "explorer", icon: "laptop", accesskey: "v"},
                openProject: {name: LNG.openProject, className: "openProject", icon: "edit"},
                sep2: "--------",
                info: {name: LNG.info, className: "info", icon: "info", accesskey: "i"}
            }
        })
    }, g = function () {
        $('<i class="' + o.substr(1) + '"></i>').appendTo("#rightMenu"), $.contextMenu({
            zIndex: 9999,
            selector: o,
            callback: function (e) {
                w(e)
            },
            items: {
                edit: {name: LNG.edit, className: "edit", icon: "edit", accesskey: "e"},
                open: {name: LNG.open, className: "open", icon: "external-link", accesskey: "o"},
                download: {name: LNG.download, className: "download", icon: "download", accesskey: "x"},
                show_file: {name: LNG.show_file, className: "show_file", icon: "globe", accesskey: "b"},
                sep1: "--------",
                info: {name: LNG.info, className: "info", icon: "info", accesskey: "i"}
            }
        })
    }, b = function () {
        $('<i class="taskBarMenu"></i>').appendTo("#rightMenu"), $.contextMenu({
            zIndex: 9999,
            selector: ".taskBarMenu",
            items: {
                quitOthers: {
                    name: LNG.close_others,
                    className: "quitOthers",
                    icon: "remove-circle",
                    accesskey: "o"
                }, quit: {name: LNG.close, className: "quit", icon: "remove", accesskey: "q"}
            },
            callback: function (e, t) {
                var a = t.$trigger.attr("id"), i = art.dialog.list[a];
                switch (e) {
                    case"quitOthers":
                        $.each(art.dialog.list, function (e, t) {
                            a != e && t.close()
                        });
                        break;
                    case"quit":
                        i.close()
                }
            }
        })
    }, y = function () {
        $.contextMenu({
            zIndex: 9999,
            selector: ".task_tab",
            items: {
                closeAll: {name: LNG.dialog_close_all, icon: "remove-circle", accesskey: "q"},
                showAll: {name: LNG.dialog_display_all, icon: "th-large", accesskey: "s"},
                hideAll: {name: LNG.dialog_min_all, icon: "remove", accesskey: "h"}
            },
            callback: function (e, t) {
                var a = t.$trigger.attr("id");
                switch (art.dialog.list[a], e) {
                    case"showAll":
                        $.each(art.dialog.list, function (e, t) {
                            t.display(!0)
                        });
                        break;
                    case"hideAll":
                        $.each(art.dialog.list, function (e, t) {
                            t.display(!1)
                        });
                        break;
                    case"closeAll":
                        $.each(art.dialog.list, function (e, t) {
                            t.close()
                        });
                        break;
                    default:
                }
            }
        })
    }, x = function () {
        $('<i class="dialog_menu"></i>').appendTo("#rightMenu"), $.contextMenu({
            zIndex: 9999,
            selector: ".dialog_menu",
            items: {
                quit_dialog: {name: LNG.close, className: "quit_dialog", icon: "remove", accesskey: "q"},
                hide_dialog: {name: LNG.dialog_min, className: "hide_dialog", icon: "minus", accesskey: "h"},
                refresh: {name: LNG.refresh, className: "refresh", icon: "refresh", accesskey: "r"},
                open_window: {name: LNG.open_ie, className: "open_window", icon: "globe", accesskey: "b"}
            },
            callback: function (e, t) {
                var a = t.$trigger.attr("id"), i = art.dialog.list[a];
                switch (e) {
                    case"quit_dialog":
                        i.close();
                        break;
                    case"hide_dialog":
                        i.display(!1);
                        break;
                    case"refresh":
                        i.refresh();
                        break;
                    case"open_window":
                        i.open_window();
                        break;
                    default:
                }
            }
        })
    }, w = function (e) {
        switch (e) {
            case"edit":
                ui.tree.openEditor();
                break;
            case"open":
                ui.tree.open();
                break;
            case"refresh":
                ui.tree.refresh();
                break;
            case"info":
                ui.tree.info();
                break;
            case"explorer":
                ui.tree.explorer();
                break;
            case"openProject":
                ui.tree.openProject();
                break;
            case"show_file":
                ui.tree.show_file();
                break;
            case"download":
                ui.tree.download();
                break;
            case"search":
                ui.tree.search();
                break;
            case"refresh_all":
                ui.tree.init();
                break;
            case"quit":
                break;
            default:
        }
    };
    return {
        initExplorer: r, initEditor: l, show: function (e, t, a) {
            e && (rightMenu.hidden(), $(e).contextMenu({x: t, y: a}))
        }, menuShow: function () {
            var e = $(".context-menu-list").filter(":visible"), t = $(".context-menu-active");
            if (0 != e.length && 0 != t.length) {
                if (t.hasClass("dialog_menu")) {
                    var a = t.attr("id"), i = art.dialog.list[a];
                    i.has_frame() ? (e.find(".open_window").show(), e.find(".refresh").show()) : (e.find(".open_window").hide(), e.find(".refresh").hide())
                }
                if (t.hasClass("menufile")) {
                    var n = fileLight.type(Global.fileListSelect);
                    "zip" == n ? e.find(".unzip").show() : e.find(".unzip").hide(), "html" == n || "htm" == n || "oexe" == n ? e.find(".open_text").show() : e.find(".open_text").hide()
                }
                if (t.hasClass("menuMore")) {
                    var o = 0;
                    Global.fileListSelect.each(function () {
                        var e = core.pathExt(fileLight.name($(this)));
                        (inArray(core.filetype.music, e) || inArray(core.filetype.movie, e)) && (o += 1)
                    }), 0 == o ? e.find(".playmedia").hide() : e.find(".playmedia").show()
                }
            }
        }, isDisplay: function () {
            var e = !1;
            return $(".context-menu-list").each(function () {
                "none" != $(this).css("display") && (e = !0)
            }), e
        }, hidden: function () {
            $(".context-menu-list").filter(":visible").trigger("contextmenu:hide")
        }
    }
}), define("app/common/taskTap", [], function () {
    var e = {}, t = "", a = 160, i = function () {
        $(".task_tab .tab").die("mouseenter").live("mouseenter", function (e) {
            $(this).hasClass("this") || $(this).addClass("hover"), stopPP(e)
        }).die("click").live("click", function (e) {
            var t = $(this).attr("id"), a = art.dialog.list[t], i = $("." + t);
            "hidden" == i.css("visibility") ? a.display(!0) : i.hasClass("aui_state_focus") ? a.display(!1) : a.zIndex(), stopPP(e)
        }).die("mouseleave").live("mouseleave", function () {
            $(this).removeClass("hover")
        }).die("dblclick").live("dblclick", function () {
        })
    }, n = function () {
        var e, t, i, n, o = !1, s = !1, r = 0, l = 0, c = 0, d = 0, p = 0, u = 0;
        $(".task_tab .tab").die("mousedown").live("mousedown", function (t) {
            return e = $(this), s = !0, this.setCapture && this.setCapture(), $(document).mousemove(function (e) {
                f(e)
            }), $(document).one("mouseup", function (e) {
                return v(e), this.releaseCapture && this.releaseCapture(), stopPP(e), !1
            }), stopPP(t), !1
        });
        var h = function (a) {
            o = !0, r = a.pageX, $tab_parent = $(".task_tab"), t = $(".task_tab .tab"), $(".tasktab-dragging").remove(), i = e.clone().addClass("tasktab-dragging").prependTo("body"), d = $sizeInt(t.css("margin-right")), p = $tab_parent.width(), u = $tab_parent.get(0).getBoundingClientRect().left, u += $(window).scrollLeft(), l = e.get(0).getBoundingClientRect().left, c = $sizeInt(t.css("width"));
            var n = e.get(0).getBoundingClientRect().top - $sizeInt(e.css("margin-top")), s = a.clientX - r + l;
            $("body").prepend("<div class='dragMaskView'></div>"), i.css({
                width: c + "px",
                top: n,
                left: s
            }), e.css("opacity", 0)
        }, f = function (a) {
            if (s) {
                window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty(), 0 == o && h(a);
                var n = a.clientX - r + l;
                u > n || n > u + p - c || (i.css("left", n), t.each(function () {
                    var t = $(this).get(0).getBoundingClientRect().left;
                    if (n > t && t + c / 2 + d > n) {
                        if (e.attr("id") == $(this).attr("id"))return;
                        m($(this).attr("id"), "left")
                    }
                    if (n > t - c / 2 + d && t > n) {
                        if (e.attr("id") == $(this).attr("id"))return;
                        m($(this).attr("id"), "right")
                    }
                }))
            }
        }, m = function (i, o) {
            if (!e.is(":animated") || n != i) {
                n = i, e.stop(!0, !0), $(".insertTemp").remove(), t = $(".task_tab .tab");
                var s = e.width(), r = $(".task_tab #" + i), l = e.clone(!0).insertAfter(e).css({
                    "margin-right": "0px",
                    border: "none"
                }).addClass("insertTemp");
                "left" == o ? e.after(r).css("width", "0px") : (e.before(r).css("width", "0px"), r.before(l)), e.animate({width: s + "px"}, a), l.animate({width: "0px"}, a, function () {
                    $(this).remove(), t = $(".task_tab .tab")
                })
            }
        }, v = function () {
            s = !1, o = !1, startTime = 0, $(".dragMaskView").remove(), void 0 != i && (l = e.get(0).getBoundingClientRect().left, i.animate({left: l + "px"}, a, function () {
                e.css("opacity", 1), $(this).remove()
            }))
        }
    }, o = function (e) {
        var t = 110, i = t, n = t + 12, o = $(".task_tab .tab"), s = $(".task_tab .tabs").width() - 10, r = o.length, l = Math.floor(s / n);
        switch (r > l && (i = Math.floor(s / r) - 12), e) {
            case"add":
                $(".task_tab .tabs .this").css("width", "0").animate({width: i + "px"}, a);
            case"close":
                o.animate({width: i + "px"}, a);
                break;
            case"resize":
                o.css("width", i + "px");
                break;
            default:
        }
    }, s = function (t, a) {
        $(".task_tab").removeClass("hidden");
        var i = a.replace(/<[^>]+>/g, ""), n = '<div class="tab taskBarMenu" id="' + t + '" title="' + i + '">' + a + "</div>";
        $(n).insertBefore(".task_tab .last"), o("add"), e[t] = {id: t, name: name}
    }, r = function (e) {
        $(".task_tab .this").removeClass("this"), $(".task_tab #" + e).addClass("this"), t = e
    }, l = function (t) {
        delete e[t], $(".task_tab #" + t).animate({width: 0}, a, function () {
            $(".task_tab #" + t).remove(), o("close"), 0 == $(".tabs .tab").length && "desktop" != Config.pageApp && $(".task_tab").addClass("hidden")
        })
    };
    return {
        add: s, focus: r, close: l, init: function () {
            var e = '<div class="task_tab"><div class="tabs"><div class="last" style="clear:both;"></div></div></div>';
            $(e).appendTo("body"), "desktop" != Config.pageApp && $(".task_tab").addClass("hidden"), $(window).bind("resize", function () {
                o("resize")
            }), i(), n()
        }
    }
}), define("app/common/core", [], function (require, exports) {
    return {
        filetype: {
            image: ["jpg", "jpeg", "png", "bmp", "gif", "ico"],
            music: ["mp3", "wma", "wav", "mid", "m4a", "aac", "midi"],
            movie: ["avi", "flv", "f4v", "wmv", "3gp", "mp4", "wmv", "asf", "m4v", "mov", "mpg"],
            doc: ["doc", "docx", "docm", "xls", "xlsx", "xlsb", "xlsm", "ppt", "pptx", "pptm"],
            text: ["oexe", "inc", "inf", "csv", "log", "asc", "tsv", "lnk", "url", "webloc"],
            code: ["abap", "abc", "as", "ada", "adb", "htgroups", "htpasswd", "conf", "htaccess", "htgroups", "htpasswd", "asciidoc", "asm", "ahk", "bat", "cmd", "c9search_results", "cpp", "c", "cc", "cxx", "h", "hh", "hpp", "cirru", "cr", "clj", "cljs", "CBL", "COB", "coffee", "cf", "cson", "Cakefile", "cfm", "cs", "css", "curly", "d", "di", "dart", "diff", "patch", "Dockerfile", "dot", "dummy", "dummy", "e", "ejs", "ex", "exs", "elm", "erl", "hrl", "frt", "fs", "ldr", "ftl", "gcode", "feature", ".gitignore", "glsl", "frag", "vert", "go", "groovy", "haml", "hbs", "handlebars", "tpl", "mustache", "hs", "hx", "html", "htm", "xhtml", "erb", "rhtml", "ini", "cfg", "prefs", "io", "jack", "jade", "java", "js", "jsm", "json", "jq", "jsp", "jsx", "jl", "tex", "latex", "ltx", "bib", "lean", "hlean", "less", "liquid", "lisp", "ls", "logic", "lql", "lsl", "lua", "lp", "lucene", "Makefile", "GNUmakefile", "makefile", "OCamlMakefile", "make", "md", "markdown", "mask", "matlab", "mel", "mc", "mush", "mysql", "nix", "m", "mm", "ml", "mli", "pas", "p", "pl", "pm", "pgsql", "php", "phtml", "ps1", "praat", "praatscript", "psc", "proc", "plg", "prolog", "properties", "proto", "py", "r", "Rd", "Rhtml", "rb", "ru", "gemspec", "rake", "Guardfile", "Rakefile", "Gemfile", "rs", "sass", "scad", "scala", "scm", "rkt", "scss", "sh", "bash", ".bashrc", "sjs", "smarty", "tpl", "snippets", "soy", "space", "sql", "styl", "stylus", "svg", "tcl", "tex", "txt", "textile", "toml", "twig", "ts", "typescript", "str", "vala", "vbs", "vb", "vm", "v", "vh", "sv", "svh", "vhd", "vhdl", "xml", "rdf", "rss", "wsdl", "xslt", "atom", "mathml", "mml", "xul", "xbl", "xaml", "xq", "yaml", "yml", "htm", "xib", "xsd", "storyboard", "plist", "csproj"],
            bindary: ["pdf", "bin", "zip", "swf", "gzip", "rar", "arj", "tar", "gz", "cab", "tbz", "tbz2", "lzh", "uue", "bz2", "ace", "exe", "so", "dll", "chm", "rtf", "odp", "odt", "pages", "class", "psd", "ttf", "fla", "7z", "dmg", "iso", "dat", "ipa"]
        }, ico: function (e) {
            var t = G.static_path + "images/file_16/", a = ["folder", "file", "edit", "search", "up", "setting", "appStore", "error", "info", "mp3", "flv", "pdf", "doc", "xls", "ppt", "html", "swf"], i = $.inArray(e, a);
            return -1 == i ? t + "file.png" : t + e + ".png"
        }, contextmenu: function (e) {
            try {
                rightMenu.hidden()
            } catch (t) {
            }
            var t = e || window.event;
            return t ? t && $(t.target).is("textarea") || $(t.target).is("input") || 0 != $(t.target).parents(".topbar").length || 0 != $(t.target).parents(".edit_body").length || 0 != $(t.target).parents(".aui_state_focus").length ? !0 : !1 : !0
        }, pathThis: function (e) {
            e = e.replace(/\\/g, "/");
            var t = e.split("/"), a = t[t.length - 1];
            if ("" == a && (a = t[t.length - 2]), 0 == a.search("fileProxy")) {
                a = urlDecode(a.substr(a.search("&path=")));
                var t = a.split("/");
                a = t[t.length - 1], "" == a && (a = t[t.length - 2])
            }
            return a
        }, pathFather: function (e) {
            e = e.replace(/\\/g, "/");
            var t = e.lastIndexOf("/");
            return e.substr(0, t + 1)
        }, pathExt: function (e) {
            e = e.replace(/\\/g, "/"), e = e.replace(/\/+/g, "/");
            var t = e.lastIndexOf(".");
            return e = e.substr(t + 1), e.toLowerCase()
        }, path2url: function (e) {
            if ("http" == e.substr(0, 4))return e;
            if (e = e.replace(/\\/g, "/"), e = e.replace(/\/+/g, "/"), e = e.replace(/\/\.*\//g, "/"), G.is_root && e.substring(0, G.web_root.length) == G.web_root)return G.web_host + e.replace(G.web_root, "");
            var t = G.app_host + "/vis.go?explorer/fileProxy&path=" + urlEncode(e);
            return G.share_page !== void 0 && (t = G.app_host + "/vis.go?share/fileProxy&user=" + G.user + "&sid=" + G.sid + "&path=" + urlEncode(e)), t
        }, authCheck: function (e, t) {
            return G.is_root ? !0 : AUTH.hasOwnProperty(e) ? AUTH[e] ? !0 : (void 0 == t && (t = LNG.no_permission), core.tips.tips(t, !1), !1) : !0
        }, ajaxError: function (e) {
            core.tips.close(LNG.system_error, !1);
            var t = e.responseText, a = '<div class="ajaxError">' + t + "</div>", i = $.dialog.list.ajaxErrorDialog;
            return "<!--user login-->" == t.substr(0, 17) ? (FrameCall.goRefresh(), void 0) : (i ? i.content(a) : $.dialog({
                id: "ajaxErrorDialog",
                padding: 0,
                width: "60%",
                height: "50%",
                fixed: !0,
                resize: !0,
                ico: core.ico("error"),
                title: "ajax error",
                content: a
            }), void 0)
        }, file_get: function (e, t) {
            var a = "./vis.go?editor/fileGet&filename=" + urlEncode2(e);
            G.share_page !== void 0 && (a = "./vis.go?share/fileGet&user=" + G.user + "&sid=" + G.sid + "&filename=" + urlEncode2(e)), $.ajax({
                url: a,
                dataType: "json",
                beforeSend: function () {
                    core.tips.loading(LNG.loading)
                },
                error: core.ajaxError,
                success: function (e) {
                    core.tips.close(LNG.success), "function" == typeof t && t(e.data.content)
                }
            })
        }, setting: function (e) {
            void 0 == e && (e = G.is_root ? "system" : "user"), void 0 == window.top.frames.Opensetting_mode ? $.dialog.open("./vis.go?setting#" + e, {
                id: "setting_mode",
                fixed: !0,
                ico: core.ico("setting"),
                resize: !0,
                title: LNG.setting,
                width: 960,
                height: 580
            }) : ($.dialog.list.setting_mode.display(!0), FrameCall.top("Opensetting_mode", "Setting.setGoto", '"' + e + '"'))
        }, copyright: function () {
            var e = require("../tpl/copyright.html"), t = template.compile(e), a = t({LNG: LNG, G: G});
            $.dialog({
                id: "copyright_dialog",
                bottom: 0,
                right: 0,
                simple: !0,
                resize: !1,
                title: LNG.about + " kod",
                width: 425,
                padding: "0",
                fixed: !0,
                content: a
            })
        }, appStore: function () {
            $.dialog.open("./vis.go?app", {
                id: "app_store",
                fixed: !0,
                ico: core.ico("appStore"),
                resize: !0,
                title: LNG.app_store,
                width: 900,
                height: 550
            })
        }, openIE: function (e) {
            $.dialog.open(e, {fixed: !0, resize: !0, title: LNG.app_store, width: "80%", height: "70%"})
        }, openApp: function (app) {
            if ("url" == app.type) {
                var icon = app.icon;
                -1 == app.icon.search(G.static_path) && "http" != app.icon.substring(0, 4) && (icon = G.static_path + "images/app/" + app.icon), "number" != typeof app.width && -1 == app.width.search("%") && (app.width = parseInt(app.width)), "number" != typeof app.height && -1 == app.height.search("%") && (app.height = parseInt(app.height)), $.dialog.open(app.content, {
                    title: app.name,
                    fixed: !0,
                    ico: icon,
                    resize: app.resize,
                    simple: app.simple,
                    title: app.name.replace(".oexe", ""),
                    width: app.width,
                    height: app.height
                })
            } else {
                var exec = app.content;
                console.log(exec), eval("{" + exec + "}")
            }
        }, update: function () {
            var e = base64_decode("aHR0cDovL3N0YXRpYy5rYWxjYWRkbGUuY29tL3VwZGF0ZS9tYWluLmpz") + "?a=" + UUID();
            require.async(e, function () {
                try {
                } catch (e) {
                }
            })
        }, explorer: function (e, t) {
            void 0 == e && (e = ""), void 0 == t && (t = core.pathThis(e));
            var a = "./vis.go?/explorer&type=iframe&path=" + e;
            G.share_page !== void 0 && (a = "./vis.go?share/folder&type=iframe&user=" + G.user + "&sid=" + G.sid + "&path=" + e), $.dialog.open(a, {
                resize: !0,
                fixed: !0,
                ico: core.ico("folder"),
                title: t,
                width: 880,
                height: 550
            })
        }, explorerCode: function (e) {
            void 0 == e && (e = "");
            var t = "vis.go?/editor&project=" + e;
            G.share_page !== void 0 && (t = "./vis.go?share/code_read&user=" + G.user + "&sid=" + G.sid + "&project=" + e), $.dialog.open(t, {
                resize: !0,
                fixed: !0,
                ico: core.ico("folder"),
                title: core.pathThis(e),
                width: "80%",
                height: "70%"
            })
        }, setSkin_finished: function () {
            var e = $(".setSkin_finished").attr("src");
            e && ($("#link_css_list").attr("href", e), $(".setSkin_finished").remove())
        }, setSkin: function (e, t) {
            var a = G.static_path + "style/skin/" + e + t;
            $("body").append('<img src="' + a + '" onload="core.setSkin_finished();" onerror="core.setSkin_finished();" class="setSkin_finished">')
        }, editorFull: function () {
            var e = $("iframe[name=OpenopenEditor]");
            e.toggleClass("frame_fullscreen")
        }, language: function (e) {
            Cookie.set("kod_user_language", e, 8760), window.location.reload()
        }, tips: {
            topHeight: function () {
                return "undefined" != typeof Global && Global.topbar_height ? Global.topbar_height : 0
            }, loading: function (e) {
                Tips.loading(e, "info", core.tips.topHeight())
            }, close: function (e, t) {
                "object" == typeof e ? Tips.close(e.data, e.code, core.tips.topHeight()) : Tips.close(e, t, core.tips.topHeight())
            }, tips: function (e, t) {
                "object" == typeof e ? Tips.tips(e.data, e.code, core.tips.topHeight()) : Tips.tips(e, t, core.tips.topHeight())
            }
        }, fullScreen: function () {
            "true" == $("body").attr("fullScreen") && core.exitfullScreen(), $("body").attr("fullScreen", "true");
            var e = document.documentElement;
            e.requestFullscreen ? e.requestFullscreen() : e.mozRequestFullScreen ? e.mozRequestFullScreen() : e.webkitRequestFullScreen && e.webkitRequestFullScreen()
        }, exitfullScreen: function () {
            $("body").attr("fullScreen", "false"), document.exitFullscreen ? document.exitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitCancelFullScreen && document.webkitCancelFullScreen()
        }, createFlash: function (e, t, a) {
            var i = '<object type="application/x-shockwave-flash" id="' + a + '" data="' + e + '" width="100%" height="100%">' + '<param name="movie" value="' + e + '"/>' + '<param name="allowfullscreen" value="true" />' + '<param name="allowscriptaccess" value="always" />' + '<param name="flashvars" value="' + t + '" />' + '<param name="wmode" value="transparent" />' + "</object>";
            return i
        }, search: function (e, t) {
            var a, i, n = require("../tpl/search.html"), o = require("../tpl/search_list.html"), s = function () {
                var o = template.compile(n);
                0 == $(".dialog_do_search").length ? (l(), i = {
                    search: e,
                    path: t,
                    is_content: void 0,
                    is_case: void 0,
                    ext: "",
                    LNG: LNG
                }, a = $.dialog({
                    id: "dialog_do_search",
                    padding: 0,
                    fixed: !0,
                    ico: core.ico("search"),
                    resize: !0,
                    title: LNG.search,
                    width: 450,
                    content: o(i)
                }), c(i), $("#search_ext").tooltip({
                    placement: "bottom",
                    html: !0
                }), $("#search_path").tooltip({
                    placement: "bottom", html: !0, title: function () {
                        return $("#search_path").val()
                    }
                })) : ($("#search_value").val(e), $("#search_path").val(t), r(), $.dialog.list.dialog_do_search.display(!0))
            }, r = function () {
                i = {
                    search: $("#search_value").val(),
                    path: $("#search_path").val(),
                    is_content: $("#search_is_content").attr("checked"),
                    is_case: $("#search_is_case").attr("checked"),
                    ext: $("#search_ext").val()
                }, c(i)
            }, l = function () {
                $("#search_value").die("keyup").live("keyup", function () {
                    ui.path.setSearchByStr($(this).val())
                }), $("#search_value,#search_ext,#search_path").keyEnter(r), $(".search_header a.button").die("click").live("click", r), $(".search_result .list .name").die("click").live("click", function () {
                    var e = $(this).find("a").html(), t = $(this).parent().find(".path a").html() + e;
                    $(this).parent().hasClass("file") ? ui.pathOpen.open(t) : "explorer" == Config.pageApp ? ui.path.list(t + "/", "tips") : core.explorer(t + "/")
                }), $(".search_result .list .path a").die("click").live("click", function () {
                    var e = $(this).html();
                    "explorer" == Config.pageApp ? ui.path.list(e, "tips") : core.explorer(e)
                })
            }, c = function (e) {
                var t = 150;
                $("#search_value").focus(), $(".search_result .list").remove();
                var a = $(".search_result .message td");
                if (!e.search || !e.path)return a.hide().html(LNG.search_info).fadeIn(t), void 0;
                if (1 >= e.search.length)return a.hide().html("too short!").fadeIn(t), void 0;
                var i = "vis.go?explorer/search";
                G.share_page !== void 0 && (i = "vis.go?share/search&user=" + G.user + "&sid=" + G.sid), $.ajax({
                    url: i,
                    dataType: "json",
                    type: "POST",
                    data: e,
                    beforeSend: function () {
                        a.hide().html(LNG.searching + '<img src="' + G.static_path + 'images/loading.gif">').fadeIn(t)
                    },
                    error: core.ajaxError,
                    success: function (e) {
                        if (!e.code)return a.hide().html(e.data).fadeIn(t), void 0;
                        if (0 == e.data.filelist.length && 0 == e.data.folderlist.length)return a.hide().html(LNG.search_null).fadeIn(t), void 0;
                        a.hide();
                        var i = template.compile(o);
                        e.data.LNG = LNG, $(i(e.data)).insertAfter(".search_result .message").fadeIn(t)
                    }
                })
            };
            s()
        }, server_dwonload: function (e) {
            core.upload_check("explorer:serverDownload");
            var t = $(".download_box"), a = t.find("#download_list"), i = t.find("input").val();
            if (t.find("input").val(""), !i || "http" != i.substr(0, 4))return core.tips.tips("url false!", !1), void 0;
            var n = UUID(), o = '<div id="' + n + '" class="item">' + '<div class="info"><span class="title" tytle="' + i + '">' + core.pathThis(i) + "</span>" + '<span class="size">0b</span>' + '<span class="state">' + LNG.upload_ready + "</span>" + '<a class="remove font-icon icon-remove" href="javascript:void(0)"></a>' + '<div style="clear:both"></div></div></div>';
            a.find(".item").length > 0 ? $(o).insertBefore(a.find(".item:eq(0)")) : a.append(o);
            var s, r, l, c = 0, d = $("#" + n), p = $("#" + n + " .state").text(LNG.download_ready), u = $('<div class="progress progress-striped active"><div class="progress-bar" role="progressbar" style="width: 0%;text-align:right;"></div></div>').appendTo("#" + n).find(".progress-bar");
            $("#" + n + " .remove").bind("click", function () {
                clearInterval(s), s = !1, clearTimeout(r), s = !1, $.get("./vis.go?explorer/serverDownload&type=remove&uuid=" + n), $(this).parent().parent().slideUp(function () {
                    $(this).remove(), ui.f5()
                })
            }), $.ajax({
                url: "./vis.go?explorer/serverDownload&type=download&save_path=" + e + "&url=" + urlEncode2(i) + "&uuid=" + n,
                dataType: "json",
                error: function (e, t, a) {
                    core.ajaxError(e, t, a), clearInterval(s), s = !1, clearTimeout(r), s = !1, u.parent().remove(), p.addClass("error").text(LNG.download_error)
                },
                success: function (e) {
                    clearInterval(s), s = !1, clearTimeout(r), s = !1, e.code ? (ui.f5_callback(function () {
                        ui.path.setSelectByFilename(e.info)
                    }), p.text(LNG.download_success), $("#" + n + " .info .title").html(e.info)) : p.addClass("error").text(LNG.error), u.parent().remove()
                }
            });
            var h = function () {
                $.ajax({
                    url: "./vis.go?explorer/serverDownload&type=percent&uuid=" + n,
                    dataType: "json",
                    success: function (e) {
                        var t = "", a = e.data;
                        if (s) {
                            if (!e.code)return p.text(LNG.loading), void 0;
                            if (a) {
                                if (a.size = parseFloat(a.size), a.time = parseFloat(a.time), l) {
                                    var i = (a.size - l.size) / (a.time - l.time);
                                    if (c > .2 * i) {
                                        var n = c;
                                        c = i, i = n
                                    } else c = i;
                                    t = core.file_size(i) + "/s"
                                }
                                if (0 == a.length)d.find(".progress-bar").css("width", "100%").text(LNG.loading); else {
                                    var o = 100 * (a.size / a.length);
                                    d.find(".progress-bar").css("width", o + "%"), p.text(parseInt(o) + "%(" + t + ")")
                                }
                                d.find(".size").text(core.file_size(a.length)), l = a
                            }
                        }
                    }
                })
            };
            r = setTimeout(function () {
                h(), s = setInterval(function () {
                    h()
                }, 1e3)
            }, 100)
        }, file_size: function (e) {
            if (0 == e)return "0B";
            e = parseFloat(e);
            var t = {GB: 1073741824, MB: 1048576, KB: 1024, "B ": 0};
            for (var a in t)if (e >= t[a])return (e / t[a]).toFixed(1) + a;
            return "0B"
        }, upload_check: function (e) {
            return void 0 == e && (e = "explorer:fileUpload"), !G.is_root && AUTH.hasOwnProperty(e) && 1 != AUTH[e] ? (core.tips.tips(LNG.no_permission, !1), void 0) : "*recycle*/" == G.this_path || "*share*/" == G.this_path || "*share*/" == G.this_path || G.json_data && "writeable" != G.json_data.path_type ? (core.tips.tips(LNG.no_permission_write, !1), !1) : !0
        }, upload: function () {
            G.upload_path = G.this_path;
            var e = urlDecode(G.upload_path);
            if (uploader.option("server", "vis.go?explorer/fileUpload&path=" + urlEncode(G.upload_path)), 30 >= e.length ? e : "..." + e.substr(e.length - 30), 0 != $(".dialog_file_upload").length)return $.dialog.list.dialog_file_upload.display(!0), void 0;
            var t = require("../tpl/upload.html"), a = template.compile(t), i = WebUploader.Base.formatSize(G.upload_max);
            $.dialog({
                padding: 5,
                resize: !0,
                ico: core.ico("up"),
                id: "dialog_file_upload",
                fixed: !0,
                title: LNG.upload_muti,
                content: a({LNG: LNG, maxsize: i}),
                close: function () {
                    $.each(uploader.getFiles(), function (e, t) {
                        uploader.skipFile(t), uploader.removeFile(t)
                    }), $.each($("#download_list .item"), function () {
                        $(this).find(".remove").click()
                    })
                }
            }), $(".file_upload .tips").tooltip({placement: "bottom"}), $(".file_upload .top_nav a.menu").unbind("click").bind("click", function () {
                $(this).hasClass("tab_upload") ? ($(".file_upload .tab_upload").addClass("this"), $(".file_upload .tab_download").removeClass("this"), $(".file_upload .upload_box").removeClass("hidden"), $(".file_upload .download_box").addClass("hidden")) : ($(".file_upload .tab_upload").removeClass("this"), $(".file_upload .tab_download").addClass("this"), $(".file_upload .upload_box").addClass("hidden"), $(".file_upload .download_box").removeClass("hidden"))
            }), $(".file_upload .download_box button").unbind("click").bind("click", function () {
                core.server_dwonload(G.upload_path)
            }), uploader.addButton({id: "#picker"})
        }, upload_init: function () {
            var e = "#thelist", t = !0;
            $.browser.msie && (t = !1);
            var a = 10485760;
            a >= G.upload_max && (a = .5 * G.upload_max), uploader = WebUploader.create({
                swf: G.static_path + "js/lib/webuploader/Uploader.swf",
                dnd: "body",
                threads: 2,
                compress: !1,
                resize: !1,
                prepareNextFile: !0,
                duplicate: !0,
                chunked: t,
                chunkRetry: 3,
                chunkSize: a
            }), $("#uploader .success").die("click").live("click", function () {
                var e = $(this).find("span.title").attr("title");
                "explorer" == Config.pageApp ? ui.path.list(core.pathFather(e), "tips", function () {
                    ui.path.setSelectByFilename(core.pathThis(e))
                }) : core.explorer(core.pathFather(e))
            }), $("#uploader .open").die("click").live("click", function (e) {
                var t = $(this).find("span.title").attr("title");
                ui.pathOpen.open(t), stopPP(e)
            }), $(".upload_box_clear").die("click").live("click", function () {
                $("#thelist .item.success,#thelist .item.error").each(function () {
                    $(this).slideUp(300, function () {
                        $(this).remove()
                    })
                })
            }), $(".upload_box_setting").die("click").live("click", function () {
                $(".upload_box_config").toggleClass("hidden")
            }), $("#uploader .remove").die("click").live("click", function (e) {
                var t = $(this).parent().parent().attr("id");
                uploader.skipFile(t), uploader.removeFile(t, !0), $(this).parent().parent().slideUp(function () {
                    $(this).remove()
                }), stopPP(e)
            });
            var i = 0, n = 0, o = "0B/s", s = function (e, t) {
                var a = e.size * t, i = 5;
                e.speed === void 0 ? e.speed = [[time() - 500, 0], [time(), a]] : i >= e.speed.length ? e.speed.push([time(), a]) : (e.speed = e.speed.slice(1, i), e.speed.push([time(), a]));
                var n = e.speed[e.speed.length - 1], s = e.speed[0], r = (n[1] - s[1]) / ((n[0] - s[0]) / 1e3);
                return r = core.file_size(r) + "/s", o = r, r
            }, r = [];
            uploader.on("uploadBeforeSend", function (e, t) {
                var a = urlEncode(e.file.fullPath);
                (void 0 == a || "undefined" == a) && (a = ""), t.fullPath = a
            }).on("fileQueued", function (t) {
                if (!core.upload_check())return uploader.skipFile(t), uploader.removeFile(t), void 0;
                var a, n = $(e), a = t.fullPath;
                t.finished = !1, (void 0 == a || "undefined" == a) && (a = t.name), i++, $(e).find(".item").length > 0 && (n = $(e).find(".item:eq(0)"));
                var o = '<div id="' + t.id + '" class="item"><div class="info">' + '<span class="title" title="' + G.upload_path + a + '">' + core.pathThis(a) + "</span>" + '<span class="size">' + core.file_size(t.size) + "</span>" + '<span class="state">' + LNG.upload_ready + "</span>" + '<a class="remove font-icon icon-remove" href="javascript:void(0)"></a>' + '<div style="clear:both"></div></div></div>';
                $(e).find(".item").length > 0 ? $(o).insertBefore($(e).find(".item:eq(0)")) : $(e).append(o), uploader.upload()
            }).on("uploadProgress", function (e, t) {
                $(".dialog_file_upload .aui_title").text(LNG.uploading + ": " + n + "/" + i + " (" + o + ")");
                var a = s(e, t), r = $("#" + e.id), l = r.find(".progress .progress-bar");
                l.length || (l = $('<div class="progress progress-striped active"><div class="progress-bar" role="progressbar" style="width: 0%"></div></div>').appendTo(r).find(".progress-bar")), r.find(".state").text(parseInt(100 * t) + "%(" + a + ")"), l.css("width", 100 * t + "%")
            }).on("uploadAccept", function (e, t) {
                e.file.serverData = t;
                try {
                    r.push(core.pathThis(t.info))
                } catch (a) {
                }
            }).on("uploadSuccess", function (e) {
                var t = 36 * $("#" + e.id).index(".item");
                $("#uploader").scrollTop(t), n++;
                var a = e.serverData;
                if (a.code ? ($("#" + e.id).addClass("success"), $("#" + e.id).find(".state").text(a.data), $("#" + e.id).find(".remove").removeClass("icon-remove").addClass("icon-ok").addClass("open").removeClass("remove")) : ($("#" + e.id).addClass("error").find(".state").addClass("error"), $("#" + e.id).find(".state").text(a.data).attr("title", a.data)), uploader.removeFile(e), $("#" + e.id).find(".progress").fadeOut(), !e.fullPath) {
                    var i = r;
                    ui.f5_callback(function () {
                        ui.path.setSelectByFilename(i)
                    })
                }
            }).on("uploadError", function (e, t) {
                n++, $("#" + e.id).find(".progress").fadeOut(), $("#" + e.id).addClass("error").find(".state").addClass("error"), $("#" + e.id).find(".state").text(LNG.upload_error + "(" + t + ")")
            }).on("uploadFinished", function () {
                $(".dialog_file_upload .aui_title").text(LNG.upload_success + ": " + n + "/" + i), i = 0, n = 0, uploader.reset(), "explorer" == Config.pageApp && ui.tree.checkIfChange(G.this_path);
                var e = r;
                ui.f5_callback(function () {
                    ui.path.setSelectByFilename(e), r = []
                })
            }).on("error", function (e) {
                core.tips.tips(e, !1)
            });
            var l;
            inState = !1, dragOver = function () {
                0 == inState && (inState = !0, MaskView.tips(LNG.upload_drag_tips)), l && window.clearTimeout(l)
            }, dragLeave = function (e) {
                stopPP(e), l && window.clearTimeout(l), l = window.setTimeout(function () {
                    inState = !1, MaskView.close()
                }, 100)
            }, dragDrop = function (e) {
                try {
                    if (e = e.originalEvent || e, core.upload_check()) {
                        var t = e.dataTransfer.getData("text/plain");
                        t && "http" == t.substring(0, 4) ? ui.pathOperate.appAddURL(t) : core.upload()
                    }
                    stopPP(e)
                } catch (e) {
                }
                inState && (inState = !1, MaskView.close())
            }
        }
    }
}), define("app/tpl/copyright.html", [], '<div class="copyright_dialog_content">\n	<div class="title">\n		<div class="logo"><i class="icon-cloud"></i>KodExplorer v{{G.version}}</div>\n		<div class=\'info\'>——{{LNG.kod_name_copyright}}</div>\n	</div>\n	<div class="content">\n		<p>{{#LNG.copyright_desc}}</p>\n		<div>{{#LNG.copyright_contact}}</div>\n		<div>{{#LNG.copyright_info}}</div> \n	</div>\n</div>'), define("app/tpl/search.html", [], "<div class='do_search'>\n    <div class='search_header'>\n       <div class='s_br'>\n            <input type='text' id='search_value' value='{{search}}'/><a class='right button icon-search'></a>\n            <div style='float:right'>{{LNG.path}}:<input type='text' id='search_path' value='{{path}}'/></div>\n        </div>\n       <div class='s_br'>\n            <input type='checkbox' id='search_is_case' {{if is_case}}checked='true'{{/if}}/>\n            <label for='search_is_case'>{{LNG.search_uplow}}</label>\n            <input type='checkbox' id='search_is_content' {{if is_content}}checked='true'{{/if}}/>\n            <label for='search_is_content'>{{LNG.search_content}}</label>\n            <div style='float:right'>{{LNG.file_type}}:<input type='text' id='search_ext' value='{{ext}}' title='{{LNG.search_ext_tips}}'/></div>\n        </div>\n    </div>\n    <div class='search_result'>\n        <table border='0' cellspacing='0' cellpadding='0'>\n            <tr class='search_title'>\n               <td class='name'>{{LNG.name}}</td>\n               <td class='type'>{{LNG.type}}</td>\n               <td class='size'>{{LNG.size}}</td>\n               <td class='path'>{{LNG.path}}</td>\n            </tr>\n            <tr class='message'><td colspan='4'></td></tr>\n        </table>\n    </div>\n</div>\n\n"), define("app/tpl/search_list.html", [], "{{each folderlist as v i}}\n    <tr class='list folder' data-path='{{v.path}}{{v.name}}' data-type='folder' data-size='0'>\n        <td class='name'><a href='javascript:void(0);' title='{{LNG.open}}{{v.name}}'>{{v.name}}</a></td>\n        <td class='type'>{{LNG.folder}}</td>\n        <td class='size'>0</td>\n        <td class='path'><a href='javascript:void(0);' title='{{LNG.goto}}{{v.path}}'>{{v.path}}</a></td>\n    </tr>\n{{/each}}\n{{each filelist as v i}}\n<tr class='list file'\n    data-path='{{v.path}}{{v.name}}' \n    data-type='{{v.ext}}' \n    data-size='{{v.size}}'>\n    <td class='name'><a href='javascript:void(0);' title='{{LNG.open}}{{v.name}}'>{{v.name}}</a></td>\n    <td class='type'>{{v.ext}}</td>\n    <td class='size'>{{v.size_friendly}}</td>\n    <td class='path'><a href='javascript:void(0);' title='{{LNG.goto}}{{v.path}}'>{{v.path}}</a></td>\n</tr>\n{{/each}}"), define("app/tpl/upload.html", [], "<div class='file_upload'>\n    <div class='top_nav'>\n       <a href='javascript:void(0);' class='menu this tab_upload'>{{LNG.upload_local}}</a>\n       <a href='javascript:void(0);' class='menu tab_download''>{{LNG.download_from_server}}</a>\n       <div style='clear:both'></div>\n    </div>\n    <div class='upload_box'>\n        <div class='btns'>\n            <div id='picker'>{{LNG.upload_select}}</div>\n            <div class=\"upload_box_tips\">\n            <a href=\"javascript:void(0);\" class=\"upload_box_clear\">{{LNG.upload_clear}}</a> \n            <!-- \n            | <a href=\"javascript:void(0);\" class=\"upload_box_setting\">\n            {{LNG.upload_setting}}<b class=\"caret\"></b></a> \n            -->\n            </div>\n            <div style='clear:both'></div>\n        </div>\n\n        <div class=\"upload_box_config hidden\">\n            <i>{{LNG.upload_tips}}</i>\n            <div class=\"upload_check_box\">\n                <b>{{LNG.upload_exist}}</b>\n                <label><input type=\"radio\" name=\"existing\" value=\"rename\" checked=\"checked\">{{LNG.upload_exist_rename}}</label>\n                <label><input type=\"radio\" name=\"existing\" value=\"replace\">{{LNG.upload_exist_replace}}</label>\n                <label><input type=\"radio\" name=\"existing\" value=\"skip\">{{LNG.upload_exist_skip}}</label>\n            </div>\n        </div>\n        <div id='uploader' class='wu-example'>\n            <div id='thelist' class='uploader-list'></div>\n        </div>\n    </div>\n    <div class='download_box hidden'>\n        <div class='list'>{{LNG.download_address}}<input type='text' name='url'/>\n        <button class='btn btn-default btn-sm' type='button'>{{LNG.download}}</button>\n        </div>\n        <div style='clear:both'></div>\n        <div id='downloader'>\n            <div id='download_list' class='uploader-list'></div>\n        </div>\n    </div>\n</div>"), define("app/common/tree", ["./pathOperate", "./pathOpen", "./CMPlayer"], function (e) {
    var t, a = e("./pathOperate"), i = e("./pathOpen"), n = !1;
    ui.pathOpen = i, ui.pathOperate = a;
    var o, s = function () {
        0 != $("#windowMaskView").length && "block" == $("#windowMaskView").css("display") && inArray(core.filetype.image, d().type) && i.open(d().path, d().type)
    }, r = function () {
        $.ajax({
            url: Config.treeAjaxURL + "&type=init", dataType: "json", error: function () {
                $("#folderList").html('<div style="text-align:center;">' + LNG.system_error + "</div>")
            }, success: function (e) {
                if (!e.code)return $("#folderList").html('<div style="text-align:center;">' + LNG.system_error + "</div>"), void 0;
                var t = e.data;
                $.fn.zTree.init($("#folderList"), c, t), o = $.fn.zTree.getZTreeObj("folderList")
            }
        }), $(".ztree .switch").die("mouseenter").live("mouseenter", function () {
            $(this).addClass("switch_hover")
        }).die("mouseleave").live("mouseleave", function () {
            $(this).removeClass("switch_hover")
        }), "editor" == Config.pageApp && (Mousetrap.bind("up", function (e) {
            l(e, "up")
        }).bind("down", function (e) {
            l(e, "down")
        }).bind("left", function (e) {
            l(e, "left")
        }).bind("right", function (e) {
            l(e, "right")
        }), Mousetrap.bind("enter", function () {
            tree.open()
        }).bind(["del", "command+backspace"], function () {
            tree.remove()
        }).bind("f2", function (e) {
            stopPP(e), tree.rname()
        }).bind(["ctrl+f", "command+f"], function (e) {
            stopPP(e), tree.search()
        }).bind(["ctrl+c", "command+c"], function () {
            tree.copy()
        }).bind(["ctrl+x", "command+x"], function () {
            tree.cute()
        }).bind(["ctrl+v", "command+v"], function () {
            tree.past()
        }).bind("alt+m", function () {
            tree.create("folder")
        }).bind("alt+n", function () {
            tree.create("file")
        }))
    }, l = function (e, t) {
        stopPP(e);
        var a = o.getSelectedNodes()[0];
        if (a) {
            switch (t) {
                case"up":
                    var i = a.getPreNode();
                    if (i) {
                        if (i.open && i.children.length > 0)for (; i.open && i.children && i.children.length >= 1;)i = i.children[i.children.length - 1]
                    } else i = a.getParentNode();
                    o.selectNode(i);
                    break;
                case"down":
                    if (a.open && a.children.length >= 1)i = a.children[0]; else {
                        var n = a, i = n.getNextNode() || n.getParentNode().getNextNode();
                        try {
                            for (; !i;)n = n.getParentNode(), i = n.getNextNode() || n.getParentNode().getNextNode()
                        } catch (e) {
                        }
                    }
                    o.selectNode(i);
                    break;
                case"left":
                    a.isParent ? a.open ? o.expandNode(a, !1) : o.selectNode(a.getParentNode()) : o.selectNode(a.getParentNode());
                    break;
                case"right":
                    a.open ? o.selectNode(a.children[0]) : o.expandNode(a, !0);
                    break;
                default:
            }
            s()
        }
    }, c = {
        async: {
            enable: !0,
            dataType: "json",
            url: Config.treeAjaxURL,
            autoParam: ["ajax_name=name", "ajax_path=path", "this_path"],
            dataFilter: function (e, t, a) {
                return a.code ? a.data : null
            }
        },
        edit: {enable: !0, showRemoveBtn: !1, showRenameBtn: !1, drag: {isCopy: !1, isMove: !1}},
        view: {
            showLine: !1, selectedMulti: !1, dblClickExpand: !1, addDiyDom: function (e, t) {
                var a = Global.treeSpaceWide, i = $("#" + t.tId + "_switch"), n = $("#" + t.tId + "_ico");
                if (i.remove(), n.before(i), "file" == t.type && n.removeClass("button ico_docu").addClass("file " + t.ext), "oexe" == t.ext && n.removeClass("button ico_docu").addClass("file oexe").removeAttr("style"), t.level >= 1) {
                    var o = "<span class='space' style='display: inline-block;width:" + a * t.level + "px'></span>";
                    i.before(o)
                }
                var s = "";
                void 0 != t.menuType ? s = t.menuType : (("file" == t.type || "oexe" == t.ext) && (s = "menuTreeFile"), "folder" == t.type && (s = "menuTreeFolder"));
                var r = LNG.name + ":" + t.name + "\n" + LNG.size + ":" + t.size_friendly + "\n" + LNG.modify_time + ":" + t.mtime;
                "file" != t.type && (r = t.name), i.parent().addClass(s).attr("title", r)
            }
        },
        callback: {
            onClick: function (e, t, a) {
                return o.selectNode(a), o.expandNode(a), "folder" != a.type || "editor" != Config.pageApp ? 0 == a.level ? ("explorer" == Config.pageApp && void 0 != a.this_path && ui.path.list(a.this_path + "/"), !1) : ("editor" == Config.pageApp ? ui.tree.openEditor() : "explorer" == Config.pageApp && ui.tree.open(), void 0) : void 0
            }, beforeRightClick: function (e, t) {
                o.selectNode(t)
            }, beforeAsync: function (e, t) {
                t.ajax_name = urlEncode(t.name), t.ajax_path = urlEncode(t.path)
            }, onAsyncSuccess: function (e, a, i, n) {
                return 0 == n.data.length ? (o.removeChildNodes(i), void 0) : ("function" == typeof t && (t(), t = void 0), void 0)
            }, onRename: function (e, i, n) {
                var s = n.getParentNode();
                if (o.getNodesByParam("name", n.name, s).length > 1)return core.tips.tips(LNG.name_isexists, !1), o.removeNode(n), void 0;
                if (n.create) {
                    var r = n.path + "/" + n.name;
                    "folder" == n.type ? a.newFolder(r, function (e) {
                        e.code && (p(s), t = function () {
                            var e = o.getNodesByParam("name", n.name, s)[0];
                            o.selectNode(e), u()
                        })
                    }) : a.newFile(r, function (e) {
                        e.code && (p(s), t = function () {
                            var e = o.getNodesByParam("name", n.name, s)[0];
                            o.selectNode(e), u()
                        })
                    })
                } else {
                    var l = n.path + n.beforeName, c = n.path + n.name;
                    a.rname(l, c, function (e) {
                        e.code && (p(s), t = function () {
                            var e = o.getNodesByParam("name", n.name, s)[0];
                            o.selectNode(e), u()
                        })
                    })
                }
            }, beforeDrag: function (e, t) {
                for (var a = 0, i = t.length; i > a; a++)if (t[a].drag === !1)return !1;
                return !0
            }, beforeDrop: function (e, t, a) {
                return a ? a.drop !== !1 : !0
            }, onDrop: function (e, t, i, n) {
                var o = "", s = "", r = i[0];
                (r.father || r.this_path) && (o = r.father + urlEncode(r.name), s = n.father + urlEncode(n.name), a.cuteDrag([{
                    path: o,
                    type: r.type
                }], s, function () {
                    p(r)
                }))
            }
        }
    }, d = function (e) {
        if (o) {
            var t = o.getSelectedNodes()[0], a = "", i = "";
            return t ? (t.father ? a = t.father + t.name : t.this_path ? a = t.this_path : "" != t.path ? a = t.path + t.name : "" == t.path && (a = "/" + t.name), i = t.ext, ("_null_" == i || void 0 == i) && (i = "folder"), "file" == i && (i = t.ext), e ? [{
                path: a,
                type: i,
                node: t
            }] : {path: a, type: i, node: t}) : {path: "", type: ""}
        }
    }, p = function (e) {
        if (void 0 == e && (e = o.getSelectedNodes()[0]), !e.isParent) {
            if (e = e.getParentNode(), !e)return ui.tree.init(), void 0;
            if (e && "menuTreeFavRoot" == e.menuType)return
        }
        return "lib" == e.iconSkin ? (ui.tree.init(), void 0) : (o.reAsyncChildNodes(e, "refresh"), void 0)
    }, u = function () {
        "explorer" == Config.pageApp && ui.f5()
    };
    return {
        pathOpen: i, init: r, refresh: p, openEditor: function () {
            i.openEditor(d().path)
        }, openIE: function () {
            i.openIE(d().path)
        }, share: function () {
            a.share(d())
        }, download: function () {
            "folder" == d().type ? a.zipDownload(d(!0)) : i.download(d().path)
        }, open: function () {
            if (!($(".dialog_path_remove").length >= 1)) {
                var e = d();
                "oexe" == e.type && (e.path = e.node), i.open(e.path, e.type)
            }
        }, fav: function () {
            a.fav(d().path)
        }, search: function () {
            core.search("", d().path)
        }, appEdit: function () {
            var e = d(), t = e.node;
            t.path = e.path, a.appEdit(t, function () {
                p(e.node.getParentNode())
            })
        }, info: function () {
            a.info(d(!0))
        }, copy: function () {
            a.copy(d(!0))
        }, cute: function () {
            a.cute(d(!0))
        }, fav_remove: function () {
            $.dialog({
                id: "dialog_fav_remove",
                fixed: !0,
                icon: "question",
                title: LNG.fav_remove,
                width: 250,
                padding: 40,
                content: LNG.fav_remove + "?",
                ok: function () {
                    $.ajax({
                        url: "vis.go?fav/del&name=" + d().node.name,
                        dataType: "json",
                        async: !1,
                        success: function (e) {
                            core.tips.tips(e), ui.tree.init()
                        }
                    })
                },
                cancel: !0
            })
        }, past: function () {
            var e = d();
            e.node.isParent || (e.node = e.node.getParentNode()), a.past(e.path, function () {
                u(), p(e.node)
            })
        }, clone: function () {
            var e = d();
            e.node.isParent || (e.node = e.node.getParentNode()), a.copyDrag(d(!0), core.pathFather(e.path), function () {
                u(), p(e.node)
            })
        }, remove: function () {
            var e = d(!0), t = e[0].node.getParentNode();
            a.remove(e, function () {
                u(), p(t)
            })
        }, checkIfChange: function (e) {
            n || (n = !0, o && (o.getNodesByFilter(function (t) {
                var a;
                return t.this_path ? a = t.this_path : "" != t.path && (a = t.path + t.name), a == e || a + "/" == e || "/" + t.name + "/" == e ? (p(t), !0) : !1
            }, !0), setTimeout(function () {
                n = !1
            }, 1e3)))
        }, explorer: function () {
            var e = d().path;
            e || (e = G.this_path), core.explorer(d().path)
        }, openProject: function () {
            var e = d().path;
            e || (e = G.this_path), core.explorerCode(e)
        }, fileBox: function (e) {
            e = "save_file", e = "save_folder", e = "select_", $(".header-left").css("width", 110).next().css("left", 150), $(".frame-left").width("width", 142), $.dialog.open("?/explorer&plague=" + e, {
                resize: !0,
                fixed: !0,
                title: "另存为",
                width: 750,
                height: 420
            })
        }, create: function (e) {
            var t = o.getSelectedNodes();
            if (0 >= t.length) {
                var a = o.getNodeByParam("ext", "__root__", null);
                o.selectNode(a)
            }
            var i = d(), n = i.node, s = n.getParentNode(), r = "newfile", l = 0, c = LNG.newfolder;
            if ("folder" == e) {
                for (; o.getNodesByParam("name", c + "(" + l + ")", s).length > 0;)l++;
                newNode = {name: c + "(" + l + ")", ext: "", type: "folder", create: !0, path: i.path}
            } else {
                for (var p = e; o.getNodesByParam("name", r + "(" + l + ")." + p, s).length > 0;)l++;
                newNode = {name: r + "(" + l + ")." + p, ext: p, type: "file", create: !0, path: i.path}
            }
            if (void 0 != n.children) {
                var u = o.addNodes(n, newNode)[0];
                o.editName(u)
            } else {
                "folder" != n.type && (n = n.getParentNode());
                var u = o.addNodes(n, newNode)[0];
                o.editName(u)
            }
        }, show_file: function () {
            var e = "./vis.go?share/file&sid=" + G.sid + "&user=" + G.user + "&path=" + d().path;
            window.open(e)
        }, rname: function () {
            var e = o.getSelectedNodes()[0];
            o.editName(e), e.beforeName = e.name
        }
    }
}), define("app/common/pathOperate", [], function (e) {
    var t = {};
    t.file_info = e("../tpl/fileinfo/file_info.html"), t.path_info = e("../tpl/fileinfo/path_info.html"), t.path_info_more = e("../tpl/fileinfo/path_info_more.html");
    var a = ["/", "\\", ":", "*", "?", '"', "<", ">", "|"], i = function (e) {
        var t = function (e, t) {
            for (var a = t.length, i = 0; a > i; i++)if (e.indexOf(t[i]) > 0)return !0;
            return !1
        };
        return t(e, a) ? (core.tips.tips(LNG.path_not_allow + ':/  : * ? " < > |', !1), !1) : !0
    }, n = function (e) {
        for (var t = "list=[", a = 0; e.length > a; a++)t += '{"type":"' + e[a].type + '","path":"' + urlEncode2(e[a].path) + '"}', e.length - 1 > a && (t += ",");
        return t + "]"
    }, o = function (e, t) {
        if (e) {
            var a = core.pathThis(e);
            return i(a) ? ($.ajax({
                dataType: "json",
                url: "vis.go?explorer/mkfile&path=" + urlEncode2(e),
                beforeSend: function () {
                    core.tips.loading()
                },
                error: core.ajaxError,
                success: function (e) {
                    core.tips.close(e), "function" == typeof t && t(e)
                }
            }), void 0) : ("function" == typeof t && t(), void 0)
        }
    }, s = function (e, t) {
        if (e) {
            var a = core.pathThis(e);
            return i(a) ? ($.ajax({
                dataType: "json",
                url: "vis.go?explorer/mkdir&path=" + urlEncode2(e),
                beforeSend: function () {
                    core.tips.loading()
                },
                error: core.ajaxError,
                success: function (e) {
                    core.tips.close(e), "function" == typeof t && t(e)
                }
            }), void 0) : ("function" == typeof t && t(), void 0)
        }
    }, r = function (e, t, a) {
        return e && t && e != t ? i(core.pathThis(t)) ? ($.ajax({
            type: "POST",
            dataType: "json",
            url: "vis.go?explorer/pathRname",
            data: "path=" + urlEncode(e) + "&rname_to=" + urlEncode(t),
            beforeSend: function () {
                core.tips.loading()
            },
            error: core.ajaxError,
            success: function (e) {
                core.tips.close(e), "function" == typeof a && a(e)
            }
        }), void 0) : ("function" == typeof a && a(), void 0) : void 0
    }, l = function (e, t) {
        if (!(1 > e.length)) {
            var a = e[0].path, i = LNG.remove_title, o = a + "<br/><br/>" + LNG.remove_info, s = "vis.go?explorer/pathDelete";
            "*recycle*/" == G.this_path && (o = LNG.recycle_remove + "?", s = "vis.go?explorer/pathDeleteRecycle", i = LNG.recycle_remove), "share" == e[0].type && (o = LNG.share_remove_tips, s = "vis.go?userShare/del", i = LNG.share_remove), e.length > 1 && (o += ' ... <span class="badge">' + e.length + "</span>"), $.dialog({
                id: "dialog_path_remove",
                fixed: !0,
                icon: "question",
                title: i,
                padding: 20,
                width: 200,
                lock: !0,
                background: "#000",
                opacity: .3,
                content: o,
                ok: function () {
                    $.ajax({
                        url: s, type: "POST", dataType: "json", data: n(e), beforeSend: function () {
                            core.tips.loading()
                        }, error: core.ajaxError, success: function (a) {
                            if (core.tips.close(a), FrameCall.father("ui.f5", ""), "share" == e[0].type) {
                                var i = art.dialog.list.share_dialog;
                                void 0 != i && i.close()
                            }
                            "function" == typeof t && t(a)
                        }
                    })
                },
                cancel: !0
            })
        }
    }, c = function (e) {
        1 > e.length || $.ajax({
            url: "vis.go?explorer/pathCopy",
            type: "POST",
            dataType: "json",
            data: n(e),
            error: core.ajaxError,
            success: function (e) {
                core.tips.tips(e)
            }
        })
    }, d = function (e) {
        var t = e.path, a = "folder" == e.type ? "folder" : "file";
        1 > t.length || core.authCheck("userShare:set") && $.ajax({
            url: "./vis.go?userShare/checkByPath&path=" + urlEncode(t),
            dataType: "json",
            success: function (e) {
                e.code ? p(e.data) : p(void 0, function () {
                    $(".content_info input[name=type]").val(a), $(".content_info input[name=path]").val(t), $(".content_info input[name=name]").val(core.pathThis(t)), "file" == a && $(".label_code_read").addClass("hidden")
                })
            }
        })
    }, p = function (t, a) {
        0 != $(".share_dialog").length && $(".share_dialog").shake(2, 5, 100), seajs.use("lib/jquery.datetimepicker/jquery.datetimepicker.css"), e.async("lib/jquery.datetimepicker/jquery.datetimepicker", function () {
            u(t), void 0 != a && a()
        })
    }, u = function (t) {
        var a = e("../tpl/share.html"), i = template.compile(a), n = i({LNG: LNG});
        $.dialog({
            id: "share_dialog",
            simple: !0,
            resize: !1,
            width: 425,
            title: LNG.share,
            padding: "0",
            fixed: !0,
            content: n,
            cancel: function () {
            }
        });
        var o = "zh_CN" == G.lang ? "ch" : "en";
        $("#share_time").datetimepicker({
            format: "Y/m/d",
            formatDate: "Y/m/d",
            timepicker: !1,
            lang: o
        }), $("#share_time").unbind("blur").bind("blur", function (e) {
            stopPP(e)
        });
        var s = function (e) {
            if ($(".share_setting_more").addClass("hidden"), void 0 == e)$(".share_has_url").addClass("hidden"), $(".share_action .share_remove_button").addClass("hidden"), $(".content_info input[name=sid]").val(""), $(".content_info input[name=type]").val(""), $(".content_info input[name=name]").val(""), $(".content_info input[name=path]").val(""), $(".content_info input[name=time_to]").val(""), $(".content_info input[name=share_password]").val(""), $(".share_view_info").addClass("hidden"); else {
                t = e, $(".content_info input[name=sid]").val(e.sid), $(".content_info input[name=type]").val(e.type), $(".content_info input[name=name]").val(e.name), $(".content_info input[name=path]").val(e.path), $(".content_info input[name=time_to]").val(e.time_to), $(".content_info input[name=share_password]").val(e.share_password), $(".share_view_info").removeClass("hidden"), e.num_download === void 0 && (e.num_download = 0), e.num_view === void 0 && (e.num_view = 0);
                var a = LNG.share_view_num + e.num_view + "  " + LNG.share_download_num + e.num_download;
                $(".share_view_info").html(a), "1" == e.code_read ? $(".content_info input[name=code_read]").attr("checked", "checked") : $(".content_info input[name=code_read]").removeAttr("checked"), "1" == e.not_download ? $(".content_info input[name=not_download]").attr("checked", "checked") : $(".content_info input[name=not_download]").removeAttr("checked"), $(".share_has_url").removeClass("hidden"), "file" == e.type ? $(".label_code_read").addClass("hidden") : $(".label_code_read").removeClass("hidden");
                var i = e.type;
                "folder" == e.type && (i = 1 == e.code_read ? "code_read" : "folder");
                var n = G.app_host + "vis.go?share/" + i + "&user=" + G.user_name + "&sid=" + e.sid;
                $(".content_info .share_url").val(n), ("" != e.time_to || "" != e.share_password || "1" == e.code_read || "1" == e.not_download) && $(".share_setting_more").removeClass("hidden"), $(".share_remove_button").removeClass("hidden"), $(".share_create_button").text(LNG.share_save), jiathis_config = {
                    url: n,
                    summary: e.name,
                    title: "share to ##",
                    shortUrl: !1,
                    hideMore: !1
                }
            }
        }, r = function () {
            $(".share_action .share_remove_button").unbind("click").click(function () {
                ui.pathOperate.remove([{type: "share", path: t.sid}]), "*share*/" == G.this_path && ui.f5()
            }), $(".content_info .share_more").unbind("click").click(function () {
                $(".share_setting_more").toggleClass("hidden")
            }), $(".share_action .share_create_button").unbind("click").click(function () {
                var e = "";
                $(".share_dialog .content_info input[name]").each(function () {
                    var t = urlEncode($(this).val());
                    "checkbox" == $(this).attr("type") && (t = $(this).attr("checked") ? "1" : ""), e += "&" + $(this).attr("name") + "=" + t
                }), $.ajax({
                    url: "vis.go?userShare/set",
                    data: e,
                    type: "POST",
                    dataType: "json",
                    beforeSend: function () {
                        $(".share_create_button").addClass("disabled")
                    },
                    error: function () {
                        core.tips.tips(LNG.error, !1)
                    },
                    success: function (e) {
                        $(".share_create_button").removeClass("disabled"), e.code ? (s(e.data), $(".share_create_button").text(LNG.share_save), "*share*/" == G.this_path && ui.f5(), core.tips.tips(LNG.success, !0)) : core.tips.tips(e)
                    }
                })
            }), $(".content_info .open_window").unbind("click").bind("click", function () {
                window.open($("input.share_url").val())
            });
            var e = $("input.share_url"), a = e.get(0);
            e.unbind("hover click").bind("hover click", function () {
                $(this).focus();
                var t = e.val().length;
                if (Global.isIE) {
                    var i = a.createTextRange();
                    i.moveEnd("character", -a.value.length), i.moveEnd("character", t), i.moveStart("character", 0), i.select()
                } else a.setSelectionRange(0, t)
            })
        };
        s(t), r()
    }, h = function (e) {
        if (!(1 > e.length)) {
            var t = core.path2url(e);
            FrameCall.father("ui.setWall", '"' + t + '"'), $.ajax({
                url: "vis.go?setting/set&k=wall&v=" + urlEncode(t),
                type: "json",
                success: function (e) {
                    core.tips.tips(e)
                }
            })
        }
    }, f = function (e, t, a) {
        if (!(1 > e.length)) {
            var i, n = core.pathThis(e), o = core.pathFather(e);
            i = "folder" == t ? "ui.path.list('" + urlEncode(e) + "');" : "ui.path.open('" + urlEncode(e) + "');";
            var s = urlEncode2(o + n + ".oexe");
            $.ajax({
                url: "./vis.go?explorer/mkfile&path=" + s,
                type: "POST",
                dataType: "json",
                data: 'content={"type":"app_link","content":"' + i + '","icon":"app_s2.png"}',
                success: function (e) {
                    e.code && "function" == typeof a && a(e)
                }
            })
        }
    }, m = function (e, t) {
        if (!(1 > e.length)) {
            var a = core.pathThis(e), i = core.pathFather(e);
            jsrun = "core.explorerCode('" + urlEncode(e) + "');";
            var n = urlEncode2(i + a + "_project.oexe");
            $.ajax({
                url: "./vis.go?explorer/mkfile&path=" + n,
                type: "POST",
                dataType: "json",
                data: 'content={"type":"app_link","content":"' + jsrun + '","icon":"app_s2.png"}',
                success: function (e) {
                    e.code && "function" == typeof t && t(e)
                }
            })
        }
    }, v = function (e) {
        1 > e.length || $.ajax({
            url: "vis.go?explorer/pathCute",
            type: "POST",
            dataType: "json",
            data: n(e),
            error: core.ajaxError,
            success: function (e) {
                core.tips.tips(e)
            }
        })
    }, _ = function (e, t) {
        if (e) {
            var a = "vis.go?explorer/pathPast&path=" + urlEncode2(e);
            $.ajax({
                url: a, dataType: "json", beforeSend: function () {
                    core.tips.loading(LNG.moving)
                }, error: core.ajaxError, success: function (e) {
                    core.tips.close(e), "function" == typeof t && t(e.info)
                }
            })
        }
    }, g = function (e) {
        1 > e.length && (e = [{path: G.this_path, type: "folder"}]);
        var a = "vis.go?explorer/pathInfo";
        G.share_page !== void 0 && (a = "vis.go?share/pathInfo&user=" + G.user + "&sid=" + G.sid), $.ajax({
            url: a,
            type: "POST",
            dataType: "json",
            data: n(e),
            beforeSend: function () {
                core.tips.loading(LNG.getting)
            },
            error: core.ajaxError,
            success: function (a) {
                if (!a.code)return core.tips.close(a), void 0;
                core.tips.close(LNG.get_success, !0);
                var i = "path_info_more", n = LNG.info;
                1 == e.length && (i = "folder" == e[0].type ? "path_info" : "file_info", n = core.pathThis(e[0].path), n.length > 15 && (n = n.substr(0, 15) + "...  " + LNG.info));
                var o = template.compile(t[i]), s = UUID();
                a.data.LNG = LNG, a.data.atime = date(LNG.time_type_info, a.data.atime), a.data.ctime = date(LNG.time_type_info, a.data.ctime), a.data.mtime = date(LNG.time_type_info, a.data.mtime), $.dialog({
                    id: s,
                    padding: 5,
                    ico: core.ico("info"),
                    fixed: !0,
                    title: n,
                    content: o(a.data),
                    cancel: !0
                }), b(s, e)
            }
        })
    }, b = function (e, t) {
        var a = $("." + e);
        a.find(".open_window").bind("click", function () {
            window.open(a.find("input.download_url").val())
        });
        var i = a.find("input.download_url"), o = i.get(0);
        i.unbind("hover click").bind("hover click", function () {
            $(this).focus();
            var e = i.val().length;
            if (Global.isIE) {
                var t = o.createTextRange();
                t.moveEnd("character", -o.value.length), t.moveEnd("character", e), t.moveStart("character", 0), t.select()
            } else o.setSelectionRange(0, e)
        }), a.find(".edit_chmod").click(function () {
            var e = $(this).parent().find("input"), a = $(this);
            $.ajax({
                url: "vis.go?explorer/pathChmod&mod=" + e.val(), type: "POST", data: n(t), beforeSend: function () {
                    a.text(LNG.loading)
                }, error: function () {
                    a.text(LNG.button_save)
                }, success: function (e) {
                    a.text(e.data).animate({opacity: .6}, 400, 0).delay(1e3).animate({opacity: 1}, 200, 0, function () {
                        a.text(LNG.button_save)
                    })
                }
            })
        })
    }, y = function (e) {
        if (core.authCheck("explorer:fileDownload") && !(1 > e.length)) {
            var t = "vis.go?explorer/zipDownload";
            G.share_page !== void 0 && (t = "vis.go?share/zipDownload&user=" + G.user + "&sid=" + G.sid), $.ajax({
                url: t,
                type: "POST",
                dataType: "json",
                data: n(e),
                beforeSend: function () {
                    core.tips.loading(LNG.zip_download_ready)
                },
                error: core.ajaxError,
                success: function (e) {
                    core.tips.close(e), core.tips.tips(e);
                    var t = "vis.go?explorer/fileDownloadRemove&path=" + urlEncode2(e.info);
                    G.share_page !== void 0 && (t = "vis.go?share/fileDownloadRemove&user=" + G.user + "&sid=" + G.sid + "&path=" + urlEncode2(e.info));
                    var a = '<iframe src="' + t + '" style="width:0px;height:0px;border:0;" frameborder=0></iframe>' + LNG.download_ready + "...", i = $.dialog({
                        icon: "succeed",
                        title: !1,
                        time: 1.5,
                        content: a
                    });
                    i.DOM.wrap.find(".aui_loading").remove()
                }
            })
        }
    }, x = function (e, t) {
        1 > e.length || $.ajax({
            url: "vis.go?explorer/zip",
            type: "POST",
            dataType: "json",
            data: n(e),
            beforeSend: function () {
                core.tips.loading(LNG.ziping)
            },
            error: core.ajaxError,
            success: function (e) {
                core.tips.close(e), core.tips.tips(e), "function" == typeof t && t(e)
            }
        })
    }, w = function (e, t) {
        if (e) {
            var a = "vis.go?explorer/unzip&path=" + urlEncode2(e);
            $.ajax({
                url: a, beforeSend: function () {
                    core.tips.loading(LNG.unziping)
                }, error: core.ajaxError, success: function (e) {
                    core.tips.close(e), "function" == typeof t && t(e)
                }
            })
        }
    }, k = function (e, t, a) {
        t && $.ajax({
            url: "vis.go?explorer/pathCuteDrag",
            type: "POST",
            dataType: "json",
            data: n(e) + "&path=" + urlEncode2(t + "/"),
            beforeSend: function () {
                core.tips.loading(LNG.moving)
            },
            error: core.ajaxError,
            success: function (e) {
                core.tips.close(e), "function" == typeof a && a(e)
            }
        })
    }, N = function (e, t, a, i) {
        t && (void 0 == i && (i = 0), $.ajax({
            url: "vis.go?explorer/pathCopyDrag",
            type: "POST",
            dataType: "json",
            data: n(e) + "&path=" + urlEncode2(t + "/") + "&filename_auto=" + Number(i),
            beforeSend: function () {
                core.tips.loading(LNG.moving)
            },
            error: core.ajaxError,
            success: function (e) {
                core.tips.close(e), "function" == typeof a && a(e)
            }
        }))
    }, L = function () {
        $.ajax({
            url: "vis.go?explorer/clipboard", dataType: "json", error: core.ajaxError, success: function (e) {
                e.code && $.dialog({title: LNG.clipboard, padding: 0, height: 200, width: 400, content: e.data})
            }
        })
    }, C = function (e) {
        if (e) {
            var t = "&name=" + urlEncode(core.pathThis(e)) + "&path=" + urlEncode(e);
            core.setting("fav" + t)
        }
    }, j = function (e) {
        var t = {};
        return t.type = e.find("input[type=radio]:checked").val(), t.content = e.find("textarea").val(), t.group = e.find("[name=group]").val(), e.find("input[type=text]").each(function () {
            var e = $(this).attr("name");
            t[e] = $(this).val()
        }), e.find("input[type=checkbox]").each(function () {
            var e = $(this).attr("name");
            t[e] = "checked" == $(this).attr("checked") ? 1 : 0
        }), t
    }, S = function (e) {
        e.find(".type input").change(function () {
            var t = $(this).attr("apptype");
            e.find("[data-type]").addClass("hidden"), e.find("[data-type=" + t + "]").removeClass("hidden")
        })
    }, T = function (t, a, i) {
        var n, o, s, r = LNG.app_create, l = UUID(), c = e("../tpl/app.html"), d = G.basic_path + "static/images/app/", p = template.compile(c);
        switch (void 0 == i && (i = "user_edit"), "root_edit" == i && (t = t), "user_edit" == i || "root_edit" == i ? (r = LNG.app_edit, s = p({
            LNG: LNG,
            iconPath: d,
            uuid: l,
            data: t
        })) : s = p({LNG: LNG, iconPath: d, uuid: l, data: {}}), $.dialog({
            fixed: !0,
            width: 450,
            id: l,
            padding: 15,
            title: r,
            content: s,
            button: [{
                name: LNG.preview, callback: function () {
                    var e = j(n);
                    return core.openApp(e), !1
                }
            }, {
                name: LNG.button_save, focus: !0, callback: function () {
                    var e = j(n);
                    switch (i) {
                        case"user_add":
                            var s = urlEncode2(G.this_path + e.name);
                            o = "./vis.go?app/user_app&action=add&path=" + s;
                            break;
                        case"user_edit":
                            o = "./vis.go?app/user_app&path=" + urlEncode2(t.path);
                            break;
                        case"root_add":
                            o = "./vis.go?app/add&name=" + e.name;
                            break;
                        case"root_edit":
                            o = "./vis.go?app/edit&name=" + e.name + "&old_name=" + t.name;
                            break;
                        default:
                    }
                    $.ajax({
                        url: o,
                        type: "POST",
                        dataType: "json",
                        data: "data=" + urlEncode2(json_encode(e)),
                        beforeSend: function () {
                            core.tips.loading()
                        },
                        error: core.ajaxError,
                        success: function (e) {
                            if (core.tips.close(e), e.code)if ("root_edit" == i || "root_add" == i) {
                                if (!e.code)return;
                                FrameCall.top("Openapp_store", "App.reload", '""')
                            } else"function" == typeof a ? a() : ui.f5()
                        }
                    })
                }
            }]
        }), n = $("." + l), G.is_root || $(".appbox .appline .right a.open").remove(), t.group && n.find("option").eq(t.group).attr("selected", 1), n.find(".aui_content").css("overflow", "inherit"), i) {
            case"user_edit":
                n.find(".name").addClass("hidden"), n.find(".desc").addClass("hidden"), n.find(".group").addClass("hidden"), n.find("option[value=" + t.group + "]").attr("checked", !0);
                break;
            case"user_add":
                n.find(".desc").addClass("hidden"), n.find(".group").addClass("hidden"), n.find("[apptype=url]").attr("checked", !0), n.find("[data-type=url] input[name=resize]").attr("checked", !0), n.find("input[name=width]").attr("value", "800"), n.find("input[name=height]").attr("value", "600"), n.find("input[name=icon]").attr("value", "oexe.png");
                break;
            case"root_add":
                n.find("[apptype=url]").attr("checked", !0), n.find("[data-type=url] input[name=resize]").attr("checked", !0), n.find("input[name=width]").attr("value", "800"), n.find("input[name=height]").attr("value", "600"), n.find("input[name=icon]").attr("value", "oexe.png");
                break;
            case"root_edit":
                n.find("option[value=" + t.group + "]").attr("selected", !0);
                break;
            default:
        }
        S(n)
    }, E = function () {
        core.appStore()
    }, z = function (e) {
        e && 4 > e.length && "http" != e.substring(0, 4) || $.ajax({
            url: "./vis.go?app/get_url_title&url=" + e,
            dataType: "json",
            beforeSend: function () {
                core.tips.loading()
            },
            success: function (t) {
                var a = t.data;
                core.tips.close(t);
                var i = {
                    content: "window.open('" + e + "');",
                    desc: "",
                    group: "others",
                    type: "app",
                    icon: "internet.png",
                    name: a,
                    resize: 1,
                    simple: 0,
                    height: "",
                    width: ""
                }, n = urlEncode2(G.this_path + a);
                e = "./vis.go?app/user_app&action=add&path=" + n, $.ajax({
                    url: e,
                    type: "POST",
                    dataType: "json",
                    data: "data=" + urlEncode2(json_encode(i)),
                    success: function (e) {
                        core.tips.close(e), e.code && ui.f5()
                    }
                })
            }
        })
    };
    return {
        appEdit: T,
        appList: E,
        appAddURL: z,
        share: d,
        share_box: p,
        setBackground: h,
        createLink: f,
        createProject: m,
        newFile: o,
        newFolder: s,
        rname: r,
        unZip: w,
        zipDownload: y,
        zip: x,
        copy: c,
        cute: v,
        info: g,
        remove: l,
        cuteDrag: k,
        copyDrag: N,
        past: _,
        clipboard: L,
        fav: C
    }
}), define("app/tpl/fileinfo/file_info.html", [], "<div class='pathinfo'>\n    <div class='p'>\n        <div class='icon file_icon'></div>\n        <input type='text' class='info_name' name='filename' value='{{name}}'/>\n        <div style='clear:both'></div>\n    </div>\n    \n    {{if download_path}}\n    <div class='line'></div>\n    <div class='p'>\n        <div class='title'>{{LNG.download_address}}:</div>\n        <div class=\"content input-group\">\n            <input type=\"text\" class=\"download_url\" value='{{download_path}}'>\n            <div class=\"input-group-btn\">\n                <button type=\"button\" class=\"btn btn-default open_window\">{{LNG.open}}</button>\n            </div>\n        </div>\n        <div style='clear:both'></div>\n    </div>\n    {{/if}}\n\n    <div class='line'></div>\n    <div class='p'>\n        <div class='title'>{{LNG.address}}:</div>\n        <div class='content' id='id_fileinfo_path'>{{path}}</div>\n        <div style='clear:both'></div>\n    </div>\n    <div class='p'>\n        <div class='title'>{{LNG.size}}:</div>\n        <div class='content'>{{size_friendly}}  ({{size}} Byte)</div>\n        <div style='clear:both'></div>\n    </div>\n    <div class='line'></div>\n    <div class='p'>\n        <div class='title'>{{LNG.create_time}}</div>\n        <div class='content'>{{ctime}}</div>\n        <div style='clear:both'></div>\n    </div>\n    <div class='p'>\n        <div class='title'>{{LNG.modify_time}}</div>\n        <div class='content'>{{mtime}}</div>\n        <div style='clear:both'></div>\n    </div>\n    <div class='p'>\n        <div class='title'>{{LNG.last_time}}</div>\n        <div class='content'>{{atime}}</div>\n        <div style='clear:both'></div>\n    </div>\n\n    {{if download_path}}\n    <div class='line'></div>\n    <div class='p'>\n        <div class='title'>{{LNG.permission}}:</div>\n        <div class='content'>{{mode}}</div>\n        <div style='clear:both'></div>\n    </div>\n    <div class='p'>\n        <div class='title'>{{LNG.permission_edit}}:</div>\n        <div class='content'><input type='text' class='info_chmod' value='777'/>\n        <button class='btn btn-default btn-sm edit_chmod' type='button'>{{LNG.button_save}}</button></div>\n        <div style='clear:both'></div>\n    </div>\n    {{/if}}\n</div>"), define("app/tpl/fileinfo/path_info.html", [], "<div class='pathinfo'>\n    <div class='p'>\n        <div class='icon folder_icon'></div>\n        <input type='text' class='info_name' name='filename' value='{{name}}'/>\n        <div style='clear:both'></div>\n    </div>\n    <div class='line'></div>\n    <div class='p'>\n        <div class='title'>{{LNG.address}}:</div>\n        <div class='content'>{{path}}</div>\n        <div style='clear:both'></div>\n    </div>\n    <div class='p'>\n        <div class='title'>{{LNG.size}}:</div>\n        <div class='content'>{{size_friendly}}  ({{size}} Byte)</div>\n        <div style='clear:both'></div>\n    </div>\n    <div class='p'>\n        <div class='title'>{{LNG.contain}}:</div> \n        <div class='content'>{{file_num}}  {{LNG.file}},{{folder_num}}  {{LNG.folder}}</div>\n        <div style='clear:both'></div>\n    </div>\n    <div class='line'></div>\n    <div class='p'>\n        <div class='title'>{{LNG.create_time}}</div>\n        <div class='content'>{{ctime}}</div>\n        <div style='clear:both'></div>\n    </div>\n    <div class='p'>\n        <div class='title'>{{LNG.modify_time}}</div>\n        <div class='content'>{{mtime}}</div>\n        <div style='clear:both'></div>\n    </div>\n    <div class='p'>\n        <div class='title'>{{LNG.last_time}}</div>\n        <div class='content'>{{atime}}</div>\n        <div style='clear:both'></div>\n    </div>\n    <div class='line'></div>\n    <div class='p'>\n        <div class='title'>{{LNG.permission}}:</div>\n        <div class='content'>{{mode}}</div>\n        <div style='clear:both'></div>\n    </div>\n    <div class='p'>\n        <div class='title'>{{LNG.permission_edit}}:</div>\n        <div class='content'><input type='text' class='info_chmod' value='777'/>\n        <button class='btn btn-default btn-sm edit_chmod' type='button'>{{LNG.button_save}}</button></div>\n        <div style='clear:both'></div>\n    </div>\n</div>"), define("app/tpl/fileinfo/path_info_more.html", [], "<div class='pathinfo'>\n    <div class='p'>\n        <div class='icon folder_icon'></div>\n        <div class='content' style='line-height:40px;margin-left:40px;'>\n            {{file_num}}  {{LNG.file}},{{folder_num}}  {{LNG.folder}}</div>\n        <div style='clear:both'></div>\n    </div>\n    <div class='line'></div>\n    <div class='p'>\n        <div class='title'>{{LNG.size}}:</div>\n        <div class='content'>{{size_friendly}} ({{size}} Byte)</div>\n        <div style='clear:both'></div>\n    </div>\n    <div class='line'></div>\n    <div class='p'>\n        <div class='title'>{{LNG.permission}}:</div>\n        <div class='content'>{{mode}}</div>\n        <div style='clear:both'></div>\n    </div>\n    <div class='p'>\n        <div class='title'>{{LNG.permission_edit}}:</div>\n        <div class='content'><input type='text' class='info_chmod' value='777'/>\n        <button class='btn btn-default btn-sm edit_chmod' type='button'>{{LNG.button_save}}</button></div>\n        <div style='clear:both'></div>\n    </div>\n</div>"), define("app/tpl/share.html", [], '<div class=\'content_box\'>\n    <div class=\'title\'>\n        <div class="titleinfo">{{LNG.share_title}}</div>\n        <div class="share_view_info"></div>\n    </div>\n    <div class=\'content_info\'>\n\n    	<div class="input_line">\n			<span class="input_title">{{LNG.share_path}}:</span>\n			<input id="share_name" type="text" name="path" value="" />\n			<div style="clear:both"></div>\n		</div>\n		<div class="input_line">\n			<span class="input_title">{{LNG.share_name}}:</span>\n			<input type="hidden" name="sid"/>\n			<input type="hidden" name="type"/>\n			<input id="share_name" type="text" placeholder="{{LNG.share_name}}" name="name"/>\n			\n			<a href="javascript:void(0);" class="share_more">{{LNG.more}}<b class="caret"></b></a>\n			<div style="clear:both"></div>\n		</div>\n\n		<div class="share_setting_more hidden">\n			<div class="input_line">\n				<span class="input_title">{{LNG.share_time}}:</span>\n				<input id="share_time" type="text" placeholder="{{LNG.share_time}}" name="time_to"/>\n				<i>{{LNG.share_time_desc}}</i>\n				<div style="clear:both"></div>\n			</div>\n			<div class="input_line">\n				<span class="input_title">{{LNG.share_password}}:</span>\n				<input type="text" placeholder="{{LNG.share_password}}" name="share_password"/>\n				<i>{{LNG.share_password_desc}}</i>\n				<div style="clear:both"></div>\n			</div>\n			<div class="input_line share_others">\n				<span class="input_title">{{LNG.others}}:</span>\n				<label class="label_code_read">\n					<input type="checkbox" name="code_read" value="">{{LNG.share_code_read}}\n				</label>\n				<label>\n					<input type="checkbox" name="not_download" value="">{{LNG.share_not_download}}\n				</label>\n				<div style="clear:both"></div>\n			</div>\n		</div>\n\n		<div class="input_line share_has_url">\n			<span class="input_title">{{LNG.share_url}}:</span>\n			<div class="input-group">\n	          <input type="text" class="share_url" aria-label="Text input with segmented button dropdown">\n	          <div class="input-group-btn">\n	            <button type="button" class="btn btn-default open_window">{{LNG.open}}</button>\n	          </div>\n	          <!-- <div class="share_jiathis_box"></div> -->\n	        </div>\n	        <div style="clear:both"></div>\n		</div>\n	</div>\n	<div class="share_action">		\n		<button type="button" class="btn btn-primary share_create_button">{{LNG.share_create}}</button>\n		<a type="button" href="javascript:void(0);" class="share_remove_button">{{LNG.share_cancle}}</a>\n	</div>\n</div>'), define("app/tpl/app.html", [], "<div class='appbox'>\n    <div class='appline name'>\n        <div class='left'>{{LNG.name}}</div>\n        <div class='right'><input type='text' name='name' value='{{data.name}}'/></div>\n        <div style='clear:both;'></div>\n    </div>\n    <div class='appline desc'>\n        <div class='left'>{{LNG.app_desc}}</div>\n        <div class='right'><input type='text' name='desc' value='{{data.desc}}'/></div>\n        <div style='clear:both;'></div>\n    </div>\n    <div class='appline icon'>\n        <div class='left'>{{LNG.app_icon}}</div>\n        <div class='right'><input type='text' name='icon' value='{{data.icon}}'/>\n        {{LNG.app_icon_show}}<a href='javascript:core.explorer(\"{{iconPath}}\");' class='button open'><img src='./static/images/app/computer.png'/></a></div>\n        <div style='clear:both;'></div>\n    </div>\n    <div class='appline group'>\n        <div class='left'>{{LNG.app_group}}</div>\n        <div class='right'><select name='group'>\n        <option value ='others'>{{LNG.app_group_others}}</option><option value ='game'>{{LNG.app_group_game}}</option>\n        <option value ='tools'>{{LNG.app_group_tools}}</option><option value ='reader'>{{LNG.app_group_reader}}</option>\n        <option value ='movie'>{{LNG.app_group_movie}}</option><option value ='music'>{{LNG.app_group_music}}</option>\n        </option><option value ='life'>{{LNG.app_group_life}}</option>\n        <select></div>\n        <div style='clear:both;'></div>\n    </div>\n    <div class='appline type'>\n        <div class='left'>{{LNG.app_type}}</div>\n        <div class='right'>\n            <input class='w20' type='radio' id='url{{uuid}}' apptype='url' value='url' name='{{uuid}}type' {{if data.type=='url'}}checked='checked'{{/if}}>\n            <label for='url{{uuid}}'>{{LNG.app_type_url}}</label>\n            <input class='w20' type='radio' id='app{{uuid}}' apptype='app' value='app' name='{{uuid}}type' {{if data.type=='app'}}checked='checked'{{/if}}>\n            <label for='app{{uuid}}'>{{LNG.app_type_code}}</label>\n            <input class='w20' type='radio' id='app_link{{uuid}}' apptype='app_link' value='app_link' name='{{uuid}}type' {{if data.type=='app_link'}}checked='checked'{{/if}}>\n            <label for='app_link{{uuid}}'>{{LNG.app_type_link}}</label>\n        </div>\n        <div style='clear:both;'></div>\n    </div>\n    <div class='appline' data-type='url'>\n        <div class='left'>{{LNG.app_display}}</div>\n        <div class='right'>\n            <input class='w20' type='checkbox' id='simple{{uuid}}' name='simple' {{if data.simple}}checked='true'{{/if}}>\n            <label for='simple{{uuid}}'>{{LNG.app_display_border}}</label>\n            <input class='w20' type='checkbox' id='resize{{uuid}}' name='resize' {{if data.resize}}checked='true'{{/if}}>\n            <label for='resize{{uuid}}'>{{LNG.app_display_size}}</label>\n        </div>\n        <div style='clear:both;'></div>\n    </div>\n    <div class='appline' data-type='url'>\n        <div class='left'>{{LNG.app_size}}</div>\n        <div class='right'>\n            {{LNG.width}}:&nbsp;&nbsp;<input class='w30' type='text' name='width'  value='{{data.width}}'/>\n            {{LNG.height}}:&nbsp;&nbsp;<input class='w30' type='text' name='height' value='{{data.height}}'/>\n        </div>\n        <div style='clear:both;'></div>\n    </div>\n    <div class='appline content'>\n        <div class='left hidden' data-type='app'>{{LNG.app_code}}</div>\n        <div class='left hidden' data-type='app_link'>{{LNG.app_code}}</div>\n        <div class='left' data-type='url'>{{LNG.app_url}}</div>\n        <div class='right'><textarea name='content'>{{data.content}}</textarea></div>\n        <div style='clear:both;'></div>\n    </div>\n</div>"), define("app/common/pathOpen", ["./CMPlayer"], function (e) {
    var t = function (e, t) {
        if (void 0 != e) {
            if (void 0 == t && (t = core.pathExt(e)), t = t.toLowerCase(), "folder" == t)return "explorer" == Config.pageApp ? ui.path.list(e + "/") : core.explorer(e), void 0;
            if (console.log(e), "oexe" != t) {
                if (core.authCheck("explorer:fileDownload", LNG.no_permission_download)) {
                    if ("swf" == t) {
                        var n = core.path2url(e);
                        return o(n, core.ico("swf"), core.pathThis(e)), void 0
                    }
                    if ("pdf" == t) {
                        if (Config.isIE)return i(e), void 0;
                        var c = "pdf" + UUID(), n = core.path2url(e), d = '<div id="' + c + '" style="height:100%;">			<a href="' + n + '" target="_blank" style="display:block;margin:0 auto;margin-top:80px;font-size:16px;text-align:center;">' + LNG.error + "   " + LNG.download + " PDF</a></div>";
                        return $.dialog({
                            resize: !0,
                            fixed: !0,
                            ico: core.ico("pdf"),
                            title: core.pathThis(e),
                            width: 800,
                            height: 400,
                            padding: 0,
                            content: d
                        }), new PDFObject({url: n}).embed(c), void 0
                    }
                    if ("html" == t || "htm" == t) {
                        var n = core.path2url(e);
                        return o(n, core.ico("html"), core.pathThis(e)), void 0
                    }
                    if (inArray(core.filetype.image, t)) {
                        var n = urlDecode(e);
                        return -1 == e.indexOf("http:") && (n = core.path2url(n)), MaskView.image(n), void 0
                    }
                    if (inArray(core.filetype.music, t) || inArray(core.filetype.movie, t)) {
                        var n = core.path2url(e);
                        return l(n, t), void 0
                    }
                    return inArray(core.filetype.doc, t) ? (r(e), void 0) : inArray(core.filetype.text, t) || inArray(core.filetype.code, t) ? (s(e), void 0) : ("editor" == Config.pageApp ? core.tips.tips(t + LNG.edit_can_not, !1) : a(e, ""), void 0)
                }
            } else if (console.log(e), "string" == typeof e) {
                var p = e;
                "string" != typeof e && (p = e.content.split("'")[1]), core.file_get(p, function (e) {
                    var t = json_decode(e);
                    t.name = core.pathThis(p), core.openApp(t)
                })
            } else core.openApp(e)
        }
    }, a = function (e, t) {
        var a = '<div class="unknow_file" style="width:260px;word-break: break-all;"><span>' + LNG.unknow_file_tips + "<br/>" + t + '</span><br/><a class="btn btn-success btn-sm" href="javascript:ui.path.download(\'' + e + "');\"> " + LNG.unknow_file_download + " </a></div>";
        $.dialog({fixed: !0, icon: "warning", title: LNG.unknow_file_title, padding: 30, content: a, cancel: !0})
    }, i = function (e) {
        if (core.authCheck("explorer:fileDownload", LNG.no_permission_download) && e) {
            var t = "vis.go?explorer/fileDownload&path=" + urlEncode2(e);
            G.share_page !== void 0 && (t = "vis.go?share/fileDownload&user=" + G.user + "&sid=" + G.sid + "&path=" + urlEncode2(e));
            var a = '<iframe src="' + t + '" style="width:0px;height:0px;border:0;" frameborder=0></iframe>' + LNG.download_ready + "...", i = $.dialog({
                icon: "succeed",
                title: !1,
                time: 1,
                content: a
            });
            i.DOM.wrap.find(".aui_loading").remove()
        }
    }, n = function (e) {
        if (core.authCheck("explorer:fileDownload") && void 0 != e) {
            var t = core.path2url(e);
            window.open(t)
        }
    }, o = function (e, t, a, i) {
        if (e) {
            void 0 == i && (i = "openWindow" + UUID());
            var n = "<iframe frameborder='0' name='Open" + i + "' src='" + e + "' style='width:100%;height:100%;border:0;'></iframe>";
            art.dialog.through({
                id: i,
                title: a,
                ico: t,
                width: "78%",
                height: "70%",
                padding: 0,
                content: n,
                resize: !0
            })
        }
    }, s = function (e) {
        if (core.authCheck("explorer:fileDownload", LNG.no_permission_download) && e) {
            var a = core.pathExt(e), i = core.pathThis(e);
            if (inArray(core.filetype.bindary, a) || inArray(core.filetype.music, a) || inArray(core.filetype.image, a) || inArray(core.filetype.movie, a) || inArray(core.filetype.doc, a))return t(e, a), void 0;
            if ($.dialog.list.openEditor && $.dialog.list.openEditor.zIndex(), "editor" == Config.pageApp)return FrameCall.child("OpenopenEditor", "Editor.add", '"' + urlEncode2(e) + '"'), void 0;
            if (void 0 == window.top.frames.OpenopenEditor) {
                var n = "./vis.go?editor/edit&filename=" + urlEncode(urlEncode2(e));
                G.share_page !== void 0 && (n = "./vis.go?share/edit&user=" + G.user + "&sid=" + G.sid + "&filename=" + urlEncode(urlEncode2(e)));
                var s = i + " ——" + LNG.edit;
                o(n, core.ico("edit"), s.substring(s.length - 50), "openEditor")
            } else $.dialog.list.openEditor && $.dialog.list.openEditor.display(!0), FrameCall.top("OpenopenEditor", "Editor.add", '"' + urlEncode2(e) + '"')
        }
    }, r = function (e) {
        var t = "./vis.go?explorer/officeView&path=" + urlEncode(e);
        if (G.share_page !== void 0)var t = G.app_host + "vis.go?share/officeView&user=" + G.user + "&sid=" + G.sid + "&path=" + urlEncode2(e);
        art.dialog.open(t, {
            ico: core.ico("doc"),
            title: title = core.pathThis(e),
            width: "80%",
            height: "70%",
            resize: !0
        })
    }, l = function (t, a) {
        t && ("string" == typeof t && (t = [t]), CMPlayer = e("./CMPlayer"), CMPlayer.play(t, a))
    };
    return {open: t, play: l, openEditor: s, openIE: n, download: i}
}), define("app/common/CMPlayer", [], function () {
    var e = {
        ting: {path: "music/ting", width: 410, height: 530},
        beveled: {path: "music/beveled", width: 350, height: 200},
        kuwo: {path: "music/kuwo", width: 480, height: 200},
        manila: {path: "music/manila", width: 320, height: 400},
        mp3player: {path: "music/mp3player", width: 320, height: 410},
        qqmusic: {path: "music/qqmusic", width: 300, height: 400},
        somusic: {path: "music/somusic", width: 420, height: 137},
        xdj: {path: "music/xdj", width: 595, height: 235},
        webplayer: {path: "movie/webplayer", width: 600, height: 400},
        qqplayer: {path: "movie/qqplayer", width: 600, height: 400},
        tvlive: {path: "movie/tvlive", width: 600, height: 400},
        youtube: {path: "movie/youtube", width: 600, height: 400},
        vplayer: {path: "movie/vplayer", width: 600, height: 400}
    }, t = function (e) {
        return "music" == e ? "music_player" : (void 0 == e && (e = "mp3"), inArray(core.filetype.music, e) ? "music_player" : "movie_player")
    }, a = function (t) {
        var a, i, o, s;
        "music_player" == t ? (s = core.ico("mp3"), a = e[G.musictheme], i = "music player", o = !1) : (s = core.ico("flv"), a = e[G.movietheme], i = "movie player", o = !0);
        var r = core.createFlash(G.static_path + "js/lib/cmp4/cmp.swf", "context_menu=2&auto_play=1&play_mode=1&skin=skins/" + a.path + ".zip", t), l = {
            id: t + "_dialog",
            simple: !0,
            ico: s,
            title: i,
            width: a.width + 10,
            height: a.height,
            content: '<div class="wmp_player"></div><div class="flash_player">' + r + "</div>",
            resize: o,
            padding: 0,
            fixed: !0,
            close: function () {
                var e = n(t);
                e && e.sendEvent && e.sendEvent("view_stop")
            }
        };
        window.top.CMP ? art.dialog.through(l) : $.dialog(l)
    }, i = function (e) {
        var t, a = "";
        for (t = e.length - 1; t >= 0; t--) {
            var i, n;
            -1 == e[t].search("fileProxy") ? (i = urlEncode(e[t]), n = core.pathThis(e[t])) : (i = e[t], n = core.pathThis(urlDecode(i))), i = i.replace(/%2F/g, "/"), i = i.replace(/%3F/g, "?"), i = i.replace(/%26/g, "&"), i = i.replace(/%3A/g, ":"), i = i.replace(/%3D/g, "="), a += '<list><m type="" src="' + i + '" label="' + n + '"/></list>'
        }
        return a
    }, n = function (e) {
        return window.top.CMP ? window.top.CMP.get(e) : CMP.get(e)
    }, o = function (e, t) {
        var a = n(t), o = i(e);
        try {
            a.config("play_mode", "normal");
            var s = a.list().length;
            a.list_xml(o, !0), a.sendEvent("view_play", s + 1)
        } catch (r) {
        }
    }, s = function (e) {
        if ("music_player" != e) {
            var a = n(t("movie"));
            a && (a.addEventListener("control_load", "new_play"), a.addEventListener("control_play", "new_play"))
        }
    };
    return {
        changeTheme: function (t, a) {
            var i, o, s;
            "music" == t ? (G.musictheme = a, i = "music_player") : "movie" == t && (G.movietheme = a, i = "movie_player"), s = n(i), s && (o = e[a], window.top.art.dialog.list[i + "_dialog"].size(o.width, o.height), s.sendEvent("skin_load", "skins/" + o.path + ".zip"))
        }, play: function (e, i) {
            var r = t(i), l = n(r);
            if (l)o(e, r), s(r), window.top.art.dialog.list[r + "_dialog"].display(!0); else {
                a(r);
                var c = setInterval(function () {
                    n(r) && (o(e, r), s(r), new_play(r), clearInterval(c), c = !1)
                }, 1e3)
            }
        }
    }
});
var new_play = function (e) {
    if ("music_player" == e)return $(".music_player_dialog .wmp_player").html("").css({
        width: "0px",
        height: "0px"
    }), $(".music_player_dialog .flash_player").css({width: "100%", height: "100%"}), void 0;
    var t;
    t = window.top.CMP ? window.top.CMP.get("movie_player") : CMP.get("movie_player");
    var a = function (e) {
        var t = '<object id="the_wmp_player" ', a = navigator.userAgent;
        return -1 != a.indexOf("MSIE") ? t += 'classid="clsid:6BF52A52-394A-11d3-B153-00C04F79FAA6" ' : (-1 != a.indexOf("Firefox") || -1 != a.indexOf("Chrome") || -1 != a.indexOf("Opera") || -1 != a.indexOf("Safari")) && (t += 'type="application/x-ms-wmp" '), t += 'width="100%" height="100%">', t += '<param name="URL" value="' + e + '">', t += '<param name="autoStart" value="true">', t += '<param name="autoSize" value="true">', t += '<param name="invokeURLs" value="false">', t += '<param name="playCount" value="100">', t += '<param name="Volume" value="100">', t += '<param name="defaultFrame" value="datawindow">', t += "</object>"
    };
    try {
        var i = t.item("src").toLowerCase();
        if (i.indexOf("wmv") > 1 || i.indexOf("mpg") > 1 || i.indexOf("avi") > 1 || i.indexOf("wvx") > 1 || i.indexOf("3gp") > 1) {
            $("div[id^='DIV_CMP_']").remove();
            var n = a(i);
            $(".movie_player_dialog .wmp_player").html(""), $(".movie_player_dialog .flash_player").css({
                width: "0px",
                height: "0px"
            }), setTimeout(function () {
                $(".movie_player_dialog .wmp_player").html(n).css({width: "100%", height: "100%"})
            }, 300)
        } else $(".movie_player_dialog .wmp_player").html("").css({
            width: "0px",
            height: "0px"
        }), setTimeout(function () {
            $(".movie_player_dialog .flash_player").css({width: "100%", height: "100%"})
        }, 200)
    } catch (o) {
    }
};
define("app/src/share_explorer/path", ["../../common/pathOperate", "../../tpl/fileinfo/file_info.html", "../../tpl/fileinfo/path_info.html", "../../tpl/fileinfo/path_info_more.html", "../../tpl/share.html", "../../tpl/app.html", "../../common/pathOpen", "../../common/CMPlayer"], function (e) {
    var t = e("../../common/pathOperate"), a = e("../../common/pathOpen"), i = void 0;
    ui.pathOpen = a;
    var n = function (e, t, a) {
        if (void 0 != e) {
            if (e == G.this_path)return void 0 != t && "" != t && core.tips.tips(LNG.path_is_current, "info"), void 0;
            G.this_path = e.replace(/\\/g, "/"), G.this_path = e.replace(/\/+/g, "/"), "/" != G.this_path.substr(G.this_path.length - 1) && (G.this_path += "/"), ui.f5_callback(function () {
                "function" == typeof a && a()
            }), o.add()
        }
    }, o = function () {
        var e = ["/"], t = 0, a = function () {
            return G.this_path == e[e.length - 1] ? (o(), void 0) : (t != e.length - 1 && (e = e.slice(0, t)), e.push(G.this_path), t = e.length - 1, o(), void 0)
        }, i = function () {
            e.length - 1 >= t + 1 && (t += 1, G.this_path = e[t], ui.f5(!0, !0), o())
        }, n = function () {
            t - 1 >= 0 && (t -= 1, G.this_path = e[t], ui.f5(!0, !0), o())
        }, o = function () {
            t == e.length - 1 ? $("#history_next").addClass("active") : $("#history_next").removeClass("active"), 0 == t ? $("#history_back").addClass("active") : $("#history_back").removeClass("active")
        };
        return {add: a, back: n, next: i}
    }(), s = function (e) {
        void 0 != e && ("string" == typeof e && (e = [e]), fileLight.clear(), $(".fileContiner .file").each(function (t) {
            var a = fileLight.name($(this));
            -1 != $.inArray(a, e) && $(Global.fileListAll).eq(t).addClass(Config.SelectClassName)
        }), fileLight.select(), fileLight.setInView())
    }, r = function (e) {
        if ("" != e) {
            if (e = e.toLowerCase(), void 0 == i || G.this_path != i.path || e != i.key) {
                var t = [];
                $(".fileContiner .file").each(function () {
                    var a = fileLight.name($(this));
                    a && e == a.substring(0, e.length).toLowerCase() && t.push(a)
                }), i = {key: e, path: G.this_path, index: 0, list: t}
            }
            0 != i.list.length && (s(i.list[i.index++]), i.index == i.list.length && (i.index = 0))
        }
    }, l = function (e) {
        return "" == e ? (fileLight.clear(), void 0) : (fileLight.clear(), $(".fileContiner .file").each(function (t) {
            var a = fileLight.name($(this));
            -1 != a.toLowerCase().indexOf(e) && $(Global.fileListAll).eq(t).addClass(Config.SelectClassName)
        }), fileLight.select(), fileLight.setInView(), void 0)
    }, c = function (e) {
        if (e) {
            var t = [];
            return 0 == Global.fileListSelect.length ? t : (Global.fileListSelect.each(function () {
                var e = G.this_path + fileLight.name($(this)), a = "folder" == fileLight.type($(this)) ? "folder" : "file";
                t.push({path: e, type: a})
            }), t)
        }
        if (1 != Global.fileListSelectNum)return {path: "", type: ""};
        var a = Global.fileListSelect, i = G.this_path + fileLight.name(a), n = fileLight.type(a);
        return {path: i, type: n}
    };
    return {
        history: o, openEditor: function () {
            a.openEditor(c().path)
        }, openIE: function () {
            a.openIE(c().path)
        }, open: function (e) {
            if (0 != c().path.length) {
                if (void 0 != e)return a.open(e), void 0;
                var t = c(), i = Global.fileListSelect;
                if (inArray(core.filetype.image, t.type))return "icon" == G.list_type || "desktop" == Config.pageApp ? ui.picasa.play($(i).find(".ico")) : ui.picasa.play($(i)), void 0;
                if ("oexe" == t.type) {
                    var n = i.attr("data-app");
                    t.path = json_decode(urlDecode(n))
                }
                a.open(t.path, t.type)
            }
        }, show_file: function () {
            var e = "./vis.go?share/file&sid=" + G.sid + "&user=" + G.user + "&path=" + urlEncode(c().path);
            window.open(e)
        }, openProject: function () {
            core.explorerCode(c().path)
        }, play: function () {
            if (!(1 > Global.fileListSelectNum)) {
                var e = [];
                Global.fileListSelect.each(function () {
                    var t = fileLight.type($(this));
                    if (inArray(core.filetype.music, t) || inArray(core.filetype.movie, t)) {
                        var a = core.path2url(G.this_path + fileLight.name($(this)));
                        e.push(a)
                    }
                }), a.play(e, "music")
            }
        }, pathOperate: t, download: function () {
            var e = c(!0);
            1 == e.length && "file" == e[0].type ? a.download(c().path) : t.zipDownload(e)
        }, search: function () {
            core.search("", c().path)
        }, info: function () {
            t.info(c(!0))
        }, list: n, setSearchByStr: l, setSelectByChar: r, setSelectByFilename: s
    }
}), define("app/share_common/topbar", [], function () {
    var e = "vis.go?share/fileDownload&user=" + G.user + "&sid=" + G.sid, t = "vis.go?share/fileProxy&user=" + G.user + "&sid=" + G.sid, a = function () {
        "file" != G.share_info.type && G.path !== void 0 ? (t += "&path=" + G.path, e += "&path=" + G.path, $(".btn.button_my_share").hide(), $(".share_info_user .btn-group").show()) : ($(".btn.button_my_share").show(), $(".share_info_user .btn-group").hide()), "file" == G.share_info.type && ($(".btn.button_my_share").hide(), $(".share_info_user .btn-group").show()), "1" == G.share_info.not_download && (e = "javascript:core.tips.tips('" + LNG.share_not_download_tips + "',false);"), $(".share_info_user").removeClass("hidden"), $(".btn_download").attr("href", e);
        var a = date("Y/m/d h:i", G.share_info.mtime);
        $(".topbar .time").html(a), "file" == G.share_info.type && $(".topbar .size").html(G.share_info.size), $(".topbar .info").html(LNG.share_view_num + G.share_info.num_view + "  " + LNG.share_download_num + G.share_info.num_download), $("#button_share").die("click").live("click", function () {
            i()
        })
    }, i = function () {
    };
    return {init: a}
});