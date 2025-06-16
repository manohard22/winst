import { useState, useEffect } from "react";
import { authAPI, studentAPI, adminAPI } from "../services/api";
import toast from "react-hot-toast";

// Custom hook for fetching data with loading states
export const useApiData = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiCall();
        setData(response.data);
      } catch (err) {
        setError(err);
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};

// Custom hook for students data
export const useStudents = () => {
  return useApiData(() => adminAPI.getStudents());
};

// Custom hook for payments data
export const usePayments = () => {
  return useApiData(() => adminAPI.getPayments());
};

// Custom hook for tasks data
export const useTasks = () => {
  return useApiData(() => studentAPI.getTasks());
};

// Custom hook for admin tasks
export const useAdminTasks = () => {
  return useApiData(() => adminAPI.getTasks());
};

// Custom hook for dashboard stats
export const useDashboardStats = () => {
  return useApiData(() => adminAPI.getDashboardStats());
};

// Custom hook for user certificates
export const useCertificates = (userId) => {
  return useApiData(() => studentAPI.getCertificates(userId), [userId]);
};

// Custom hook for form submission with loading state
export const useFormSubmit = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (apiCall, successMessage = "Success!") => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      toast.success(successMessage);
      return response;
    } catch (err) {
      setError(err);
      toast.error(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
};

export default useApiData;
