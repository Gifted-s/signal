// External dependencies
import { ObjectId } from "mongodb";


// Class Implementation
export  class User {
    constructor(public phone: string, public deviceToken: string, public createdAt?: Date, public id?: ObjectId) {}
}
export class Sender {
    constructor(public phone: string, public createdAt?: Date, public id?: ObjectId) {}
}