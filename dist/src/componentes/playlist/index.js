"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const playlistRouter = (0, express_1.Router)();
playlistRouter.post("/", controller_1.store);
playlistRouter.get("/", controller_1.findAll);
playlistRouter.post("/add", controller_1.addTrackOnPlaylist);
playlistRouter.get("/:id", controller_1.trackOnPlaylistById);
exports.default = playlistRouter;
//# sourceMappingURL=index.js.map