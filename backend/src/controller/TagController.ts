import { getRepository, DeleteResult, Raw } from "typeorm";
import { Request, Response } from 'express';
import { Tag } from '../model/Tag';
import { UserRole } from '../model/User';
import * as escape from 'pg-escape'

import { NotFound } from '../Errors';

// semelhante para edição e delete
export async function validateCreate(req : Request): Promise<number>{
	// somente usuario adm e profissional pode criar tag
	if(req.user.type == UserRole.ADMIN || req.user.type == UserRole.PROFISSIONAL)
		return 200;
	return 403;
}

export async function validateEdit(req : Request): Promise<number>{
	// somente usuario adm ou moderador pode alterar
	if(req.user.type == UserRole.ADMIN /* || req.user.type == UserRole.MODERADOR*/)
		return 200;
	return 403;
}

export async function validateDelete(req : Request): Promise<number>{
	return validateEdit(req);
}

export async function processCreateData(req : Request): Promise<Tag> {
	const tag = new Tag();
	const body = req["body"];

	tag.description = body.description;

	return tag;
}

export async function processEditData(req : Request): Promise<Tag> {
	const tag = new Tag();
	const body = req["body"];

	tag.description = body.description;

	return tag;
}

export async function getAll(req : Request, res : Response, next) : Promise<Response> {
	try{
		let options;

		const limit = Number(req.query["limit"]) || 8;
		console.log(`Limit: ${limit}`);

		if(req.query["page"]){
			const page = Number(req.query["page"]);
			options = {order: {id : "ASC"}, take: limit, skip: (limit * (page - 1))};
			console.log(`Page: ${page}`);
		}

		let queryName;
		if(req.query["description"])
			queryName = "description"
		if(queryName){
			const attribute = String(req.query[queryName]).toLocaleLowerCase();
			const query = escape(`ILIKE %L`, `%${attribute}%`)
			options = {...options, where: 
				{[queryName]: Raw(alias => `${alias} ${query}`)}
			}
		}
		const tags = await getRepository(Tag).find(options);
		console.log(tags);
		if(tags && tags.length > 0)
			return res.json(tags);
		
		throw new NotFound();
	}catch(err){
		return next(err);
	}
}

export async function getByPk(req : Request, res : Response, next) : Promise<Response> {
	const tag = await getRepository(Tag).findOne(req.params["id"]);
	if(tag)
		return res.json(tag);
	
	const err = new NotFound;
	return next(err);
}

export async function create(req : Request, res : Response, next) : Promise<Response>{
	try{
		const statusCode = await validateCreate(req);

		if(statusCode != 200)
			return res.status(statusCode).send();

		const tag: Tag = await processCreateData(req);

		const result: Tag[] = await getRepository(Tag).save([tag]);
		return res.json(result);
	}catch(err){
		return next(err);
	}
}

export async function edit(req : Request, res : Response, next): Promise<Response> {
	try{
		const statusCode = await validateEdit(req);
		if(statusCode != 200)
			return res.status(statusCode).send();

		const tag: Tag = await processEditData(req);

		const foundTag = await getRepository(Tag).findOne(req.params["id"]);
		if(foundTag){
			getRepository(Tag).merge(foundTag, tag);
			const result = await getRepository(Tag).save(foundTag);
			return res.json(result);
		}
		throw new NotFound;
	}catch(err){
		return next(err);
	}
}

export async function remove(req : Request, res : Response, next): Promise<Response> {
	try{
		const statusCode = await validateDelete(req);
		if(statusCode != 200)
			return res.status(statusCode).send();
			

		const result: DeleteResult = await getRepository(Tag).delete(req.params["id"]);
		if(result.affected >= 1)
			return res.status(200).send();
		else
			return res.status(404).send();
	}catch(err){
		return next(err);
	}
}
