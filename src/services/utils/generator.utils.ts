import { v4 as uuidv4 } from 'uuid';
export class GeneratorUtils {
  public static getUUID() {
    return uuidv4();
  }
}
