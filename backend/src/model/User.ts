import {Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique} from "typeorm";
import { Notice } from './Notice';
import { Comment } from './Comment';

export enum UserRole {
    ADMIN = 0,
    //MODERADOR = 1,
    PROFISSIONAL = 2,
    //COMUM = 3,
}

@Entity()
@Unique(["registerType", "registerState", "register"])
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, length: 20, select: false })
    username: string;

    @Column({ length: 72, select: false })
    password: string;

    @Column({ unique: true, length: 50, select: false })
    email: string;

    @Column({ length: 50 })
    name: string;

    @Column({ length: 25, nullable: true })
    imageId: string;

    @Column({ length: 5, nullable: true })
    imageType: string;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.PROFISSIONAL,
        select: false
    })
    type: UserRole;

    // tipo de identificador
    // caso seja profissional, pode ser crm, crf, etc...
    @Column({ default: "cpf", select: false })
    registerType : string

    @Column({ length: 2, nullable: true, select: false })
    registerState : string

    // valor do identificador
    // cada cpf, crm e crf tem o seu próprio
    @Column({ select: false })
    register: string

    @OneToMany(type => Notice, notice => notice.user)
    notices: Notice[];

    @OneToMany(type => Comment, comment => comment.user)
    comments: Comment[];

}
