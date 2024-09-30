const { getMenu, createMenu, updateMenu } = require("../controllers/menus");

const menusRoutes = require("express").Router();

menusRoutes.get("/", getMenu);
menusRoutes.post("/", createMenu);
menusRoutes.put("/:id", updateMenu);

module.exports = menusRoutes;
