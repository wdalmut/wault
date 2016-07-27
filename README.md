# A simple vault to store things locally

A simple vault to store things locally.

```sh
$ npm install -g wault
```

## Options

Set the database path via env variable: `WAULT_PATH=~/.wault` (to have the
database at path `~/.wault`. By default the database is at path
`/tmp/wault.level`


## Use it

```sh
wault store

Password:
Key: this-is-my-key
Value: http://www.google.it/
```

```sh
wault get

Password:
Key: this-is-my-key

Here your content:
 * http://www.google.it/
```

## Multiple keys

You can mark the same value with different keys, for example: `one`, `two`, `three`

```sh
$ wault store

Password:
Key: one two three
Value: this is the value
```

Obtain a single key value

```sh
$ wault get

Password:
Key: one

Here your content:
 * this is the value
```

## Multiple values

The `wault` is always in append mode (store different values on the same key)

```sh
$ wault get

Password:
Key: one

Here your content:
 * this is the value
 * another value
```

