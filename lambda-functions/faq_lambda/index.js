const DB = require('../../utils/DB');
const Faq = require('./utils/faqModel');
DB();

exports.handler = async (event) => {
  try {
    switch (event.type) {
      case 'getAllFaqs':
        return await Faq.find();  
      case 'getFaq':
        return await Faq.findById(event.arguments.id);
      case 'getFaqsByRole':
        return await Faq.find({ roles:event.arguments.role }).exec();
      case 'getFaqsByTopic':
        return await Faq.find({ topic:event.arguments.topic }).exec();
      case 'createFaq':
        return await Faq.create(event.arguments);
      case 'updateFaq':
        return await Faq.findByIdAndUpdate(
          event.arguments.id,
          event.arguments,
          {
            new: true,
            runValidators: true,
          }
        );
      case 'deleteFaq':
        return await Faq.findByIdAndDelete(event.arguments.id);
      default:
        return null;
    }
  } catch (error) {
    throw error;
  }
};
