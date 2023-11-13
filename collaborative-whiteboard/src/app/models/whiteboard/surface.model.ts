import { PropertiesService } from 'src/app/services/properties/properties.service';

export class Surface {
  surfaceHeight = 0;
  surfaceWidth = 0;
  gridCellWidth = '0';
  gridCellHeight = '0';

  constructor(
    private surface: HTMLElement,
    private propertiesService: PropertiesService,
    private document: Document
  ) {
    this.surfaceHeight = +surface.getAttribute('height')!;
    this.surfaceWidth = +surface.getAttribute('width')!;
    this.surface.addEventListener('mousedown', this.onSelected.bind(this));
  }

  onSelected() {
    this.propertiesService.clearSelectedEventEmmiter.next();
  }

  resizeGrid(
    largeGridWidth: string,
    largeGridHeight: string,
    smallGridWidth: string,
    smallGridHeight: string
  ) {
    this.gridCellWidth = largeGridWidth;
    this.gridCellHeight = largeGridHeight;
    const largeGridRect = this.document.getElementById('largeGridRect');
    const largeGridPath = this.document.getElementById('largeGridPath');
    const largeGrid = this.document.getElementById('largeGrid');

    const smallGridPath = this.document.getElementById('smallGridPath');
    const smallGrid = this.document.getElementById('smallGrid');

    const svg = this.document.getElementById('svg');
    const grid = this.document.getElementById('grid');

    largeGridRect?.setAttribute('width', largeGridWidth);
    largeGridRect?.setAttribute('height', largeGridHeight);

    largeGridPath?.setAttribute(
      'd',
      `M ${largeGridWidth} 0 H 0 V ${largeGridHeight}`
    );
    largeGrid?.setAttribute('width', largeGridWidth);
    largeGrid?.setAttribute('height', largeGridHeight);

    smallGridPath?.setAttribute(
      'd',
      `M ${smallGridWidth} 0 H 0 V ${smallGridHeight}`
    );
    smallGrid?.setAttribute('width', smallGridWidth);
    smallGrid?.setAttribute('height', smallGridHeight);

    grid?.setAttribute('x', '0');
    grid?.setAttribute('y', '0');

    const svgWidth = svg?.getAttribute('width')!;
    const svgHeight = svg?.getAttribute('height')!;

    this.surface.setAttribute('width', svgWidth);
    this.surface.setAttribute('height', svgHeight);

    grid?.setAttribute('x', '0');
    grid?.setAttribute('y', '0');

    grid?.setAttribute('width', svgWidth);
    grid?.setAttribute('height', svgHeight);
  }
}
