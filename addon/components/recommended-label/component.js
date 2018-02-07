import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import Component from '@ember/component';

export const DEFAULT_LABEL = `(recommended)`;
export default Component.extend({
  tagName: '',

  recommendedValue: alias('property.displayProperties.recommendedValue'),
  recommendedLabel: computed('property.displayProperties.recommendedLabel', function() {
    return this.get('property.displayProperties.recommendedLabel') || DEFAULT_LABEL;
  }),

  isRecommended: computed('value', 'recommendedValue', function() {
    let { value, recommendedValue } = this.getProperties('value', 'recommendedValue');
    if (Array.isArray(recommendedValue)) {
      return recommendedValue.indexOf(value) > -1;
    }
    return recommendedValue === value;
  })
});