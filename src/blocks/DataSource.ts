/*
 * @author Charles Xie
 */

export interface DataSource {

  readonly discriminator: "DataSource";

}

export function instanceOfDataSource(object: any): object is DataSource {
  return object.discriminator === "DataSource";
}
