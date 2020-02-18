
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

let lastRoute;

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
	if (!lastRoute) {
		lastRoute = nextRoute;
	}
	let result = routeClassNameGenerator(nextRoute, lastRoute);
	lastRoute = nextRoute;
	return result;
}

/**
 * Encompasses all the components for being able to perform dynamic transitions
 * between routes.
 * 
 * @param {Function} children
 *   Whether or not to use exact path matching
 * @param {Function} generateRouteClassName
 *   A function, given the next route, previous route, and exact matching flag
 *   to return a class name that will be applied to the route container so that
 *   the correct transition can be applied.
 * @param {Location} location
 * @return {*}
 */
const DynamicRouter = ({children, generateRouteClassName, location}) => (
	<TransitionGroup childFactory={child => {
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
	generateRouteClassName: PropTypes.func.isRequired,
	location: PropTypes.object.isRequired
};

export default withRouter(DynamicRouter);
