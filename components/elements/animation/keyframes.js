import { keyframes } from "@emotion/react"

export const fadeInUpAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translate3d(0, 40px, 0);
  }

  60% {
    transform: translate3d(0, -10px, 0);
  }

  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`
export const fadeInDownAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translate3d(0, -40px, 0);
  }

  60% {
    transform: translate3d(0, 10px, 0);
  }

  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`
export const fadeInDownRightAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translate3d(-40px, -40px, 0);
  }

  60% {
    transform: translate3d(10px, 10px, 0);
  }

  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`
export const fadeInRightAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translate3d(-50px, 0, 0);
  }

  60% {
    transform: translate3d(10px, 0, 0);
  }

  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`
