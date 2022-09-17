import { Accessor, createSignal } from 'solid-js';

interface Position {
  x: number;
  y: number;
}

type DrawingDirectionType = 'right' | 'left' | null;
type DrawInputEventHandler = (dir: DrawingDirectionType) => void;
interface DrawInputEventsComposition {
  drawingDirection: Accessor<'right' | 'left' | null>;
  handlers: {
    onMouseDown: (ev: MouseEvent) => void;
    onMouseMove: (ev: MouseEvent) => void;
    onMouseUp: (ev: MouseEvent) => void;
    onTouchStart: (ev: TouchEvent) => void;
    onTouchMove: (ev: TouchEvent) => void;
    onTouchEnd: (ev: TouchEvent) => void;
    onTouchCancel: (ev: TouchEvent) => void;
  };
}
export const useDrawInputEvents = (handler: DrawInputEventHandler, threshold = 80): DrawInputEventsComposition => {
  const [drawingDirection, setDrawingDirection] = createSignal<DrawingDirectionType>(null);
  const [drawStartPos, setDrawStartPos] = createSignal<Position | null>(null);
  const [currentTouchId, setTouchId] = createSignal(NaN);

  const onGestureStart = (pos: Position, touchId?: number) => {
    if (touchId !== undefined && !isNaN(currentTouchId())) {
      return;
    }

    setDrawStartPos({
      x: pos.x,
      y: pos.y,
    });
    if (touchId !== undefined) {
      setTouchId(touchId);
    }
  };
  const onGestureMove = (pos: Position, touchId?: number) => {
    const drawStartPosValue = drawStartPos();
    if (drawStartPosValue === null) {
      return;
    }
    if (touchId !== undefined && touchId !== currentTouchId()) {
      return;
    }

    const drawOffset = pos.x - drawStartPosValue.x;
    if (drawOffset >= threshold) {
      setDrawingDirection('right');
    } else if (drawOffset <= -threshold) {
      setDrawingDirection('left');
    } else {
      setDrawingDirection(null);
    }
  };
  const onGestureEnd = () => {
    const dir = drawingDirection();
    if (dir !== null) {
      handler(dir);
    }
    setDrawStartPos(null);
    setDrawingDirection(null);
    setTouchId(NaN);
  };

  // for mouse (PC)
  const onMouseDown = (ev: MouseEvent) => {
    onGestureStart({
      x: ev.offsetX,
      y: ev.offsetY,
    });
  };
  const onMouseMove = (ev: MouseEvent) => {
    onGestureMove({
      x: ev.offsetX,
      y: ev.offsetY,
    });
  };
  const onMouseUp = (_: MouseEvent) => {
    onGestureEnd();
  };

  // for touch device
  const onTouchStart = (ev: TouchEvent) => {
    for (let i = 0; i < ev.targetTouches.length; i++) {
      const t = ev.targetTouches.item(i);
      if (t === null) continue;
      onGestureStart(
        {
          x: t.clientX,
          y: t.clientY,
        },
        t.identifier,
      );
    }
  };
  const onTouchMove = (ev: TouchEvent) => {
    for (let i = 0; i < ev.targetTouches.length; i++) {
      const t = ev.targetTouches.item(i);
      if (t === null) continue;
      onGestureMove(
        {
          x: t.clientX,
          y: t.clientY,
        },
        t.identifier,
      );
    }
  };
  const onTouchEndOrCancel = (ev: TouchEvent) => {
    const tid = currentTouchId();
    if (isNaN(tid)) {
      return;
    }
    for (let i = 0; i < ev.targetTouches.length; i++) {
      const t = ev.targetTouches.item(i);
      if (t === null) continue;
      if (t.identifier === tid) {
        return;
      }
    }
    onGestureEnd();
  };

  return {
    drawingDirection,
    handlers: {
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onTouchStart,
      onTouchMove,
      onTouchEnd: onTouchEndOrCancel,
      onTouchCancel: onTouchEndOrCancel,
    },
  };
};
