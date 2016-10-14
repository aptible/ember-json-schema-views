import Ember from 'ember';
import SchemaFieldInitializerMixin from 'ember-json-schema-views/mixins/components/schema-field-initializer';

export default Ember.Component.extend(SchemaFieldInitializerMixin, {
  init() {
    this._super(...arguments);
    let { key, property, document } = this.getProperties(['key', 'property', 'document']);

    if (typeof document.get(key) !== 'undefined' && document.get(key) !== '') {
      return;
    }

    if (!Ember.getWithDefault(property, 'displayProperties.prompt', false)) {
      // No value set and no prompt set.  We should select the first value
      let [initialValue] = property.validValues;
      document.set(key, initialValue);
      this.set('value', initialValue);
    }

  },

  classNames: ['schema-field-component', 'schema-field-select'],
  getCurrentValue() {
    return this.$('select').val();
  }
});