import Ember from 'ember';

export function getPropertyInputType(property) {
  if (property.type === 'array') {
    return 'checkbox';
  }

  if (property.validValues && Array.isArray(property.validValues)) {
    return 'select';
  }

  if (property.type === 'boolean') {
    if (Ember.get(property, 'displayProperties.useToggle')) {
      return 'toggle';
    } else {
      return 'radio';
    }
  }

  return 'text';
}

export default Ember.Component.extend({
  tagName: '',
  recursive: true,
  propertyCollection: Ember.computed('properties.[]', function() {
    let { properties, recursive } = this.getProperties('properties', 'recursive');
    let propertyKeys = Object.keys(properties);

    return propertyKeys.map((key) => {
      let property = properties[key];
      let showChildProperties = recursive && property.properties;

      return { key, property, type: getPropertyInputType(property),
               showChildProperties, childProperties: property.properties };
    });
  })
});
