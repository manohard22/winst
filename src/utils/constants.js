// Application constants
export const ROLES = {
  ADMIN: "admin",
  STUDENT: "student",
  MENTOR: "mentor",
};

export const TASK_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  OVERDUE: "overdue",
};

export const PAYMENT_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
};

export const STUDENT_STATUS = {
  ACTIVE: "active",
  COMPLETED: "completed",
  DROPPED: "dropped",
  PENDING: "pending",
};

export const TECHNOLOGIES = [
  "Web Development",
  "Data Science",
  "Mobile Development",
  "Digital Marketing",
  "Cloud Computing",
  "Cybersecurity",
  "DevOps",
  "UI/UX Design",
];

export const EDUCATION_LEVELS = [
  "high-school",
  "diploma",
  "undergraduate",
  "graduate",
  "postgraduate",
];

export const PAYMENT_METHODS = ["card", "upi", "netbanking", "wallet"];

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    ME: "/auth/me",
    TECHNOLOGIES: "/auth/technologies",
  },
  STUDENT: {
    TASKS: "/tasks",
    SUBMIT_TASK: (id) => `/tasks/${id}/submit`,
    PAYMENTS: "/payments/my-payments",
    CERTIFICATES: (id) => `/certificates/student/${id}`,
  },
  ADMIN: {
    STUDENTS: "/admin/students",
    PAYMENTS: "/admin/payments",
    TASKS: "/admin/tasks",
    DASHBOARD_STATS: "/admin/dashboard-stats",
  },
  PAYMENTS: {
    PROCESS: "/payments",
    HISTORY: "/payments/my-payments",
  },
  CERTIFICATES: {
    GENERATE: "/certificates/generate",
    DOWNLOAD: (filename) => `/certificates/download/${filename}`,
  },
};

export const STATUS_COLORS = {
  [TASK_STATUS.PENDING]: "bg-gray-100 text-gray-800",
  [TASK_STATUS.IN_PROGRESS]: "bg-yellow-100 text-yellow-800",
  [TASK_STATUS.COMPLETED]: "bg-green-100 text-green-800",
  [TASK_STATUS.OVERDUE]: "bg-red-100 text-red-800",

  [PAYMENT_STATUS.PENDING]: "bg-yellow-100 text-yellow-800",
  [PAYMENT_STATUS.COMPLETED]: "bg-green-100 text-green-800",
  [PAYMENT_STATUS.FAILED]: "bg-red-100 text-red-800",
  [PAYMENT_STATUS.REFUNDED]: "bg-blue-100 text-blue-800",

  [STUDENT_STATUS.ACTIVE]: "bg-green-100 text-green-800",
  [STUDENT_STATUS.COMPLETED]: "bg-blue-100 text-blue-800",
  [STUDENT_STATUS.DROPPED]: "bg-red-100 text-red-800",
  [STUDENT_STATUS.PENDING]: "bg-yellow-100 text-yellow-800",
};

export const GRADE_POINTS = {
  "A+": 4.0,
  A: 3.7,
  "B+": 3.3,
  B: 3.0,
  "C+": 2.7,
  C: 2.0,
  D: 1.0,
  F: 0.0,
};

export const PROGRAM_PRICES = {
  "Web Development": 15000,
  "Data Science": 20000,
  "Mobile Development": 18000,
  "Digital Marketing": 12000,
  "Cloud Computing": 16000,
  Cybersecurity: 22000,
  DevOps: 17000,
  "UI/UX Design": 14000,
};

export const PROGRAM_DURATIONS = {
  "Web Development": 6,
  "Data Science": 8,
  "Mobile Development": 6,
  "Digital Marketing": 4,
  "Cloud Computing": 5,
  Cybersecurity: 6,
  DevOps: 5,
  "UI/UX Design": 4,
};
