export type Role = 'student' | 'company' | 'admin' | 'school';

export type CompanyStatus = 'verified' | 'pending' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  university?: string;
  major?: string;
  studentId?: string;
  companyId?: string;
  title?: string;
  phone?: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  status: CompanyStatus;
  rejectionReason?: string;
  location: string;
  description: string;
  logo: string;
  verifiedAt?: string;
  submittedAt: string;
  website: string;
  taskCount: number;
  taxCode?: string; // Mã số thuế
  legalDocumentName?: string; // Tên giấy tờ pháp lý
  legalDocumentUploadedAt?: string;
}

export type TaskCategory = 'Marketing' | 'CNTT' | 'Thiết kế' | 'Kế toán' | 'Du lịch';

export type TaskType = 'challenge' | 'project'; // 'challenge' = Thử sức (≤ 3h), 'project' = Dự án ngắn (5–40h, bắt buộc có thù lao)

export interface TaskEvaluationCriterion {
  id: string;
  name: string;
  maxScore: number;
  description?: string;
}

export type TaskStatus = 'draft' | 'pending_review' | 'open' | 'closed' | 'rejected' | 'removed';

export interface Task {
  id: string;
  companyId: string;
  companyName: string;
  companyVerified: boolean;
  title: string;
  category: TaskCategory;
  type: TaskType; // Thử sức hoặc Dự án ngắn
  shortBrief: string;
  description: string;
  requirements: string[];
  evaluationCriteriaList: TaskEvaluationCriterion[]; // 2-5 tiêu chí kèm điểm tối đa
  rewardVND: number; // Thù lao VND (bắt buộc đối với dự án ngắn)
  deadline: string; // ISO date string (YYYY-MM-DD)
  deadlineHoursRemaining?: number;
  isUrgent: boolean; // Hạn nộp gấp
  estimatedHours: number; // Thử sức <= 3h, Dự án ngắn 5-40h
  submissionCount: number;
  status: TaskStatus;
  deliverableFormat: string;
  attachmentName?: string; // Tệp đính kèm tài liệu đề bài
  attachmentUrl?: string;
  maxParticipants?: number; // Số lượng nhận tối đa
  targetYear?: number[]; // Ví dụ [1, 2] hoặc [3, 4]
  rejectionReason?: string; // Lý do nếu bị từ chối
}

export type MyTaskStatus = 'in_progress' | 'submitted' | 'graded' | 'overdue' | 'cancelled';

export interface MyTaskRecord {
  id: string;
  taskId: string;
  studentId: string;
  claimedAt: string;
  deadlineTimestamp: number; // Timestamp để đếm ngược hạn nộp
  status: MyTaskStatus;
  
  // Submission fields
  deliverableLink?: string;
  fileName?: string;
  notes?: string;
  submittedAt?: string;
  selfPledgeConfirmed?: boolean; // Cam kết tự làm bài
  
  // Grading fields
  score?: number;
  passed?: boolean;
  feedbackQuote?: string;
  detailedFeedback?: string;
  criteriaScores?: { criterionName: string; score: number; maxScore: number }[];
  gradedAt?: string;
  isPublicInPortfolio?: boolean; // Mặc định false (Riêng tư)
  
  // Project workflow fields
  isAssigned?: boolean;
  isCompleted?: boolean;
  isPaidConfirmed?: boolean; // Đã xác nhận chi trả thù lao
  hasReviewedCompany?: boolean;
}

export interface Submission {
  id: string;
  taskId: string;
  taskTitle: string;
  studentId: string;
  studentName: string;
  studentUniversity: string;
  submittedAt: string;
  deliverableLink: string;
  fileName?: string;
  notes: string;
  status: 'submitted' | 'graded' | 'revision_requested' | 'overdue';
  score?: number; // thang điểm 10
  passed?: boolean;
  feedbackQuote?: string;
  detailedFeedback?: string;
  criteriaScores?: { criterionName: string; score: number; maxScore: number }[];
  gradedAt?: string;
  gradedByCompanyId?: string;
  isPublicInPortfolio?: boolean; // Mặc định Riêng tư
}

export interface StudentProfile {
  id: string;
  name: string;
  studentCode: string; // Mã sinh viên
  faculty: string; // Khoa
  university: string;
  major: string;
  year: number; // Năm học: 1, 2, 3, 4
  cohort: string;
  email: string;
  avatar: string;
  bio: string; // Giới thiệu
  skills: string[]; // Tối đa 15 kỹ năng
  productLinks: { label: string; url: string }[]; // Liên kết sản phẩm
  completedTasksCount: number;
  averageScore: number;
  headline: string;
  allowCompaniesToFindMe: boolean; // Công tắc cho phép doanh nghiệp tìm thấy tôi
}

export interface JobPosting {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  type: 'Thực tập sinh' | 'Bán thời gian' | 'Chính thức khởi đầu';
  location: string;
  salaryText: string;
  requiredProofScore: number; // Chỉ tuyển bạn có bài đạt từ điểm này
  targetCategory: TaskCategory;
  description: string;
  requirements: string[];
  benefits: string[];
  postedAt: string;
  headcount?: number; // Số lượng tuyển
  deadline?: string; // Hạn nộp hồ sơ
  status?: 'open' | 'closed' | 'draft';
}

export type ApplicationStatus = 'submitted' | 'reviewing' | 'interviewing' | 'accepted' | 'rejected';

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  companyId: string;
  companyName: string;
  studentId: string;
  studentName: string;
  appliedAt: string;
  coverNote: string;
  attachedProofIds: string[]; // Thẻ bằng chứng đính kèm
  status: ApplicationStatus;
  internalNote?: string; // Ghi chú nội bộ doanh nghiệp
  candidateFeedback?: string; // Phản hồi gửi cho sinh viên
  updatedAt?: string;
}

export interface CompanyInvitation {
  id: string;
  companyId: string;
  companyName: string;
  studentId: string;
  type: 'task_invite' | 'interview_invite' | 'project_invite' | 'internship_invite';
  title: string;
  message: string;
  taskId?: string;
  sentAt: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface CompanyReview {
  id: string;
  companyId: string;
  companyName: string;
  studentId: string;
  studentName: string;
  taskId: string;
  taskTitle: string;
  rating: number; // 1-5 sao
  comment: string;
  createdAt: string;
}

export interface StudentEvaluation {
  id: string;
  companyId: string;
  studentId: string;
  studentName: string;
  taskId: string;
  taskTitle: string;
  rating: number; // 1-5 sao
  comment: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  studentId?: string;
  companyId?: string;
  title: string;
  content: string;
  type: 'graded' | 'invitation' | 'job_update' | 'deadline_warning' | 'system' | 'new_submission' | 'verification';
  createdAt: string;
  isRead: boolean;
  actionTab?: string;
}

export type ViolationReason =
  | 'Yêu cầu đóng phí'
  | 'Vượt giới hạn giờ'
  | 'Không chấm bài'
  | 'Nội dung sai sự thật'
  | 'Sao chép bài'
  | 'Khác';

export type ViolationReportStatus = 'pending' | 'resolved_violation' | 'resolved_no_violation';

export interface ViolationReport {
  id: string;
  targetType: 'task' | 'job' | 'company';
  targetId: string;
  targetTitle: string;
  taskId?: string; // backwards compatibility
  taskTitle?: string;
  studentId: string;
  studentName?: string;
  reason: ViolationReason | string;
  details: string; // bắt buộc mô tả
  createdAt: string;
  status: ViolationReportStatus;
  adminConclusion?: string;
  actionTaken?: 'removed_task' | 'removed_job' | 'locked_account' | 'warning' | 'dismissed';
  resolvedAt?: string;
  resolvedBy?: string;
}

export type AccountStatus = 'active' | 'locked';

export interface ManagedAccount {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: AccountStatus;
  lockReason?: string;
  lockedAt?: string;
  lockedBy?: string;
  violationCount: number;
  violationHistory: {
    date: string;
    action: string;
    reason: string;
  }[];
  createdAt: string;
  organization?: string;
}

export interface AuditLog {
  id: string;
  action:
    | 'verify_company'
    | 'reject_company'
    | 'approve_task'
    | 'reject_task'
    | 'remove_task'
    | 'remove_job'
    | 'lock_account'
    | 'unlock_account'
    | 'resolve_report';
  actionTitle: string;
  targetType: 'company' | 'task' | 'job' | 'account' | 'report';
  targetId: string;
  targetName: string;
  actorId: string;
  actorName: string;
  timestamp: string;
  reason?: string;
  details?: string;
}

export interface FacultyReportData {
  facultyName: string;
  studentCount: number;
  completedTasksCount: number;
  averageScore: number;
  interviewInvitesCount: number;
  hiredCount: number;
  totalRewardVND: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  title: string;
  message: string;
}

