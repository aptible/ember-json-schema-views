import Component from '@ember/component';
import { schedule } from '@ember/runloop';

export default Component.extend({
  classNames: ['schema-field-component', 'schema-field-checkbox'],
  init() {
    this._super(...arguments);
    let key = this.get('key');
    let jsonDocument = this.get('document');
    let defaultValue = this.get('property.default');

    schedule('afterRender', () => {
      let initialValue =  null;
      let documentValue = jsonDocument.get(key);

      if (typeof defaultValue !== 'undefined') {
        initialValue = defaultValue;
      }

      if (typeof documentValue !== 'undefined') {
        initialValue = documentValue;
      }

      if (initialValue !== null) {
        this.set('value', initialValue);
        jsonDocument.set(key, initialValue);
      }
    });
  },

  actions: {
    update(values) {
      let { document, key } = this.getProperties('document', 'key');
      document.set(key, values);
      this.set('value', values);
      this.sendAction('changed', values); // eslint-disable-line ember/closure-actions
    }
  }
});