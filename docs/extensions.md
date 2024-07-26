// extending classes

class BaseClass {
    constructor(public name: string) {}
    greet() { return `Hello, ${this.name}!`; }
}

class ExtendedClass extends BaseClass {
    constructor(name: string, public age: number) { super(name); }
    describe() { return `${this.name} is ${this.age} years old.`; }
}

// extending interfaces

interface Person {
    name: string;
    greet(): string;
}

interface ExtendedPerson extends Person {
    age: number;
    describe(): string;
}

class DetailedPerson implements ExtendedPerson {
    constructor(public name: string, public age: number) {}
    greet() { return `Hello, ${this.name}!`; }
    describe() { return `${this.name} is ${this.age} years old.`; }
}

// Exporting a class
export class ExtendedClass extends BaseClass { ... }

// Exporting an interface
export interface ExtendedPerson extends Person { ... }

// importing
import { ExtendedClass } from './extended';
import { DetailedPerson } from './detailedPerson';
