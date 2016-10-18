import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  showProperty: true,
  init() {
    this._super(...arguments);
    let property = this.get('property.property');
    let document = this.get('document');

    if (!property.visible) {
      this.set('showProperty', false);
      return;
    }

    if (!property.isDependentProperty) {
      return;
    }

    this.setProperties({
      isDependentProperty: true,
      dependsOnProperties: property.dependsOnProperties
    });

    property.dependsOnProperties.forEach((dependsOn) => {
      this.callback = Ember.run.bind(this, this._onUpdatedMasterProperty);
      document.values.addObserver(dependsOn.property.documentPath, this.callback);
    });

    document.values.addObserver('didLoad', this.callback);
    this._onUpdatedMasterProperty();
  },

  propertyOptions: Ember.computed('showProperty', function() {
    let showProperty = this.get('showProperty');
    return { showProperty };
  }),

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

    document.values.removeObserver('didLoad', this.callback);
  },

  _onUpdatedMasterProperty() {
    let property = this.get('property.property');
    let document = this.get('document');
    let dependencyCount = property.dependsOnProperties.length;

    let showProperty = property.dependsOnProperties.filter((dependsOn) => {
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

    }).length === dependencyCount;

    this.setProperties({ showProperty });

    if (showProperty) {
      this._setDefaultValue();
    } else {
      document.set(property.documentPath, null);
    }
  },

  _setDefaultValue() {
    let document = this.get('document');
    let property = this.get('property.property');
    let defaultValue = this.get('property.default');
    let value;

    if (!Ember.isNone(document.get(property.documentPath))) {
      return;
    }

    if (Ember.isNone(defaultValue)) {
      value = { 'array': [], 'string': '', 'object': {} }[property.type];
    } else {
      value = defaultValue;
    }

    if (!Ember.isNone(value)) {
      document.set(property.documentPath, value);
    }
  }
});
