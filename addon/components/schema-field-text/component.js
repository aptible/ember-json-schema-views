import Component from '@ember/component';
import SchemaFieldInitializerMixin from 'ember-json-schema-views/mixins/components/schema-field-initializer';

export default Component.extend(SchemaFieldInitializerMixin, {
  classNames: ['schema-field-component', 'schema-field-text']
});