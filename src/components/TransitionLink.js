import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";

import { shouldNavigate } from "../utils/shouldNavigate";
import { triggerTransition } from "../utils/triggerTransition";
import { Consumer } from "../context/createTransitionContext";

if (typeof forwardRef === "undefined") {
  forwardRef = C => C;
}

const TransitionLink = forwardRef(({
  to,
  children,
  exit,
  entry,
  activeStyle,
  partiallyActive,
  style,
  className,
  activeClassName,
  state,
  onClick,
  trigger,
  replace,
  innerRef,
  ...rest
}, ref) => {
  return (
    <Consumer>
      {({ ...context }) => (
        <Link
          style={style}
          activeStyle={activeStyle}
          className={className}
          activeClassName={activeClassName}
          partiallyActive={partiallyActive}
          onClick={event => {
            const weShouldNavigate = shouldNavigate(event);

            if (weShouldNavigate) {
              triggerTransition({
                event,
                to,
                exit,
                entry,
                trigger,
                replace,
                linkState: state,
                ...context
              });
            }
            
            if (typeof onClick === "function") {
              onClick(event, weShouldNavigate);
            }
          }}
          to={to} // use gatsby link so prefetching still happens. this is prevent defaulted in triggertransition
          ref={ref || innerRef}
          {...rest}
        >
          {children}
        </Link>
      )}
    </Consumer>
  );
});

TransitionLink.propTypes = {
  to: PropTypes.string.isRequired,
  exitLength: PropTypes.number,
  entryDelay: PropTypes.number,
  exitFn: PropTypes.func,
  entryState: PropTypes.object
};

export { TransitionLink };
