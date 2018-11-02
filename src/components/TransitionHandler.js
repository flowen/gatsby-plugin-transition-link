import React, { Component } from "react";
import { Transition, TransitionGroup } from "react-transition-group";
import { Consumer } from "../context/createTransitionContext";
import { PublicProvider } from "../context/createTransitionContext";
import InternalProvider from "../context/InternalProvider";
import delayTransitionRender from "./delayTransitionRender";
import { returnTransitionState } from "../utils/returnTransitionState";

const DelayedTransition = delayTransitionRender(Transition);
export default class TransitionHandler extends Component {
  render() {
    const { props } = this;
    const { children } = props;
    return (
      <InternalProvider>
        <Consumer>
          {({
            exitDelay,
            exitLength,
            exitState,
            entryDelay,
            entryLength,
            entryState,
            entryTrigger,
            entryProps,
            exitTrigger,
            exitProps,
            transitionIdHistory,
            inTransition
          }) => {
            return (
              <TransitionGroup>
                <DelayedTransition
                  delay={entryDelay}
                  timeout={{ enter: entryLength, exit: exitLength }}
                  onEnter={node => {
                    entryTrigger &&
                      typeof entryTrigger === "function" &&
                      entryTrigger(entryProps, node);
                    window.scrollTo(0, 0);
                  }}
                  key={props.location.pathname}
                  onExit={node => {
                    exitTrigger &&
                      typeof exitTrigger === "function" &&
                      exitTrigger(exitProps, node);
                  }}
                >
                  {transitionStatus => {
                    const transitionState = returnTransitionState({
                      inTransition,
                      location: props.location,
                      transitionIdHistory,
                      transitionStatus,
                      entry: {
                        state: entryState,
                        delay: entryDelay,
                        length: entryLength
                      },
                      exit: {
                        state: exitState,
                        delay: exitDelay,
                        length: exitLength
                      }
                    });

                    const childWithTransitionState = React.Children.map(
                      children,
                      child => {
                        return React.cloneElement(child, {
                          ...transitionState
                        });
                      }
                    );

                    return (
                      <div
                        style={{
                          position: "absolute",
                          width: "100%",
                          zIndex:
                            transitionStatus === "entering" ||
                            transitionStatus === "entered"
                              ? 1
                              : 0
                        }}
                      >
                        <PublicProvider value={{ ...transitionState }}>
                          {childWithTransitionState}
                        </PublicProvider>
                      </div>
                    );
                  }}
                </DelayedTransition>
              </TransitionGroup>
            );
          }}
        </Consumer>
      </InternalProvider>
    );
  }
}
