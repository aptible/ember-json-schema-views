import Ember from 'ember';

export const DEFAULT_TRUE_LABEL = 'True';
export const DEFAULT_FALSE_LABEL = 'False';

export default Ember.Component.extend({
  classNames: ['schema-field-radio'],
  init() {
    this._super(...arguments);
    let key = this.get('key');
    let document = this.get('document');
    let defaultValue = this.get('property.default');
    let initialValue =  '';
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

  trueLabel: Ember.computed('property.displayProperties.labels.trueLabel', function() {
    return this.get('property.displayProperties.labels.trueLabel') || DEFAULT_TRUE_LABEL;
  }),

  falseLabel: Ember.computed('property.displayProperties.labels.falseLabel', function() {
    return this.get('property.displayProperties.labels.falseLabel') || DEFAULT_FALSE_LABEL;
  }),

  actions: {
    changed() {
      let document = this.get('document');
      let key = this.get('key');
      let value = this.$('input[type="radio"]:checked').val();

      if (value && value.toLowerCase() === 'true') {
        value = true;
      } else {
        value = false;
      }

      document.set(key, value);
      this.set('value', value);
      this.sendAction('changed', value);
    }
  }
});