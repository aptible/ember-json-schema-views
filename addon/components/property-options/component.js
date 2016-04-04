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
      let currentValue = document.get(dependsOn.property.documentPath);
      return dependsOn.values.indexOf(currentValue) > -1;
    }).length === dependencyCount;

    this.setProperties({ showProperty });

    if (!showProperty) {
      document.set(property.documentPath, null);
    }
  }
});
