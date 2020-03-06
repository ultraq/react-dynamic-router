
import PropTypes                     from 'prop-types';
import React                         from 'react';
import {withRouter}                  from 'react-router-dom';
import {Transition, TransitionGroup} from 'react-transition-group';

/**
 * Converts props passed to this component into a function-as-child component so
 * that props can be exposed.
 * 
 * @param {Function} children
 * @param {Object} props
 * @return {*}
 */
const ComponentToFunction = ({children, ...props}) => {
	return children(props);
};

// TODO: These should be state values on the dynamic router, otherwise they're
//       static and devs can only have 1 instance of the dynamic router!
let lastRoute, lastClass;

/**
 * Use the end of an animation on the given node to signal the end of a
 * "transition" (for react-transition-group).
 * 
 * @param {Node} node
 * @param {Function} done
 */
const useAnimationForEndTransition = (node, done) => {
	node.addEventListener('animationend', event => {
		if (event.target === node) {
			done();
		}
	});
};

/**
 * Wraps the route class name generator function to keep track of the last route
 * that was used as knowing the previous route is very useful in determining the
 * class name to create.
 * 
 * @param {String} nextRoute
 * @param {Function} routeClassNameGenerator
 * @return {String}
 */
function withLastRoute(nextRoute, routeClassNameGenerator) {

	// Because of how often react-router renders, the case of the routes being
	// exactly the same can occur, but is not useful for the class name generator,
	// so return the last class result.
	if (lastRoute === nextRoute) {
		return lastClass;
	}

	if (!lastRoute) {
		lastRoute = nextRoute;
	}
	let result = routeClassNameGenerator(nextRoute, lastRoute);
	lastRoute = nextRoute;
	lastClass = result;
	return result;
}

/**
 * Encompasses all the components for being able to perform dynamic transitions
 * between routes.
 * 
 * @param {Function} children
 *   Whether or not to use exact path matching
 * @param {Node} component
 *   See: https://reactcommunity.org/react-transition-group/transition-group#TransitionGroup-prop-component
 * @param {Function} generateRouteClassName
 *   A function, given the next route, previous route, and exact matching flag
 *   to return a class name that will be applied to the route container so that
 *   the correct transition can be applied.
 * @param {Location} location
 * @return {*}
 */
const DynamicRouter = ({children, component, generateRouteClassName, location}) => (
	<TransitionGroup component={component} childFactory={child => {
		return React.cloneElement(child, {
			routeClassName: withLastRoute(location.pathname, generateRouteClassName)
		});
	}}>
		<ComponentToFunction key={location.key}>
			{({routeClassName, ...transitionProps}) => (
				<Transition {...transitionProps} appear={true} addEndListener={useAnimationForEndTransition}>
					{state => children(`${routeClassName}-${state}`)}
				</Transition>
			)}
		</ComponentToFunction>
	</TransitionGroup>
);

DynamicRouter.propTypes = {
	children: PropTypes.func.isRequired,
	component: PropTypes.any,
	generateRouteClassName: PropTypes.func.isRequired,
	location: PropTypes.object.isRequired
};

DynamicRouter.defaultProps = {
	component: null
};

export default withRouter(DynamicRouter);
