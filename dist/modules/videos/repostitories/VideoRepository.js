"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = require("../../../mysql");
const uuid_1 = require("uuid");
class VideoRepository {
    upload(request, response) {
        const { title, description, user_id } = request.body;
        mysql_1.pool.getConnection((err, connection) => {
            connection.query('INSERT INTO videos (video_id, user_id, title, description) VALUES (?,?,?,?)', [(0, uuid_1.v4)(), user_id, title, description], (error) => {
                connection.release();
                if (error) {
                    return response.status(400).json(error);
                }
                response.status(200).json({ message: 'Vídeo criado com sucesso!' });
            });
        });
    }
    getVideos(request, response) {
        const { user_id } = request.params;
        mysql_1.pool.getConnection((err, connection) => {
            connection.query('SELECT * FROM videos WHERE user_id = ?', [user_id], (error, results) => {
                connection.release();
                if (error) {
                    return response.status(400).json({ error: 'Erro.' });
                }
                if (results == false) {
                    return response.status(400).json({ error: 'Usuário não encontrado ou não há videos enviados.' });
                }
                return response.status(200).json({ message: 'Videos retornados com sucesso', videos: results });
            });
        });
    }
    searchVideos(request, response) {
        const { search } = request.query;
        mysql_1.pool.getConnection((err, connection) => {
            connection.query('SELECT * FROM videos WHERE title LIKE ?', [`%${search}%`], (error, results) => {
                connection.release();
                if (error) {
                    return response.status(400).json({ error: 'Erro.' });
                }
                if (results == false) {
                    return response.status(400).json({ error: 'Nada encontrado.' });
                }
                return response.status(200).json({ message: 'Videos retornados com sucesso', videos: results });
            });
        });
    }
}
;
exports.default = VideoRepository;
