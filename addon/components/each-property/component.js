import Ember from 'ember';
import PropertyOptions from 'ember-json-schema-views/utils/property-options';

export default Ember.Component.extend({
  tagName: '',

  propertyCollection: Ember.computed('properties.[]', 'document', function() {
    let { properties, document } = this.getProperties('properties', 'document');
    let propertyKeys = Object.keys(properties);

    return propertyKeys.map((key) => {
      return new PropertyOptions({
        key, document, property: properties[key]
      });
    });
  }),

  willDestroyElement() {
    this.get('propertyCollection').forEach((property) => {
      property.teardown();
    });
  }
});
