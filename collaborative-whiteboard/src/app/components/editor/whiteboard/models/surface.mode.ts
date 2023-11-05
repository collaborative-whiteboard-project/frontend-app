import { MouseService } from '../services/mouse.service';
import { SvgElement } from './svg-element.model';

export class Surface extends SvgElement {
  gridCellW: string = '80';
  gridCellH: string = '80';

  constructor(
    mouseController: MouseService,
    svgSurface: HTMLElement,
    private document: Document
  ) {
    super(mouseController, svgSurface);
  }

  override onDrag(event: Event): void {
    return;
  }

  resizeGrid(
    cellWidth: string,
    cellHeight: string,
    smallCellWidth: string,
    smallCellHeight: string
  ) {
    this.gridCellW = cellWidth;
    this.gridCellH = cellHeight;
    const largeGridRect = this.document.getElementById('largeGridRect');
    const largeGridPath = this.document.getElementById('largeGridPath');
    const largeGrid = this.document.getElementById('largeGrid');

    const smallGridPath = this.document.getElementById('smallGridPath');
    const smallGrid = this.document.getElementById('smallGrid');

    const svg = this.document.getElementById('svg');
    const grid = this.document.getElementById('grid');

    largeGridRect?.setAttribute('width', cellWidth);
    largeGridRect?.setAttribute('height', cellHeight);

    largeGridPath?.setAttribute(
      'd',
      'M ' + cellWidth + ' 0 H 0 V ' + cellHeight
    );
    largeGrid?.setAttribute('width', cellWidth);
    largeGrid?.setAttribute('height', cellHeight);

    smallGridPath?.setAttribute(
      'd',
      'M ' + smallCellWidth + ' 0 H 0 V ' + smallCellHeight
    );
    smallGrid?.setAttribute('width', smallCellWidth);
    smallGrid?.setAttribute('height', smallCellHeight);

    grid?.setAttribute('x', (-cellWidth).toString());
    grid?.setAttribute('y', (-cellHeight).toString());

    var svgW = svg?.getAttribute('width');
    var svgH = svg?.getAttribute('height');

    if (!!svgW && !!svgH) {
      this.svgElement?.setAttribute(
        'width',
        (+svgW + +cellWidth * 2).toString()
      );
      this.svgElement?.setAttribute(
        'height',
        (+svgH + +cellHeight * 2).toString()
      );

      this.svgElement?.setAttribute('x', (-cellWidth).toString());
      this.svgElement?.setAttribute('y', (-cellHeight).toString());

      this.svgElement?.setAttribute(
        'width',
        (+svgW + +cellWidth * 2).toString()
      );
      this.svgElement?.setAttribute(
        'height',
        (+svgH + +cellHeight * 2).toString()
      );
    }
  }
}
