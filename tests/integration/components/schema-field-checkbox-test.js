import { moduleForComponent, test } from 'ember-qunit';
import Schema from 'ember-json-schema-document/models/schema';
import hbs from 'htmlbars-inline-precompile';

let allStates = ['IN', 'NY', 'CA', 'CO', 'UT'];
let schemaJson = {
  'type': 'object',
  'properties': {
    'states': {
      'title': 'In which of these states have you lived?',
      'type': 'array',
      'uniqueItems': true,
      'minItems': 1,
      'items': {
        'type': 'string',
        'enum': allStates
      },
      'displayProperties': {
        'recommendedValue': ['IN', 'CA'],
        'recommendedLabel': '(recommended!)'
      }
    }
  }
};

moduleForComponent('schema-field-checkbox', {
  integration: true
});

test('Basic UI', function(assert) {
  this.schema = new Schema(schemaJson);
  this.property = this.schema.properties.states;
  this.document = this.schema.buildDocument();

  this.setProperties({ key: 'states', property: this.property, document: this.document });
  this.render(hbs('{{schema-field-checkbox key=key property=property document=document}}'));

  allStates.forEach((state) => {
    assert.equal(getCheckbox(state).length, 1, `${state} checkbox is present`);
  });

  let checkedStates = ['IN', 'NY', 'CA'];
  let recommendedStates = ['IN', 'CA'];
  let recommendedTest = /recommended\!/;
  checkBoxes(checkedStates);

  checkedStates.forEach((state) => {
    assert.ok(getCheckbox(state).is(':checked'), `${state} is checked.`);
  });

  recommendedStates.forEach((state) => {
    assert.ok(recommendedTest.test(getCheckbox(state).next('span').text()), 'has recommended label');
  });

  assert.deepEqual(this.document.get('states'), ['IN', 'NY', 'CA'], 'document values are set');

  checkBoxes(['IN', 'CA']);
  assert.deepEqual(this.document.get('states'), ['NY'], 'document values are unset');
});

test('Uses existing document values when present', function(assert) {
  let checkedStates = ['NY', 'CA'];
  this.schema = new Schema(schemaJson);
  this.property = this.schema.properties.states;
  this.document = this.schema.buildDocument();
  this.document.set('states', checkedStates);

  this.setProperties({ key: 'states', property: this.property, document: this.document });
  this.render(hbs('{{schema-field-checkbox key=key property=property document=document}}'));

  checkedStates.forEach((state) => {
    assert.ok(getCheckbox(state).is(':checked'), `${state} is checked.`);
  });

  checkBoxes(['IN', 'CA'], false);
  assert.deepEqual(this.document.get('states'), ['NY', 'IN'], 'document values are unset');
});

function getCheckbox(value) {
  return this.$(`label:contains(${value}) input`);
}

function checkBoxes(states) {
  states.forEach((state) => {
    let check = getCheckbox(state);
    check.click();
  });
}
