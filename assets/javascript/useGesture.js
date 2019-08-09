import { useEffect, useState, useRef } from 'react';

class Pointer {
  /**
   *
   * @param {{clientX:number, clientY: number}} touch event touch object
   */
  constructor(touch) {
    this.x = touch.clientX;
    this.y = touch.clientY;
  }
}

const debounce = (func, wait) => {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
};

/**
 *
 * @param {{x: number, y: number}} p1
 * @param {{x: number, y: number}} p2
 */
const getDistance = (p1, p2) => {
  const powX = Math.pow(p1.x - p2.x, 2);
  const powY = Math.pow(p1.y - p2.y, 2);

  return Math.sqrt(powX + powY);
};

/**
 *
 * @param {{x: number, y: number}} p1
 * @param {{x: number, y: number}} p2
 */
const getAngleDeg = (p1, p2) => {
  return (Math.atan2(p1.y - p2.y, p1.x - p2.x) * 180) / Math.PI;
};

/**
 * 
 * @param {Object} ref React ref object
 * @param {{   
    onPanStart: function,
    onPanMove: function,
    onSwipeLeft: function,
    onSwipeRight: function,
    onSwipeUp: function,
    onSwipeDown: function,
    onPanEnd: function,
    onSwipeLeftEnd: function,
    onSwipeRightEnd: function,
    onSwipeUpEnd: function,
    onSwipeDownEnd: function,
    onPinchStart: function,
    onPinchChanged: function,
    onPinchEnd: function,
    }} handlers 
 * @param {{
  minDelta: number
}} options 
*/
export default function useGestures(
  ref,
  handlers,
  options = {
    minDelta: 30
  }
) {
  const [touches, setTouches] = useState(null);
  const [gesture, setGesture] = useState('');

  const initialTouches = useRef(null);

  useEffect(() => {
    const element = ref.current;

    const getCurrentTouches = (originalEvent, touches, prevTouch) => {
      const firstTouch = initialTouches.current;

      if (touches.length === 2) {
        const pointer1 = new Pointer(touches[0]);
        const pointer2 = new Pointer(touches[1]);

        const distance = getDistance(pointer1, pointer2);
        return {
          preventDefault: originalEvent.preventDefault,
          stopPropagation: originalEvent.stopPropagation,
          pointers: [pointer1, pointer2],
          delta: prevTouch ? distance - prevTouch.distance : 0,
          scale: firstTouch ? distance / firstTouch.distance : 1,
          distance,
          angleDeg: getAngleDeg(pointer1, pointer2)
        };
      } else {
        const pointer = new Pointer(touches[0]);

        return {
          preventDefault: originalEvent.preventDefault,
          stopPropagation: originalEvent.stopPropagation,
          ...pointer,
          deltaX: prevTouch ? pointer.x - prevTouch.x : 0,
          deltaY: prevTouch ? pointer.y - prevTouch.y : 0,
          delta: prevTouch ? getDistance(pointer, prevTouch) : 0,
          distance: firstTouch ? getDistance(pointer, firstTouch) : 0,
          angleDeg: prevTouch ? getAngleDeg(pointer, prevTouch) : 0
        };
      }
    };

    const callHandler = (eventName, event) => {
      if (eventName && handlers[eventName] && typeof handlers[eventName] === 'function') {
        handlers[eventName](event);
      }
    };

    const handleTouchStart = event => {
      const currentTouches = getCurrentTouches(event, event.touches, null);
      setTouches(currentTouches);
      initialTouches.current = currentTouches;

      if (event.touches.length === 2) {
        callHandler('onPinchStart', currentTouches);
      } else {
        callHandler('onPanStart', currentTouches);
      }
    };

    const handleTouchMove = event => {
      const currentTouches = getCurrentTouches(event, event.touches, touches);
      setTouches(currentTouches);

      if (event.touches.length === 2) {
        callHandler('onPinchChanged', currentTouches);
      } else {
        callHandler('onPanMove', currentTouches);

        let eventName, theGesture;

        if (Math.abs(currentTouches.deltaX) >= options.minDelta && Math.abs(currentTouches.deltaY) < options.minDelta) {
          if (currentTouches.deltaX < 0) {
            eventName = 'onSwipeLeft';
            theGesture = 'swipeLeft';
          } else {
            eventName = 'onSwipeRight';
            theGesture = 'swipeRight';
          }
        } else if (
          Math.abs(currentTouches.deltaX) < options.minDelta &&
          Math.abs(currentTouches.deltaY) >= options.minDelta
        ) {
          if (currentTouches.deltaY < 0) {
            eventName = 'onSwipeUp';
            theGesture = 'swipeUp';
          } else {
            eventName = 'onSwipeDown';
            theGesture = 'swipeDown';
          }
        } else {
          theGesture = '';
        }

        if (eventName) {
          debounce((eventName, touches, theGesture) => {
            callHandler(eventName, touches);
            setGesture(theGesture);
          }, 100)(eventName, touches, theGesture);

        }
      }
    };

    const handleTouchEnd = event => {
      const currentTouches = getCurrentTouches(event, event.changedTouches, null);
      if (touches && touches.pointers) {
        if (touches.pointers.length === 2) {
          callHandler('onPinchEnd', currentTouches);
        } else {
          callHandler('onPanEnd', currentTouches);
        }
      }

      if (gesture) {
        callHandler(`on${gesture.charAt(0).toUpperCase() + gesture.slice(1)}End`, currentTouches);
      }
    };

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchmove', handleTouchMove);
    element.addEventListener('touchend', handleTouchEnd);
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  });
}