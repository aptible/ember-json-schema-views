import Component from '@ember/component';
import { schedule } from '@ember/runloop';
import { isNone } from '@ember/utils';

export default Component.extend({
  tagName: '',
  init() {
    this._super(...arguments);
    let property = this.get('property.property');
    let document = this.get('document');
    const defaultProps = { propertyOptions: { showProperty: true } };

    if (!property.isDependentProperty) {
      this.setProperties(defaultProps);
      return;
    }

    this.setProperties({
      isDependentProperty: true,
      dependsOnProperties: property.dependsOnProperties,
      propertyOptions: { showProperty: this._shouldPropertyBeVisible() }
    });

    property.dependsOnProperties.forEach((dependsOn) => {
      const prop = dependsOn.property.documentPath;
      document.values.addObserver(prop, this._updateProperties.bind(this));
    });

    document.values.addObserver('didLoad', this._updateProperties.bind(this));
    this._updateProperties();
  },

  _shouldPropertyBeVisible() {
    const property = this.get('property.property');
    const document = this.get('document');
    const dependencyCount = property.dependsOnProperties.length;

    const validDependencies = property.dependsOnProperties.filter((dependsOn) => {
      // `dependsOn.values` is an array of required values.  If the property's
      // current value is included in this array, it is now required
      let currentValue = document.get(dependsOn.property.documentPath);

      if (dependsOn.property.type === 'array') {
        // For array types, we are checking to see if any of the current values
        // are included in `dependsOn.values`.
        return Array.isArray(currentValue) && currentValue.filter((value) => {
          return dependsOn.values.indexOf(value) > -1;
        }).length > 0;
      } else {
        return dependsOn.values.indexOf(currentValue) > -1;
      }
    }).length;

    return validDependencies === dependencyCount;
  },

  _updateProperties() {
    const property = this.get('property.property');
    const document = this.get('document');
    const showProperty = this._shouldPropertyBeVisible();
    if (showProperty !== this.get('propertyOptions.showProperty')) {
      this.set('propertyOptions.showProperty', showProperty);
    }

    schedule('afterRender', () => {
      if (showProperty) {
        this._setVisibleValue();
      } else if (document.get(property.documentPath) !== null) {
        document.set(property.documentPath, null);
      }
    });
  },

  _setVisibleValue() {
    let document = this.get('document');
    let property = this.get('property.property');
    let defaultValue = this.get('property.default');
    let value;

    if (!isNone(document.get(property.documentPath))) {
      return;
    }

    if (isNone(defaultValue)) {
      value = { 'array': [], 'string': '', 'object': {}, 'boolean': false }[property.type];
    } else {
      value = defaultValue;
    }

    if (!isNone(value)) {
      document.set(property.documentPath, value);
    }
  },

  willDestroyElement() {
    this._super(...arguments);

    let property = this.get('property.property');
    let document = this.get('document');

    if (!property.isDependentProperty) {
      return;
    }

    property.dependsOnProperties.forEach((dependsOn) => {
      document.values.removeObserver(dependsOn.property.documentPath);
    });

    document.values.removeObserver('didLoad', this._updatedPropertyListener);
  }
});
