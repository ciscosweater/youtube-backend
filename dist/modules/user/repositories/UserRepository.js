"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = require("../../../mysql");
const uuid_1 = require("uuid");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
class UserRepository {
    register(request, response) {
        const { name, email, password } = request.body;
        mysql_1.pool.getConnection((err, connection) => {
            (0, bcrypt_1.hash)(password, 10, (err, hash) => {
                if (err) {
                    return response.status(500).json(err);
                }
                connection.query('INSERT INTO users (user_id, name, email, password) VALUES (?,?,?,?)', [(0, uuid_1.v4)(), name, email, hash], (error) => {
                    connection.release();
                    if (error) {
                        return response.status(400).json(error);
                    }
                    response.status(200).json({ sucess: true });
                });
            });
        });
    }
    login(request, response) {
        const { email, password } = request.body;
        mysql_1.pool.getConnection((err, connection) => {
            connection.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
                connection.release();
                if (error) {
                    return response.status(400).json({ error: 'Erro.' });
                }
                if (results == false) {
                    return response.status(400).json({ error: 'Email não encontrado.' });
                }
                (0, bcrypt_1.compare)(password, results[0].password, (err, result) => {
                    if (err) {
                        return response.status(400).json({ error: 'Erro.' });
                    }
                    if (result == false) {
                        return response.status(400).json({ error: 'Senha incorreta.' });
                    }
                    if (result == true) {
                        const token = (0, jsonwebtoken_1.sign)({
                            id: results[0].user_id,
                            email: results[0].email
                        }, process.env.SECRET, { expiresIn: "1d" });
                        return response.status(200).json({ sucess: true, token: token });
                    }
                });
            });
        });
    }
}
;
exports.default = UserRepository;
