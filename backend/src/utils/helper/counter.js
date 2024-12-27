const countForms = async(schema) => {
    try {
        const totalforms = await schema.aggregate([
            { $match: { address: "Province4" }},
            { $count: "total"}
        ])
        if (totalforms.length > 0) {
            console.log(`Total ${propertyType} enquiry forms:`, totalforms[0].total);
            return totalforms[0].total;
          } else {
            console.log('No enquiry forms found for this property type');
            return 0;
          }
    } catch (error) {
        throw error;
    }
}
export { countForms }