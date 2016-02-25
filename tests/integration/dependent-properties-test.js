import { moduleForComponent, test } from 'ember-qunit';
import Schema from 'ember-json-schema-document/models/schema';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

Error.stackTraceLimit = 100;

let schemaBody = {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'id': 'http://jsonschema.net',
  'type': 'object',
  'properties': {
    'vulnerabilityScanner': {
      'type': 'object',
      'properties': {
        'usesVulnerabilityScanners': {
          'type': 'boolean',
          'default': false,
          'displayProperties': {
            'title': 'Do you use vulnerability scanners?'
          }
        },

        'provider': {
          'title': 'Which provider do you use?',
          'type': 'text'
        },

        'frequency': {
          'title': 'How often do you scan?',
          'type': 'text',
          'enum': ['Daily', 'Weekly', 'Monthly', 'Semi-annually', 'Annually']
        }
      },

      'required': [
        'usesVulnerabilityScanners'
      ],

      'dependencies': {
        'usesVulnerabilityScanners': ['provider', 'frequency']
      }
    }
  }
};

moduleForComponent('each-property', {
  integration: true
});

test('renders dependent properties', function(assert) {
  let schema = new Schema(schemaBody);
  let { properties } = schema;
  let document = schema.buildDocument();

  this.setProperties({ document, properties });

  this.render(hbs`
    {{#each-property properties=properties document=document as |key property type|}}
      {{component (concat 'schema-field-' type) key=key property=property document=document}}
    {{/each-property}}
  `);

  assert.equal(this.$('input[name="vulnerabilityScanner.usesVulnerabilityScanners"]').length, 2, 'shows initial toggle');
  assert.equal(this.$('input[name="vulnerabilityScanner.provider"]').length, 0, 'doesn\'t show provider');
  assert.equal(this.$('select[name="vulnerabilityScanner.frequency"]').length, 0, 'doesn\'t show frequency select');

  Ember.run(() => {
    this.$('input[name="vulnerabilityScanner.usesVulnerabilityScanners"][value="true"]').click();
    this.$('input[name="vulnerabilityScanner.usesVulnerabilityScanners"]').trigger('change');
  });

  assert.equal(this.$('input[name="vulnerabilityScanner.provider"]').length, 1, 'shows provider');
  assert.equal(this.$('select[name="vulnerabilityScanner.frequency"]').length, 1, 'shows frequency select');
});
