import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  isVisible: true,
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
    // an a run-time generated object key.

    property.dependsOnProperties.forEach((dependsOn) => {
      let callback = Ember.run.bind(this, this._onUpdatedMasterProperty);
      document.values.addObserver(dependsOn.documentPath, callback);
    });

    this._onUpdatedMasterProperty();
  },

  propertyOptions: Ember.computed('isVisible', function() {
    let isVisible = this.get('isVisible');
    return { isVisible };
  }),

  willDestroyElement() {
    this._super(...arguments);

    let property = this.get('property.property');
    let document = this.get('document');

    if (!property.isDependentProperty) {
      return;
    }

    property.dependsOnProperties.forEach((dependsOn) => {
      let callback = Ember.run.bind(this, this._onUpdatedMasterProperty);
      document.values.removeObserver(dependsOn.documentPath, callback);
    });
  },

  _onUpdatedMasterProperty() {
    let property = this.get('property.property');
    let document = this.get('document');

    let isVisible = property.dependsOnProperties.filter((dependsOn) => {
      return !!document.get(dependsOn.documentPath);
    }).length > 0;

    this.setProperties({ isVisible });
  }
});