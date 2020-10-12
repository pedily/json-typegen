# json-typings

> Generate TypeScript type definitions from JSON-compatible JavaScript objects

Do you want to get type declarations for JSON-like JavaScript objects at runtime?
Do you **NOT** want to ship 8MB of TypeScript as a dependency to do so?
Then this might be what you are looking for!

## Usage
TL;DR: take a JSON-like value and pass it into `getDeclaration`, get back its typings.
```js
const { getDeclaration } = require('json-typings')

const person = {
    firstname: 'John',
    lastname: 'Doe',
    luckyNumber: 42,
    awesome: true,
    children: [
        'Jane',
        'Max'
    ]
}

console.log(getDeclaration(person));
```

outputs *(without linebreaks and spaces)*
```
{
    firstname: string;
    lastname: string;
    luckyNumber: number;
    awesome: bolean;
    chlidren: string[];
}
```
The above output can be used to describe this object as a TypeScript declaration.
You can add it to a .d.ts file like this:
```typescript
declare const person = { firstname: string; /* ... */ };
```

## API

```js
const { getDeclaration } = require('json-typings')
```


## Install

With [npm](https://npmjs.org/) installed, run

```
$ npm install json-typings
```

## License

MIT

