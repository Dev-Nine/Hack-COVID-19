import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";
import {User} from "./User";
import {Comment} from "./Comment";

@Entity()
export class Notice {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    abstract: string;

    @Column()
    date: Date;

    @Column()
    text: string;

    @OneToMany(type => Comment, comment => comment.notice)
    comments: Comment[];

    @ManyToOne(type => User, user => user.notices, {
        eager: true // carregar dados da foreign key
    })
    user: User;

    public isValid(): boolean {
        if (this.title && this.date && this.text && this.user) {
            return true;
        } 
        return false;
    }
}
