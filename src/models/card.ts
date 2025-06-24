import { Schema, model } from 'mongoose';

export interface ICard {
  name: string;
  link: string;
  owner: string;
  likes?: string[];
  createdAt?: Date;
}

const cardSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Поле name обязательно'],
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: [true, 'Поле link обязательно'],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Поле owner обязательно'],
  },
  likes: {
    type: [{
      type: Schema.Types.ObjectId,
    }],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false, timestamps: true });

export default model<ICard>('card', cardSchema);
