"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoRoutes = void 0;
const express_1 = require("express");
const VideoRepository_1 = __importDefault(require("../modules/videos/repostitories/VideoRepository"));
const login_1 = require("../middleware/login");
const videoRoutes = (0, express_1.Router)();
exports.videoRoutes = videoRoutes;
const videoRepository = new VideoRepository_1.default();
videoRoutes.post('/create-video', login_1.login, (request, response) => {
    videoRepository.upload(request, response);
});
videoRoutes.get('/list-videos/:user_id', login_1.login, (request, response) => {
    videoRepository.getVideos(request, response);
});
videoRoutes.get('/search', (request, response) => {
    videoRepository.searchVideos(request, response);
});
