import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

@Schema({ timestamps: true })
export class RefreshToken {
  @Prop({ required: true })
  accessToken: string;
  @Prop({ required: true })
  refreshToken: string;
  @Prop({
    required: true,
    unique: true,
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  })
  user: User;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
export type RefreshTokenDocument = HydratedDocument<RefreshToken>;
