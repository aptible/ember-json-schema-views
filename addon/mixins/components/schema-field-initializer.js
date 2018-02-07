import Mixin from '@ember/object/mixin';
import { schedule } from '@ember/runloop';
import { computed } from '@ember/object';

export default Mixin.create({
  init() {
    this._super(...arguments);
    let key = this.get('key');
    let jsonDocument = this.get('document');
    let defaultValue = this.get('property.default');

    schedule('afterRender', () => {
      let initialValue = jsonDocument.get(key) || defaultValue || '';
      this.set('value', initialValue);
      jsonDocument.set(key, initialValue);
    });
  },

  getCurrentValue() {
    this.$('input').val();
  },

  disabled: computed('property.readonly', function() {
    if (this.get('property.readonly')) {
      return 'disabled';
    }

    return false;
  }),

  actions: {
    update(value) {
      if (typeof value === 'undefined') {
        value = this.getCurrentValue();
      }
      let jsonDocument = this.get('document');
      let key = this.get('key');

      jsonDocument.set(key, value);
      this.set('value', value);
      this.sendAction('changed', value);  // eslint-disable-line ember/closure-actions
    }
  }
});
