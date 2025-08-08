const mongoose = require('mongoose');

// Schema للـ Part Brand
const partBrandSchema = new mongoose.Schema({
    partBrandID: { type: Number, required: true, unique: true }, // فرض عدم التكرار على partBrandID
    partBrandName: { type: String, required: true, unique: true }, // فرض عدم التكرار على partBrandName
});

// التحقق من التكرار في `partBrandID` و `partBrandName`
partBrandSchema.pre('save', async function (next) {
    try {
        // البحث عن إدخال بنفس `partBrandID` أو `partBrandName`
        const existingBrand = await mongoose.models['PartBrands'].findOne({
            $or: [
                { partBrandID: this.partBrandID }, // تحقق من تكرار `partBrandID`
                { partBrandName: this.partBrandName }, // تحقق من تكرار `partBrandName`
            ],
        });

        if (existingBrand) {
            // توليد رسالة خطأ عند وجود تكرار
            const errorMessage = existingBrand.partBrandID === this.partBrandID
                ? 'partBrandID مكرر'
                : 'partBrandName مكرر';
            return next(new Error(errorMessage));
        }

        next(); // متابعة الحفظ إذا لم يكن هناك تكرار
    } catch (error) {
        next(error); // تمرير أي خطأ آخر
    }
});

module.exports = mongoose.model('PartBrands', partBrandSchema);
