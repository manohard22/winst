import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Shield, CheckCircle, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const Payment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const programDetails = {
    name: "Web Development Internship",
    duration: "6 months",
    price: 15000,
    originalPrice: 20000,
    discount: 5000,
    features: [
      "Live project experience",
      "Industry expert mentorship",
      "Certificate upon completion",
      "Job placement assistance",
      "24/7 technical support",
    ],
  };

  const onSubmit = async (data) => {
    setIsProcessing(true);
    try {
      const paymentData = {
        amount: programDetails.price,
        method: paymentMethod,
        technology:
          programDetails.name.split(" ")[0] +
          " " +
          programDetails.name.split(" ")[1], // Extract technology name
        transactionId: `TXN${Date.now()}`,
      };

      // Add payment method specific data
      if (paymentMethod === "card") {
        paymentData.cardNumber = data.cardNumber;
        paymentData.cardholderName = data.cardholderName;
      } else if (paymentMethod === "upi") {
        paymentData.upiId = data.upiId;
      } else if (paymentMethod === "netbanking") {
        paymentData.bank = data.bank;
      }

      const response = await paymentAPI.processPayment(paymentData);
      toast.success("Payment successful! Welcome to the program!");
      navigate("/student-dashboard");
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(
        error.response?.data?.message || "Payment failed. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-max">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-lucro-blue hover:text-lucro-dark-blue mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              Complete Your Payment
            </h1>
            <p className="text-gray-600 mt-2">
              Secure your spot in the internship program
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Payment Details
                </h2>

                {/* Payment Method Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Payment Method
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => setPaymentMethod("card")}
                      className={`p-4 border-2 rounded-lg flex items-center justify-center ${
                        paymentMethod === "card"
                          ? "border-lucro-blue bg-lucro-light-blue"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <CreditCard className="h-6 w-6 mr-2" />
                      Credit/Debit Card
                    </button>
                    <button
                      onClick={() => setPaymentMethod("upi")}
                      className={`p-4 border-2 rounded-lg flex items-center justify-center ${
                        paymentMethod === "upi"
                          ? "border-lucro-blue bg-lucro-light-blue"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      UPI
                    </button>
                    <button
                      onClick={() => setPaymentMethod("netbanking")}
                      className={`p-4 border-2 rounded-lg flex items-center justify-center ${
                        paymentMethod === "netbanking"
                          ? "border-lucro-blue bg-lucro-light-blue"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      Net Banking
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {paymentMethod === "card" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          {...register("cardNumber", {
                            required: "Card number is required",
                          })}
                          className="input-field"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                        {errors.cardNumber && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.cardNumber.message}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date *
                          </label>
                          <input
                            type="text"
                            {...register("expiryDate", {
                              required: "Expiry date is required",
                            })}
                            className="input-field"
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                          {errors.expiryDate && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.expiryDate.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV *
                          </label>
                          <input
                            type="text"
                            {...register("cvv", {
                              required: "CVV is required",
                            })}
                            className="input-field"
                            placeholder="123"
                            maxLength={4}
                          />
                          {errors.cvv && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.cvv.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cardholder Name *
                        </label>
                        <input
                          type="text"
                          {...register("cardholderName", {
                            required: "Cardholder name is required",
                          })}
                          className="input-field"
                          placeholder="John Doe"
                        />
                        {errors.cardholderName && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.cardholderName.message}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  {paymentMethod === "upi" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        UPI ID *
                      </label>
                      <input
                        type="text"
                        {...register("upiId", {
                          required: "UPI ID is required",
                        })}
                        className="input-field"
                        placeholder="yourname@upi"
                      />
                      {errors.upiId && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.upiId.message}
                        </p>
                      )}
                    </div>
                  )}

                  {paymentMethod === "netbanking" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Bank *
                      </label>
                      <select
                        {...register("bank", {
                          required: "Please select a bank",
                        })}
                        className="input-field"
                      >
                        <option value="">Select your bank</option>
                        <option value="sbi">State Bank of India</option>
                        <option value="hdfc">HDFC Bank</option>
                        <option value="icici">ICICI Bank</option>
                        <option value="axis">Axis Bank</option>
                        <option value="kotak">Kotak Mahindra Bank</option>
                      </select>
                      {errors.bank && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.bank.message}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center">
                    <input
                      id="terms"
                      type="checkbox"
                      {...register("terms", {
                        required: "You must accept the terms",
                      })}
                      className="h-4 w-4 text-lucro-blue focus:ring-lucro-blue border-gray-300 rounded"
                    />
                    <label
                      htmlFor="terms"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      I agree to the terms and conditions and privacy policy
                    </label>
                  </div>
                  {errors.terms && (
                    <p className="text-red-500 text-sm">
                      {errors.terms.message}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="btn-primary w-full flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Shield className="h-5 w-5 mr-2" />
                        Pay ₹{programDetails.price.toLocaleString()}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Summary
                </h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {programDetails.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Duration: {programDetails.duration}
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Original Price</span>
                      <span className="text-gray-600 line-through">
                        ₹{programDetails.originalPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Discount</span>
                      <span className="text-green-600">
                        -₹{programDetails.discount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-lucro-blue">
                        ₹{programDetails.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  What's Included
                </h3>
                <ul className="space-y-2">
                  {programDetails.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card">
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-green-500 mr-2" />
                  <span>
                    Secure payment powered by industry-standard encryption
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
