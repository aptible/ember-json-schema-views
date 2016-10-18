import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import Schema from 'ember-json-schema-document/models/schema';
import hbs from 'htmlbars-inline-precompile';

Error.stackTraceLimit = 100;

let flatSchema = {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'id': 'http://jsonschema.net',
  'type': 'object',
  'properties': {
    'primaryLocation': {
      'id': 'http://jsonschema.net/0/primary',
      'type': 'boolean',
      'default': false,
      'displayProperties': {
        'title': 'Primary location'
      }
    },
    'isActive': {
      'type': 'boolean',
      'default': false,
      'displayProperties': {
        'title': 'Is Active Location?',
        'useToggle': true
      }
    },
    'description': {
      'id': 'http://jsonschema.net/description',
      'default': 'Headquarters',
      'type': 'string',
      'displayProperties': {
        'title': 'Description'
      }
    },
    'city': {
      'id': 'http://jsonschema.net/city',
      'type': 'string',
      'displayProperties': {
        'title': 'City'
      }
    },
    'state': {
      'id': 'http://jsonschema.net/state',
      'type': 'string',
      'enum': ['RI', 'NY', 'IN', 'CA', 'UT', 'CO'],
      'displayProperties': {
        'title': 'State'
      }
    },
    'zip': {
      'id': 'http://jsonschema.net/state',
      'type': 'string',
      'displayProperties': {
        'title': 'Zip'
      }
    }
  },
  'required': [
    'description'
  ]
};

let nestedSchema = {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'id': 'http://jsonschema.net',
  'type': 'object',
  'properties': {
    'primaryLocation': {
      'id': 'http://jsonschema.net/0/primary',
      'type': 'boolean',
      'default': false,
      'displayProperties': {
        'title': 'Primary location'
      }
    },
    'isActive': {
      'type': 'boolean',
      'default': false,
      'displayProperties': {
        'title': 'Is Active Location?',
        'useToggle': true
      }
    },
    'description': {
      'id': 'http://jsonschema.net/description',
      'type': 'string',
      'default': 'Headquarters',
      'displayProperties': {
        'title': 'Description'
      }
    },
    'address': {
      'id': 'http://jsonschema.net/address',
      'type': 'object',
      'properties': {
        'streetAddress': {
          'id': 'http://jsonschema.net/address/streetAddress',
          'type': 'string'
        },
        'city': {
          'id': 'http://jsonschema.net/address/city',
          'type': 'string'
        },
        'state': {
          'id': 'http://jsonschema.net/address/state',
          'type': 'string',
          'enum': [ 'RI', 'NY', 'IN', 'CA', 'UT', 'CO']
        },
        'zip': {
          'id': 'http://jsonschema.net/address/zip',
          'type': 'string'
        }
      },
      'required': [
        'streetAddress',
        'city'
      ]
    }
  },
  'required': [
    'description',
    'address'
  ]
};

moduleForComponent('each-property', {
  integration: true
});

test('can render flat schema document properties', function(assert) {
  let schema = new Schema(flatSchema);
  let { properties } = schema;
  let document = schema.buildDocument();

  this.setProperties({ document, properties });

  this.render(hbs`
    {{#each-property properties=properties document=document as |key property type|}}
      {{component (concat 'schema-field-' type) key=key property=property document=document}}
    {{/each-property}}
  `);

  assert.equal(this.$('input[type="radio"][name="primaryLocation"]').length, 2, 'has two radios');
  assert.equal(this.$('.x-toggle-btn').length, 1, 'has a toggle button');
  assert.equal(this.$('input[type="text"][name="description"]').length, 1, 'has a description text field');
  assert.equal(this.$('input[type="text"][name="description"]').val(), 'Headquarters', 'description has default value');
  assert.equal(this.$('input[type="text"][name="city"]').length, 1, 'has a city text field');
  assert.equal(this.$('select[name="state"]').length, 1, 'has a state select');
  assert.equal(this.$('select[name="state"] option').length, 6, 'has 6 choices');
  assert.equal(this.$('input[type="text"][name="zip"]').length, 1, 'has a zip text field');
});

test('can render nested schema document properties', function(assert) {
  let schema = new Schema(nestedSchema);
  let { properties } = schema;
  let document = schema.buildDocument();

  this.setProperties({ document, properties });

  this.render(hbs`
    {{#each-property properties=properties document=document as |key property type|}}
      {{component (concat 'schema-field-' type) key=key property=property document=document}}
    {{/each-property}}
  `);

  assert.equal(this.$('input[type="radio"][name="primaryLocation"]').length, 2, 'has two radios');
  assert.equal(this.$('.x-toggle-btn').length, 1, 'has a toggle button');
  assert.equal(this.$('input[type="text"][name="description"]').length, 1, 'has a description text field');
  assert.equal(this.$('input[type="text"][name="description"]').val(), 'Headquarters', 'description has default value');
  assert.equal(this.$('input[type="text"][name="address.city"]').length, 1, 'has a city text field');
  assert.equal(this.$('select[name="address.state"]').length, 1, 'has a state select');
  assert.equal(this.$('select[name="address.state"] option').length, 6, 'has 6 choices');
  assert.equal(this.$('input[type="text"][name="address.zip"]').length, 1, 'has a zip text field');
});

test('`recrusive=false` will prevent recursively iterating child properties', function(assert) {
  let schema = new Schema(nestedSchema);
  let { properties } = schema;
  let document = schema.buildDocument();

  this.setProperties({ document, properties });

  this.render(hbs`
    {{#each-property properties=properties document=document recursive=false as |key property type|}}
      {{component (concat 'schema-field-' type) key=key property=property document=document}}
    {{/each-property}}
  `);

  assert.equal(this.$('input[type="radio"][name="primaryLocation"]').length, 2, 'has two radios');
  assert.equal(this.$('.x-toggle-btn').length, 1, 'has a toggle button');
  assert.equal(this.$('input[type="text"][name="description"]').length, 1, 'has a description text field');
  assert.equal(this.$('input[type="text"][name="description"]').val(), 'Headquarters', 'description has default value');
  assert.equal(this.$('input[type="text"][name="address.city"]').length, 0, 'no city text field present');
  assert.equal(this.$('select[name="address.state"]').length, 0, 'no state select present');
  assert.equal(this.$('input[type="text"][name="address.zip"]').length, 0, 'no zip text field present');
});

test('`visible=false` properties will not be rendered', function(assert) {
  let invisiblePropSchema = Ember.$.extend({}, {}, flatSchema);
  invisiblePropSchema.properties.primaryLocation._visible = false;
  let schema = new Schema(invisiblePropSchema);
  let { properties } = schema;
  let document = schema.buildDocument();

  this.setProperties({ document, properties });

  this.render(hbs`
    {{#each-property properties=properties document=document as |key property type options|}}
      {{#if options.showProperty}}
        {{component (concat 'schema-field-' type) key=key property=property document=document}}
      {{/if}}
    {{/each-property}}
  `);

  assert.equal(this.$('input[type="radio"][name="primaryLocation"]').length, 0, '`primaryLocation` property is hidden.');
  assert.equal(this.$('input[type="text"][name="description"]').length, 1, 'has a description text field');
});
