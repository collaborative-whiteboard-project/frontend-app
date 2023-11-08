import { Subject } from 'rxjs';

export class DrawingSurface {
  mouseDown = false;
  createPathEventEmmiter = new Subject<string>();
  constructor(
    private drawingSurface: HTMLElement,
    private tempPath: HTMLElement,
    private tempObjects: HTMLElement
  ) {
    this.drawingSurface.addEventListener(
      'mousedown',
      this.onMouseDown.bind(this)
    );
    this.drawingSurface.addEventListener(
      'mousemove',
      this.onMouseMove.bind(this)
    );
    this.drawingSurface.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.drawingSurface.style.cursor = 'crosshair';
  }

  activateDrawingSurface() {
    this.tempObjects.appendChild(this.drawingSurface);
  }

  deactivateDrawinSurface() {
    try {
      this.tempObjects.removeChild(this.drawingSurface);
    } catch (error) {
      console.log('DrawingSurface already removed');
    }
    this.tempPath.setAttribute('d', ' ');
  }

  onMouseDown(event: Event) {
    const mouseEvent = event as MouseEvent;
    const surfaceCoordiantes = this.calculateSurfaceCoordinates(
      mouseEvent.pageX,
      mouseEvent.pageY
    );
    this.mouseDown = true;

    this.tempPath.setAttribute(
      'd',
      `M ${surfaceCoordiantes.surfaceX} ${surfaceCoordiantes.surfaceY} `
    );
  }

  onMouseMove(event: Event) {
    if (this.mouseDown) {
      const mouseEvent = <MouseEvent>event;
      const surfaceCoordiantes = this.calculateSurfaceCoordinates(
        mouseEvent.pageX,
        mouseEvent.pageY
      );
      let d = this.tempPath.getAttribute('d');
      if (!!d) {
        d += `L ${surfaceCoordiantes.surfaceX} ${surfaceCoordiantes.surfaceY} `;
        this.tempPath.setAttributeNS(null, 'd', d);
      }
    }
  }

  onMouseUp() {
    const d = this.tempPath.getAttribute('d');
    if (!!d) {
      this.createPathEventEmmiter.next(d);
    }
    this.tempPath.setAttribute('d', '');
    this.mouseDown = false;
  }

  calculateSurfaceCoordinates(
    mouseX: number,
    mouseY: number
  ): { surfaceX: number; surfaceY: number } {
    const x =
      mouseX -
      this.drawingSurface.parentElement?.parentElement?.parentElement
        ?.offsetLeft! +
      this.drawingSurface.parentElement?.parentElement?.parentElement
        ?.parentElement?.parentElement?.scrollLeft!;
    const y =
      mouseY -
      this.drawingSurface.parentElement?.parentElement?.parentElement
        ?.parentElement?.parentElement?.parentElement?.offsetTop! +
      this.drawingSurface.parentElement?.parentElement?.parentElement
        ?.parentElement?.scrollTop!;
    return { surfaceX: x, surfaceY: y - 10 };
  }
}
