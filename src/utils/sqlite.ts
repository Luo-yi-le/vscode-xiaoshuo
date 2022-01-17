/* eslint-disable no-useless-escape */
/* eslint-disable prefer-const */
import * as path from 'path';
import * as sqlite from 'sqlite3';
import * as vscode from "vscode";

export class Sqlite implements ISqlite {
    private filename = "bookshelf4.db";

    public db: any;
    private whereOpt: any[] = [];
    private fieldOpt: any[] = [];
    private orderOpt: any[] = [];
    private serialize: boolean | any = false;
    private tableOpt: string | any = "";

    constructor() {
        this.init()
    }
    private init() {
        this.db = new sqlite.Database(this.filename, function (e: any) {
            if (e) {
                throw e;
            }
        });

        this.db.get("SELECT * FROM book", (e: any) => {
            if (e) {
                // id 名称 类型 链接地址 当前阅读章节 章节索引
                this.db.run("CREATE TABLE book(id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT,type TEXT,url TEXT,nav_id int,nav_index INT,active INT);");
                // id 书籍id 链接地址 阅读状态 章节内容
                this.db.run("CREATE TABLE book_nav(id INTEGER PRIMARY KEY AUTOINCREMENT,book_id INT,sort INT,url TEXT, title TEXT,read INT,content TEXT);");
            } else {
                this.db.get("select sort from book_nav limit 0,1", (e: any) => {
                    if (e) {
                        console.log(e);
                        this.db.run("ALTER TABLE book_nav ADD sort INT DEFAULT(0);").then((err: any) => {
                            console.log(err);
                        });
                    }
                });
            }

        });
    }
    public order(field: string | string[], type: string) {
        if (Array.isArray(field)) {
            this.orderOpt = this.orderOpt.concat(field);
            return this;
        }
        this.orderOpt.push(`${field} ${type}`);
        return this;
    };

    public startSerialize() {
        this.serialize = true;
    };
    public async run(sql: string) {
        return new Promise((resolve) => {
            this.db.run(sql, function (e: any) {
                if (e) {
                    console.log(sql);
                }
                resolve(1);
            });
        });
    };
    public table(name: string) {
        this.tableOpt = name;
        this.whereOpt = [];
        this.fieldOpt = [];
        this.orderOpt = [];
        return this;
    }
    async create(data: any) {
        const field = Object.keys(data);
        // eslint-disable-next-line prefer-const
        let value: any = [];
        Object.values(data).forEach((item) => {
            if (typeof item === "number") {
                value.push(`${item}`);
            } else {
                if (typeof item === "string") {
                    // eslint-disable-next-line no-useless-escape
                    item = item.replace(/\'/g, "\"");
                    // eslint-disable-next-line no-useless-escape
                    value.push(`\'${item}\'`);
                } else {
                    // eslint-disable-next-line no-useless-escape
                    value.push(`\'${item}\'`);
                }
            }
        });

        const sql = `INSERT INTO ${this.tableOpt}(${field}) VALUEs(${value});`;
        return await this.run(sql);
    };
    async createPipe(data: any) {
        const field = Object.keys(data);
        // eslint-disable-next-line prefer-const
        let value: any = [];
        data.forEach((item: any) => {
            Object.values(data).forEach((item) => {
                if (typeof item === "number") {
                    value.push(`${item}`);
                } else {
                    if (typeof item === "string") {
                        // eslint-disable-next-line no-useless-escape
                        item = item.replace("\'", "\"");
                        // eslint-disable-next-line no-useless-escape
                        value.push(`\'${item}\'`);
                    }
                }
            });

        });

        const sql = `INSERT INTO ${this.tableOpt}(${field}) VALUEs(${value});`;
        console.log(sql);

        return await this.run(sql);
    };
    async delete(sql: string) {
        return Promise.resolve()
    };
    async update(data: any) {
        let where = this.whereOpt.join(" AND ");
        let dataArr = [];
        for (let key in data) {
            if (typeof data[key] === "string") {
                let value = data[key].replace("\'", "\"");
                dataArr.push(`${key} =  \'${value}\'`);
            } else {
                let value = data[key];
                dataArr.push(`${key} =  \'${value}\'`);
            }
        }
        let dataStr = dataArr.join(",");
        const sql = `UPDATE ${this.tableOpt} SET  ${dataStr}  WHERE ${where};`;
        return this.run(sql);
    };
    public async find() {
        return new Promise((resolve, reject) => {
            let field = this.fieldOpt.join(",") || "*";
            let sql = `SELECT ${field} FROM ${this.tableOpt}`;
            if (this.whereOpt.length) {
                sql += " WHERE " + this.whereOpt.join(" AND ");
            }
            if (this.orderOpt.length) {
                sql += " ORDER BY " + this.orderOpt.join(",");
            }
            let data = this.db.get(sql, function (err: any, row: any) {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }
    public field(name: any) {
        if (Array.isArray(name)) {
            this.fieldOpt = this.fieldOpt.concat(name);
        } else if (typeof name === "string") {
            this.fieldOpt = this.fieldOpt.concat(name.split(','));
        }
        return this;
    }
    public where(field: any, op: any = "", value: any = "") {
        if (typeof field === "object") {
            for (let key in field) {
                if (typeof field[key] === "number") {
                    this.whereOpt.push(`${key} = ${field[key]}`);
                } else {
                    this.whereOpt.push(`${key} = \`${field[key]}\``);
                }
            }
            return this;
        }
        if ("" === value) {
            value = op;
            op = "=";
        }
        if (typeof value === "number") {
            this.whereOpt.push(`${field} ${op} ${value}`);
        } else {
            this.whereOpt.push(`${field} ${op} "${value}"`);
        }
        return this;
    }
    public async select() {
        return new Promise((resolve, reject) => {
            let field = this.fieldOpt.join(",") || "*";
            let where = this.whereOpt.join(" AND ");
            if (!this.tableOpt) {
                return false;
            }
            let sql = `SELECT ${field} FROM ${this.tableOpt} `;

            if (where) {
                sql += ` WHERE ${where}`;
            }
            if (this.orderOpt.length) {
                sql += " ORDER BY " + this.orderOpt.join(",");
            }
            this.db.all(sql, function (err: any, row: any) {
                if (err) {
                    console.log(sql);
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });

    }

}

interface ISqlite {
    order: (field: Array<string> | string, type: string) => this;
    startSerialize: () => any;
    run: (sql: string) => Promise<unknown>;
    create: (data: any) => Promise<unknown>;
    createPipe: (data: any) => Promise<unknown>;
    delete: (sql: string) => Promise<unknown>;
    update: (data: any) => Promise<unknown>;
    find: (sql: any) => any;
}