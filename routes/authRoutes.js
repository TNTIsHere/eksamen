const { Router } = require("express");
const authController = require("../controllers/authController");

const router = Router()

// Authentication routes with a controller
router.get("/sign-up", authController.signup_get);
router.get("/sign-in", authController.login_get);
router.get("/logout", authController.logout_get);
router.get("/home/:id", authController.homepage_get);
router.get("/:id", authController.id_get);
router.post("/addwish", authController.addwish_post);
router.post("/sign-in", authController.login_post);
router.post("/sign-up", authController.signup_post);
router.post("/updatewish", authController.updatewish_post);
router.delete("/deletewish/:id", authController.deletewish_delete);

module.exports = router;