const mongoose = require('mongoose');

const productSchema = new  mongoose.Schema({

    name:{
        type: String,
        trim:true,
        unique:[true, 'Product name must be unique'],
        minLength:[3, 'Product name must be at least 3 characters long'],
        maxLength:[100, 'Product name must be at most 100 characters long'],
    },
    slug:{
        type:String,
        lowercase: true,
    },
    image:{
       type:  String,
        required: [true, 'Product image is required'],},
    price:{
        type: Number,
        required: [true, 'Product price is required'],
        trim: true,
    },
    category:{
        type:mongoose.Schema.ObjectId,
        ref: 'Category',
        required:[true, 'Product category is required'],
    }, 
    branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  purchaseCount: {
    type: Number,
    default: 0
  },
  totalSoldQuantity: {
    type: Number,
    default: 0
  }

},{timestamps:true});

productSchema.pre(/^find/, function(next){
    this.populate({
        path:'category',
        select:'name-_id'
    })
    next()
})

const setImageURL = (doc)=>{
if(doc.image){
    const imageUrl = `${process.env.BASE_URL}/images/products/${doc.image}`
    doc.image = imageUrl;
  }
}
productSchema.post('init',  (doc)=>{
  setImageURL(doc);
})
productSchema.post('save',  (doc)=>{
  setImageURL(doc);
})
const Product = mongoose.model('Product', productSchema)

module.exports = Product