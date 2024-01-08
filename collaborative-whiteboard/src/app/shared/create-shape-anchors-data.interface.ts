export interface CreateShapeAnchorsData {
  shapeId: string;
  anchorsCoordinates: AnchorCoordinates[];
}

export interface AnchorCoordinates {
  x: number;
  y: number;
}
