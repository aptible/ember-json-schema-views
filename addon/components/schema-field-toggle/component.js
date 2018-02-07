import Component from '@ember/component';
import { schedule } from '@ember/runloop';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

export const DEFAULT_SIZE = 'small';
export const DEFAULT_SHOW_LABELS = false;
export const DEFAULT_TRUE_LABEL = 'True';
export const DEFAULT_FALSE_LABEL = 'False';

export default Component.extend({
  classNames: ['schema-field-component', 'schema-field-toggle'],
  init() {
    this._super(...arguments);

    let key = this.get('key');
    let document = this.get('document');

    schedule('afterRender', () => {
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

      if (initialValue !== documentValue) {
        document.set(key, initialValue);
      }
    });
  },

  toggleSize: computed('property.displayProperties.toggleSize', function() {
    return this.get('property.displayProperties.toggleSize') || DEFAULT_SIZE;
  }),

  showLabels: computed('property.displayProperties.showLabels', function() {
    return this.get('property.displayProperties.showLabels') || DEFAULT_SHOW_LABELS;
  }),

  trueLabel: computed('property.displayProperties.labels.trueLabel', function() {
    return `${this.get('property.displayProperties.labels.trueLabel') || DEFAULT_TRUE_LABEL}::true`;
  }),

  falseLabel: computed('property.displayProperties.labels.falseLabel', function() {
    return `${this.get('property.displayProperties.labels.falseLabel') || DEFAULT_FALSE_LABEL}::false`;
  }),

  name: alias('key'),

  actions: {
    onToggle(newValue) {
      let document = this.get('document');
      document.set(this.get('key'), newValue);
      this.set('value', newValue);
      this.sendAction('changed', newValue);  // eslint-disable-line ember/closure-actions
    }
  }
});