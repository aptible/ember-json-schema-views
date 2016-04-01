import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  showProperty: true,
  init() {
    this._super(...arguments);
    let property = this.get('property.property');
    let document = this.get('document');

    if (!property.isDependentProperty) {
      return;
    }

    this.setProperties({
      isDependentProperty: true,
      dependsOnProperties: property.dependsOnProperties
    });

    // If this property depends on other values, set up observers.
    // REVIEW: It would be ideal to do this with computeds, but it's not clear
    // how to set up computeds for either all child properties of an object or
    // a run-time generated object key.

    property.dependsOnProperties.forEach((dependsOn) => {
      let callback = Ember.run.bind(this, this._onUpdatedMasterProperty);
      document.values.addObserver(dependsOn.property.documentPath, callback);
    });

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
      document.values.removeObserver(dependsOn.property.documentPath)
    });
  },

  _onUpdatedMasterProperty() {
    let property = this.get('property.property');
    let document = this.get('document');
    let dependencyCount = property.dependsOnProperties.length;
    let dependentValue = null;

    let showProperty = property.dependsOnProperties.filter((dependsOn) => {
      let currentValue = document.get(dependsOn.property.documentPath);
      return dependsOn.values.indexOf(currentValue) > -1;
    }).length === dependencyCount;


    if (showProperty) {
      dependentValue = { array: [], string: '', 'boolean': null }[property.type];
    }

    document.set(property.documentPath, dependentValue);
    this.setProperties({ showProperty });
  }
});