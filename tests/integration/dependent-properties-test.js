import { moduleForComponent, test } from 'ember-qunit';
import Schema from 'ember-json-schema-document/models/schema';
import hbs from 'htmlbars-inline-precompile';

let arrayDependencySchema = {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'id': 'http://jsonschema.net',
  'type': 'object',
  'properties': {
    'vulnerabilityScanner': {
      'type': 'object',
      'properties': {
        'provider': {
          'type': 'array',
          'title': 'Which provider do you use?',
          'items': {
            'type': 'string',
            'enum': [
              'Amazon',
              'Google',
              'Other'
            ]
          }
        },

        'other': {
          'title': 'Which other provider do you use?',
          'type': 'text',
          displayProperties: { placeholder: 'other' }
        }
      },

      'required': [ 'provider' ],
      '_dependencies': { 'other': { 'provider': 'Other' } }
    }
  }
};

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
          'title': 'Do you use vulnerability scanners?'
        },

        'provider': {
          'title': 'Which provider do you use?',
          'type': 'text',
          displayProperties: { placeholder: 'provider' }
        },

        'frequency': {
          'title': 'How often do you scan?',
          'type': 'text',
          'enum': ['Daily', 'Weekly', 'Monthly', 'Semi-annually', 'Annually']
        },

        'whyNot': {
          'title': 'Why don\'t you use a vulnerability scanner?',
          'type': 'text',
          displayProperties: { placeholder: 'why not' }
        }
      },

      'required': [
        'usesVulnerabilityScanners'
      ],

      '_dependencies': {
        'provider': { 'usesVulnerabilityScanners': true },
        'frequency': { 'usesVulnerabilityScanners': true },
        'whyNot': { 'usesVulnerabilityScanners': false }
      }
    }
  }
};

moduleForComponent('dependent-properties', {
  integration: true
});

test('renders dependent properties', function(assert) {
  let schema = new Schema(schemaBody);
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

  assert.equal(this.$('input[name="vulnerabilityScanner.usesVulnerabilityScanners"]').length, 2, 'shows initial toggle');
  assert.equal(this.$('input[name="vulnerabilityScanner.provider"]').length, 0, 'doesn\'t show provider');
  assert.equal(this.$('select[name="vulnerabilityScanner.frequency"]').length, 0, 'doesn\'t show frequency select');
  assert.equal(this.$('input[name="vulnerabilityScanner.whyNot"]').length, 1, 'shows whynot text');

  this.$('input[name="vulnerabilityScanner.usesVulnerabilityScanners"][value="true"]').click();
  this.$('input[name="vulnerabilityScanner.usesVulnerabilityScanners"]').trigger('change');

  assert.equal(this.$('input[name="vulnerabilityScanner.provider"]').length, 1, 'shows provider');
  assert.equal(this.$('select[name="vulnerabilityScanner.frequency"]').length, 1, 'shows frequency select');
  assert.equal(this.$('input[name="vulnerabilityScanner.whyNot"]').length, 0, 'doesn\'t shows whynot text');

});

test('renders dependent properties with array values', function(assert) {
  let schema = new Schema(arrayDependencySchema);
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

  assert.equal(this.$('.checkbox label span:contains(Amazon)').length, 1, 'shows provider options');
  assert.equal(this.$('input[name="vulnerabilityScanner.other"]').length, 0, 'doesn\'t show other');

  this.$('.checkbox label span:contains(Other)').click();
  assert.equal(this.$('input[name="vulnerabilityScanner.other"]').length, 1, 'other is visible');
});
