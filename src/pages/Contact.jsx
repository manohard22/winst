import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Message sent successfully! We'll get back to you soon.");
      reset();
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6 text-lucro-blue" />,
      title: "Email Us",
      details: ["info@lucro.com", "support@lucro.com"],
      description: "Send us an email anytime",
    },
    {
      icon: <Phone className="h-6 w-6 text-lucro-blue" />,
      title: "Call Us",
      details: ["+91 9876543210", "+91 9876543211"],
      description: "Mon-Fri from 9am to 6pm",
    },
    {
      icon: <MapPin className="h-6 w-6 text-lucro-blue" />,
      title: "Visit Us",
      details: ["123 Tech Park", "Bangalore, Karnataka 560001"],
      description: "Come say hello at our office",
    },
    {
      icon: <Clock className="h-6 w-6 text-lucro-blue" />,
      title: "Working Hours",
      details: [
        "Monday - Friday: 9:00 AM - 6:00 PM",
        "Saturday: 10:00 AM - 4:00 PM",
      ],
      description: "We're here to help",
    },
  ];

  const faqs = [
    {
      question: "How long are the internship programs?",
      answer:
        "Our internship programs range from 2-8 months depending on the technology track you choose. Most programs are 3-6 months long.",
    },
    {
      question: "Do you provide certificates?",
      answer:
        "Yes, we provide industry-recognized certificates upon successful completion of the internship program.",
    },
    {
      question: "Is there job placement assistance?",
      answer:
        "Absolutely! We have partnerships with 150+ companies and provide dedicated placement support to all our students.",
    },
    {
      question: "Can I switch between different technology tracks?",
      answer:
        "Yes, you can switch tracks within the first two weeks of the program, subject to availability and prerequisites.",
    },
    {
      question: "What is the refund policy?",
      answer:
        "We offer a 7-day money-back guarantee if you're not satisfied with the program quality.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white section-padding">
        <div className="container-max text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Have questions about our internship programs? We're here to help you
            start your journey in tech.
          </p>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-lucro-light-blue rounded-full flex items-center justify-center">
                    {info.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {info.title}
                </h3>
                <div className="space-y-1 mb-2">
                  {info.details.map((detail, detailIndex) => (
                    <p key={detailIndex} className="text-gray-700 font-medium">
                      {detail}
                    </p>
                  ))}
                </div>
                <p className="text-sm text-gray-600">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="section-padding bg-lucro-light-gray">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="card">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      {...register("firstName", {
                        required: "First name is required",
                      })}
                      className="input-field"
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      {...register("lastName", {
                        required: "Last name is required",
                      })}
                      className="input-field"
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className="input-field"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    {...register("phone")}
                    className="input-field"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    {...register("subject", {
                      required: "Please select a subject",
                    })}
                    className="input-field"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="programs">Program Information</option>
                    <option value="admission">Admission Process</option>
                    <option value="technical">Technical Support</option>
                    <option value="partnership">Partnership</option>
                  </select>
                  {errors.subject && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    {...register("message", {
                      required: "Message is required",
                    })}
                    rows={5}
                    className="input-field"
                    placeholder="Tell us how we can help you..."
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Map & Additional Info */}
            <div className="space-y-8">
              <div className="card">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Visit Our Office
                </h3>
                <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center mb-4">
                  <p className="text-gray-600">Interactive Map Coming Soon</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-lucro-blue mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Lucro Headquarters
                      </p>
                      <p className="text-gray-600">123 Tech Park, Whitefield</p>
                      <p className="text-gray-600">
                        Bangalore, Karnataka 560001
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-lucro-blue mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Office Hours</p>
                      <p className="text-gray-600">
                        Monday - Friday: 9:00 AM - 6:00 PM
                      </p>
                      <p className="text-gray-600">
                        Saturday: 10:00 AM - 4:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Quick Response
                </h3>
                <p className="text-gray-600 mb-4">
                  We typically respond to all inquiries within 24 hours. For
                  urgent matters, please call us directly.
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <strong>General Inquiries:</strong> info@lucro.com
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Technical Support:</strong> support@lucro.com
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Admissions:</strong> admissions@lucro.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about our internship programs.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
