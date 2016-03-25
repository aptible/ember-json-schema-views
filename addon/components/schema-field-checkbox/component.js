import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['schema-field-checkbox'],
  init() {
    this._super(...arguments);
    let key = this.get('key');
    let document = this.get('document');
    let defaultValue = this.get('property.default');
    let initialValue =  [];
    let documentValue = document.get(key);

    if (typeof defaultValue !== 'undefined') {
      initialValue = defaultValue;
    }

    if (typeof documentValue !== 'undefined') {
      initialValue = documentValue;
    }

    this.set('value', initialValue);
    document.set(key, initialValue);
  },

  actions: {
    update(values) {
      let { document, key } = this.getProperties('document', 'key');

      document.set(key, values);
      this.set('value', values);
      this.sendAction('changed', values);
    }
  }
});