import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Shape } from 'src/app/enums/shape.enum';
import { parseTransformAttribute } from 'src/app/helpers/parse-transform-attribute.helper';

import { PropertiesService } from 'src/app/services/properties/properties.service';
import { SocketService } from 'src/app/services/socket/socket.service';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss'],
})
export class PropertiesComponent implements OnInit, OnDestroy {
  elementSelected = false;
  elementType: Shape = Shape.RECTANGLE;
  elementPropertiesSub: Subscription;
  clearSelectedSub: Subscription;

  positionInputsActive = false;
  dimensionsInputsActive = false;
  radiusInputActive = false;
  strokeInputsActive = false;
  fillInputsActive = false;
  textInputsActive = false;

  elementId: string | undefined;
  positionXValue: string | undefined;
  positionYValue: string | undefined;
  widthValue: string | undefined;
  heightValue: string | undefined;
  radiusValue: string | undefined;
  strokeWidthValue: string | undefined;
  strokeColorValue: string | undefined;
  fillColorValue: string | undefined;
  fillOpacityValue: string | undefined;
  fontSizeValue: string | undefined;
  textValue: string | undefined;
  transform: string | undefined;

  constructor(
    private propertiesService: PropertiesService,
    private socketService: SocketService
  ) {
    this.elementPropertiesSub =
      this.propertiesService.sendPropertiesEventEmmiter.subscribe(
        (properties) => {
          this.elementType = properties.shapeType;
          this.elementId = properties.id;
          this.positionXValue = properties.x;
          this.positionYValue = properties.y;
          this.widthValue = properties.width;
          this.heightValue = properties.height;
          this.radiusValue = properties.r;
          this.strokeWidthValue = properties['stroke-width'];
          this.strokeColorValue = properties.stroke;
          this.fillColorValue = properties.fill;
          this.fillOpacityValue = properties['fill-opacity'];
          this.textValue = properties.text;
          this.fontSizeValue = properties['font-size'];
          this.calulateActiveInputs(this.elementType);
          this.elementSelected = true;
          this.transform = properties.transform;
        }
      );

    this.clearSelectedSub =
      this.propertiesService.clearSelectedEventEmmiter.subscribe(() => {
        this.elementSelected = false;
      });
  }
  ngOnInit(): void {
    // this.fillColorPicker.nativeElement.value = this.fillColorV;
    // this.strokeColorPicker.nativeElement.value = this.strokeColorPicker;
  }
  ngOnDestroy(): void {
    this.clearSelectedSub.unsubscribe();
    this.elementPropertiesSub.unsubscribe();
  }

  // resetPropertiesValues() {
  //   this.positionXValue = null;
  //   this.positionYValue = null;
  //   this.widthValue = null;
  //   this.heightValue = null;
  //   this.radiusValue = null;
  //   this.textValue = null;
  //   this.fontSizeValue = null;
  // }

  onStrokeChange(value: string) {
    this.strokeWidthValue = value;
    this.sendProperties();
    this.emitChangeUsingSocket('stroke-width', value);
  }

  onStrokeColorChange(value: string) {
    this.strokeColorValue = value;
    this.sendProperties();
    this.emitChangeUsingSocket('stroke-color', value);
  }

  onFillColorChange(value: string) {
    this.fillColorValue = value;
    this.sendProperties();
    this.emitChangeUsingSocket('fill-color', value);
  }

  onFillOpacityChange(value: string) {
    this.fillOpacityValue = value;
    this.sendProperties();
    this.emitChangeUsingSocket('fill-opacity', value);
  }

  onPositionXChange(value: string) {
    const parsedTransform = parseTransformAttribute(this.transform!);
    const translateX = parsedTransform[0].values[0];
    const translateY = parsedTransform[0].values[1];
    const x = +this.positionXValue! - +translateX;
    const newTranslateX = +value - x;
    //this.sendProperties();
    this.transform = `translate(${newTranslateX}, ${translateY})`;
    this.positionXValue = value;
    this.emitChangeUsingSocket(
      'transform',
      `translate(${newTranslateX}, ${translateY})`
    );
  }

  onPositionYChange(value: string) {
    //this.sendProperties();
    const parsedTransform = parseTransformAttribute(this.transform!);
    const translateX = parsedTransform[0].values[0];
    const translateY = parsedTransform[0].values[1];
    const y = +this.positionYValue! - +translateY;
    const newTranslateY = +value - y;
    this.positionYValue = value;
    this.transform = `translate(${translateX}, ${newTranslateY})`;
    this.emitChangeUsingSocket(
      'transform',
      `translate(${translateX}, ${newTranslateY})`
    );
  }

  onWidthChange(value: string) {
    this.widthValue = value;
    this.sendProperties();
    this.emitChangeUsingSocket('width', value);
  }

  onHeightChange(value: string) {
    this.heightValue = value;
    this.sendProperties();
    this.emitChangeUsingSocket('height', value);
  }

  onRadiusChange(value: string) {
    this.radiusValue = value;
    this.sendProperties();
    this.emitChangeUsingSocket('radius', value);
  }

  onTextChange(value: string) {
    this.textValue = value;
    this.sendProperties();
    this.emitChangeUsingSocket('text', value);
  }

  onFontSizeChange(value: string) {
    this.fontSizeValue = value;
    this.sendProperties();
    this.emitChangeUsingSocket('font-size', value);
  }

  emitChangeUsingSocket(name: string, value: string) {
    if (this.propertiesService.canUserEdit) {
      this.socketService.updateWhiteboardElement(this.elementId!, name, value);
    }
  }

  sendProperties() {
    this.propertiesService.updatePropertiesEventEmmiter.next({
      id: this.elementId!,
      shapeType: this.elementType,
      x: this.positionXValue,
      y: this.positionYValue,
      width: this.widthValue,
      height: this.heightValue,
      r: this.radiusValue,
      stroke: this.strokeColorValue,
      'stroke-width': this.strokeWidthValue,
      fill: this.fillColorValue,
      'fill-opacity': this.fillOpacityValue,
      text: this.textValue,
      'font-size': this.fontSizeValue,
      transform: '',
    });
  }

  calulateActiveInputs(shapeType: Shape) {
    this.positionInputsActive =
      shapeType === Shape.RECTANGLE ||
      shapeType === Shape.CIRCLE ||
      shapeType === Shape.TEXT;
    this.dimensionsInputsActive = shapeType === Shape.RECTANGLE;
    this.radiusInputActive = shapeType === Shape.CIRCLE;
    this.strokeInputsActive =
      shapeType === Shape.RECTANGLE ||
      shapeType === Shape.CIRCLE ||
      shapeType === Shape.PATH ||
      shapeType === Shape.LINE;
    this.fillInputsActive =
      shapeType === Shape.RECTANGLE ||
      shapeType === Shape.CIRCLE ||
      shapeType === Shape.PATH;
    this.textInputsActive = shapeType === Shape.TEXT;
  }
}
