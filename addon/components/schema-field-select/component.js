import Ember from 'ember';
import SchemaFieldInitializerMixin from 'ember-json-schema-views/mixins/components/schema-field-initializer';

export default Ember.Component.extend(SchemaFieldInitializerMixin, {
  classNames: ['schema-field-component', 'schema-field-select'],
  getCurrentValue() {
    return this.$('select').val();
  }
});