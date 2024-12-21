import mongoose, { Schema, Document, Types } from 'mongoose';

interface IBlog extends Document {
    title: string;
    summary: string;
    body: string;
    createdOn: Date;
    updatedOn: Date;
    authorID: Types.ObjectId;
    tags: string[];
}

const BlogSchema: Schema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        summary: { type: String, trim: true },
        body: { type: String, required: true },
        imageURL: {type: String, required: true},
        createdOn: { type: Date, default: Date.now },
        updatedOn: { type: Date, default: Date.now },
        authorID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        tags: { type: [String], default: [] },
    },
    { timestamps: true }
);

const BlogModel = mongoose.model<IBlog>('Blog', BlogSchema);
export default BlogModel;
export { IBlog };
