import { get } from '@ember/object';
import Component from '@ember/component';
import { computed } from '@ember/object';

export function getPropertyInputType(property) {
  if (property.type === 'array') {
    return 'checkbox';
  }

  if (property.type === 'object') {
    return 'object';
  }

  if (property.validValues && Array.isArray(property.validValues)) {
    return 'select';
  }

  if (property.type === 'boolean') {
    if (get(property, 'displayProperties.useToggle')) {
      return 'toggle';
    } else {
      return 'radio';
    }
  }

  return 'text';
}

export default Component.extend({
  tagName: '',
  recursive: true,
  propertyCollection: computed('properties.[]', function() {
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
