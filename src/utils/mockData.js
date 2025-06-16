// Mock data for development when backend is not available
export const mockUser = {
  id: "1",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "+91 9876543210",
  education: "undergraduate",
  fieldOfStudy: "Computer Science",
  technology: "Web Development",
  role: "student",
  status: "active",
  progress: 65,
  joinDate: "2024-01-15",
  paymentStatus: "paid",
};

export const mockTasks = [
  {
    id: 1,
    title: "Complete React Fundamentals Module",
    description: "Learn React components, props, and state management",
    status: "completed",
    dueDate: "2024-01-15",
    points: 100,
  },
  {
    id: 2,
    title: "Build Todo Application",
    description:
      "Create a fully functional todo app using React and localStorage",
    status: "in-progress",
    dueDate: "2024-01-20",
    points: 150,
  },
  {
    id: 3,
    title: "API Integration Project",
    description: "Integrate REST APIs and handle data fetching",
    status: "pending",
    dueDate: "2024-01-25",
    points: 200,
  },
];

export const mockStudents = [
  {
    id: 1,
    name: "Rahul Kumar",
    email: "rahul@example.com",
    program: "Web Development",
    status: "active",
    progress: 75,
    joinDate: "2024-01-15",
    paymentStatus: "paid",
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "priya@example.com",
    program: "Data Science",
    status: "active",
    progress: 60,
    joinDate: "2024-01-10",
    paymentStatus: "paid",
  },
];
