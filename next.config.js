// must restart server whenever you make changes in next.config
module.exports = {
  env: {
    MONGO_SRV: "mongodb+srv://alex:abc@cluster0-rlm2v.gcp.mongodb.net/test?retryWrites=true&w=majority",
    JWT_SECRET: "iriendslkweoiqzqpeie",
    CLOUDINARY_PRESET: 'hhpreset',
    CLOUDINARY_URL: "https://api.cloudinary.com/v1_1/ddhuj8rld/image/upload",
    STRIPE_SECRET_KEY: "notactuallydoingthisbutalsogetfromstripe"
  }
};
