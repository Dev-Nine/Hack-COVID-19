import { Router } from "express";
import { getConnection } from "typeorm";

import UserController from "./controller/UserController";
import NoticeController from "./controller/NoticeController";
import TagController from "./controller/TagController";
import SessionController from "./controller/SessionController";

import ensureAuthentication from './middlewares/ensureAuthentication'
import verifyAuthentication from './middlewares/verifyAuthentication'

import { CovidInfo } from "./model/CovidInfo";

import { Errors } from './Errors';

import { celebrate } from 'celebrate';
import validator from 'cpf-cnpj-validator'
const Joi = require('@hapi/joi').extend(validator)

export default class Routes {
    public routes: Router;
    private userController: UserController;
    private noticeController: NoticeController;
    // private commentController: CommentController;
    private tagController: TagController;
    private sessionController: SessionController;

    constructor() {
        this.routes = Router();
        this.userController = new UserController();
        this.noticeController = new NoticeController();
        // this.commentController = new CommentController();
        this.tagController = new TagController();
        this.sessionController = new SessionController();
    }

    public defineRoutes() {
        // USUARIOS
        const userSchema = celebrate({
            body: Joi.object().keys({ 
                username: Joi.string().required().regex(/^[a-z0-9_]{4,20}$/),
                password: Joi.string().required().regex(/^[a-zA-Z0-9!@#$%&*]{6,30}$/),
                email: Joi.string().required().email(),
                name: Joi.string().required().regex(/^[a-zA-Z ]{4,50}$/),
                type: Joi.number().required().min(0).max(3),
                identifierType: Joi.string().default('cpf'),
                identifier: Joi.when('identifierType', { is: Joi.string().regex(/^cpf$/), then: Joi.document().cpf()})
            })
        }, {
            abortEarly: false
        });

        this.routes.get("/users", 
            this.userController.getAll.bind(this.userController));
        this.routes.get("/users/:id", 
            this.userController.getByPk.bind(this.userController));
        this.routes.post("/users",
            verifyAuthentication, 
            userSchema,
            this.userController.create.bind(this.userController));
        this.routes.put("/users/:id", 
            ensureAuthentication, 
            userSchema,
            this.userController.edit.bind(this.userController));
        this.routes.delete("/users/:id", 
            ensureAuthentication, 
            this.userController.delete.bind(this.userController));

        // TAG
        this.routes.get("/tags", this.tagController.getAll.bind(this.tagController));
        this.routes.get("/tags/:id", this.tagController.getByPk.bind(this.tagController));
        this.routes.post("/tags", ensureAuthentication, this.tagController.create.bind(this.tagController));
        this.routes.put("/tags/:id", ensureAuthentication, this.tagController.edit.bind(this.tagController));
        this.routes.delete("/tags/:id", ensureAuthentication, this.tagController.delete.bind(this.tagController));

        // NOTICIAS
        this.routes.get("/notices", this.noticeController.getAll.bind(this.noticeController));
        this.routes.get("/notices/:id",this.noticeController.getByPk.bind(this.noticeController));
        this.routes.post("/notices", ensureAuthentication, this.noticeController.create.bind(this.noticeController));
        this.routes.put("/notices/:id", ensureAuthentication, this.noticeController.edit.bind(this.noticeController));
        this.routes.delete("/notices/:id", ensureAuthentication, this.noticeController.delete.bind(this.noticeController));

        // COMENTARIOS
        // this.routes.get("/comments", this.commentController.getAll.bind(this.commentController));
        // this.routes.get("/comments/:id", this.commentController.getByPk.bind(this.commentController));
        // this.routes.post("/comments", ensureAuthentication, this.commentController.create.bind(this.commentController));
        // this.routes.put("/comments/:id", ensureAuthentication, this.commentController.edit.bind(this.commentController));
        // this.routes.delete("/comments/:id", ensureAuthentication, this.commentController.delete.bind(this.commentController));

        // SESSÕES (LOGIN)
        this.routes.post("/sessions", this.sessionController.auth.bind(this.sessionController));
        this.routes.get("/sessions", ensureAuthentication, this.sessionController.index.bind(this.sessionController));
    
        // COVID (INFO)
        this.routes.get('/covid', async function getInfo (req, res) {
            const query = getConnection().getRepository(CovidInfo);

            //Get the last request saved
            const result = await query.findOne({
                order: {
                    date: 'DESC',
                }
            });

            // console.log(result);

            if (result)
                return res.json(result);
            else 
               throw new Errors.BaseError('A error ocurred'); 
        });
    }
}
