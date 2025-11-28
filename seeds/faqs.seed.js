import dotenv from "dotenv";
import mongoose from "mongoose";
import FaqSchema from "../src/models/Faq.js";

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await FaqSchema.deleteMany({});

    await FaqSchema.insertMany([
        {
          "question": "How do I book a service?",
          "answer": "Search for the service you need, choose a provider, select your preferred date and time, and confirm the booking."
        },
        {
          "question": "Are the service providers verified?",
          "answer": "Yes, all providers on Fixora go through a verification process, including ID checks and skill validation."
        },
        {
          "question": "How do payments work?",
          "answer": "Payments are made securely through Fixora using UPI, credit/debit cards, or net banking. Cash payments may also be available for some services."
        },
        {
          "question": "Can I cancel a booking?",
          "answer": "Yes, you can cancel any booking before the provider starts the service. Cancellation charges may apply depending on timing."
        },
        {
          "question": "What if my provider does not show up?",
          "answer": "You can report a no-show in the app. Our support team will help you reschedule or assign a new provider."
        },
        {
          "question": "How are service charges calculated?",
          "answer": "Charges depend on service type, provider's rate card, distance, and additional materials used (if any)."
        },
        {
          "question": "Can I become a service provider on Fixora?",
          "answer": "Yes. You can sign up as a provider, upload your verification documents, and start receiving customer requests."
        },
        {
          "question": "How does Fixora ensure safety?",
          "answer": "Providers undergo background checks, and all customer–provider interactions are recorded through the platform for safety and transparency."
        }
      ]
    );

    console.log("✅ Faq seeded");
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

run();
