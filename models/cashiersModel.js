const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const cashierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'name required'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, 'email required'],
      unique: true,
      lowercase: true,
    },
   // phone: String,
    image: String,

    password: {
      type: String,
      required: [true, 'password required'],
      minlength: [6, 'Too short password'],
    },
    branch:{
        type: mongoose.Schema.ObjectId,
        ref: 'Branch',
        required: [true, 'Cashier must belong to a branch'],
    },
    passwordChangedAt: Date,
  //  passwordResetCode: String,
   // passwordResetExpires: Date,
   // passwordResetVerified: Boolean,
    role: {
      type: String,
      default: 'cashier',
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

cashierSchema.pre(/^find/, function(next){
    this.populate({
        path:'branch',
        select:'name-_id'
    }),
    next()
})

const setImageURL = (doc)=>{
if(doc.image){
    const imageUrl = `${process.env.BASE_URL}/images/cashiers/${doc.image}`
    doc.image = imageUrl;
  }
}
cashierSchema.post('init',  (doc)=>{
  setImageURL(doc);
})
cashierSchema.post('save',  (doc)=>{
  setImageURL(doc);
})
cashierSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  // Hashing user password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const Cashier = mongoose.model('Cashier', cashierSchema);

module.exports = Cashier;