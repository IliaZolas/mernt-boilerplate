import mongoose, { Document, Schema } from 'mongoose';

interface Book extends Document {
    title: string;
    description: string;
    imageUrl: string;
    public_id: string;
    user: mongoose.Schema.Types.ObjectId;
}

const BookSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    public_id: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

const BookModel = mongoose.model<Book>('booktable', BookSchema);

export default BookModel;
