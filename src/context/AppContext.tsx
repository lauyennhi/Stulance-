import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  DEMO_USERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_COMPANIES,
  INITIAL_FACULTY_STATS,
  INITIAL_INVITATIONS,
  INITIAL_JOB_APPLICATIONS,
  INITIAL_JOB_POSTINGS,
  INITIAL_MANAGED_ACCOUNTS,
  INITIAL_MY_TASKS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REVIEWS,
  INITIAL_STUDENT_EVALUATIONS,
  INITIAL_STUDENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_TASKS,
  INITIAL_VIOLATION_REPORTS,
} from '../data/mockData';
import {
  ApplicationStatus,
  AuditLog,
  Company,
  CompanyInvitation,
  CompanyReview,
  FacultyReportData,
  JobApplication,
  JobPosting,
  ManagedAccount,
  MyTaskRecord,
  NotificationItem,
  Role,
  StudentEvaluation,
  StudentProfile,
  Submission,
  Task,
  TaskStatus,
  ToastMessage,
  User,
  ViolationReason,
  ViolationReport,
  ViolationReportStatus,
} from '../types';

interface AppContextType {
  currentUser: User | null;
  activeRole: Role | null;
  companies: Company[];
  tasks: Task[];
  submissions: Submission[];
  students: StudentProfile[];
  currentStudentProfile: StudentProfile | null;
  currentCompany: Company | null;
  jobPostings: JobPosting[];
  myTasks: MyTaskRecord[];
  jobApplications: JobApplication[];
  invitations: CompanyInvitation[];
  companyReviews: CompanyReview[];
  studentEvaluations: StudentEvaluation[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  toasts: ToastMessage[];
  
  // UI States
  isAuthOpen: boolean;
  authMode: 'login' | 'register_student' | 'register_company' | 'forgot_password';
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  
  // Selected Company for Profile View modal/page
  viewingCompanyId: string | null;
  setViewingCompanyId: (id: string | null) => void;
  
  // Selected Task for Detail modal/page
  viewingTaskId: string | null;
  setViewingTaskId: (id: string | null) => void;

  // Actions
  openAuth: (mode?: 'login' | 'register_student' | 'register_company' | 'forgot_password') => void;
  closeAuth: () => void;
  quickLoginAs: (role: Role) => void;
  loginWithEmail: (email: string, password: string) => boolean;
  registerStudent: (data: { name: string; email: string; university: string; major: string; cohort: string; password: string }) => boolean;
  registerCompany: (data: { companyName: string; contactName: string; email: string; industry: string; location: string; description: string; password: string }) => boolean;
  logout: () => void;
  
  // Student Actions
  claimTask: (taskId: string) => boolean;
  cancelClaimedTask: (myTaskId: string) => boolean;
  submitTaskWork: (myTaskId: string, data: { deliverableLink?: string; fileName?: string; notes: string; selfPledgeConfirmed: boolean }) => boolean;
  updateTaskSubmission: (myTaskId: string, data: { deliverableLink?: string; fileName?: string; notes: string }) => boolean;
  toggleProofPublicInPortfolio: (myTaskId: string) => void;
  updateStudentProfile: (updatedData: Partial<StudentProfile>) => void;
  addSkillToProfile: (skill: string) => boolean;
  removeSkillFromProfile: (skill: string) => void;
  toggleFindMe: () => void;
  applyForJob: (jobId: string, coverNote: string, attachedProofIds: string[]) => boolean;
  withdrawJobApplication: (applicationId: string) => boolean;
  acceptInvitation: (invitationId: string) => void;
  declineInvitation: (invitationId: string) => void;
  submitCompanyReview: (companyId: string, taskId: string, rating: number, comment: string) => boolean;
  reportTaskViolation: (taskId: string, reason: string, details: string) => void;
  
  // Company Actions
  updateCompanyProfile: (data: {
    name?: string;
    taxCode?: string;
    industry?: string;
    location?: string;
    website?: string;
    description?: string;
    logo?: string;
    legalDocumentName?: string;
  }) => boolean;
  resubmitCompanyVerification: (legalDocumentName: string) => boolean;
  createTask: (data: Partial<Task>, status: TaskStatus) => { success: boolean; error?: string };
  updateTask: (taskId: string, data: Partial<Task>) => { success: boolean; error?: string };
  deleteTask: (taskId: string) => boolean;
  closeTaskEarly: (taskId: string) => boolean;
  gradeSubmissionWithCriteria: (
    submissionId: string,
    criteriaScores: { criterionName: string; score: number; maxScore: number }[],
    feedbackQuote: string,
    detailedFeedback: string
  ) => boolean;
  assignStudentToProject: (taskId: string, studentId: string) => boolean;
  confirmProjectCompletionAndPayment: (taskId: string, studentId: string) => boolean;
  sendCompanyInvitation: (
    studentId: string,
    type: 'task_invite' | 'interview_invite' | 'project_invite' | 'internship_invite',
    title: string,
    message: string,
    taskId?: string
  ) => boolean;
  createJobPosting: (data: Partial<JobPosting>) => boolean;
  updateJobPosting: (jobId: string, data: Partial<JobPosting>) => boolean;
  closeJobPosting: (jobId: string) => boolean;
  deleteJobPosting: (jobId: string) => boolean;
  updateApplicationKanbanStatus: (applicationId: string, newStatus: ApplicationStatus) => void;
  updateApplicationDetails: (
    applicationId: string,
    data: {
      status?: ApplicationStatus;
      internalNote?: string;
      candidateFeedback?: string;
    }
  ) => void;
  submitStudentEvaluation: (studentId: string, taskId: string, rating: number, comment: string) => boolean;

  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  
  violationReports: ViolationReport[];
  managedAccounts: ManagedAccount[];
  auditLogs: AuditLog[];
  facultyStats: FacultyReportData[];
  
  // Toast
  notify: (title: string, message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  
  // Reset
  resetMockData: () => void;

  // Admin Actions
  verifyCompany: (companyId: string) => void;
  rejectCompany: (companyId: string, reason: string) => void;
  approveTask: (taskId: string) => void;
  rejectTask: (taskId: string, reason: string) => void;
  removeTaskByAdmin: (taskId: string, reason: string) => void;
  removeJobPostingByAdmin: (jobId: string, reason: string) => void;
  resolveViolationReport: (
    reportId: string,
    conclusion: 'violation' | 'no_violation',
    note: string,
    actionTaken?: 'removed_task' | 'removed_job' | 'locked_account' | 'warning' | 'dismissed'
  ) => void;
  lockAccount: (accountId: string, reason: string) => void;
  unlockAccount: (accountId: string) => void;
  reportViolation: (
    targetType: 'task' | 'job' | 'company',
    targetId: string,
    targetTitle: string,
    reason: string,
    details: string
  ) => void;

  // School Actions
  exportSchoolReportCSV: (facultyFilter?: string, timeFilter?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'stulance_current_user',
  COMPANIES: 'stulance_companies_v2',
  TASKS: 'stulance_tasks_v2',
  SUBMISSIONS: 'stulance_submissions_v2',
  STUDENTS: 'stulance_students_v2',
  JOBS: 'stulance_job_postings_v2',
  MY_TASKS: 'stulance_my_tasks_v2',
  APPLICATIONS: 'stulance_job_applications_v2',
  INVITATIONS: 'stulance_invitations_v2',
  REVIEWS: 'stulance_reviews_v2',
  EVALUATIONS: 'stulance_student_evaluations_v2',
  NOTIFICATIONS: 'stulance_notifications_v2',
  REPORTS: 'stulance_reports_v2',
  ACCOUNTS: 'stulance_accounts_v2',
  AUDIT_LOGS: 'stulance_audit_logs_v2',
  FACULTY_STATS: 'stulance_faculty_stats_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current user
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeRole, setActiveRole] = useState<Role | null>(currentUser ? currentUser.role : null);

  // Entities stored in localStorage
  const [companies, setCompanies] = useState<Company[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPANIES);
      return saved ? JSON.parse(saved) : INITIAL_COMPANIES;
    } catch {
      return INITIAL_COMPANIES;
    }
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
    } catch {
      return INITIAL_SUBMISSIONS;
    }
  });

  const [students, setStudents] = useState<StudentProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [jobPostings, setJobPostings] = useState<JobPosting[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.JOBS);
      return saved ? JSON.parse(saved) : INITIAL_JOB_POSTINGS;
    } catch {
      return INITIAL_JOB_POSTINGS;
    }
  });

  const [myTasks, setMyTasks] = useState<MyTaskRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MY_TASKS);
      return saved ? JSON.parse(saved) : INITIAL_MY_TASKS;
    } catch {
      return INITIAL_MY_TASKS;
    }
  });

  const [jobApplications, setJobApplications] = useState<JobApplication[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_JOB_APPLICATIONS;
    } catch {
      return INITIAL_JOB_APPLICATIONS;
    }
  });

  const [invitations, setInvitations] = useState<CompanyInvitation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INVITATIONS);
      return saved ? JSON.parse(saved) : INITIAL_INVITATIONS;
    } catch {
      return INITIAL_INVITATIONS;
    }
  });

  const [companyReviews, setCompanyReviews] = useState<CompanyReview[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [studentEvaluations, setStudentEvaluations] = useState<StudentEvaluation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVALUATIONS);
      return saved ? JSON.parse(saved) : INITIAL_STUDENT_EVALUATIONS;
    } catch {
      return INITIAL_STUDENT_EVALUATIONS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [violationReports, setViolationReports] = useState<ViolationReport[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
      return saved ? JSON.parse(saved) : INITIAL_VIOLATION_REPORTS;
    } catch {
      return INITIAL_VIOLATION_REPORTS;
    }
  });

  const [managedAccounts, setManagedAccounts] = useState<ManagedAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      return saved ? JSON.parse(saved) : INITIAL_MANAGED_ACCOUNTS;
    } catch {
      return INITIAL_MANAGED_ACCOUNTS;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  const [facultyStats, setFacultyStats] = useState<FacultyReportData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FACULTY_STATS);
      return saved ? JSON.parse(saved) : INITIAL_FACULTY_STATS;
    } catch {
      return INITIAL_FACULTY_STATS;
    }
  });

  // UI state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register_student' | 'register_company' | 'forgot_password'>('login');
  const [currentTab, setCurrentTab] = useState('home');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [viewingCompanyId, setViewingCompanyId] = useState<string | null>(null);
  const [viewingTaskId, setViewingTaskId] = useState<string | null>(null);

  // Synced entity for current session
  const currentStudentProfile = currentUser && currentUser.role === 'student'
    ? students.find((s) => s.id === currentUser.id) || students[0]
    : null;

  const currentCompany = currentUser && currentUser.role === 'company'
    ? companies.find((c) => c.id === (currentUser.companyId || 'comp-1')) || companies[0]
    : null;

  // Unread notifications count
  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  // Sync state to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      setActiveRole(currentUser.role);
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
      setActiveRole(null);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobPostings));
  }, [jobPostings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MY_TASKS, JSON.stringify(myTasks));
  }, [myTasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(jobApplications));
  }, [jobApplications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVITATIONS, JSON.stringify(invitations));
  }, [invitations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(companyReviews));
  }, [companyReviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify(studentEvaluations));
  }, [studentEvaluations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(violationReports));
  }, [violationReports]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(managedAccounts));
  }, [managedAccounts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FACULTY_STATS, JSON.stringify(facultyStats));
  }, [facultyStats]);

  // Periodic check for overdue student tasks, auto-closing expired company tasks, and deadline warnings
  useEffect(() => {
    const checkSystemAutomations = () => {
      const now = Date.now();
      const todayStr = new Date().toISOString().split('T')[0];

      // 1. Tự động chuyển trạng thái bài sinh viên sang quá hạn nếu hết thời gian làm bài
      setMyTasks((prev) =>
        prev.map((item) => {
          if (item.status === 'in_progress' && item.deadlineTimestamp < now) {
            return { ...item, status: 'overdue' };
          }
          return item;
        })
      );

      // 2. Rule: "Tự đóng nhiệm vụ khi qua hạn nộp"
      setTasks((prev) =>
        prev.map((task) => {
          if (task.status === 'open' && task.deadline && task.deadline < todayStr) {
            return { ...task, status: 'closed' };
          }
          return task;
        })
      );
    };

    checkSystemAutomations();
    const interval = setInterval(checkSystemAutomations, 30000);
    return () => clearInterval(interval);
  }, []);

  // Toast Helpers
  const notify = (title: string, message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth Methods
  const openAuth = (mode: 'login' | 'register_student' | 'register_company' | 'forgot_password' = 'login') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const closeAuth = () => {
    setIsAuthOpen(false);
  };

  const quickLoginAs = (role: Role) => {
    const user = DEMO_USERS[role];
    if (user) {
      setCurrentUser(user);
      setActiveRole(role);
      setIsAuthOpen(false);
      setCurrentTab('home');
      const roleNameVi =
        role === 'student'
          ? 'Sinh viên'
          : role === 'company'
          ? 'Doanh nghiệp'
          : role === 'admin'
          ? 'Cán bộ quản trị'
          : 'Đại diện Nhà trường';
      notify('Đăng nhập thành công', `Chào mừng ${user.name} (${roleNameVi}) quay trở lại!`, 'success');
    }
  };

  const loginWithEmail = (email: string, pass: string): boolean => {
    const matched = Object.values(DEMO_USERS).find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      setCurrentUser(matched);
      setActiveRole(matched.role);
      setIsAuthOpen(false);
      setCurrentTab('home');
      notify('Đăng nhập thành công', `Chào mừng ${matched.name} đã đăng nhập!`, 'success');
      return true;
    }
    
    const matchedStudent = students.find((s) => s.email.toLowerCase() === email.toLowerCase());
    if (matchedStudent) {
      const userObj: User = {
        id: matchedStudent.id,
        name: matchedStudent.name,
        email: matchedStudent.email,
        role: 'student',
        university: matchedStudent.university,
        major: matchedStudent.major,
        avatar: matchedStudent.avatar,
        title: `Sinh viên · ${matchedStudent.university}`,
      };
      setCurrentUser(userObj);
      setActiveRole('student');
      setIsAuthOpen(false);
      setCurrentTab('home');
      notify('Đăng nhập thành công', `Chào bạn ${matchedStudent.name}!`, 'success');
      return true;
    }

    notify('Đăng nhập không thành công', 'Email hoặc mật khẩu chưa chính xác. Bạn có thể dùng 4 nút Vào nhanh để trải nghiệm demo!', 'error');
    return false;
  };

  const registerStudent = (data: { name: string; email: string; university: string; major: string; cohort: string; password: string }) => {
    const newStudentId = `stu-${Date.now()}`;
    const newProfile: StudentProfile = {
      id: newStudentId,
      name: data.name,
      studentCode: `SV${Math.floor(100000 + Math.random() * 900000)}`,
      faculty: 'Khoa Đào tạo Tiêu chuẩn',
      university: data.university,
      major: data.major,
      year: 3,
      cohort: data.cohort,
      email: data.email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: `Sinh viên chuyên ngành ${data.major} tại ${data.university}. Luôn chủ động thử thách với các bài toán doanh nghiệp thực tế.`,
      skills: ['Giải quyết vấn đề', 'Làm việc độc lập'],
      productLinks: [],
      completedTasksCount: 0,
      averageScore: 0,
      headline: `Sinh viên ngành ${data.major} tại ${data.university}`,
      allowCompaniesToFindMe: true,
    };

    setStudents((prev) => [newProfile, ...prev]);

    const userObj: User = {
      id: newStudentId,
      name: data.name,
      email: data.email,
      role: 'student',
      university: data.university,
      major: data.major,
      avatar: newProfile.avatar,
      title: `Sinh viên · ${data.university}`,
    };

    setCurrentUser(userObj);
    setActiveRole('student');
    setIsAuthOpen(false);
    setCurrentTab('home');
    notify('Đăng ký tài khoản thành công', `Chào mừng ${data.name}! Hãy nhận nhiệm vụ thực tế đầu tiên ngay.`, 'success');
    return true;
  };

  const registerCompany = (data: { companyName: string; contactName: string; email: string; industry: string; location: string; description: string; password: string }) => {
    const newCompId = `comp-${Date.now()}`;
    const newCompany: Company = {
      id: newCompId,
      name: data.companyName,
      industry: data.industry,
      status: 'pending',
      location: data.location,
      description: data.description,
      logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=80',
      submittedAt: new Date().toISOString().split('T')[0],
      website: 'https://doanhnghiep.vn.mock',
      taskCount: 0,
      taxCode: '0109998888',
      legalDocumentName: 'Dang_Ky_Kinh_Doanh_DoanhNghiep.pdf',
      legalDocumentUploadedAt: new Date().toISOString().split('T')[0],
    };

    setCompanies((prev) => [newCompany, ...prev]);

    const userObj: User = {
      id: `comp-user-${Date.now()}`,
      name: data.contactName,
      email: data.email,
      role: 'company',
      companyId: newCompId,
      title: `Đại diện tuyển dụng · ${data.companyName}`,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    };

    setCurrentUser(userObj);
    setActiveRole('company');
    setIsAuthOpen(false);
    setCurrentTab('home');
    notify('Đăng ký doanh nghiệp thành công', `Hồ sơ ${data.companyName} đã gửi tới Cán bộ Nhà trường để xác minh.`, 'info');
    return true;
  };

  const logout = () => {
    const prevName = currentUser?.name;
    setCurrentUser(null);
    setActiveRole(null);
    setCurrentTab('home');
    notify('Đã đăng xuất', `Tài khoản ${prevName || ''} đã đăng xuất an toàn khỏi Stulance.`, 'info');
  };

  // STUDENT ACTIONS
  const claimTask = (taskId: string): boolean => {
    if (!currentUser || currentUser.role !== 'student') {
      openAuth('login');
      return false;
    }

    const task = tasks.find((t) => t.id === taskId);
    if (!task) return false;

    const alreadyClaimed = myTasks.some(
      (m) => m.taskId === taskId && m.studentId === currentUser.id && m.status !== 'cancelled'
    );
    if (alreadyClaimed) {
      notify('Không thể nhận lại', 'Bạn đã nhận nhiệm vụ này trước đó rồi. Vui lòng kiểm tra mục "Nhiệm vụ của tôi".', 'error');
      return false;
    }

    const durationHours = task.type === 'challenge' ? Math.min(task.estimatedHours, 3) : task.estimatedHours;
    const deadlineTimestamp = Date.now() + durationHours * 60 * 60 * 1000;

    const newMyTask: MyTaskRecord = {
      id: `mytask-${Date.now()}`,
      taskId: task.id,
      studentId: currentUser.id,
      claimedAt: new Date().toISOString().split('T')[0],
      deadlineTimestamp,
      status: 'in_progress',
    };

    setMyTasks((prev) => [newMyTask, ...prev]);
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, submissionCount: t.submissionCount + 1 } : t))
    );

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      studentId: currentUser.id,
      title: task.type === 'challenge' ? 'Đã nhận nhiệm vụ Thử sức!' : 'Đã ứng tuyển dự án ngắn!',
      content: `Bạn có ${durationHours} giờ để hoàn thành "${task.title}". Hạn nộp đang được đếm ngược!`,
      type: 'deadline_warning',
      createdAt: new Date().toISOString().split('T')[0],
      isRead: false,
      actionTab: 'my-tasks',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    notify(
      task.type === 'challenge' ? 'Đã nhận nhiệm vụ thành công!' : 'Đã đăng ký dự án thành công!',
      `Đồng hồ đếm ngược đã bắt đầu (${durationHours} giờ). Chúc bạn làm bài thật xuất sắc!`,
      'success'
    );
    return true;
  };

  const cancelClaimedTask = (myTaskId: string): boolean => {
    const item = myTasks.find((m) => m.id === myTaskId);
    if (!item) return false;

    if (item.status !== 'in_progress') {
      notify('Không thể hủy', 'Bạn chỉ có thể hủy nhận nhiệm vụ khi bài làm chưa được nộp.', 'error');
      return false;
    }

    setMyTasks((prev) => prev.filter((m) => m.id !== myTaskId));
    notify('Đã hủy nhận nhiệm vụ', 'Nhiệm vụ đã được gỡ khỏi danh sách Đang làm của bạn.', 'info');
    return true;
  };

  const submitTaskWork = (
    myTaskId: string,
    data: { deliverableLink?: string; fileName?: string; notes: string; selfPledgeConfirmed: boolean }
  ): boolean => {
    if (!data.selfPledgeConfirmed) {
      notify('Thiếu cam kết', 'Bạn bắt buộc phải tích chọn "Tôi cam kết tự làm bài này" trước khi gửi nộp.', 'error');
      return false;
    }

    if (!data.deliverableLink?.trim() && !data.fileName?.trim()) {
      notify('Thiếu sản phẩm', 'Vui lòng nhập đường dẫn liên kết hoặc tải lên tệp bài làm.', 'error');
      return false;
    }

    const item = myTasks.find((m) => m.id === myTaskId);
    if (!item) return false;

    if (Date.now() > item.deadlineTimestamp) {
      setMyTasks((prev) =>
        prev.map((m) => (m.id === myTaskId ? { ...m, status: 'overdue' } : m))
      );
      notify('Hết hạn nộp bài', 'Nhiệm vụ này đã quá hạn nộp nên hệ thống đã khóa quyền nộp.', 'error');
      return false;
    }

    const task = tasks.find((t) => t.id === item.taskId);

    const updatedMyTask: MyTaskRecord = {
      ...item,
      status: 'submitted',
      deliverableLink: data.deliverableLink?.trim(),
      fileName: data.fileName?.trim(),
      notes: data.notes?.trim(),
      submittedAt: new Date().toISOString().split('T')[0],
      selfPledgeConfirmed: true,
    };

    setMyTasks((prev) => prev.map((m) => (m.id === myTaskId ? updatedMyTask : m)));

    const newSub: Submission = {
      id: `sub-${Date.now()}`,
      taskId: item.taskId,
      taskTitle: task?.title || 'Nhiệm vụ thực tế',
      studentId: currentUser?.id || 'stu-1',
      studentName: currentUser?.name || 'Nguyễn Minh Khang',
      studentUniversity: currentUser?.university || 'Đại học Bách Khoa Hà Nội',
      submittedAt: new Date().toISOString().split('T')[0],
      deliverableLink: data.deliverableLink?.trim() || data.fileName?.trim() || 'Link file',
      fileName: data.fileName,
      notes: data.notes,
      status: 'submitted',
    };
    setSubmissions((prev) => [newSub, ...prev]);

    notify('Nộp bài thành công!', 'Bài làm của bạn đã gửi đến doanh nghiệp để chấm điểm theo các tiêu chí.', 'success');
    return true;
  };

  const updateTaskSubmission = (
    myTaskId: string,
    data: { deliverableLink?: string; fileName?: string; notes: string }
  ): boolean => {
    const item = myTasks.find((m) => m.id === myTaskId);
    if (!item) return false;

    if (item.status !== 'submitted') {
      notify('Không thể cập nhật', 'Chỉ có thể cập nhật bài làm đang ở trạng thái Đã nộp và chưa được chấm.', 'error');
      return false;
    }

    if (Date.now() > item.deadlineTimestamp) {
      notify('Hết hạn cập nhật', 'Nhiệm vụ đã quá hạn thời gian nên không thể chỉnh sửa thêm.', 'error');
      return false;
    }

    setMyTasks((prev) =>
      prev.map((m) =>
        m.id === myTaskId
          ? {
              ...m,
              deliverableLink: data.deliverableLink?.trim() || m.deliverableLink,
              fileName: data.fileName?.trim() || m.fileName,
              notes: data.notes?.trim() || m.notes,
            }
          : m
      )
    );

    notify('Cập nhật bài làm thành công', 'Thông tin chỉnh sửa mới nhất đã được lưu lại cho doanh nghiệp.', 'success');
    return true;
  };

  const toggleProofPublicInPortfolio = (myTaskId: string) => {
    setMyTasks((prev) =>
      prev.map((m) => {
        if (m.id === myTaskId) {
          const newVal = !m.isPublicInPortfolio;
          notify(
            newVal ? 'Đã bật Công khai Thẻ bằng chứng' : 'Đã chuyển sang Riêng tư',
            newVal
              ? 'Thẻ bằng chứng này hiện đã hiển thị trong hồ sơ năng lực của bạn cho doanh nghiệp xem.'
              : 'Thẻ bằng chứng này chỉ hiển thị riêng với bạn.',
            'info'
          );
          return { ...m, isPublicInPortfolio: newVal };
        }
        return m;
      })
    );

    setSubmissions((prev) =>
      prev.map((s) => {
        if (s.id === myTaskId || s.taskId === myTasks.find((m) => m.id === myTaskId)?.taskId) {
          return { ...s, isPublicInPortfolio: !s.isPublicInPortfolio };
        }
        return s;
      })
    );
  };

  const updateStudentProfile = (updatedData: Partial<StudentProfile>) => {
    if (!currentUser) return;
    setStudents((prev) =>
      prev.map((st) => (st.id === currentUser.id ? { ...st, ...updatedData } : st))
    );
    notify('Đã cập nhật hồ sơ năng lực', 'Thông tin cá nhân và định hướng nghề nghiệp đã được lưu.', 'success');
  };

  const addSkillToProfile = (skill: string): boolean => {
    if (!currentUser) return false;
    const currentSkills = currentStudentProfile?.skills || [];
    if (currentSkills.length >= 15) {
      notify('Đạt giới hạn', 'Hồ sơ năng lực cho phép tối đa 15 kỹ năng cốt lõi.', 'error');
      return false;
    }
    if (currentSkills.some((s) => s.toLowerCase() === skill.toLowerCase())) {
      notify('Kỹ năng đã có', `Kỹ năng "${skill}" đã tồn tại trong danh sách của bạn.`, 'info');
      return false;
    }

    const updated = [...currentSkills, skill.trim()];
    updateStudentProfile({ skills: updated });
    return true;
  };

  const removeSkillFromProfile = (skill: string) => {
    if (!currentUser) return;
    const currentSkills = currentStudentProfile?.skills || [];
    const updated = currentSkills.filter((s) => s !== skill);
    updateStudentProfile({ skills: updated });
  };

  const toggleFindMe = () => {
    if (!currentStudentProfile) return;
    const newVal = !currentStudentProfile.allowCompaniesToFindMe;
    updateStudentProfile({ allowCompaniesToFindMe: newVal });
    notify(
      newVal ? 'Đã bật tìm kiếm' : 'Đã tắt tìm kiếm',
      newVal
        ? 'Doanh nghiệp đã xác minh có thể chủ động tìm thấy bạn và gửi lời mời.'
        : 'Hồ sơ của bạn hiện ở chế độ ẩn với công cụ tìm kiếm của doanh nghiệp.',
      'info'
    );
  };

  const applyForJob = (jobId: string, coverNote: string, attachedProofIds: string[]): boolean => {
    if (!currentUser) {
      openAuth('login');
      return false;
    }

    const job = jobPostings.find((j) => j.id === jobId);
    if (!job) return false;

    const alreadyApplied = jobApplications.some(
      (a) => a.jobId === jobId && a.studentId === currentUser.id
    );
    if (alreadyApplied) {
      notify('Đã nộp đơn trước đó', 'Mỗi tin tuyển dụng chỉ được nộp một hồ sơ ứng tuyển.', 'error');
      return false;
    }

    const newApp: JobApplication = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      companyId: job.companyId,
      companyName: job.companyName,
      studentId: currentUser.id,
      studentName: currentUser.name,
      appliedAt: new Date().toISOString().split('T')[0],
      coverNote,
      attachedProofIds,
      status: 'submitted',
    };

    setJobApplications((prev) => [newApp, ...prev]);

    notify(
      'Ứng tuyển thành công!',
      `Hồ sơ năng lực kèm ${attachedProofIds.length} Thẻ bằng chứng đã được chuyển tới ${job.companyName}.`,
      'success'
    );
    return true;
  };

  const withdrawJobApplication = (applicationId: string): boolean => {
    const app = jobApplications.find((a) => a.id === applicationId);
    if (!app) return false;

    if (app.status !== 'submitted') {
      notify('Không thể rút đơn', 'Hồ sơ đã được nhà tuyển dụng xem xét hoặc xử lý nên không thể rút lại.', 'error');
      return false;
    }

    setJobApplications((prev) => prev.filter((a) => a.id !== applicationId));
    notify('Đã rút đơn ứng tuyển', `Đơn ứng tuyển vị trí "${app.jobTitle}" đã được thu hồi an toàn.`, 'info');
    return true;
  };

  const acceptInvitation = (invitationId: string) => {
    setInvitations((prev) =>
      prev.map((inv) => (inv.id === invitationId ? { ...inv, status: 'accepted' } : inv))
    );
    notify('Đã chấp nhận lời mời', 'Bạn đã đồng ý kết nối. Doanh nghiệp sẽ liên hệ với bạn trong thời gian sớm nhất!', 'success');
  };

  const declineInvitation = (invitationId: string) => {
    setInvitations((prev) =>
      prev.map((inv) => (inv.id === invitationId ? { ...inv, status: 'declined' } : inv))
    );
    notify('Đã từ chối lời mời', 'Thông báo đã được ghi nhận vào hệ thống.', 'info');
  };

  const submitCompanyReview = (companyId: string, taskId: string, rating: number, comment: string): boolean => {
    if (!currentUser) return false;
    const task = tasks.find((t) => t.id === taskId);
    const company = companies.find((c) => c.id === companyId);

    const newRev: CompanyReview = {
      id: `rev-${Date.now()}`,
      companyId,
      companyName: company?.name || 'Doanh nghiệp đối tác',
      studentId: currentUser.id,
      studentName: currentUser.name,
      taskId,
      taskTitle: task?.title || 'Nhiệm vụ thực tế',
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString().split('T')[0],
    };

    setCompanyReviews((prev) => [newRev, ...prev]);
    setMyTasks((prev) =>
      prev.map((m) => (m.taskId === taskId ? { ...m, hasReviewedCompany: true } : m))
    );

    notify('Đã gửi đánh giá doanh nghiệp', `Cảm ơn bạn đã đánh giá ${rating} sao cho ${company?.name || 'doanh nghiệp'}.`, 'success');
    return true;
  };

  const reportTaskViolation = (taskId: string, reason: string, details: string) => {
    const task = tasks.find((t) => t.id === taskId);
    notify('Đã gửi báo cáo vi phạm', `Cán bộ nhà trường sẽ kiểm tra nhiệm vụ "${task?.title || ''}" trong vòng 24 giờ.`, 'info');
  };

  // ==========================================
  // COMPANY SUBSYSTEM ACTIONS
  // ==========================================

  // 1. Cập nhật hồ sơ doanh nghiệp & Rule: "Sửa mã số thuế hoặc giấy tờ thì trạng thái về Chờ xác minh"
  const updateCompanyProfile = (data: {
    name?: string;
    taxCode?: string;
    industry?: string;
    location?: string;
    website?: string;
    description?: string;
    logo?: string;
    legalDocumentName?: string;
  }): boolean => {
    if (!currentCompany) return false;

    const isLegalModified =
      (data.taxCode !== undefined && data.taxCode !== currentCompany.taxCode) ||
      (data.legalDocumentName !== undefined && data.legalDocumentName !== currentCompany.legalDocumentName);

    const newStatus: 'verified' | 'pending' | 'rejected' = isLegalModified
      ? 'pending'
      : currentCompany.status;

    setCompanies((prev) =>
      prev.map((c) =>
        c.id === currentCompany.id
          ? {
              ...c,
              ...data,
              status: newStatus,
              rejectionReason: isLegalModified ? undefined : c.rejectionReason,
            }
          : c
      )
    );

    if (isLegalModified) {
      notify(
        'Hồ sơ chuyển sang Chờ xác minh',
        'Do bạn đã chỉnh sửa Mã số thuế hoặc Giấy tờ pháp lý, cán bộ nhà trường sẽ thẩm định lại hồ sơ trong 24h.',
        'info'
      );
    } else {
      notify('Đã cập nhật hồ sơ doanh nghiệp', 'Thông tin giới thiệu và liên hệ đã được lưu thành công.', 'success');
    }
    return true;
  };

  // Nộp lại hồ sơ xác minh sau khi bị từ chối
  const resubmitCompanyVerification = (legalDocumentName: string): boolean => {
    if (!currentCompany) return false;

    setCompanies((prev) =>
      prev.map((c) =>
        c.id === currentCompany.id
          ? {
              ...c,
              legalDocumentName,
              status: 'pending',
              rejectionReason: undefined,
              submittedAt: new Date().toISOString().split('T')[0],
            }
          : c
      )
    );

    notify('Đã nộp lại hồ sơ xác minh', 'Hồ sơ đã gửi tới cán bộ trường để kiểm duyệt lại.', 'success');
    return true;
  };

  // 2. Tạo nhiệm vụ theo từng bước (với validation thời lượng và thù lao, chặn khi chưa xác minh)
  const createTask = (data: Partial<Task>, taskStatus: TaskStatus = 'open'): { success: boolean; error?: string } => {
    if (!currentCompany) {
      return { success: false, error: 'Vui lòng đăng nhập với tài khoản doanh nghiệp.' };
    }

    // Rule: "Chưa xác minh thì khóa nút đăng nhiệm vụ và đăng tin, kèm lời giải thích"
    if (currentCompany.status !== 'verified' && taskStatus !== 'draft') {
      notify(
        'Yêu cầu xác minh doanh nghiệp',
        'Doanh nghiệp của bạn đang ở trạng thái ' +
          (currentCompany.status === 'pending' ? 'Chờ xác minh' : 'Bị từ chối') +
          '. Vui lòng hoàn tất giấy tờ để được mở khóa đăng nhiệm vụ.',
        'error'
      );
      return { success: false, error: 'Chưa xác minh doanh nghiệp.' };
    }

    const type = data.type || 'challenge';
    const hours = data.estimatedHours || 3;
    const reward = data.rewardVND || 0;

    // Rule: "Hệ thống tự chặn khi vi phạm giới hạn giờ hoặc thiếu thù lao"
    if (type === 'challenge') {
      if (hours > 3) {
        return { success: false, error: 'Nhiệm vụ Thử sức giới hạn thời lượng tối đa 3 giờ.' };
      }
    } else if (type === 'project') {
      if (hours < 5 || hours > 40) {
        return { success: false, error: 'Dự án ngắn phải có thời lượng từ 5 đến 40 giờ.' };
      }
      if (reward <= 0) {
        return { success: false, error: 'Dự án ngắn bắt buộc phải có thù lao cho sinh viên.' };
      }
    }

    const newTask: Task = {
      id: `task-${Date.now()}`,
      companyId: currentCompany.id,
      companyName: currentCompany.name,
      companyVerified: currentCompany.status === 'verified',
      title: data.title || 'Nhiệm vụ thực tế mới',
      category: data.category || 'CNTT',
      type,
      shortBrief: data.shortBrief || '',
      description: data.description || '',
      requirements: data.requirements || [],
      evaluationCriteriaList: data.evaluationCriteriaList || [
        { id: 'c1', name: 'Chất lượng chuyên môn', maxScore: 5 },
        { id: 'c2', name: 'Tính ứng dụng thực tế', maxScore: 5 },
      ],
      rewardVND: reward,
      deadline: data.deadline || '2026-10-30',
      isUrgent: !!data.isUrgent,
      estimatedHours: hours,
      submissionCount: 0,
      status: taskStatus,
      deliverableFormat: data.deliverableFormat || 'Link GitHub / Figma hoặc file nộp',
      attachmentName: data.attachmentName,
      maxParticipants: data.maxParticipants || 10,
    };

    setTasks((prev) => [newTask, ...prev]);

    notify(
      taskStatus === 'draft' ? 'Đã lưu bản nháp' : 'Đã đăng nhiệm vụ thành công',
      taskStatus === 'draft'
        ? 'Nhiệm vụ đã được lưu vào danh sách Nháp của bạn.'
        : `Nhiệm vụ "${newTask.title.substring(0, 36)}..." hiện đã mở nhận bài làm từ sinh viên!`,
      'success'
    );
    return { success: true };
  };

  // 3. Sửa nhiệm vụ: "Sửa khi là Nháp hoặc Bị từ chối. Không cho sửa khi đã có sinh viên nhận!"
  const updateTask = (taskId: string, data: Partial<Task>): { success: boolean; error?: string } => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return { success: false, error: 'Không tìm thấy nhiệm vụ.' };

    // Rule: Không cho sửa khi đã có sinh viên nhận
    const hasSubmissions = submissions.some((s) => s.taskId === taskId) || myTasks.some((m) => m.taskId === taskId);
    if (hasSubmissions) {
      notify('Không thể chỉnh sửa', 'Nhiệm vụ này đã có sinh viên nhận làm đề bài, không được phép sửa để đảm bảo tính công bằng.', 'error');
      return { success: false, error: 'Đã có sinh viên nhận làm, không thể sửa.' };
    }

    if (task.status !== 'draft' && task.status !== 'rejected') {
      notify('Không thể sửa', 'Chỉ có thể chỉnh sửa nhiệm vụ ở trạng thái Nháp hoặc Bị từ chối.', 'error');
      return { success: false, error: 'Chỉ sửa khi là Nháp hoặc Bị từ chối.' };
    }

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...data } : t))
    );

    notify('Đã cập nhật nhiệm vụ', 'Thông tin nhiệm vụ đã được cập nhật thành công.', 'success');
    return { success: true };
  };

  // 4. Xóa nhiệm vụ: "Xóa khi là Nháp"
  const deleteTask = (taskId: string): boolean => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return false;

    if (task.status !== 'draft') {
      notify('Không thể xóa', 'Chỉ được phép xóa nhiệm vụ khi đang ở trạng thái Nháp.', 'error');
      return false;
    }

    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    notify('Đã xóa nhiệm vụ nháp', 'Nhiệm vụ đã được gỡ khỏi hệ thống.', 'info');
    return true;
  };

  // 5. Đóng sớm khi Đang mở
  const closeTaskEarly = (taskId: string): boolean => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return false;

    if (task.status !== 'open') {
      notify('Không thể đóng', 'Chỉ có thể đóng sớm khi nhiệm vụ đang ở trạng thái Đang mở.', 'error');
      return false;
    }

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'closed' } : t))
    );
    notify('Đã đóng nhận bài sớm', `Nhiệm vụ "${task.title.substring(0, 30)}..." đã ngừng nhận thêm sinh viên mới.`, 'info');
    return true;
  };

  // 6. Màn hình chấm chia đôi với tiêu chí & Rule: "ô nhận xét bắt buộc tối thiểu 50 ký tự; Đã chấm thì không sửa"
  const gradeSubmissionWithCriteria = (
    submissionId: string,
    criteriaScores: { criterionName: string; score: number; maxScore: number }[],
    feedbackQuote: string,
    detailedFeedback: string
  ): boolean => {
    const sub = submissions.find((s) => s.id === submissionId);
    if (!sub) return false;

    // Rule: "Đã chấm thì không sửa"
    if (sub.status === 'graded') {
      notify('Đã chấm trước đó', 'Bài làm này đã có kết quả chấm chính thức và không thể sửa lại theo quy chế.', 'error');
      return false;
    }

    // Rule: "ô nhận xét bắt buộc (tối thiểu 50 ký tự)"
    if (detailedFeedback.trim().length < 50) {
      notify('Nhận xét quá ngắn', 'Nhận xét chi tiết bắt buộc phải đạt tối thiểu 50 ký tự để hướng dẫn sinh viên phát triển.', 'error');
      return false;
    }

    // Calculate total score dynamically from criteria
    const totalScore = Number(criteriaScores.reduce((sum, c) => sum + c.score, 0).toFixed(1));
    const passed = totalScore >= 8.0;

    const gradedAt = new Date().toISOString().split('T')[0];

    // Update submission
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? {
              ...s,
              status: 'graded',
              score: totalScore,
              passed,
              feedbackQuote,
              detailedFeedback,
              criteriaScores,
              gradedAt,
              gradedByCompanyId: currentCompany?.id || 'comp-1',
            }
          : s
      )
    );

    // Update student's myTask record
    setMyTasks((prev) =>
      prev.map((m) =>
        m.taskId === sub.taskId && m.studentId === sub.studentId
          ? {
              ...m,
              status: 'graded',
              score: totalScore,
              passed,
              feedbackQuote,
              detailedFeedback,
              criteriaScores,
              gradedAt,
              isPublicInPortfolio: false, // Rule: mặc định Riêng tư
            }
          : m
      )
    );

    // Rule: "Khi doanh nghiệp chấm xong, kết quả tự vào hồ sơ năng lực của sinh viên"
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === sub.studentId) {
          const newCount = s.completedTasksCount + 1;
          const newAvg = Number(((s.averageScore * s.completedTasksCount + totalScore) / newCount).toFixed(1));
          return {
            ...s,
            completedTasksCount: newCount,
            averageScore: newAvg,
          };
        }
        return s;
      })
    );

    // Add notification to student
    const notifItem: NotificationItem = {
      id: `notif-${Date.now()}`,
      studentId: sub.studentId,
      title: 'Bài làm của bạn đã có kết quả chấm điểm!',
      content: `${currentCompany?.name || 'Doanh nghiệp'} đã chấm bài "${sub.taskTitle}" đạt ${totalScore}/10 điểm.`,
      type: 'graded',
      createdAt: gradedAt,
      isRead: false,
      actionTab: 'my-tasks',
    };
    setNotifications((prev) => [notifItem, ...prev]);

    notify(
      'Chấm bài thành công!',
      `Tổng điểm: ${totalScore}/10đ. ${passed ? 'Thẻ bằng chứng đã được cấp cho sinh viên!' : 'Đã gửi phản hồi cho sinh viên.'}`,
      'success'
    );
    return true;
  };

  // 7. Dự án ngắn: Chọn sinh viên thực hiện & Xác nhận hoàn thành/đã chi trả thù lao
  const assignStudentToProject = (taskId: string, studentId: string): boolean => {
    setMyTasks((prev) =>
      prev.map((m) =>
        m.taskId === taskId && m.studentId === studentId
          ? { ...m, isAssigned: true }
          : m
      )
    );
    notify('Đã chọn sinh viên thực hiện', 'Sinh viên đã được chỉ định chính thức cho dự án này.', 'success');
    return true;
  };

  const confirmProjectCompletionAndPayment = (taskId: string, studentId: string): boolean => {
    setMyTasks((prev) =>
      prev.map((m) =>
        m.taskId === taskId && m.studentId === studentId
          ? { ...m, isCompleted: true, isPaidConfirmed: true }
          : m
      )
    );
    notify(
      'Đã xác nhận hoàn thành & chi trả',
      'Hệ thống đã ghi nhận dự án hoàn thành và hoàn tất chi trả thù lao (Cổng chỉ ghi nhận xác nhận, không xử lý tiền).',
      'success'
    );
    return true;
  };

  // 8. Gửi lời mời sinh viên (Phỏng vấn / Dự án ngắn / Thực tập)
  const sendCompanyInvitation = (
    studentId: string,
    type: 'task_invite' | 'interview_invite' | 'project_invite' | 'internship_invite',
    title: string,
    message: string,
    taskId?: string
  ): boolean => {
    if (!currentCompany) return false;

    const newInv: CompanyInvitation = {
      id: `inv-${Date.now()}`,
      companyId: currentCompany.id,
      companyName: currentCompany.name,
      studentId,
      type,
      title,
      message,
      taskId,
      sentAt: new Date().toISOString().split('T')[0],
      status: 'pending',
    };

    setInvitations((prev) => [newInv, ...prev]);

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      studentId,
      title: `Lời mời mới từ ${currentCompany.name}`,
      content: title,
      type: 'invitation',
      createdAt: new Date().toISOString().split('T')[0],
      isRead: false,
      actionTab: 'invitations',
    };
    setNotifications((prev) => [notif, ...prev]);

    notify('Đã gửi lời mời tới sinh viên', `Lời mời đã được chuyển tới hộp thư của ứng viên.`, 'success');
    return true;
  };

  // 9. Tin tuyển dụng: Tạo, sửa, đóng, xóa khi chưa có đơn
  const createJobPosting = (data: Partial<JobPosting>): boolean => {
    if (!currentCompany) return false;

    // Rule: Chưa xác minh thì khóa nút đăng tin
    if (currentCompany.status !== 'verified') {
      notify(
        'Yêu cầu xác minh doanh nghiệp',
        'Doanh nghiệp chưa được xác minh thì chưa thể đăng tin tuyển dụng.',
        'error'
      );
      return false;
    }

    const newJob: JobPosting = {
      id: `job-${Date.now()}`,
      companyId: currentCompany.id,
      companyName: currentCompany.name,
      title: data.title || 'Vị trí mới',
      type: data.type || 'Thực tập sinh',
      location: data.location || 'Hà Nội',
      salaryText: data.salaryText || 'Thỏa thuận',
      requiredProofScore: data.requiredProofScore || 8.5,
      targetCategory: data.targetCategory || 'CNTT',
      description: data.description || '',
      requirements: data.requirements || [],
      benefits: data.benefits || [],
      postedAt: new Date().toISOString().split('T')[0],
      headcount: data.headcount || 1,
      deadline: data.deadline || '2026-10-31',
      status: 'open',
    };

    setJobPostings((prev) => [newJob, ...prev]);
    notify('Đã đăng tin tuyển dụng', `Tin tuyển dụng "${newJob.title}" đã mở nhận hồ sơ.`, 'success');
    return true;
  };

  const updateJobPosting = (jobId: string, data: Partial<JobPosting>): boolean => {
    setJobPostings((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, ...data } : j))
    );
    notify('Đã cập nhật tin tuyển dụng', 'Thông tin tuyển dụng đã được lưu.', 'success');
    return true;
  };

  const closeJobPosting = (jobId: string): boolean => {
    setJobPostings((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'closed' } : j))
    );
    notify('Đã đóng tin tuyển dụng', 'Vị trí này đã dừng nhận thêm hồ sơ.', 'info');
    return true;
  };

  // Rule: Xóa khi chưa có đơn
  const deleteJobPosting = (jobId: string): boolean => {
    const hasApps = jobApplications.some((a) => a.jobId === jobId);
    if (hasApps) {
      notify('Không thể xóa', 'Tin tuyển dụng đã có ứng viên nộp hồ sơ, bạn chỉ có thể chọn Đóng tin thay vì xóa.', 'error');
      return false;
    }

    setJobPostings((prev) => prev.filter((j) => j.id !== jobId));
    notify('Đã xóa tin tuyển dụng', 'Tin tuyển dụng đã được xóa hoàn toàn.', 'info');
    return true;
  };

  // Kanban update status: Đã nộp, Đang xem xét, Mời phỏng vấn, Nhận, Không phù hợp
  const updateApplicationKanbanStatus = (applicationId: string, newStatus: ApplicationStatus) => {
    setJobApplications((prev) =>
      prev.map((a) => (a.id === applicationId ? { ...a, status: newStatus } : a))
    );

    const app = jobApplications.find((a) => a.id === applicationId);
    if (app) {
      const statusVi =
        newStatus === 'submitted'
          ? 'Đã nộp'
          : newStatus === 'reviewing'
          ? 'Đang xem xét'
          : newStatus === 'interviewing'
          ? 'Mời phỏng vấn'
          : newStatus === 'accepted'
          ? 'Nhận trúng tuyển'
          : 'Không phù hợp';

      // Notify student
      const notifItem: NotificationItem = {
        id: `notif-${Date.now()}`,
        studentId: app.studentId,
        title: `Cập nhật hồ sơ ứng tuyển: ${app.jobTitle}`,
        content: `Hồ sơ của bạn đã được chuyển sang trạng thái "${statusVi}".`,
        type: 'job_update',
        createdAt: new Date().toISOString().split('T')[0],
        isRead: false,
        actionTab: 'jobs',
      };
      setNotifications((prev) => [notifItem, ...prev]);
    }

    notify('Đã cập nhật trạng thái ứng viên', 'Thẻ ứng viên đã chuyển cột trong bảng Kanban.', 'success');
  };

  const updateApplicationDetails = (
    applicationId: string,
    data: {
      status?: ApplicationStatus;
      internalNote?: string;
      candidateFeedback?: string;
    }
  ) => {
    const app = jobApplications.find((a) => a.id === applicationId);
    if (!app) return;

    const oldStatus = app.status;
    const newStatus = data.status || oldStatus;

    setJobApplications((prev) =>
      prev.map((a) =>
        a.id === applicationId
          ? {
              ...a,
              ...(data.status ? { status: data.status } : {}),
              ...(data.internalNote !== undefined ? { internalNote: data.internalNote } : {}),
              ...(data.candidateFeedback !== undefined ? { candidateFeedback: data.candidateFeedback } : {}),
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : a
      )
    );

    // If status changed or candidate feedback was provided, notify student
    if ((data.status && data.status !== oldStatus) || data.candidateFeedback) {
      const statusVi =
        newStatus === 'submitted'
          ? 'Đã nộp'
          : newStatus === 'reviewing'
          ? 'Đang xem xét'
          : newStatus === 'interviewing'
          ? 'Mời phỏng vấn'
          : newStatus === 'accepted'
          ? 'Nhận trúng tuyển'
          : 'Không phù hợp';

      const notifItem: NotificationItem = {
        id: `notif-${Date.now()}`,
        studentId: app.studentId,
        title: `Cập nhật hồ sơ ứng tuyển: ${app.jobTitle}`,
        content: data.candidateFeedback
          ? `Phản hồi từ ${app.companyName}: "${data.candidateFeedback.substring(0, 80)}${data.candidateFeedback.length > 80 ? '...' : ''}" (Trạng thái: ${statusVi})`
          : `Hồ sơ của bạn đã được chuyển sang trạng thái "${statusVi}".`,
        type: 'job_update',
        createdAt: new Date().toISOString().split('T')[0],
        isRead: false,
        actionTab: 'jobs',
      };
      setNotifications((prev) => [notifItem, ...prev]);
    }

    notify(
      'Đã lưu cập nhật ứng viên',
      data.candidateFeedback
        ? 'Đã cập nhật ghi chú và gửi phản hồi thông báo tới sinh viên.'
        : 'Đã cập nhật thông tin ứng viên trên bảng Kanban.',
      'success'
    );
  };

  // 10. Đánh giá sinh viên sau dự án ngắn (1–5 sao + nhận xét)
  const submitStudentEvaluation = (
    studentId: string,
    taskId: string,
    rating: number,
    comment: string
  ): boolean => {
    if (!currentCompany) return false;
    const task = tasks.find((t) => t.id === taskId);
    const student = students.find((s) => s.id === studentId);

    const newEval: StudentEvaluation = {
      id: `eval-${Date.now()}`,
      companyId: currentCompany.id,
      studentId,
      studentName: student?.name || 'Sinh viên',
      taskId,
      taskTitle: task?.title || 'Dự án ngắn',
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString().split('T')[0],
    };

    setStudentEvaluations((prev) => [newEval, ...prev]);

    notify('Đã gửi đánh giá sinh viên', `Đánh giá ${rating} sao cho bạn ${student?.name} đã được lưu vào hồ sơ chứng thực.`, 'success');
    return true;
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    notify('Đã đánh dấu đã đọc', 'Tất cả thông báo đã được đánh dấu là đã xem.', 'info');
  };

  // Admin & Moderation Actions
  const verifyCompany = (companyId: string) => {
    const comp = companies.find((c) => c.id === companyId);
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === companyId
          ? {
              ...c,
              status: 'verified',
              verifiedAt: new Date().toISOString().split('T')[0],
              rejectionReason: undefined,
            }
          : c
      )
    );

    // Audit log
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action: 'verify_company',
      actionTitle: 'Phê duyệt xác minh pháp lý doanh nghiệp',
      targetType: 'company',
      targetId: companyId,
      targetName: comp?.name || 'Doanh nghiệp',
      actorId: currentUser?.id || 'admin-1',
      actorName: currentUser?.name || 'Thầy Trần Quốc Tuấn',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      details: 'Mã số thuế và giấy tờ đăng ký kinh doanh đã được kiểm tra hợp lệ.',
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    // Notification to company
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      companyId,
      title: 'Hồ sơ pháp lý đã được phê duyệt xác minh!',
      content: 'Cán bộ nhà trường đã thẩm định thành công hồ sơ doanh nghiệp. Bạn đã có đầy đủ quyền đăng nhiệm vụ và tin tuyển dụng.',
      type: 'verification',
      createdAt: new Date().toISOString().split('T')[0],
      isRead: false,
      actionTab: 'verification',
    };
    setNotifications((prev) => [notif, ...prev]);

    notify('Đã xác minh doanh nghiệp', `Doanh nghiệp "${comp?.name}" đã được cấp huy hiệu Đã xác minh.`, 'success');
  };

  const rejectCompany = (companyId: string, reason: string) => {
    const comp = companies.find((c) => c.id === companyId);
    setCompanies((prev) =>
      prev.map((c) => (c.id === companyId ? { ...c, status: 'rejected', rejectionReason: reason } : c))
    );

    // Audit log
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action: 'reject_company',
      actionTitle: 'Từ chối xác minh doanh nghiệp',
      targetType: 'company',
      targetId: companyId,
      targetName: comp?.name || 'Doanh nghiệp',
      actorId: currentUser?.id || 'admin-1',
      actorName: currentUser?.name || 'Thầy Trần Quốc Tuấn',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      reason,
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    // Notification to company
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      companyId,
      title: 'Hồ sơ pháp lý chưa đạt yêu cầu xác minh',
      content: `Lý do từ chối: "${reason}". Vui lòng cập nhật giấy tờ tại mục Hồ sơ & Pháp lý để nộp lại.`,
      type: 'verification',
      createdAt: new Date().toISOString().split('T')[0],
      isRead: false,
      actionTab: 'verification',
    };
    setNotifications((prev) => [notif, ...prev]);

    notify('Đã từ chối xác minh', 'Thông báo từ chối kèm lý do đã được chuyển tới doanh nghiệp.', 'info');
  };

  const approveTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'open', rejectionReason: undefined } : t))
    );

    // Audit log
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action: 'approve_task',
      actionTitle: 'Phê duyệt nhiệm vụ tuyển dụng',
      targetType: 'task',
      targetId: taskId,
      targetName: task?.title || 'Nhiệm vụ',
      actorId: currentUser?.id || 'admin-1',
      actorName: currentUser?.name || 'Thầy Trần Quốc Tuấn',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      details: 'Đã qua bảng kiểm tự động: Đúng giới hạn giờ, có 2-5 tiêu chí chấm, không thu phí.',
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    if (task) {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        companyId: task.companyId,
        title: `Nhiệm vụ "${task.title.substring(0, 30)}..." đã được duyệt`,
        content: 'Nhiệm vụ đã được mở công khai trên hệ thống và sẵn sàng nhận bài làm từ sinh viên.',
        type: 'system',
        createdAt: new Date().toISOString().split('T')[0],
        isRead: false,
        actionTab: 'company-tasks',
      };
      setNotifications((prev) => [notif, ...prev]);
    }

    notify('Đã duyệt nhiệm vụ', `Nhiệm vụ "${task?.title.substring(0, 30)}..." đã chuyển sang trạng thái Đang mở.`, 'success');
  };

  const rejectTask = (taskId: string, reason: string) => {
    const task = tasks.find((t) => t.id === taskId);
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'rejected', rejectionReason: reason } : t))
    );

    // Audit log
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action: 'reject_task',
      actionTitle: 'Từ chối duyệt nhiệm vụ',
      targetType: 'task',
      targetId: taskId,
      targetName: task?.title || 'Nhiệm vụ',
      actorId: currentUser?.id || 'admin-1',
      actorName: currentUser?.name || 'Thầy Trần Quốc Tuấn',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      reason,
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    if (task) {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        companyId: task.companyId,
        title: `Nhiệm vụ "${task.title.substring(0, 30)}..." bị từ chối phê duyệt`,
        content: `Lý do: "${reason}". Doanh nghiệp có thể chỉnh sửa lại nội dung để gửi duyệt lại.`,
        type: 'system',
        createdAt: new Date().toISOString().split('T')[0],
        isRead: false,
        actionTab: 'company-tasks',
      };
      setNotifications((prev) => [notif, ...prev]);
    }

    notify('Đã từ chối nhiệm vụ', 'Lý do từ chối đã được gửi tới doanh nghiệp.', 'info');
  };

  const removeTaskByAdmin = (taskId: string, reason: string) => {
    const task = tasks.find((t) => t.id === taskId);
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'removed', rejectionReason: reason } : t))
    );

    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action: 'remove_task',
      actionTitle: 'Gỡ bỏ nhiệm vụ vi phạm quy chế',
      targetType: 'task',
      targetId: taskId,
      targetName: task?.title || 'Nhiệm vụ',
      actorId: currentUser?.id || 'admin-1',
      actorName: currentUser?.name || 'Thầy Trần Quốc Tuấn',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      reason,
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    if (task) {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        companyId: task.companyId,
        title: `Nhiệm vụ "${task.title.substring(0, 30)}..." đã bị cán bộ gỡ bỏ`,
        content: `Lý do gỡ: "${reason}".`,
        type: 'system',
        createdAt: new Date().toISOString().split('T')[0],
        isRead: false,
        actionTab: 'company-tasks',
      };
      setNotifications((prev) => [notif, ...prev]);
    }

    notify('Đã gỡ nhiệm vụ vi phạm', 'Nhiệm vụ đã bị gỡ khỏi cổng Stulance.', 'info');
  };

  const removeJobPostingByAdmin = (jobId: string, reason: string) => {
    const job = jobPostings.find((j) => j.id === jobId);
    setJobPostings((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'closed' } : j))
    );

    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action: 'remove_job',
      actionTitle: 'Gỡ bỏ tin tuyển dụng vi phạm',
      targetType: 'job',
      targetId: jobId,
      targetName: job?.title || 'Tin tuyển dụng',
      actorId: currentUser?.id || 'admin-1',
      actorName: currentUser?.name || 'Thầy Trần Quốc Tuấn',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      reason,
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    notify('Đã đóng tin tuyển dụng vi phạm', 'Tin tuyển dụng đã bị ngừng hiển thị.', 'info');
  };

  const resolveViolationReport = (
    reportId: string,
    conclusion: 'violation' | 'no_violation',
    note: string,
    actionTaken?: 'removed_task' | 'removed_job' | 'locked_account' | 'warning' | 'dismissed'
  ) => {
    const report = violationReports.find((r) => r.id === reportId);
    setViolationReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              status: conclusion === 'violation' ? 'resolved_violation' : 'resolved_no_violation',
              adminConclusion: note,
              actionTaken: actionTaken || (conclusion === 'violation' ? 'warning' : 'dismissed'),
              resolvedAt: new Date().toISOString().split('T')[0],
              resolvedBy: currentUser?.name || 'Thầy Trần Quốc Tuấn',
            }
          : r
      )
    );

    // If action taken is removed_task or removed_job
    if (actionTaken === 'removed_task' && report?.targetId) {
      removeTaskByAdmin(report.targetId, note);
    } else if (actionTaken === 'removed_job' && report?.targetId) {
      removeJobPostingByAdmin(report.targetId, note);
    }

    // Audit log
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action: 'resolve_report',
      actionTitle: `Kết luận báo cáo: ${conclusion === 'violation' ? 'Có vi phạm' : 'Không vi phạm'}`,
      targetType: 'report',
      targetId: reportId,
      targetName: report?.targetTitle || 'Báo cáo vi phạm',
      actorId: currentUser?.id || 'admin-1',
      actorName: currentUser?.name || 'Thầy Trần Quốc Tuấn',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      details: note,
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    notify('Đã xử lý báo cáo vi phạm', `Kết luận: ${conclusion === 'violation' ? 'Có vi phạm' : 'Không vi phạm'}.`, 'success');
  };

  const lockAccount = (accountId: string, reason: string) => {
    const today = new Date().toISOString().split('T')[0];
    const acc = managedAccounts.find((a) => a.id === accountId);

    setManagedAccounts((prev) =>
      prev.map((a) =>
        a.id === accountId
          ? {
              ...a,
              status: 'locked',
              lockReason: reason,
              lockedAt: today,
              lockedBy: currentUser?.name || 'Thầy Trần Quốc Tuấn',
              violationCount: a.violationCount + 1,
              violationHistory: [
                { date: today, action: 'Khóa tài khoản', reason },
                ...a.violationHistory,
              ],
            }
          : a
      )
    );

    // Audit log
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action: 'lock_account',
      actionTitle: 'Khóa tài khoản người dùng / doanh nghiệp',
      targetType: 'account',
      targetId: accountId,
      targetName: acc?.name || 'Tài khoản',
      actorId: currentUser?.id || 'admin-1',
      actorName: currentUser?.name || 'Thầy Trần Quốc Tuấn',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      reason,
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    notify('Đã khóa tài khoản', `Tài khoản "${acc?.name}" đã bị tạm dừng hoạt động.`, 'info');
  };

  const unlockAccount = (accountId: string) => {
    const acc = managedAccounts.find((a) => a.id === accountId);
    setManagedAccounts((prev) =>
      prev.map((a) =>
        a.id === accountId
          ? {
              ...a,
              status: 'active',
              lockReason: undefined,
              lockedAt: undefined,
              lockedBy: undefined,
            }
          : a
      )
    );

    // Audit log
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action: 'unlock_account',
      actionTitle: 'Mở khóa tài khoản',
      targetType: 'account',
      targetId: accountId,
      targetName: acc?.name || 'Tài khoản',
      actorId: currentUser?.id || 'admin-1',
      actorName: currentUser?.name || 'Thầy Trần Quốc Tuấn',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      details: 'Khôi phục trạng thái hoạt động bình thường.',
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    notify('Đã mở khóa tài khoản', `Tài khoản "${acc?.name}" đã hoạt động trở lại.`, 'success');
  };

  const reportViolation = (
    targetType: 'task' | 'job' | 'company',
    targetId: string,
    targetTitle: string,
    reason: string,
    details: string
  ) => {
    const newRep: ViolationReport = {
      id: `rep-${Date.now()}`,
      targetType,
      targetId,
      targetTitle,
      taskId: targetType === 'task' ? targetId : undefined,
      taskTitle: targetType === 'task' ? targetTitle : undefined,
      studentId: currentUser?.id || 'stu-unknown',
      studentName: currentUser?.name || 'Sinh viên',
      reason,
      details,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'pending',
    };

    setViolationReports((prev) => [newRep, ...prev]);

    notify(
      'Đã gửi báo cáo vi phạm',
      'Cán bộ Ban Hợp tác Doanh nghiệp nhà trường sẽ tiếp nhận và kiểm tra trong vòng 24 giờ làm việc.',
      'success'
    );
  };

  const exportSchoolReportCSV = (facultyFilter?: string, timeFilter?: string) => {
    // Build CSV content with UTF-8 BOM
    const bom = '\uFEFF';
    let csv = `${bom}BÁO CÁO THỐNG KÊ KẾT NỐI VIỆC LÀM & NĂNG LỰC SINH VIÊN QUA NHIỆM VỤ THẬT\n`;
    csv += `Thời điểm xuất: ${new Date().toLocaleString('vi-VN')}\n`;
    csv += `Đơn vị: ${currentUser?.university || 'Đại học Bách Khoa Hà Nội'}\n`;
    csv += `Bộ lọc: Khoa = ${facultyFilter || 'Tất cả'}, Thời gian = ${timeFilter || 'Toàn bộ năm học'}\n\n`;

    csv += 'PHẦN 1: THỐNG KÊ TỔNG HỢP THEO KHOA / VIỆN ĐÀO TẠO\n';
    csv += 'Khoa / Viện,Số sinh viên tham gia,Nhiệm vụ đã hoàn thành,Điểm trung bình bài làm,Số lời mời việc làm,Số trúng tuyển,Tổng thù lao nhận (VND)\n';

    const dataToExport =
      !facultyFilter || facultyFilter === 'Tất cả'
        ? facultyStats
        : facultyStats.filter((f) => f.facultyName.includes(facultyFilter));

    dataToExport.forEach((f) => {
      csv += `"${f.facultyName}",${f.studentCount},${f.completedTasksCount},${f.averageScore},${f.interviewInvitesCount},${f.hiredCount},${f.totalRewardVND}\n`;
    });

    csv += '\nPHẦN 2: DANH SÁCH BÀI LÀM SINH VIÊN ĐÃ ĐƯỢC DOANH NGHIỆP CẤP THẺ BẰNG CHỨNG\n';
    csv += 'Mã sinh viên,Họ và tên,Trường / Khoa,Nhiệm vụ thực tế,Doanh nghiệp thẩm định,Điểm số (/10),Ngày cấp,Trích dẫn nhận xét\n';

    submissions
      .filter((s) => s.status === 'graded')
      .forEach((sub) => {
        csv += `"${sub.studentId}","${sub.studentName}","${sub.studentUniversity}","${sub.taskTitle.replace(/"/g, '""')}","${sub.gradedByCompanyId || 'Doanh nghiệp'}",${sub.score || 0},"${sub.gradedAt || ''}","${(sub.feedbackQuote || '').replace(/"/g, '""')}"\n`;
      });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bao_cao_stulance_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    notify('Xuất file CSV thành công', 'Tệp báo cáo kiểm định đã được tải xuống máy tính của bạn.', 'success');
  };

  // Reset to initial mock dataset
  const resetMockData = () => {
    setCompanies(INITIAL_COMPANIES);
    setTasks(INITIAL_TASKS);
    setSubmissions(INITIAL_SUBMISSIONS);
    setStudents(INITIAL_STUDENTS);
    setJobPostings(INITIAL_JOB_POSTINGS);
    setMyTasks(INITIAL_MY_TASKS);
    setJobApplications(INITIAL_JOB_APPLICATIONS);
    setInvitations(INITIAL_INVITATIONS);
    setCompanyReviews(INITIAL_REVIEWS);
    setStudentEvaluations(INITIAL_STUDENT_EVALUATIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setViolationReports(INITIAL_VIOLATION_REPORTS);
    setManagedAccounts(INITIAL_MANAGED_ACCOUNTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setFacultyStats(INITIAL_FACULTY_STATS);

    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    notify('Đã khôi phục dữ liệu mẫu', 'Hệ thống đã nạp lại toàn bộ dữ liệu mẫu ban đầu.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activeRole,
        companies,
        tasks,
        submissions,
        students,
        currentStudentProfile,
        currentCompany,
        jobPostings,
        myTasks,
        jobApplications,
        invitations,
        companyReviews,
        studentEvaluations,
        notifications,
        unreadNotificationCount,
        toasts,
        violationReports,
        managedAccounts,
        auditLogs,
        facultyStats,
        isAuthOpen,
        authMode,
        currentTab,
        setCurrentTab,
        viewingCompanyId,
        setViewingCompanyId,
        viewingTaskId,
        setViewingTaskId,
        openAuth,
        closeAuth,
        quickLoginAs,
        loginWithEmail,
        registerStudent,
        registerCompany,
        logout,
        claimTask,
        cancelClaimedTask,
        submitTaskWork,
        updateTaskSubmission,
        toggleProofPublicInPortfolio,
        updateStudentProfile,
        addSkillToProfile,
        removeSkillFromProfile,
        toggleFindMe,
        applyForJob,
        withdrawJobApplication,
        acceptInvitation,
        declineInvitation,
        submitCompanyReview,
        reportTaskViolation,
        updateCompanyProfile,
        resubmitCompanyVerification,
        createTask,
        updateTask,
        deleteTask,
        closeTaskEarly,
        gradeSubmissionWithCriteria,
        assignStudentToProject,
        confirmProjectCompletionAndPayment,
        sendCompanyInvitation,
        createJobPosting,
        updateJobPosting,
        closeJobPosting,
        deleteJobPosting,
        updateApplicationKanbanStatus,
        updateApplicationDetails,
        submitStudentEvaluation,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        verifyCompany,
        rejectCompany,
        approveTask,
        rejectTask,
        removeTaskByAdmin,
        removeJobPostingByAdmin,
        resolveViolationReport,
        lockAccount,
        unlockAccount,
        reportViolation,
        exportSchoolReportCSV,
        notify,
        removeToast,
        resetMockData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
