import Ember from 'ember';
export const DEFAULT_LABEL = `(recommended)`;

export default Ember.Component.extend({
  tagName: '',

  recommendedValue: Ember.computed.alias('property.displayProperties.recommendedValue'),
  recommendedLabel: Ember.computed('property.displayProperties.recommendedLabel', function() {
    return this.get('property.displayProperties.recommendedLabel') || DEFAULT_LABEL;
  }),

  isRecommended: Ember.computed('value', 'recommendedValue', function() {
    let { value, recommendedValue } = this.getProperties('value', 'recommendedValue');
    if (Array.isArray(recommendedValue)) {
      return recommendedValue.indexOf(value) > -1;
    }
    return recommendedValue === value;
  })
});