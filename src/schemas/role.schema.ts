import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Permission } from './permission.schema';

@Schema()
export class Role {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [Permission], required: true })
  permissions: Permission[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
