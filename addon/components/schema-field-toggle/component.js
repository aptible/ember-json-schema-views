import Ember from 'ember';

export const DEFAULT_SIZE = 'small';
export const DEFAULT_SHOW_LABELS = false;
export const DEFAULT_TRUE_LABEL = 'True';
export const DEFAULT_FALSE_LABEL = 'False';

export default Ember.Component.extend({
  classNames: ['schema-field-component', 'schema-field-toggle'],
  init() {
    this._super(...arguments);

    let key = this.get('key');
    let document = this.get('document');
    let defaultValue = this.get('property.default');
    let initialValue =  false;
    let documentValue = document.get(key);

    if (typeof defaultValue !== 'undefined') {
      initialValue = defaultValue;
    }

    if (typeof documentValue !== 'undefined') {
      initialValue = documentValue;
    }

    this.set('value', initialValue);
  },

  toggleSize: Ember.computed('property.displayProperties.toggleSize', function() {
    return this.get('property.displayProperties.toggleSize') || DEFAULT_SIZE;
  }),

  showLabels: Ember.computed('property.displayProperties.showLabels', function() {
    return this.get('property.displayProperties.showLabels') || DEFAULT_SHOW_LABELS;
  }),

  trueLabel: Ember.computed('property.displayProperties.labels.trueLabel', function() {
    return `${this.get('property.displayProperties.labels.trueLabel') || DEFAULT_TRUE_LABEL}::true`;
  }),

  falseLabel: Ember.computed('property.displayProperties.labels.falseLabel', function() {
    return `${this.get('property.displayProperties.labels.falseLabel') || DEFAULT_FALSE_LABEL}::false`;
  }),

  name: Ember.computed.alias('key'),

  actions: {
    onToggle(toggleParams) {
      let { newValue }= toggleParams;
      let document = this.get('document');

      document.set(this.get('key'), newValue);
      this.set('value', newValue);
      this.sendAction('changed', newValue);
    }
  }
});