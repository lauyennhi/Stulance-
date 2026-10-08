import React, { useState } from 'react';
import {
  AlertTriangle,
  Award,
  Bell,
  BookOpen,
  Briefcase,
  Building,
  CheckCircle2,
  Clock,
  Compass,
  ExternalLink,
  Eye,
  FileCheck2,
  FileText,
  Filter,
  Globe,
  GraduationCap,
  Layers,
  Link2,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Plus,
  RotateCcw,
  Search,
  Send,
  Share2,
  ShieldAlert,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  UserCheck,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  JobPosting,
  MyTaskRecord,
  Role,
  StudentProfile,
  Submission,
  Task,
  TaskCategory,
  TaskType,
} from '../../types';
import { EmptyState } from '../common/EmptyState';
import { ProofCard } from '../common/ProofCard';
import { CompanyProfileModal } from '../student/CompanyProfileModal';
import { CompanyReviewModal } from '../student/CompanyReviewModal';
import { GradingDetailModal } from '../student/GradingDetailModal';
import { JobDetailModal } from '../student/JobDetailModal';
import { SubmitWorkModal } from '../student/SubmitWorkModal';
import { TaskCountdown } from '../student/TaskCountdown';
import { TaskDetailModal } from '../student/TaskDetailModal';
import { ViolationReportModal } from '../student/ViolationReportModal';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    currentStudentProfile,
    tasks,
    myTasks,
    jobPostings,
    jobApplications,
    invitations,
    notifications,
    companies,
    claimTask,
    cancelClaimedTask,
    toggleProofPublicInPortfolio,
    updateStudentProfile,
    addSkillToProfile,
    removeSkillFromProfile,
    toggleFindMe,
    acceptInvitation,
    declineInvitation,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    unreadNotificationCount,
    currentTab,
    setCurrentTab,
    notify,
  } = useApp();

  // Navigation Sub-tab within Student Subsystem
  const [activeSubTab, setActiveSubTab] = useState<
    'home' | 'search_tasks' | 'my_tasks' | 'portfolio' | 'jobs' | 'invitations' | 'notifications'
  >('home');

  React.useEffect(() => {
    if (currentTab === 'tasks' || currentTab === 'search_tasks' || currentTab === 'browse-tasks') {
      setActiveSubTab('search_tasks');
    } else if (currentTab === 'my-tasks' || currentTab === 'my_tasks' || currentTab === 'my-submissions') {
      setActiveSubTab('my_tasks');
    } else if (currentTab === 'portfolio' || currentTab === 'my-proofs') {
      setActiveSubTab('portfolio');
    } else if (currentTab === 'jobs') {
      setActiveSubTab('jobs');
    } else if (currentTab === 'invitations') {
      setActiveSubTab('invitations');
    } else if (currentTab === 'notifications') {
      setActiveSubTab('notifications');
    } else if (currentTab === 'home') {
      setActiveSubTab('home');
    }
  }, [currentTab]);

  // Modal states
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [submittingMyTask, setSubmittingMyTask] = useState<{ record: MyTaskRecord; isUpdating: boolean } | null>(null);
  const [gradingDetailRecord, setGradingDetailRecord] = useState<MyTaskRecord | null>(null);
  const [companyProfileId, setCompanyProfileId] = useState<string | null>(null);
  const [reviewCompanyTarget, setReviewCompanyTarget] = useState<{ companyId: string; taskId: string } | null>(null);
  const [reportTaskId, setReportTaskId] = useState<string | null>(null);
  const [reportJobId, setReportJobId] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // My Tasks internal status tabs
  const [myTasksFilter, setMyTasksFilter] = useState<'in_progress' | 'submitted' | 'graded' | 'overdue'>('in_progress');

  // Search Tasks Filters
  const [taskSearchQuery, setTaskSearchQuery] = useState('');
  const [taskCategoryFilter, setTaskCategoryFilter] = useState<string>('Tất cả');
  const [taskTypeFilter, setTaskTypeFilter] = useState<string>('Tất cả'); // Thử sức vs Dự án ngắn
  const [taskDurationFilter, setTaskDurationFilter] = useState<string>('Tất cả'); // Dưới 3h, 3-8h, Trên 8h
  const [taskUrgentOnly, setTaskUrgentOnly] = useState<boolean>(false);

  // Job Postings Filters
  const [jobSearchQuery, setJobSearchQuery] = useState('');
  const [jobCategoryFilter, setJobCategoryFilter] = useState<string>('Tất cả');
  const [jobTypeFilter, setJobTypeFilter] = useState<string>('Tất cả');
  const [jobLocationFilter, setJobLocationFilter] = useState<string>('Tất cả');
  const [jobsViewMode, setJobsViewMode] = useState<'browse' | 'my_applications'>('browse');

  // Portfolio states
  const [isEmployerPreviewMode, setIsEmployerPreviewMode] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(currentStudentProfile?.bio || '');

  // Format currency
  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num) + ' đ';
  };

  // Student specific profile data
  const student = currentStudentProfile || {
    id: currentUser?.id || 'stu-1',
    name: currentUser?.name || 'Nguyễn Minh Khang',
    studentCode: '20210452',
    faculty: 'Khoa Công nghệ Thông tin',
    university: currentUser?.university || 'Đại học Bách Khoa Hà Nội',
    major: currentUser?.major || 'Khoa học Máy tính',
    year: 4,
    cohort: 'K66',
    email: currentUser?.email || 'khang.nm.bk@stulance.edu.vn',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Sinh viên năm cuối Khoa học Máy tính Bách Khoa. Tập trung phát triển giải pháp thực chiến.',
    skills: ['React', 'TypeScript', 'Next.js', 'PostgreSQL', 'Tailwind CSS', 'Git'],
    productLinks: [{ label: 'GitHub', url: 'https://github.com/minhkhang-hust' }],
    completedTasksCount: 4,
    averageScore: 9.4,
    headline: 'Lập trình viên Frontend yêu thích TypeScript sạch và kiểm thử tự động.',
    allowCompaniesToFindMe: true,
  };

  // 1. HOME: Personalized recommendations based on student's major & year
  const recommendedTasks = tasks.filter((t) => {
    // Recommend tasks in related field or open to their study year
    const matchMajor =
      student.major.toLowerCase().includes('máy tính') || student.major.toLowerCase().includes('cntt')
        ? t.category === 'CNTT' || t.category === 'Thiết kế'
        : student.major.toLowerCase().includes('kinh') || student.major.toLowerCase().includes('market')
        ? t.category === 'Marketing' || t.category === 'Kế toán'
        : true;
    return matchMajor;
  });

  // Tasks in progress for countdown in Home
  const inProgressMyTasks = myTasks.filter((m) => m.status === 'in_progress');
  const submittedMyTasks = myTasks.filter((m) => m.status === 'submitted');
  const gradedMyTasks = myTasks.filter((m) => m.status === 'graded');
  const overdueMyTasks = myTasks.filter((m) => m.status === 'overdue');

  // Pending Invitations
  const pendingInvitations = invitations.filter((inv) => inv.status === 'pending');

  // 2. SEARCH TASKS: Filter logic
  const filteredTasks = tasks.filter((t) => {
    const matchQuery =
      t.title.toLowerCase().includes(taskSearchQuery.toLowerCase()) ||
      t.companyName.toLowerCase().includes(taskSearchQuery.toLowerCase()) ||
      t.shortBrief.toLowerCase().includes(taskSearchQuery.toLowerCase());

    const matchCategory = taskCategoryFilter === 'Tất cả' || t.category === taskCategoryFilter;

    const matchType =
      taskTypeFilter === 'Tất cả' ||
      (taskTypeFilter === 'Thử sức' && t.type === 'challenge') ||
      (taskTypeFilter === 'Dự án ngắn' && t.type === 'project');

    const matchDuration =
      taskDurationFilter === 'Tất cả' ||
      (taskDurationFilter === 'Dưới 3h' && t.estimatedHours <= 3) ||
      (taskDurationFilter === '3–8h' && t.estimatedHours > 3 && t.estimatedHours <= 8) ||
      (taskDurationFilter === 'Trên 8h' && t.estimatedHours > 8);

    const matchUrgent = !taskUrgentOnly || t.isUrgent;

    return matchQuery && matchCategory && matchType && matchDuration && matchUrgent;
  });

  // 7. JOBS FILTER
  const filteredJobs = jobPostings.filter((j) => {
    const matchQuery =
      j.title.toLowerCase().includes(jobSearchQuery.toLowerCase()) ||
      j.companyName.toLowerCase().includes(jobSearchQuery.toLowerCase()) ||
      j.description.toLowerCase().includes(jobSearchQuery.toLowerCase());

    const matchCategory = jobCategoryFilter === 'Tất cả' || j.targetCategory === jobCategoryFilter;
    const matchType = jobTypeFilter === 'Tất cả' || j.type === jobTypeFilter;
    const matchLocation =
      jobLocationFilter === 'Tất cả' || j.location.toLowerCase().includes(jobLocationFilter.toLowerCase());

    return matchQuery && matchCategory && matchType && matchLocation;
  });

  // Handle adding skill
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    const success = addSkillToProfile(newSkillInput.trim());
    if (success) setNewSkillInput('');
  };

  // Handle save bio
  const handleSaveBio = () => {
    updateStudentProfile({ bio: bioInput.trim() });
    setIsEditingBio(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Top Welcome Card with Personalized Tone & Action Status */}
      <div className="stulance-card p-6 border border-[#DCE8F8] bg-white mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-[#EAF2FC] text-[#3D7DD8] border border-[#DCE8F8] flex items-center justify-center font-heading font-bold text-2xl shrink-0">
                {student.name.charAt(0)}
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#CDEFE0] text-[#0F5B39] border-2 border-white flex items-center justify-center text-[10px] font-bold">
                ✓
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                {/* 1. Lời chào theo tên */}
                <h1 className="font-heading font-bold text-xl sm:text-2xl text-[#16243D]">
                  Chào {student.name.split(' ').slice(-1)[0]}, sẵn sàng làm thử thách hôm nay?
                </h1>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#EAF2FC] text-[#3D7DD8]">
                  Sinh viên năm {student.year}
                </span>
              </div>
              <p className="text-xs text-[#5B6B85] mt-1">
                {student.faculty} · {student.major} · {student.university}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-6 self-start md:self-auto border-t md:border-t-0 pt-3 md:pt-0 border-[#DCE8F8]">
            <div className="text-center sm:text-left">
              <p className="text-[11px] text-[#5B6B85]">Đang làm</p>
              <p className="font-heading font-bold text-lg text-[#16243D]">
                {inProgressMyTasks.length} bài
              </p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-[11px] text-[#5B6B85]">Thẻ bằng chứng</p>
              <p className="font-heading font-bold text-lg text-[#3D7DD8]">
                {gradedMyTasks.length} thẻ
              </p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-[11px] text-[#5B6B85]">Điểm TB</p>
              <p className="font-heading font-bold text-lg text-[#0F5B39] font-numbers">
                {student.averageScore.toFixed(1)}
                <span className="text-xs font-normal text-[#5B6B85]">/10</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Student Sub-navigation Bar */}
      <div className="flex items-center gap-2 border-b border-[#DCE8F8] pb-3 mb-6 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab('home')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            activeSubTab === 'home'
              ? 'bg-[#3D7DD8] text-white shadow-xs'
              : 'text-[#5B6B85] hover:text-[#16243D] bg-white border border-[#DCE8F8]'
          }`}
        >
          Trang chủ & Gợi ý
        </button>

        <button
          onClick={() => setActiveSubTab('search_tasks')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            activeSubTab === 'search_tasks'
              ? 'bg-[#3D7DD8] text-white shadow-xs'
              : 'text-[#5B6B85] hover:text-[#16243D] bg-white border border-[#DCE8F8]'
          }`}
        >
          Tìm kiếm nhiệm vụ ({tasks.length})
        </button>

        <button
          onClick={() => setActiveSubTab('my_tasks')}
          className={`relative px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            activeSubTab === 'my_tasks'
              ? 'bg-[#3D7DD8] text-white shadow-xs'
              : 'text-[#5B6B85] hover:text-[#16243D] bg-white border border-[#DCE8F8]'
          }`}
        >
          Nhiệm vụ của tôi ({myTasks.length})
          {inProgressMyTasks.length > 0 && (
            <span className="ml-1.5 w-2 h-2 rounded-full bg-[#B83214] inline-block" />
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('portfolio')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            activeSubTab === 'portfolio'
              ? 'bg-[#3D7DD8] text-white shadow-xs'
              : 'text-[#5B6B85] hover:text-[#16243D] bg-white border border-[#DCE8F8]'
          }`}
        >
          Hồ sơ năng lực ({gradedMyTasks.length} Bằng chứng)
        </button>

        <button
          onClick={() => setActiveSubTab('jobs')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            activeSubTab === 'jobs'
              ? 'bg-[#3D7DD8] text-white shadow-xs'
              : 'text-[#5B6B85] hover:text-[#16243D] bg-white border border-[#DCE8F8]'
          }`}
        >
          Tin tuyển dụng ({jobPostings.length})
        </button>

        <button
          onClick={() => setActiveSubTab('invitations')}
          className={`relative px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            activeSubTab === 'invitations'
              ? 'bg-[#3D7DD8] text-white shadow-xs'
              : 'text-[#5B6B85] hover:text-[#16243D] bg-white border border-[#DCE8F8]'
          }`}
        >
          Lời mời ({invitations.length})
          {pendingInvitations.length > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#FFE9A8] text-[#7A5B00] text-[10px] font-bold">
              {pendingInvitations.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('notifications')}
          className={`relative px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            activeSubTab === 'notifications'
              ? 'bg-[#3D7DD8] text-white shadow-xs'
              : 'text-[#5B6B85] hover:text-[#16243D] bg-white border border-[#DCE8F8]'
          }`}
        >
          Thông báo
          {unreadNotificationCount > 0 && (
            <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-[#B83214] text-white text-[10px] font-bold">
              {unreadNotificationCount}
            </span>
          )}
        </button>
      </div>

      {/* ============================================================== */}
      {/* 1. TRANG CHỦ SINH VIÊN */}
      {/* ============================================================== */}
      {activeSubTab === 'home' && (
        <div className="space-y-8">
          {/* Mục tiêu trải nghiệm: Nhận nhiệm vụ đầu tiên trong tối đa 3 phút! */}
          <div className="p-6 rounded-[20px] bg-gradient-to-r from-white via-white to-[#EAF2FC] border border-[#DCE8F8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3D7DD8] mb-1.5">
                <Sparkles className="w-4 h-4" />
                Bắt đầu nhiệm vụ đầu tiên trong 3 phút
              </span>
              <h2 className="font-heading font-bold text-lg sm:text-xl text-[#16243D]">
                Nhận nhiệm vụ Thử sức ngắn (tối đa 3h), nộp bài và nhận Thẻ bằng chứng ngay
              </h2>
              <p className="text-xs text-[#5B6B85] mt-1 leading-relaxed">
                Được chấm điểm minh bạch bởi kỹ sư và chuyên viên thực tế. Không cần viết CV dài dòng, chỉ cần hoàn thành một thử thách nhỏ để chứng minh năng lực.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveSubTab('search_tasks');
                setTaskTypeFilter('Thử sức');
              }}
              className="px-6 py-3 bg-[#3D7DD8] hover:bg-[#2F67B5] text-white text-xs font-semibold rounded-full transition-colors shadow-xs shrink-0 self-start md:self-auto cursor-pointer"
            >
              Xem các nhiệm vụ Thử sức &lt; 3h →
            </button>
          </div>

          {/* NHIỆM VỤ ĐANG LÀM KÈM ĐẾM NGƯỢC HẠN NỘP (Real-time countdown timer) */}
          {inProgressMyTasks.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-bold text-lg text-[#16243D]">
                    Nhiệm vụ đang làm dở
                  </h3>
                  <span className="text-xs text-[#B83214] font-semibold bg-[#FFD6CC] px-2.5 py-0.5 rounded-full">
                    Đang đếm ngược hạn nộp
                  </span>
                </div>
                <button
                  onClick={() => {
                    setActiveSubTab('my_tasks');
                    setMyTasksFilter('in_progress');
                  }}
                  className="text-xs text-[#3D7DD8] font-semibold hover:underline"
                >
                  Xem tất cả ({inProgressMyTasks.length}) →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inProgressMyTasks.map((item) => {
                  const taskObj = tasks.find((t) => t.id === item.taskId);
                  if (!taskObj) return null;
                  return (
                    <div
                      key={item.id}
                      className="stulance-card p-5 border border-[#DCE8F8] bg-white flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-xs font-semibold text-[#3D7DD8]">
                            {taskObj.category} · {taskObj.companyName}
                          </span>
                          {/* Đếm ngược hạn nộp thời gian thực */}
                          <TaskCountdown deadlineTimestamp={item.deadlineTimestamp} />
                        </div>

                        <h4 className="font-heading font-bold text-base text-[#16243D] mb-1.5 line-clamp-1">
                          {taskObj.title}
                        </h4>
                        <p className="text-xs text-[#5B6B85] line-clamp-2 mb-3">
                          {taskObj.shortBrief}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#DCE8F8] flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => cancelClaimedTask(item.id)}
                          className="text-xs text-[#5B6B85] hover:text-[#B83214] transition-colors"
                        >
                          Hủy nhận nhiệm vụ
                        </button>
                        <button
                          type="button"
                          onClick={() => setSubmittingMyTask({ record: item, isUpdating: false })}
                          className="px-5 py-2 rounded-full bg-[#3D7DD8] hover:bg-[#2F67B5] text-white text-xs font-semibold transition-colors shadow-xs"
                        >
                          Nộp bài làm ngay →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* LỜI MỜI MỚI (Invitations from companies) */}
          {pendingInvitations.length > 0 && (
            <div className="p-6 rounded-[20px] bg-[#F5F9FF] border border-[#DCE8F8]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#3D7DD8]" />
                  <h3 className="font-heading font-bold text-base text-[#16243D]">
                    Bạn có {pendingInvitations.length} lời mời mới từ doanh nghiệp
                  </h3>
                </div>
                <button
                  onClick={() => setActiveSubTab('invitations')}
                  className="text-xs text-[#3D7DD8] font-semibold hover:underline"
                >
                  Xem chi tiết lời mời →
                </button>
              </div>

              <div className="space-y-3">
                {pendingInvitations.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-4 rounded-xl bg-white border border-[#DCE8F8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#16243D]">{inv.companyName}</span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#FFE9A8] text-[#7A5B00] font-semibold">
                          {inv.type === 'interview_invite' ? 'Mời phỏng vấn' : 'Mời thử sức'}
                        </span>
                      </div>
                      <p className="font-medium text-[#16243D] mt-1">{inv.title}</p>
                      <p className="text-[#5B6B85] line-clamp-1 mt-0.5">{inv.message}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      <button
                        onClick={() => declineInvitation(inv.id)}
                        className="px-3 py-1.5 rounded-full border border-[#DCE8F8] text-[#5B6B85] hover:text-[#B83214]"
                      >
                        Từ chối
                      </button>
                      <button
                        onClick={() => acceptInvitation(inv.id)}
                        className="px-4 py-1.5 rounded-full bg-[#3D7DD8] hover:bg-[#2F67B5] text-white font-semibold"
                      >
                        Chấp nhận
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* KHỐI "GỢI Ý CHO BẠN" LỌC THEO NGÀNH VÀ NĂM HỌC */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading font-bold text-lg text-[#16243D]">
                  Gợi ý cho bạn ({student.major} · Năm {student.year})
                </h3>
                <p className="text-xs text-[#5B6B85] mt-0.5">
                  Được chọn lọc theo ngành học của bạn tại {student.university}
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveSubTab('search_tasks');
                  setTaskCategoryFilter('Tất cả');
                }}
                className="text-xs text-[#3D7DD8] font-semibold hover:underline"
              >
                Khám phá tất cả {tasks.length} nhiệm vụ →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedTasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className="stulance-card stulance-card-hover p-6 flex flex-col justify-between cursor-pointer border border-[#DCE8F8] bg-white group"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#5B6B85] mb-2.5">
                      <span className="font-semibold text-[#3D7DD8]">{task.category}</span>
                      <span className="text-[11px] font-medium bg-[#F5F9FF] px-2 py-0.5 rounded-full border border-[#DCE8F8]">
                        {task.type === 'challenge' ? '⚡ Thử sức (≤3h)' : '📋 Dự án'}
                      </span>
                    </div>

                    <h4 className="font-heading font-semibold text-base text-[#16243D] group-hover:text-[#3D7DD8] transition-colors line-clamp-2 mb-2 leading-snug">
                      {task.title}
                    </h4>
                    <p className="text-xs text-[#5B6B85] line-clamp-2 leading-relaxed mb-4">
                      {task.shortBrief}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FFE9A8] text-[#7A5B00]">
                        Thù lao: {formatVND(task.rewardVND)}
                      </span>
                      {task.isUrgent && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#FFD6CC] text-[#B83214]">
                          Hạn gấp
                        </span>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[#DCE8F8] flex items-center justify-between text-xs text-[#5B6B85]">
                      <span className="font-medium text-[#16243D] truncate max-w-[170px]">
                        {task.companyName}
                      </span>
                      <span className="text-[#3D7DD8] font-semibold">Xem đề →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. TÌM KIẾM NHIỆM VỤ */}
      {/* ============================================================== */}
      {activeSubTab === 'search_tasks' && (
        <div className="space-y-6">
          {/* Search bar & Comprehensive Filters */}
          <div className="stulance-card p-6 border border-[#DCE8F8] bg-white space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-[#5B6B85] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={taskSearchQuery}
                onChange={(e) => setTaskSearchQuery(e.target.value)}
                placeholder="Tìm kiếm nhiệm vụ theo tên, kỹ năng, công ty tuyển dụng..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#DCE8F8] bg-[#F5F9FF] text-xs text-[#16243D] focus:bg-white focus:ring-2 focus:ring-[#3D7DD8]/30 outline-none"
              />
            </div>

            {/* Filter Controls Row */}
            <div className="flex items-center gap-4 flex-wrap text-xs">
              {/* Ngành */}
              <div className="flex items-center gap-1.5">
                <span className="text-[#5B6B85]">Ngành:</span>
                <select
                  value={taskCategoryFilter}
                  onChange={(e) => setTaskCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-full border border-[#DCE8F8] bg-white text-xs text-[#16243D] outline-none"
                >
                  {['Tất cả', 'Marketing', 'CNTT', 'Thiết kế', 'Kế toán', 'Du lịch'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Loại nhiệm vụ: Thử sức / Dự án ngắn */}
              <div className="flex items-center gap-1.5">
                <span className="text-[#5B6B85]">Loại:</span>
                <select
                  value={taskTypeFilter}
                  onChange={(e) => setTaskTypeFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-full border border-[#DCE8F8] bg-white text-xs text-[#16243D] outline-none"
                >
                  <option value="Tất cả">Tất cả hình thức</option>
                  <option value="Thử sức">Thử sức (Tối đa 3h)</option>
                  <option value="Dự án ngắn">Dự án ngắn (&gt;3h)</option>
                </select>
              </div>

              {/* Thời lượng */}
              <div className="flex items-center gap-1.5">
                <span className="text-[#5B6B85]">Thời lượng:</span>
                <select
                  value={taskDurationFilter}
                  onChange={(e) => setTaskDurationFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-full border border-[#DCE8F8] bg-white text-xs text-[#16243D] outline-none"
                >
                  <option value="Tất cả">Tất cả thời lượng</option>
                  <option value="Dưới 3h">Dưới 3 giờ làm</option>
                  <option value="3–8h">Từ 3 đến 8 giờ</option>
                  <option value="Trên 8h">Trên 8 giờ làm</option>
                </select>
              </div>

              {/* Hạn gấp toggle */}
              <label className="flex items-center gap-1.5 cursor-pointer ml-auto">
                <input
                  type="checkbox"
                  checked={taskUrgentOnly}
                  onChange={(e) => setTaskUrgentOnly(e.target.checked)}
                  className="rounded border-[#DCE8F8] text-[#3D7DD8]"
                />
                <span className="text-[#16243D] font-medium">Chỉ hiện hạn gấp</span>
              </label>
            </div>
          </div>

          {/* Results Grid */}
          {filteredTasks.length === 0 ? (
            <EmptyState
              icon={Search}
              title="Không tìm thấy nhiệm vụ phù hợp"
              description="Thử thay đổi từ khóa tìm kiếm hoặc bỏ bớt các tiêu chí lọc ngành / thời lượng để xem thêm nhiệm vụ nhé."
              actionText="Xóa toàn bộ bộ lọc"
              onAction={() => {
                setTaskSearchQuery('');
                setTaskCategoryFilter('Tất cả');
                setTaskTypeFilter('Tất cả');
                setTaskDurationFilter('Tất cả');
                setTaskUrgentOnly(false);
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className="stulance-card stulance-card-hover p-6 flex flex-col justify-between cursor-pointer border border-[#DCE8F8] bg-white group"
                >
                  <div>
                    {/* Top unboxed metadata line */}
                    <div className="flex items-center justify-between text-xs text-[#5B6B85] mb-2.5">
                      <span className="font-semibold text-[#3D7DD8]">{task.category}</span>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{task.estimatedHours}h làm</span>
                      </div>
                    </div>

                    <h3 className="font-heading font-semibold text-base text-[#16243D] group-hover:text-[#3D7DD8] transition-colors line-clamp-2 mb-2 leading-snug">
                      {task.title}
                    </h3>

                    <p className="text-xs text-[#5B6B85] line-clamp-3 leading-relaxed mb-4">
                      {task.shortBrief}
                    </p>
                  </div>

                  <div>
                    {/* Thù lao nếu có (vàng bơ) & hạn nộp */}
                    <div className="flex items-center gap-2 flex-wrap mb-4">
                      {task.rewardVND > 0 && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FFE9A8] text-[#7A5B00]">
                          Thù lao: {formatVND(task.rewardVND)}
                        </span>
                      )}

                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                          task.isUrgent
                            ? 'bg-[#FFD6CC] text-[#B83214] font-semibold'
                            : 'bg-[#F5F9FF] text-[#5B6B85] border border-[#DCE8F8]'
                        }`}
                      >
                        {task.isUrgent ? 'Gấp: ' : 'Hạn: '}
                        {task.deadline}
                      </span>
                    </div>

                    {/* Footer: Doanh nghiệp + Dấu xác minh */}
                    <div className="pt-3 border-t border-[#DCE8F8] flex items-center justify-between text-xs text-[#5B6B85]">
                      <div className="flex items-center gap-1.5 truncate max-w-[180px]">
                        <span className="font-medium text-[#16243D] truncate">{task.companyName}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#3D7DD8] shrink-0" />
                      </div>
                      <span className="text-[#3D7DD8] font-semibold shrink-0">
                        {task.type === 'challenge' ? 'Thử sức →' : 'Xem dự án →'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. NHIỆM VỤ CỦA TÔI (4 TAB: Đang làm, Đã nộp, Đã chấm, Quá hạn) */}
      {/* ============================================================== */}
      {activeSubTab === 'my_tasks' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-heading font-bold text-xl text-[#16243D]">
                Nhiệm vụ của bạn
              </h2>
              <p className="text-xs text-[#5B6B85] mt-0.5">
                Theo dõi tiến độ, nộp bài, chỉnh sửa và xem kết quả thẩm định năng lực.
              </p>
            </div>

            {/* 4 Tabs Selector */}
            <div className="flex items-center gap-1.5 p-1 bg-[#F5F9FF] border border-[#DCE8F8] rounded-full overflow-x-auto">
              <button
                type="button"
                onClick={() => setMyTasksFilter('in_progress')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  myTasksFilter === 'in_progress'
                    ? 'bg-[#3D7DD8] text-white shadow-xs'
                    : 'text-[#5B6B85] hover:text-[#16243D]'
                }`}
              >
                Đang làm ({inProgressMyTasks.length})
              </button>
              <button
                type="button"
                onClick={() => setMyTasksFilter('submitted')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  myTasksFilter === 'submitted'
                    ? 'bg-[#3D7DD8] text-white shadow-xs'
                    : 'text-[#5B6B85] hover:text-[#16243D]'
                }`}
              >
                Đã nộp ({submittedMyTasks.length})
              </button>
              <button
                type="button"
                onClick={() => setMyTasksFilter('graded')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  myTasksFilter === 'graded'
                    ? 'bg-[#3D7DD8] text-white shadow-xs'
                    : 'text-[#5B6B85] hover:text-[#16243D]'
                }`}
              >
                Đã chấm ({gradedMyTasks.length})
              </button>
              <button
                type="button"
                onClick={() => setMyTasksFilter('overdue')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  myTasksFilter === 'overdue'
                    ? 'bg-[#3D7DD8] text-white shadow-xs'
                    : 'text-[#5B6B85] hover:text-[#16243D]'
                }`}
              >
                Quá hạn ({overdueMyTasks.length})
              </button>
            </div>
          </div>

          {/* TAB 4.1: ĐANG LÀM */}
          {myTasksFilter === 'in_progress' && (
            <div className="space-y-4">
              {inProgressMyTasks.length === 0 ? (
                <EmptyState
                  icon={Clock}
                  title="Bạn không có nhiệm vụ nào đang làm dở"
                  description="Hãy nhận một nhiệm vụ Thử sức hoặc dự án ngắn mới để rèn luyện kỹ năng thực tế ngay hôm nay."
                  actionText="Khám phá nhiệm vụ ngay"
                  onAction={() => setActiveSubTab('search_tasks')}
                />
              ) : (
                inProgressMyTasks.map((item) => {
                  const taskObj = tasks.find((t) => t.id === item.taskId);
                  if (!taskObj) return null;
                  return (
                    <div
                      key={item.id}
                      className="stulance-card p-6 border border-[#DCE8F8] bg-white flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="text-xs font-semibold text-[#3D7DD8]">
                            {taskObj.category}
                          </span>
                          <span>·</span>
                          <span className="text-xs text-[#5B6B85]">
                            Đăng bởi {taskObj.companyName}
                          </span>
                          <TaskCountdown deadlineTimestamp={item.deadlineTimestamp} />
                        </div>

                        <h3 className="font-heading font-bold text-base sm:text-lg text-[#16243D] mb-1.5">
                          {taskObj.title}
                        </h3>
                        <p className="text-xs text-[#5B6B85] leading-relaxed max-w-2xl mb-3">
                          {taskObj.shortBrief}
                        </p>

                        <div className="flex items-center gap-3 text-xs text-[#5B6B85]">
                          <span>Thù lao: <strong>{formatVND(taskObj.rewardVND)}</strong></span>
                          <span>·</span>
                          <span>Nhận ngày: {item.claimedAt}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
                        {/* Rule: Được hủy nhận khi chưa nộp */}
                        <button
                          type="button"
                          onClick={() => cancelClaimedTask(item.id)}
                          className="px-4 py-2 rounded-full border border-[#DCE8F8] text-xs font-medium text-[#5B6B85] hover:text-[#B83214] hover:bg-[#FFF8F7] transition-colors"
                        >
                          Hủy nhận
                        </button>
                        <button
                          type="button"
                          onClick={() => setSubmittingMyTask({ record: item, isUpdating: false })}
                          className="px-6 py-2.5 rounded-full bg-[#3D7DD8] hover:bg-[#2F67B5] text-white text-xs font-semibold transition-colors shadow-xs"
                        >
                          Nộp bài làm
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 4.2: ĐÃ NỘP (CẬP NHẬT KHI CHƯA HẾT HẠN VÀ CHƯA CHẤM) */}
          {myTasksFilter === 'submitted' && (
            <div className="space-y-4">
              {submittedMyTasks.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="Chưa có bài nào đã nộp đang chờ chấm"
                  description="Khi bạn nộp bài làm thành công, bài sẽ hiển thị tại đây để bạn có thể xem lại hoặc chỉnh sửa trước hạn chót."
                />
              ) : (
                submittedMyTasks.map((item) => {
                  const taskObj = tasks.find((t) => t.id === item.taskId);
                  const isStillEditable = Date.now() < item.deadlineTimestamp;

                  return (
                    <div
                      key={item.id}
                      className="stulance-card p-6 border border-[#DCE8F8] bg-white flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FFE9A8] text-[#7A5B00]">
                            Đang chờ doanh nghiệp chấm điểm
                          </span>
                          <span className="text-xs text-[#5B6B85]">
                            · Nộp ngày {item.submittedAt || '26/03/2026'}
                          </span>
                        </div>

                        <h3 className="font-heading font-bold text-base text-[#16243D] mb-1">
                          {taskObj?.title || 'Nhiệm vụ thực tế'}
                        </h3>

                        {item.deliverableLink && (
                          <div className="text-xs text-[#5B6B85] mt-1 flex items-center gap-1.5 truncate">
                            <span>Sản phẩm đã nộp:</span>
                            <a
                              href={item.deliverableLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#3D7DD8] hover:underline font-mono truncate max-w-sm"
                            >
                              {item.deliverableLink}
                            </a>
                          </div>
                        )}

                        {item.notes && (
                          <p className="text-xs text-[#5B6B85] italic mt-1.5 bg-[#F5F9FF] p-2.5 rounded-xl">
                            <strong>Ghi chú:</strong> {item.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                        {/* Rule: Được cập nhật bài khi chưa hết hạn và chưa chấm */}
                        {isStillEditable ? (
                          <button
                            type="button"
                            onClick={() => setSubmittingMyTask({ record: item, isUpdating: true })}
                            className="px-5 py-2.5 rounded-full border border-[#3D7DD8] bg-[#EAF2FC] hover:bg-[#3D7DD8] hover:text-white text-[#3D7DD8] text-xs font-semibold transition-colors"
                          >
                            Cập nhật bài nộp
                          </button>
                        ) : (
                          <span className="text-xs text-[#5B6B85] italic">
                            Đã khóa sửa bài (Hết thời hạn)
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 4.3: ĐÃ CHẤM (XEM ĐIỂM CHI TIẾT TỪNG TIÊU CHÍ, THẺ BẰNG CHỨNG) */}
          {myTasksFilter === 'graded' && (
            <div className="space-y-4">
              {gradedMyTasks.length === 0 ? (
                <EmptyState
                  icon={Award}
                  title="Chưa có bài nào được chấm điểm"
                  description="Sau khi doanh nghiệp đối soát và hoàn tất chấm điểm bài làm của bạn, kết quả thẩm định sẽ hiển thị tại đây."
                />
              ) : (
                gradedMyTasks.map((item) => {
                  const taskObj = tasks.find((t) => t.id === item.taskId);
                  const isPublic = !!item.isPublicInPortfolio;

                  return (
                    <div
                      key={item.id}
                      className="stulance-card p-6 border border-[#DCE8F8] bg-white flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#CDEFE0] text-[#0F5B39]">
                            ✓ Đã thẩm định & cấp bằng chứng
                          </span>
                          <span className="text-xs text-[#5B6B85]">
                            · Chấm ngày {item.gradedAt || '25/03/2026'}
                          </span>
                          {isPublic ? (
                            <span className="text-[11px] font-medium text-[#3D7DD8] bg-[#EAF2FC] px-2 py-0.5 rounded-full">
                              Đang công khai
                            </span>
                          ) : (
                            <span className="text-[11px] font-medium text-[#5B6B85] bg-slate-100 px-2 py-0.5 rounded-full">
                              Riêng tư
                            </span>
                          )}
                        </div>

                        <h3 className="font-heading font-bold text-base text-[#16243D] mb-1">
                          {taskObj?.title || 'Nhiệm vụ thực tế'}
                        </h3>

                        {item.feedbackQuote && (
                          <blockquote className="text-xs italic text-[#16243D] mt-2 border-l-2 border-[#3D7DD8] pl-2.5">
                            &ldquo;{item.feedbackQuote}&rdquo;
                          </blockquote>
                        )}
                      </div>

                      <div className="flex items-center gap-4 self-end md:self-auto shrink-0">
                        {/* Score Circle */}
                        <div className="w-12 h-12 rounded-full border-2 border-[#3D7DD8] bg-[#F5F9FF] flex flex-col items-center justify-center shrink-0">
                          <span className="font-heading font-bold text-sm text-[#16243D]">
                            {(item.score || 9.0).toFixed(1)}
                          </span>
                          <span className="text-[9px] text-[#5B6B85]">/ 10</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setGradingDetailRecord(item)}
                          className="px-5 py-2.5 rounded-full bg-[#3D7DD8] hover:bg-[#2F67B5] text-white text-xs font-semibold transition-colors shadow-xs"
                        >
                          Xem chi tiết kết quả →
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 4.4: QUÁ HẠN (QUY TẮC: QUÁ HẠN THÌ KHÓA NỘP BÀI) */}
          {myTasksFilter === 'overdue' && (
            <div className="space-y-4">
              {overdueMyTasks.length === 0 ? (
                <EmptyState
                  icon={CheckCircle2}
                  title="Không có nhiệm vụ nào bị quá hạn"
                  description="Bạn quản lý thời gian rất tốt! Hãy tiếp tục duy trì tiến độ hoàn thành đúng cam kết."
                />
              ) : (
                overdueMyTasks.map((item) => {
                  const taskObj = tasks.find((t) => t.id === item.taskId);
                  return (
                    <div
                      key={item.id}
                      className="stulance-card p-6 border border-[#FFD6CC] bg-[#FFF8F7] flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FFD6CC] text-[#B83214] inline-block mb-1.5">
                          Đã quá thời gian nộp bài
                        </span>
                        <h3 className="font-heading font-bold text-base text-[#16243D] mb-1">
                          {taskObj?.title || 'Nhiệm vụ'}
                        </h3>
                        <p className="text-xs text-[#5B6B85]">
                          Theo quy chế thi đua công bằng, nhiệm vụ đã bị khóa quyền nộp bài do vượt quá thời lượng cho phép.
                        </p>
                      </div>
                      <div className="text-xs font-semibold text-[#B83214] shrink-0">
                        Đã khóa nộp bài
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. HỒ SƠ NĂNG LỰC */}
      {/* ============================================================== */}
      {activeSubTab === 'portfolio' && (
        <div className="space-y-8">
          {/* Portfolio Top Bar with Controls */}
          <div className="stulance-card p-6 border border-[#DCE8F8] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-heading font-bold text-xl text-[#16243D]">
                Hồ sơ năng lực thực chiến
              </h2>
              <p className="text-xs text-[#5B6B85] mt-0.5">
                Được xây dựng từ các Thẻ bằng chứng bài làm thật thay cho CV truyền thống.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Công tắc "Cho phép doanh nghiệp tìm thấy tôi" */}
              <button
                type="button"
                onClick={toggleFindMe}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  student.allowCompaniesToFindMe
                    ? 'bg-[#CDEFE0] text-[#0F5B39]'
                    : 'bg-slate-100 text-[#5B6B85]'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                {student.allowCompaniesToFindMe
                  ? 'Doanh nghiệp có thể tìm thấy bạn'
                  : 'Đang ẩn với tìm kiếm'}
              </button>

              {/* Nút "Xem như doanh nghiệp" (Preview Mode) */}
              <button
                type="button"
                onClick={() => setIsEmployerPreviewMode(!isEmployerPreviewMode)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                  isEmployerPreviewMode
                    ? 'bg-[#16243D] text-white border-[#16243D]'
                    : 'bg-white border-[#DCE8F8] text-[#16243D] hover:bg-slate-50'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                {isEmployerPreviewMode ? 'Thoát chế độ xem thử' : 'Xem như doanh nghiệp'}
              </button>
            </div>
          </div>

          {/* Banner if in Preview Mode */}
          {isEmployerPreviewMode && (
            <div className="p-4 rounded-2xl bg-[#EAF2FC] border border-[#3D7DD8] text-xs text-[#16243D] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#3D7DD8]" />
                <span>
                  <strong>Chế độ Xem thử:</strong> Đây là giao diện chính xác mà nhà tuyển dụng sẽ nhìn thấy khi duyệt hồ sơ của bạn. Các Thẻ bằng chứng đang ở chế độ Riêng tư sẽ tự động bị ẩn.
                </span>
              </div>
              <button
                onClick={() => setIsEmployerPreviewMode(false)}
                className="text-xs text-[#3D7DD8] font-bold hover:underline shrink-0"
              >
                Đóng xem thử
              </button>
            </div>
          )}

          {/* Student Identity Card */}
          <div className="stulance-card p-6 sm:p-8 border border-[#DCE8F8] bg-white space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Basic Academic Info */}
              <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#F5F9FF] border border-[#DCE8F8] text-xs">
                  <div>
                    <span className="text-[#5B6B85] block text-[11px]">Mã sinh viên</span>
                    <strong className="text-[#16243D] font-mono">{student.studentCode}</strong>
                  </div>
                  <div>
                    <span className="text-[#5B6B85] block text-[11px]">Khóa học</span>
                    <strong className="text-[#16243D]">{student.cohort}</strong>
                  </div>
                  <div>
                    <span className="text-[#5B6B85] block text-[11px]">Năm học</span>
                    <strong className="text-[#16243D]">Năm thứ {student.year}</strong>
                  </div>
                  <div>
                    <span className="text-[#5B6B85] block text-[11px]">Điểm TB thẩm định</span>
                    <strong className="text-[#0F5B39] font-numbers">{student.averageScore.toFixed(1)} / 10</strong>
                  </div>
                </div>

                {/* Bio / Giới thiệu */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="font-heading font-semibold text-xs text-[#5B6B85] uppercase tracking-wider">
                      Giới thiệu bản thân
                    </h4>
                    {!isEmployerPreviewMode && !isEditingBio && (
                      <button
                        onClick={() => {
                          setBioInput(student.bio);
                          setIsEditingBio(true);
                        }}
                        className="text-xs text-[#3D7DD8] hover:underline"
                      >
                        Chỉnh sửa
                      </button>
                    )}
                  </div>

                  {isEditingBio ? (
                    <div className="space-y-2">
                      <textarea
                        rows={3}
                        value={bioInput}
                        onChange={(e) => setBioInput(e.target.value)}
                        className="w-full p-3 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] outline-none focus:ring-2 focus:ring-[#3D7DD8]/30"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsEditingBio(false)}
                          className="px-3 py-1 rounded-full text-xs text-[#5B6B85]"
                        >
                          Hủy
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveBio}
                          className="px-4 py-1.5 rounded-full bg-[#3D7DD8] text-white text-xs font-semibold"
                        >
                          Lưu giới thiệu
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm text-[#16243D] leading-relaxed">
                      {student.bio}
                    </p>
                  )}
                </div>

                {/* Product Links / Liên kết sản phẩm */}
                <div>
                  <h4 className="font-heading font-semibold text-xs text-[#5B6B85] uppercase tracking-wider mb-2">
                    Liên kết sản phẩm & Mã nguồn
                  </h4>
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    {student.productLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5F9FF] border border-[#DCE8F8] text-[#16243D] hover:text-[#3D7DD8] hover:bg-[#EAF2FC] transition-colors font-medium"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        <span>{link.label}</span>
                        <ExternalLink className="w-3 h-3 text-[#5B6B85]" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Skills List (Tối đa 15 kỹ năng) */}
              <div className="p-5 rounded-2xl bg-[#F5F9FF] border border-[#DCE8F8] space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-semibold text-xs text-[#16243D]">
                    Kỹ năng cốt lõi ({student.skills.length}/15)
                  </h4>
                </div>

                {/* Unboxed skills with subtle badges */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {student.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-[#DCE8F8] text-xs font-medium text-[#16243D]"
                    >
                      <span>{skill}</span>
                      {!isEmployerPreviewMode && (
                        <button
                          type="button"
                          onClick={() => removeSkillFromProfile(skill)}
                          className="text-[#5B6B85] hover:text-[#B83214] ml-0.5"
                        >
                          ✕
                        </button>
                      )}
                    </span>
                  ))}
                </div>

                {!isEmployerPreviewMode && student.skills.length < 15 && (
                  <form onSubmit={handleAddSkill} className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      placeholder="Thêm kỹ năng mới..."
                      className="flex-1 px-3 py-1.5 rounded-full border border-[#DCE8F8] bg-white text-xs outline-none focus:ring-2 focus:ring-[#3D7DD8]/30"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-[#3D7DD8] hover:bg-[#2F67B5] text-white text-xs font-semibold rounded-full shadow-xs"
                    >
                      Thêm
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* PROOF CARDS GRID (Thẻ bằng chứng với công tắc Công khai / Riêng tư) */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading font-bold text-lg text-[#16243D]">
                  Thẻ bằng chứng năng lực thực tế
                </h3>
                <p className="text-xs text-[#5B6B85] mt-0.5">
                  Mỗi thẻ chứng thực một bài làm đã được đối tác doanh nghiệp chấm điểm. Mặc định ở chế độ Riêng tư cho đến khi bạn bật Công khai.
                </p>
              </div>
            </div>

            {/* If in Employer Preview Mode, only show public ones */}
            {(() => {
              const displayList = isEmployerPreviewMode
                ? gradedMyTasks.filter((m) => m.isPublicInPortfolio)
                : gradedMyTasks;

              if (displayList.length === 0) {
                return (
                  <EmptyState
                    icon={Award}
                    title={
                      isEmployerPreviewMode
                        ? 'Chưa có Thẻ bằng chứng nào được Công khai'
                        : 'Bạn chưa có Thẻ bằng chứng nào'
                    }
                    description={
                      isEmployerPreviewMode
                        ? 'Nhà tuyển dụng sẽ không thấy bằng chứng nào cho đến khi bạn bật công tắc Công khai trên các bài làm đã chấm.'
                        : 'Sau khi làm xong và nhận điểm từ doanh nghiệp, Thẻ bằng chứng sẽ hiển thị tại đây để bạn bật công khai.'
                    }
                    actionText={!isEmployerPreviewMode ? 'Nhận nhiệm vụ ngay' : 'Thoát xem thử'}
                    onAction={() => {
                      if (isEmployerPreviewMode) setIsEmployerPreviewMode(false);
                      else setActiveSubTab('search_tasks');
                    }}
                  />
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayList.map((record) => {
                    const taskObj = tasks.find((t) => t.id === record.taskId);
                    const subObj: Submission = {
                      id: record.id,
                      taskId: record.taskId,
                      taskTitle: taskObj?.title || 'Nhiệm vụ thực tế',
                      studentId: student.id,
                      studentName: student.name,
                      studentUniversity: student.university,
                      submittedAt: record.submittedAt || '25/03/2026',
                      deliverableLink: record.deliverableLink || '',
                      notes: record.notes || '',
                      status: 'graded',
                      score: record.score,
                      passed: record.passed,
                      feedbackQuote: record.feedbackQuote,
                      detailedFeedback: record.detailedFeedback,
                      gradedAt: record.gradedAt,
                      gradedByCompanyId: taskObj?.companyId || 'comp-1',
                      isPublicInPortfolio: record.isPublicInPortfolio,
                    };

                    return (
                      <div key={record.id} className="relative flex flex-col">
                        <ProofCard
                          submission={subObj}
                          showStudent={false}
                          onOpenDetails={() => setGradingDetailRecord(record)}
                        />

                        {/* Public / Private toggle button below each card if not in employer preview */}
                        {!isEmployerPreviewMode && (
                          <div className="mt-2.5 flex items-center justify-between text-xs px-2">
                            <span className="text-[11px] text-[#5B6B85]">
                              Trạng thái hiển thị:
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleProofPublicInPortfolio(record.id)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                                record.isPublicInPortfolio
                                  ? 'bg-[#CDEFE0] text-[#0F5B39]'
                                  : 'bg-white border border-[#DCE8F8] text-[#5B6B85] hover:bg-slate-50'
                              }`}
                            >
                              {record.isPublicInPortfolio ? (
                                <>
                                  <Globe className="w-3 h-3" />
                                  Công khai
                                </>
                              ) : (
                                <>
                                  <Lock className="w-3 h-3" />
                                  Riêng tư
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 7. TIN TUYỂN DỤNG & ĐƠN ỨNG TUYỂN CỦA TÔI */}
      {/* ============================================================== */}
      {activeSubTab === 'jobs' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-heading font-bold text-xl text-[#16243D]">
                Cơ hội việc làm qua Thẻ bằng chứng
              </h2>
              <p className="text-xs text-[#5B6B85] mt-0.5">
                Các doanh nghiệp chỉ tuyển thẳng ứng viên có điểm làm bài thực tế đạt chuẩn.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setJobsViewMode('browse')}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  jobsViewMode === 'browse'
                    ? 'bg-[#3D7DD8] text-white shadow-xs'
                    : 'bg-white border border-[#DCE8F8] text-[#5B6B85]'
                }`}
              >
                Khám phá việc làm ({jobPostings.length})
              </button>
              <button
                type="button"
                onClick={() => setJobsViewMode('my_applications')}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  jobsViewMode === 'my_applications'
                    ? 'bg-[#3D7DD8] text-white shadow-xs'
                    : 'bg-white border border-[#DCE8F8] text-[#5B6B85]'
                }`}
              >
                Đơn của tôi ({jobApplications.length})
              </button>
            </div>
          </div>

          {jobsViewMode === 'browse' ? (
            <>
              {/* Job Search & Filter Bar */}
              <div className="stulance-card p-6 border border-[#DCE8F8] bg-white space-y-4">
                <div className="relative">
                  <Search className="w-4 h-4 text-[#5B6B85] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={jobSearchQuery}
                    onChange={(e) => setJobSearchQuery(e.target.value)}
                    placeholder="Tìm theo vị trí, công ty hoặc từ khóa công việc..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#DCE8F8] bg-[#F5F9FF] text-xs text-[#16243D] focus:bg-white focus:ring-2 focus:ring-[#3D7DD8]/30 outline-none"
                  />
                </div>

                <div className="flex items-center gap-4 flex-wrap text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#5B6B85]">Ngành:</span>
                    <select
                      value={jobCategoryFilter}
                      onChange={(e) => setJobCategoryFilter(e.target.value)}
                      className="px-3 py-1.5 rounded-full border border-[#DCE8F8] bg-white text-xs outline-none"
                    >
                      {['Tất cả', 'Marketing', 'CNTT', 'Thiết kế', 'Kế toán', 'Du lịch'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[#5B6B85]">Loại hình:</span>
                    <select
                      value={jobTypeFilter}
                      onChange={(e) => setJobTypeFilter(e.target.value)}
                      className="px-3 py-1.5 rounded-full border border-[#DCE8F8] bg-white text-xs outline-none"
                    >
                      <option value="Tất cả">Tất cả</option>
                      <option value="Thực tập sinh">Thực tập sinh</option>
                      <option value="Bán thời gian">Bán thời gian</option>
                      <option value="Chính thức khởi đầu">Chính thức khởi đầu</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[#5B6B85]">Địa điểm:</span>
                    <select
                      value={jobLocationFilter}
                      onChange={(e) => setJobLocationFilter(e.target.value)}
                      className="px-3 py-1.5 rounded-full border border-[#DCE8F8] bg-white text-xs outline-none"
                    >
                      <option value="Tất cả">Tất cả địa điểm</option>
                      <option value="Hà Nội">Hà Nội</option>
                      <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
                      <option value="Remote">Làm từ xa (Remote)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Job Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredJobs.map((job) => {
                  const alreadyApplied = jobApplications.some(
                    (a) => a.jobId === job.id && a.studentId === currentUser?.id
                  );

                  return (
                    <div
                      key={job.id}
                      onClick={() => setSelectedJobId(job.id)}
                      className="stulance-card stulance-card-hover p-6 border border-[#DCE8F8] bg-white flex flex-col justify-between cursor-pointer group"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs text-[#5B6B85] mb-2.5">
                          <span className="font-semibold text-[#3D7DD8]">{job.targetCategory}</span>
                          <span className="bg-[#F5F9FF] border border-[#DCE8F8] px-2.5 py-0.5 rounded-full text-[11px] font-medium text-[#16243D]">
                            {job.type}
                          </span>
                        </div>

                        <h3 className="font-heading font-bold text-base text-[#16243D] group-hover:text-[#3D7DD8] transition-colors mb-1">
                          {job.title}
                        </h3>

                        <div className="flex items-center gap-2 text-xs text-[#5B6B85] mb-3">
                          <span className="font-medium text-[#16243D]">{job.companyName}</span>
                          <span>·</span>
                          <span>{job.location}</span>
                        </div>

                        <p className="text-xs text-[#5B6B85] line-clamp-2 leading-relaxed mb-4">
                          {job.description}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-[#F5F9FF] border border-[#DCE8F8] text-xs mb-4">
                          <div>
                            <span className="text-[11px] text-[#5B6B85] block">Mức lương</span>
                            <span className="font-heading font-bold text-[#0F5B39]">
                              {job.salaryText}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[11px] text-[#5B6B85] block">Yêu cầu điểm</span>
                            <span className="font-heading font-bold text-[#3D7DD8]">
                              ≥ {job.requiredProofScore.toFixed(1)}đ
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                          {alreadyApplied ? (
                            <span className="text-[11px] font-semibold text-[#0F5B39] bg-[#CDEFE0] px-2.5 py-1 rounded-full">
                              ✓ Đã nộp đơn
                            </span>
                          ) : (
                            <span className="text-[#5B6B85]">Đăng ngày {job.postedAt}</span>
                          )}
                          <span className="text-xs font-semibold text-[#3D7DD8]">
                            Xem chi tiết ứng tuyển →
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* MY APPLICATIONS LIST WITH STATUS AND WITHDRAWAL */
            <div className="space-y-4">
              {jobApplications.length === 0 ? (
                <EmptyState
                  icon={Briefcase}
                  title="Bạn chưa nộp đơn ứng tuyển nào"
                  description="Hãy tìm kiếm các vị trí thực tập và bán thời gian phù hợp, nộp hồ sơ kèm Thẻ bằng chứng để nhận lời mời phỏng vấn."
                  actionText="Khám phá việc làm ngay"
                  onAction={() => setJobsViewMode('browse')}
                />
              ) : (
                jobApplications.map((app) => (
                  <div
                    key={app.id}
                    className="stulance-card p-6 border border-[#DCE8F8] bg-white flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                            app.status === 'accepted'
                              ? 'bg-[#CDEFE0] text-[#0F5B39]'
                              : app.status === 'reviewing'
                              ? 'bg-[#EAF2FC] text-[#3D7DD8]'
                              : app.status === 'rejected'
                              ? 'bg-[#FFF2F0] text-[#B83214]'
                              : 'bg-[#FFE9A8] text-[#7A5B00]'
                          }`}
                        >
                          {app.status === 'submitted' && 'Đã nộp · Chờ xem xét'}
                          {app.status === 'reviewing' && 'Đang xem xét hồ sơ'}
                          {app.status === 'accepted' && 'Trúng tuyển / Mời phỏng vấn'}
                          {app.status === 'rejected' && 'Chưa phù hợp đợt này'}
                        </span>
                        <span className="text-xs text-[#5B6B85]">
                          · Nộp ngày {app.appliedAt}
                        </span>
                      </div>

                      <h3 className="font-heading font-bold text-base text-[#16243D] mb-1">
                        {app.jobTitle}
                      </h3>
                      <p className="text-xs text-[#5B6B85] mb-2">
                        Doanh nghiệp: <strong>{app.companyName}</strong>
                      </p>

                      {app.coverNote && (
                        <p className="text-xs text-[#5B6B85] italic bg-[#F5F9FF] p-2.5 rounded-xl">
                          &ldquo;{app.coverNote}&rdquo;
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                      <button
                        type="button"
                        onClick={() => setSelectedJobId(app.jobId)}
                        className="px-4 py-2 rounded-full border border-[#DCE8F8] text-xs font-medium text-[#16243D] hover:bg-slate-50"
                      >
                        Xem tin tuyển dụng
                      </button>

                      {/* Rule: Được rút đơn khi chưa được xử lý (trạng thái 'submitted') */}
                      {app.status === 'submitted' && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedJobId(app.jobId);
                          }}
                          className="px-4 py-2 rounded-full bg-[#FFF2F0] hover:bg-[#FFE5E0] text-[#B83214] text-xs font-semibold"
                        >
                          Rút đơn
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 8. LỜI MỜI TỪ DOANH NGHIỆP */}
      {/* ============================================================== */}
      {activeSubTab === 'invitations' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-xl text-[#16243D]">
                Lời mời từ doanh nghiệp
              </h2>
              <p className="text-xs text-[#5B6B85] mt-0.5">
                Các doanh nghiệp chủ động tìm thấy hồ sơ của bạn và gửi lời mời phỏng vấn hoặc thử sức.
              </p>
            </div>
          </div>

          {invitations.length === 0 ? (
            <EmptyState
              icon={Mail}
              title="Chưa có lời mời nào"
              description="Hãy hoàn thành thêm các nhiệm vụ và bật công tắc 'Cho phép doanh nghiệp tìm thấy tôi' để các công ty chủ động liên hệ nhé!"
            />
          ) : (
            <div className="space-y-4">
              {invitations.map((inv) => (
                <div
                  key={inv.id}
                  className="stulance-card p-6 border border-[#DCE8F8] bg-white flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                          inv.type === 'interview_invite'
                            ? 'bg-[#EAF2FC] text-[#3D7DD8]'
                            : 'bg-[#FFE9A8] text-[#7A5B00]'
                        }`}
                      >
                        {inv.type === 'interview_invite' ? 'Lời mời phỏng vấn' : 'Lời mời thử sức nhiệm vụ'}
                      </span>
                      <span className="text-xs text-[#5B6B85]">
                        · Gửi ngày {inv.sentAt}
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          inv.status === 'accepted'
                            ? 'bg-[#CDEFE0] text-[#0F5B39]'
                            : inv.status === 'declined'
                            ? 'bg-[#FFF2F0] text-[#B83214]'
                            : 'bg-slate-100 text-[#5B6B85]'
                        }`}
                      >
                        {inv.status === 'accepted' && '✓ Đã chấp nhận'}
                        {inv.status === 'declined' && 'Đã từ chối'}
                        {inv.status === 'pending' && 'Đang chờ bạn phản hồi'}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-base text-[#16243D] mb-1">
                      {inv.title}
                    </h3>
                    <p className="text-xs font-medium text-[#3D7DD8] mb-2">
                      Từ công ty: {inv.companyName}
                    </p>
                    <p className="text-xs text-[#5B6B85] leading-relaxed max-w-2xl bg-[#F5F9FF] p-3 rounded-xl">
                      {inv.message}
                    </p>
                  </div>

                  {inv.status === 'pending' && (
                    <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
                      <button
                        type="button"
                        onClick={() => declineInvitation(inv.id)}
                        className="px-4 py-2 rounded-full border border-[#DCE8F8] text-xs font-medium text-[#5B6B85] hover:text-[#B83214] hover:bg-slate-50 transition-colors"
                      >
                        Từ chối
                      </button>
                      <button
                        type="button"
                        onClick={() => acceptInvitation(inv.id)}
                        className="px-6 py-2 rounded-full bg-[#3D7DD8] hover:bg-[#2F67B5] text-white text-xs font-semibold transition-colors shadow-xs"
                      >
                        Chấp nhận lời mời
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 11. THÔNG BÁO (DANH SÁCH & ĐÁNH DẤU ĐÃ ĐỌC) */}
      {/* ============================================================== */}
      {activeSubTab === 'notifications' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-xl text-[#16243D]">
                Thông báo hệ thống
              </h2>
              <p className="text-xs text-[#5B6B85] mt-0.5">
                Cập nhật kết quả chấm điểm, lời mời phỏng vấn và nhắc nhở hạn chót.
              </p>
            </div>
            {unreadNotificationCount > 0 && (
              <button
                type="button"
                onClick={markAllNotificationsAsRead}
                className="text-xs text-[#3D7DD8] font-semibold hover:underline"
              >
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="Bạn không có thông báo nào"
              description="Mọi hoạt động chấm bài, lời mời và kết quả ứng tuyển sẽ xuất hiện tại đây."
            />
          ) : (
            <div className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markNotificationAsRead(n.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                    n.isRead
                      ? 'bg-white border-[#DCE8F8]'
                      : 'bg-[#F5F9FF] border-[#3D7DD8]/40 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        n.type === 'graded'
                          ? 'bg-[#CDEFE0] text-[#0F5B39]'
                          : n.type === 'invitation'
                          ? 'bg-[#FFE9A8] text-[#7A5B00]'
                          : n.type === 'deadline_warning'
                          ? 'bg-[#FFD6CC] text-[#B83214]'
                          : 'bg-[#EAF2FC] text-[#3D7DD8]'
                      }`}
                    >
                      {n.type === 'graded' && <Award className="w-4 h-4" />}
                      {n.type === 'invitation' && <Mail className="w-4 h-4" />}
                      {n.type === 'deadline_warning' && <Clock className="w-4 h-4" />}
                      {n.type === 'job_update' && <Briefcase className="w-4 h-4" />}
                      {n.type === 'system' && <Bell className="w-4 h-4" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-heading font-semibold text-sm text-[#16243D]">
                          {n.title}
                        </h4>
                        {!n.isRead && (
                          <span className="w-2 h-2 rounded-full bg-[#3D7DD8] inline-block" />
                        )}
                      </div>
                      <p className="text-xs text-[#5B6B85] mt-1 leading-relaxed">
                        {n.content}
                      </p>
                      <span className="text-[11px] text-[#5B6B85] mt-2 block">
                        {n.createdAt}
                      </span>
                    </div>
                  </div>

                  {!n.isRead && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        markNotificationAsRead(n.id);
                      }}
                      className="text-xs text-[#3D7DD8] font-medium hover:underline shrink-0"
                    >
                      Đã xem
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* MODALS */}
      {/* ============================================================== */}
      {/* 1. Task Detail Modal */}
      {selectedTaskId && (
        <TaskDetailModal
          taskId={selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
          onOpenReport={(tId) => setReportTaskId(tId)}
          onOpenCompanyProfile={(cId) => setCompanyProfileId(cId)}
        />
      )}

      {/* 2. Submit Work Modal */}
      {submittingMyTask && (
        <SubmitWorkModal
          myTask={submittingMyTask.record}
          task={tasks.find((t) => t.id === submittingMyTask.record.taskId) || tasks[0]}
          isUpdating={submittingMyTask.isUpdating}
          onClose={() => setSubmittingMyTask(null)}
        />
      )}

      {/* 3. Grading Detail Modal */}
      {gradingDetailRecord && (
        <GradingDetailModal
          myTask={gradingDetailRecord}
          task={tasks.find((t) => t.id === gradingDetailRecord.taskId)}
          onClose={() => setGradingDetailRecord(null)}
          onOpenReviewCompany={(compId, tId) => {
            setReviewCompanyTarget({ companyId: compId, taskId: tId });
          }}
        />
      )}

      {/* 4. Company Profile Modal */}
      {companyProfileId && (
        <CompanyProfileModal
          companyId={companyProfileId}
          onClose={() => setCompanyProfileId(null)}
          onSelectTask={(tId) => setSelectedTaskId(tId)}
        />
      )}

      {/* 5. Company Review Modal */}
      {reviewCompanyTarget && (
        <CompanyReviewModal
          companyId={reviewCompanyTarget.companyId}
          taskId={reviewCompanyTarget.taskId}
          onClose={() => setReviewCompanyTarget(null)}
        />
      )}

      {/* 6. Violation Report Modal (Nhiệm vụ hoặc Tin tuyển dụng) */}
      {reportTaskId && (
        <ViolationReportModal
          taskId={reportTaskId}
          onClose={() => setReportTaskId(null)}
        />
      )}
      {reportJobId && (
        <ViolationReportModal
          jobId={reportJobId}
          onClose={() => setReportJobId(null)}
        />
      )}

      {/* 7. Job Detail Modal */}
      {selectedJobId && (
        <JobDetailModal
          jobId={selectedJobId}
          onClose={() => setSelectedJobId(null)}
          onOpenCompanyProfile={(cId) => setCompanyProfileId(cId)}
          onOpenReport={(jId) => setReportJobId(jId)}
        />
      )}
    </div>
  );
};
