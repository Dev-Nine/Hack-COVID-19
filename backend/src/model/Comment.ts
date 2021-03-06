import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BeforeInsert } from "typeorm";
import { Notice } from "./Notice";
import { User } from "./User";

@Entity()
export class Comment {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @Column()
    date: Date;

    @ManyToOne(type => Notice, notice => notice.comments, {
        eager: true, // carregar dados da foreign key
        onDelete: "CASCADE"
    })
    notice: Notice;

    @ManyToOne(type => User, user => user.comments, {
        eager: true, // carregar dados da foreign key
        onDelete: "CASCADE"
    })
    user: User;

    @BeforeInsert()
    updateDates() {
      this.date = new Date;
    }

}
