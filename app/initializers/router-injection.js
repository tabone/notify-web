export function initialize(application) {
  // Include a router in each EmberJS Component.
  application.inject('component', 'router', 'router:main');
}

export default {
  name: 'router-injection',
  initialize
};
