var router = require("express").Router()

const path = require("path")
const validator = require("validator")

const application = require(path.join(global.rboxlo.root, "websites", "eclipse", "lib", "application"))
const user = require(path.join(global.rboxlo.root, "websites", "tootsie", "lib", "user"))

router.get("/delete", user.authenticated, (req, res) => {
    res.render("games/application/delete", { title: "Delete Application", laid: "games.application.delete" })
})

router.get("/deployment", user.authenticated, (req, res) => {
    res.render("games/application/deployment", { title: "Deploy Application Software", laid: "games.application.deployment" })
})

router.get("/instance-finder", user.authenticated, (req, res) => {
    res.render("games/application/instance-finder", { title: "Find Instances with Application", laid: "games.application.instance-finder" })
})

router.get("/jobs", user.authenticated, (req, res) => {
    res.render("games/application/jobs", { title: "Manage Jobs with Application", laid: "games.application.jobs" })
})

router.get("/modify", user.authenticated, async (req, res) => {
    if (req.query.hasOwnProperty("id")) {
        if (!isNaN(req.query.id) && validator.isInt(req.query.id)) {
            let id = parseInt(req.query.id)

            if (!application.exists(id)) {
                return res.redirect("/games/application/modify")
            }

            let app = (await application.getInfo(id))
            res.render("games/application/modify", { title: "Modify Application", laid: "games.application.modify", objects: { "application": app } })
        } else {
            return res.redirect("/games/application/modify")
        }
    } else {
        res.render("games/application/modify", { title: "Modify Application", laid: "games.application.modify", objects: { choosing: true } })
    }
})

router.post("/new", user.authenticated, async (req, res) => {
    let output = { success: false }

    if (!req.body.hasOwnProperty("displayName") || !req.body.hasOwnProperty("internalName") || req.body.displayName.length < 0 || req.body.internalName < 0) {
        output.message = "Invalid parameters"
        return res.render("games/application/new", { title: "New Application", laid: "games.application.new", objects: { csrf: req.csrfToken(), response: output } })
    }

    let id = (await application.create(req.body.internalName, req.body.displayName))
    
    output.success = true
    output.id = id
    
    res.render("games/application/new", { title: "New Application", laid: "games.application.new", objects: { csrf: req.csrfToken(), response: output } })
})

router.get("/new", user.authenticated, (req, res) => {
    res.render("games/application/new", { title: "New Application", laid: "games.application.new", objects: { csrf: req.csrfToken() } })
})

router.get("/json", user.authenticated, async (req, res) => {
    let applications = (await application.fetchAll())
    return res.json(applications)
})

module.exports = router