const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        unique: [true, 'Category name must be unique'],
        required:[true, 'Category name is required'],
        minLength:[3, 'Category name must be at least 3 characters long'],
        maxLength:[50, 'Category name must not exceed 50 characters']

    },
    slug:{
        type:String,
        lowercase: true
    },
},{
    timestamps:true
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;