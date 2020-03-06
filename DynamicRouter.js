
import PropTypes                     from 'prop-types';
import React, {Component}            from 'react';
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
 * Encompasses all the components for being able to perform dynamic transitions
 * between routes.
 */
class DynamicRouter extends Component {

	static propTypes = {
		children: PropTypes.func.isRequired,
		component: PropTypes.any,
		generateRouteClassName: PropTypes.func.isRequired,
		location: PropTypes.object.isRequired
	};

	static defaultProps = {
		component: null
	};

	state = {
		lastClass: null,
		lastRoute: null
	};

	/**
	 * @return {*}
	 */
	render() {

		let {children, component, generateRouteClassName, location} = this.props;
		return (
			<TransitionGroup component={component} childFactory={child => {
				return React.cloneElement(child, {
					routeClassName: this.withLastRoute(location.pathname, generateRouteClassName)
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
	}

	/**
	 * Wraps the route class name generator function to keep track of the last
	 * route that was used as knowing the previous route is very useful in
	 * determining the class name to create.
	 * 
	 * @private
	 * @param {String} nextRoute
	 * @param {Function} routeClassNameGenerator
	 * @return {String}
	 */
	withLastRoute(nextRoute, routeClassNameGenerator) {

		let {lastClass, lastRoute} = this.state;

		// Because of how often react-router renders, the case of the routes being
		// exactly the same can occur, but is not useful for the class name generator,
		// so return the last class result.
		if (lastRoute === nextRoute) {
			return lastClass;
		}

		let result = routeClassNameGenerator(nextRoute, lastRoute || nextRoute);
		this.setState({
			lastClass: result,
			lastRoute: nextRoute
		});
		return result;
	}
}

export default withRouter(DynamicRouter);
