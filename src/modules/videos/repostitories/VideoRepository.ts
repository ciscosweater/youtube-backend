import { pool } from '../../../mysql';
import { v4 as uuidv4 } from 'uuid';
import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Request, Response } from 'express';

class VideoRepository {
    upload(request: Request, response: Response) {
        const { title, description, user_id } = request.body;
        pool.getConnection((err: any, connection: any) => {
            connection.query(
                'INSERT INTO videos (video_id, user_id, title, description) VALUES (?,?,?,?)',
                [uuidv4(), user_id, title, description],
                (error: any) => {
                    connection.release();
                    if (error) {
                        return response.status(400).json(error)
                    }
                    response.status(200).json({ message: 'Vídeo criado com sucesso!' });
                }
            )
        });
    }

    getVideos(request: Request, response: Response) {
        const { user_id } = request.params;
        pool.getConnection((err: any, connection: any) => {
            connection.query(
                'SELECT * FROM videos WHERE user_id = ?',
                [user_id],
                (error: any, results: any) => {
                    connection.release();
                    if (error) {
                        return response.status(400).json({ error: 'Erro.' })
                    }

                    if (results == false) {
                        return response.status(400).json({ error: 'Usuário não encontrado ou não há videos enviados.' })
                    }

                    return response.status(200).json({ message: 'Videos retornados com sucesso', videos: results })
                }
            )
        })
    }


    searchVideos(request: Request, response: Response) {
        const { search } = request.query;
        pool.getConnection((err: any, connection: any) => {
            connection.query(
                'SELECT * FROM videos WHERE title LIKE ?',
                [`%${search}%`],
                (error: any, results: any) => {
                    connection.release();
                    if (error) {
                        return response.status(400).json({ error: 'Erro.' })
                    }

                    if (results == false) {
                        return response.status(400).json({ error: 'Nada encontrado.' })
                    }

                    return response.status(200).json({ message: 'Videos retornados com sucesso', videos: results })
                }
            )
        })
    }
};

export default VideoRepository;