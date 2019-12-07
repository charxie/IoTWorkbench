/*
 * @author Charles Xie
 */

import {Person} from "./Person";

export class User implements Person {

  public fullName: string;

  constructor(public firstName: string, public middleInitial: string, public lastName: string) {
    if (middleInitial) {
      this.fullName = firstName + " " + middleInitial + " " + lastName;
    } else {
      this.fullName = firstName + " " + lastName;
    }
  }

}
