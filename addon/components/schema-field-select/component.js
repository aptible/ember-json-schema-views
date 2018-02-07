import Component from '@ember/component';
import { getWithDefault } from '@ember/object';
import { isNone } from '@ember/utils';
import SchemaFieldInitializerMixin from 'ember-json-schema-views/mixins/components/schema-field-initializer';

export default Component.extend(SchemaFieldInitializerMixin, {
  init() {
    this._super(...arguments);
    let { key, property, document } = this.getProperties(['key', 'property', 'document']);

    if (!isNone(document.get(key))) {
      // Document has a value set, don't overwrite what is set
      return;
    }

    let initialValue;

    if (property.default) {
      // Property has a default value
      initialValue = property.default;

    } else if (!getWithDefault(property, 'displayProperties.prompt', false)) {
      // No Prompt
      initialValue = property.validValues[0];
    }

    document.set(key, initialValue);
    this.set('value', initialValue);
  },

  classNames: ['schema-field-component', 'schema-field-select'],
  getCurrentValue() {
    return this.$('select').val();
  }
});