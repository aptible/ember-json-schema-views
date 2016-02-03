# ember-json-schema-views

This addon extends aptible/ember-json-schema-document with basic JSON Schema-driven form components.

The following JSON Schema property types are supported:

* `boolean` using `schema-field-radio` or `schema-field-toggle`
* `enum` using `schema-field-select`
* `text` using `schema-field-text`

Schema properties can be recursed using the `each-property` component.

### Example: Generating a Schema-driven form by recursing Schema properties

The following template will iterate a schema's properties and build UI components
that are bound to corresponding document values;

```js
var schema = new Schema(jsonBlob);
var document = schema.buildDocument();
var properties = schema.properties();
```

```hbs
{{#each-property properties=properties as |key property type|}}
  <label>{{property.displayProperties.title}}</label>
  {{component (concat 'schema-field-' type) key=key property=property document=location}}
{{/each-property}}
```

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).