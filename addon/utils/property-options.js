import Ember from 'ember';

export function getPropertyInputType(property) {
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

export default Ember.Object.extend({
  isVisible: true,
  init(params) {
    Ember.assert('`key` is a required parameter for PropertyOptions constructor', params.key);
    Ember.assert('`property` is a required parameter for PropertyOptions constructor', params.property);
    Ember.assert('`document` is a required parameter for PropertyOptions constructor', params.document);

    this._super(...arguments);
    this.setProperties({
      type: getPropertyInputType(params.property),
      childProperties: params.property.properties
    });

    if (!params.property.isDependentProperty) {
      return;
    }

    this._observers = {};

    params.property.dependsOnProperties.forEach((dependsOn) => {
      this._observers[dependsOn.documentPath] = Ember.run.bind(this, this._onUpdatedMasterProperty);
      params.document.values.addObserver(dependsOn.documentPath, this._observers[dependsOn.documentPath]);
    });

    this._onUpdatedMasterProperty();
  },

  teardown() {
    let document = this.get('document');

    for (let path in this._observers) {
      document.values.removeObserver(path, this._observers[path]);
    }

    this._observers = {};
  },

  _onUpdatedMasterProperty() {
    let { property, document } = this.getProperties('property', 'document');
    let isVisible = property.dependsOnProperties.filter((dependsOn) => {
      return !!document.get(dependsOn.documentPath);
    }).length > 0;

    this.setProperties({ isVisible });
  }
});