import { Prop, Schema } from '@nestjs/mongoose';
import { Action } from './enums/action.enum';
import { Resource } from './enums/resource.enum';

@Schema()
export class Permission {
  @Prop({ required: true, enum: Resource })
  resource: Resource;
  @Prop({ type: [{ type: String, enum: Action }] })
  actions: Action[];
}
