"use strict"

var menuCounter = 0
var loc = window.location.href

window.onload = function() {
    const gallery = new Gallery()
    const load = new Load()
    load.loadCaller()

    if (loc.includes("index")) {
        let files = new GetData().findFiles("/images/index-gallery")
        $("#footer").before($("<div id='gallery'></div>"))
        gallery.gallery(files, $("#gallery"))
    }
    
    var sections = ["language", "menu-links", "footer"]
    $(`.${sections[0]}`).load(`load.html #${sections[0]}`,
        function () {
            $(`.${sections[1]}`).load(`load.html #${sections[1]}`,
                function () {
                    $(`.${sections[2]}`).load(`load.html #${sections[2]}`, load())
                })
    })
}

function toggleMenu() {
    menuCounter++
    var menu = $("#menu-links")
    var header = $("#page-header")

    if (menuCounter % 2 === 1) {
        menu.css("display", "block")
        menu.css("animation", "1s linear slide-in")
        header.css("display", "none")
    } else {
        header.css("display", "block")
        header.css("animation", "1s linear slide-in")
        menu.css("display", "none")
    }
}

class Load {
    async loadCaller() {
        let getData = new GetData()

        if (loc.includes("?courseID=")) {
            const display = new Display(await getData.getJSON("../course-notes.json"))
            display.objToHTML()
        } else if (loc.includes("course-notes") || loc.includes("apuntes-del-curso") || loc.includes("notes-des-cours")) {
            const organize = new Organize(await getData.getJSON("../course-notes.json"))
            organize.organizeObj()
        } else if (loc.includes("?recipe=")) {
            const display = new Display(await getData.getJSON("../recipes.json"))
            display.recipeDetails()
        } else if (loc.includes("recipes") || loc.includes("recetas") || loc.includes("recettes")) {
            const organize = new Organize(await getData.getJSON("../recipes.json"))
            organize.organizeRecipes()
        }
    }

    loadHeader() {
        var langArr, langCode, href

        if (loc.includes("/fr/")) langArr = ["English", "Español"]
        else if (loc.includes("/es/")) langArr = ["English", "Français"]
        else langArr = ["Français", "Español"]
        
        var p = $("#quote").append($("<p>")).html("Read this site in:")
        
        for (let l in langArr) {
            if (l === "Español") langCode = "es/"
            else if (l === "Français") langCode = "fr/"
            else langCode = ""
            
            href = loc.slice(0,24) + langCode + loc.slice(25, loc.length)
            p.append($("<a>")).html(l).attr("href", href)
        }
    }

    load() {
        var fullLangList = ["en","fr","es"]
        var obj = {
            "contact" : {
                "en" : "contact",
                "es" : "contacto",
                "fr" : "contact"
            },
            "cv" : {
                "en" : "cv",
                "es" : "cv",
                "fr" : "cv"
            },
            "recipes" : {
                "en" : "recipes",
                "es" : "recetas",
                "fr" : "recettes"
            },
            "index" : {
                "en" : "index",
                "es" : "index",
                "fr" : "index"
            },
            "writings" : {
                "en" : "writings",
                "es" : "escritos",
                "fr" : "écrits"
            },
            "course-notes" : {
                "en" : "course-notes",
                "es" : "apuntes-del-curso",
                "fr" : "notes-des-cours"
            }
        }
        var className = $("body").attr("class")
        var currLang = loc.match(/\/..\//)[0]
        var langList = fullLangList.filter(function (f) {return f != currLang})
        
        for (let l in langList) {
            $(`.${langList[l]}`).attr("href", `../${langList[l]}/${obj[className][langList[l]]}.html`)
        }
    }

}

class GetData {
    async getJSON(file) {
        return fetch(file)
            .then((resp) => resp.json())
            .then((respJSON) => {return respJSON})
    }

    findFiles(path) {
        const xhr = new XMLHttpRequest()
        xhr.open("GET", path, false)
        xhr.send()
        let htmlResponse, links
        let files = []
        
        if (xhr.status === 200) {
            const parser = new DOMParser()
            htmlResponse = parser.parseFromString(xhr.responseText, "text/html")
            links = htmlResponse.getElementsByTagName("a")
            for (let i =0; i < links.length; i++) {
                let fileName = links[i].getAttribute("href")
                if (fileName.includes("jpg")) files.push(fileName)
            }
        }
        return files
    }
}

class Gallery {
    constructor () {
        this.getData = new GetData()
    }

    gallery(imgArr, gallery, cat = "gallery", links = false) {
        let img, msg
        imgArr.push("/images/wraparound.jpg")
        
        for (let i = 0; i < imgArr.length; i++) {
            img = $("<img>")
                .prop("src", `../${imgArr[i]}`)
                .prop("class", cat)
                .css({"height" : "20%", "width" : "100%", "border-radius" : "30px", "padding" : "10px 0 10px 0"})
                .appendTo(gallery)
                .hide()
            
            if (links) {
                let recipe = imgArr[i].slice(imgArr[i].lastIndexOf("/") + 1, imgArr[i].length - 4)
                img.wrap($("<a>").prop("href", `${loc}?recipe=${recipe}`).prop("class", ".gallery-link"))
            }
        }

        msg = $("<h4>").prop("id", "wraparound").text("More pictures coming soon!").hide()

        let counter = 0
        $($(`.${cat}`)[counter]).show()
        
        $("<button id='previous'>").appendTo(gallery).text("Previous")
            .css({"border-radius" : "4px 10px", "position" : "relative"})
            .on("click", () => {
                $($(`.${cat}`)[counter]).hide()
                $($(`.${cat}`)[counter - 1]).show("slide", {direction: "left" }, 500)
                if (counter > 0) counter--
                else counter += imgArr.length
            })
        
        $("<button id='next'>").appendTo(gallery).text("Next")
            .offset({left: $(window).width() - $("button").width() - 10})
            .css("border-radius", "10px 4px")
            .on("click", () => {
                $($(`.${cat}`)[counter]).hide()
                $($(`.${cat}`)[counter + 1]).show("slide", {direction: "right" }, 500)
                if (counter < imgArr.length - 1) counter++
                else counter -= imgArr.length
            })

        $(window).on("resize", () => {
            $("#next").offset({left: $(window).width() - $("button").width() - 10})
        })
    }

    recipeGallery(response, div, mealType) {     
        if (!mealType) return
        let arr = []
        let files = this.getData.findFiles("/images/recipes")
        let recipeIDs = Object.keys(response)

        for (let i = 0; i < recipeIDs.length; i++) {
            if (response[recipeIDs[i]].type !== mealType) continue
            let recipeID = recipeIDs[i].toLowerCase().split(" ").join("-")

            for (let j = 0; j < files.length; j++) {
                if (files[j].includes(recipeID)) {
                    arr.push(files[j])
                    files.splice(j, 1)
                }
            }
        }
        if (arr.length) {
            const gal = new Gallery()
            gal.gallery(arr, div, `${mealType}-gallery`.toLowerCase().split(" ").join("-"), true)
        }
    }
}

class Organize {
    constructor (response) {
        this.response = response
        this.gallery = new Gallery()
    }

    organizeObj() {
        let arr = ["Fall 2023", "Spring 2024", "Fall 2024", "Spring 2025", "Fall 2025", "Winter 2026"]
        let h3, a, r, ul, className

        for (let i = 0; i < arr.length; i++) {
            className = arr[i].toLowerCase().replaceAll(" ", "-")
            ul = $("<ul>").appendTo($("#course-columns"))
            ul.wrap(`<div class="${className}"></div>`)
            h3 = $("<h3>").html(arr[i]).appendTo($(`.${className}`))

            for (let j = 0; j < Object.keys(this.response).length; j++) {
                r = Object.keys(this.response)[j].toString()

                if (this.response[r].semester == arr[i]) {
                    a = $("<a>").attr("href", loc + "?courseID=" + r)
                        .html(this.response[r].cname)
                        .appendTo($(`.${className}`))

                    a.wrap(ul).wrap("<li></li>")
                }
            }
        }
    }

    organizeRecipes() {
        let arr = []
        let mealData, mealName, className, a
        for (let i = 0; i < Object.keys(this.response).length; i++) {
            mealName = Object.keys(this.response)[i]
            mealData = this.response[mealName]
            className = mealData.type.toLowerCase().replaceAll(" ", "-")

            if (!arr.includes(mealData.type)) {
                arr.push(mealData.type)
                let galleryDiv = $(`<div id="${className}-gallery">`)
                $("#recipe-columns").append(galleryDiv)
                galleryDiv.prepend($("<ul>").addClass(className))
                    .prepend($("<h3>").html(`${mealData.type}`))
                this.gallery.recipeGallery(this.response, galleryDiv, mealData.type)
            }

            a = $("<a>").html(mealName).attr("href", `${loc}?recipe=${mealName.toLowerCase().replaceAll(" ", "-")}`)
            $("<li>").append(a).appendTo($(`.${className}`))
        }
    }
}

class Display {
    constructor (response) {
        this.response = response
    }

    recipeDetails() {
        let recipeID = loc.slice(loc.indexOf("=") + 1, loc.length)
        let recipeName = recipeID.slice(0, 1).toUpperCase() + recipeID.slice(1,recipeID.length).replaceAll("-", " ")
        $("<h3>").html(`${recipeName} recipe`).appendTo($("#recipe"))
        
        $.ajax({
            url: `../images/recipes/${recipeID}.jpg`,
            type: "HEAD",
            error: function() {},
            success: function() {
                $("<img>").attr("src", `../images/recipes/${recipeID}.jpg`)
                    .appendTo($("#recipe"))
            }
        })

        if (this.response[recipeName].href) {
            let iframe = $("<iframe>").addClass("iframe").attr("src", this.response[recipeName].href)
            $("#recipe").append(iframe)
        } else {
            $("<p>").html("Recipe coming soon!").appendTo($("#recipe"))
        }
    }

    objToHTML() {
        let courseID = loc.slice(loc.indexOf("=") + 1, loc.length)
        document.getElementById("main-page").style.display = "none"
        let h1 = $("<h1>").html(courseID.toUpperCase())
        let h3 = $("<h3>").html("Course Information")
        let p = $("<p>").html(this.response[courseID].college + ", " + this.response[courseID].semester + ", " + response[courseID].format)
        $("#course").append(h1).append(h3).append(p)

        if (this.response[courseID].details && !this.response[courseID].href) {
            let details = $("<p>").html(this.response[courseID].details)
            $("#course").append(details)
        } else if (this.response[courseID].href) {
            let iframe = $("<iframe>").addClass("iframe").attr("src", this.response[courseID].href)
            $("#course").append(iframe)
        }
    }
}

class PrototypeFunctions {
    // Not yet correctly implemented (prototypes for future addition)
    scroll() {
        var scroller = document.getElementsByClassName("content")
        var ratio = .25
        var target = scroller.scrollTop + event.deltaY * ratio

        scroller.scrollTo({
            top: target,
            behavior: "smooth"
        })
    }

    search(response) {
        var input = document.getElementById("course-search").value
        var ul = $("<ul>").appendTo($("#course"))
        var li

        for (let i = 0; i < Object.keys(response).length; i++) {
            if (Object.keys(response)[i] == input || Object.keys(response)[i].cname == input) {
                li = $("<li>").html(response[i].cname)
                ul.append(li)
            }
        }
    }
}

var linkArr = ["https://docs.google.com/document/d/15DkoQkqqjwtwyqcUKQ4jupOY6JkgPTtQq5Y_pjdPjmY/edit?tab=t.0"]

function handlePwd() {
    let inputPwd = $("#pwd").val()
    if (inputPwd == "dk827") {
        let gdocDiv = $("#gdoc")
        let iframe

        for (var i = 0; i < linkArr.length; i++) {
            iframe = gdocDiv.append(`<iframe src="${linkArr[i]}" class="iframe"
                    allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>`)
        }

        $(".pwd").css("display","none")
    } else $("body").append("<p>").text("Sorry, try again")
}
