/*
 * @author Charles Xie
 */

export interface Movable {

  getUid(): string;

  getX(): number;

  setX(x: number): void;

  getY(): number;

  setY(y: number): void;

  getWidth(): number;

  getHeight(): number;

  contains(x: number, y: number): boolean;

}
