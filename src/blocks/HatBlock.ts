/*
 * @author Charles Xie
 */

import {Block} from "./Block";
import {Hat} from "../components/Hat";
import {system} from "../Main";

export abstract class HatBlock extends Block {

  public getPhysicalTwin(): Hat {
    let name = this.uid.substring(0, this.uid.indexOf("#") - 1).trim();
    let hatName = name.substring(0, name.length - 5).trim();
    let hatId = this.uid.replace(name, hatName);
    return system.getHatById(hatId);
  }

}
