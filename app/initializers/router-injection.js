/**
 * Initializer used to inject the router inside each component enabling the user
 * to transition inside components.
 */
export function initialize(application) {
  // Include a router in each EmberJS Component.
  application.inject('component', 'router', 'router:main');
}

export default {
  name: 'router-injection',
  initialize
};
