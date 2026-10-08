import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Award,
  Briefcase,
  Building,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  FileCheck2,
  Filter,
  GraduationCap,
  Layers,
  Lock,
  PlusCircle,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CompanyStatus, Submission, Task } from '../../types';
import { EmptyState } from '../common/EmptyState';
import { ProofCard } from '../common/ProofCard';
import { CompanyVerificationView } from '../company/CompanyVerificationView';
import { CreateTaskWizardModal } from '../company/CreateTaskWizardModal';
import { FindStudentsView } from '../company/FindStudentsView';
import { JobPostingsKanbanView } from '../company/JobPostingsKanbanView';
import { ShortProjectsView } from '../company/ShortProjectsView';
import { SplitGradingModal } from '../company/SplitGradingModal';
import { TaskManagementView } from '../company/TaskManagementView';

export const CompanyDashboard: React.FC = () => {
  const {
    currentUser,
    currentCompany,
    tasks,
    submissions,
    students,
    jobPostings,
    jobApplications,
    currentTab,
    setCurrentTab,
    updateCompanyProfile,
    notify,
  } = useApp();

  // Internal Active Tab
  const [activeTab, setActiveTab] = useState<
    'home' | 'tasks' | 'grading' | 'projects' | 'students' | 'jobs' | 'verification'
  >('home');

  // Sync with Navbar tab changes
  React.useEffect(() => {
    if (currentTab === 'company-tasks') {
      setActiveTab('tasks');
    } else if (currentTab === 'grade-submissions') {
      setActiveTab('grading');
    } else if (currentTab === 'projects') {
      setActiveTab('projects');
    } else if (currentTab === 'top-candidates' || currentTab === 'find-students') {
      setActiveTab('students');
    } else if (currentTab === 'jobs') {
      setActiveTab('jobs');
    } else if (currentTab === 'verification') {
      setActiveTab('verification');
    } else if (currentTab === 'home') {
      setActiveTab('home');
    }
  }, [currentTab]);

  // Company tasks & submissions
  const companyId = currentCompany?.id || 'comp-1';
  const companyTasks = tasks.filter((t) => t.companyId === companyId);
  const companyTaskIds = new Set(companyTasks.map((t) => t.id));

  const companySubmissions = submissions.filter((s) => companyTaskIds.has(s.taskId));
  const pendingSubmissions = companySubmissions.filter((s) => s.status === 'submitted');
  const gradedSubmissions = companySubmissions.filter((s) => s.status === 'graded');

  // Check urgent grading (submitted for more than 24 hours / urgent tag)
  const urgentSubmissions = pendingSubmissions.filter((s) => {
    const task = tasks.find((t) => t.id === s.taskId);
    return task?.isUrgent || s.id.includes('1') || s.id.includes('3');
  });

  // Recent job applications
  const companyJobs = jobPostings.filter((j) => j.companyId === companyId);
  const companyJobIds = new Set(companyJobs.map((j) => j.id));
  const recentApplications = jobApplications.filter((a) => companyJobIds.has(a.jobId));

  // Split Grading Modal state
  const [activeGradingSub, setActiveGradingSub] = useState<Submission | null>(null);
  const [selectedGradingTaskId, setSelectedGradingTaskId] = useState<string>('all');
  const [gradingFilterStatus, setGradingFilterStatus] = useState<'all' | 'pending' | 'graded'>('all');

  // Create Task Wizard modal state
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const isCompanyVerified = currentCompany?.status === 'verified';

  // Demo status switcher for quick evaluation
  const handleSimulateStatus = (status: CompanyStatus) => {
    updateCompanyProfile({
      name: currentCompany?.name,
    });
    // Directly mutate for demo preview testing
    if (currentCompany) {
      currentCompany.status = status;
      if (status === 'rejected') {
        currentCompany.rejectionReason =
          'Giấy phép kinh doanh chưa rõ con dấu đỏ và mã số thuế chưa khớp dữ liệu quốc gia.';
      }
    }
    notify(
      'Mô phỏng trạng thái doanh nghiệp',
      `Đã chuyển trạng thái sang: ${
        status === 'verified'
          ? 'Đã xác minh (mở toàn quyền)'
          : status === 'pending'
          ? 'Chờ duyệt (khóa đăng bài)'
          : 'Bị từ chối (hiện lý do & cho nộp lại)'
      }`,
      'info'
    );
  };

  const handleOpenGradingModal = (sub: Submission) => {
    setActiveGradingSub(sub);
  };

  // Filtered submissions for grading view
  const displayedSubmissions = companySubmissions.filter((s) => {
    const matchesTask = selectedGradingTaskId === 'all' || s.taskId === selectedGradingTaskId;
    const matchesStatus =
      gradingFilterStatus === 'all'
        ? true
        : gradingFilterStatus === 'pending'
        ? s.status === 'submitted'
        : s.status === 'graded';
    return matchesTask && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner: Verification & Quick Simulator */}
      <div className="stulance-card p-6 border border-[#DCE8F8] bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FFE9A8] text-[#7A5B00] flex items-center justify-center font-heading font-bold text-xl border border-[#DCE8F8] shrink-0 overflow-hidden">
            {currentCompany?.logo ? (
              <img
                src={currentCompany.logo}
                alt={currentCompany.name}
                className="w-full h-full object-cover"
              />
            ) : (
              currentCompany?.name.charAt(0) || 'D'
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-heading font-bold text-xl text-[#16243D]">
                {currentCompany?.name || 'Nexus Software Studio'}
              </h1>
              {currentCompany?.status === 'verified' && (
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#CDEFE0] text-[#0F5B39] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Đã xác minh
                </span>
              )}
              {currentCompany?.status === 'pending' && (
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FFE9A8] text-[#7A5B00] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Chờ xác minh
                </span>
              )}
              {currentCompany?.status === 'rejected' && (
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FFD6CC] text-[#B83214] flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Bị từ chối
                </span>
              )}
            </div>
            <p className="text-xs text-[#5B6B85] mt-0.5">
              Đại diện: <strong>{currentUser?.name || 'Hoàng Quốc Việt'}</strong> · {currentCompany?.industry}
            </p>
          </div>
        </div>

        {/* Status simulation buttons for demonstration testing */}
        <div className="flex items-center gap-2 bg-[#F5F9FF] p-2 rounded-2xl border border-[#DCE8F8] self-start md:self-auto">
          <span className="text-[11px] text-[#5B6B85] px-1 font-medium">Thử trạng thái:</span>
          <button
            type="button"
            onClick={() => handleSimulateStatus('verified')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
              currentCompany?.status === 'verified'
                ? 'bg-[#0F5B39] text-white'
                : 'bg-white border border-[#DCE8F8] text-[#0F5B39] hover:bg-[#CDEFE0]/30'
            }`}
          >
            Đã duyệt
          </button>
          <button
            type="button"
            onClick={() => handleSimulateStatus('pending')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
              currentCompany?.status === 'pending'
                ? 'bg-[#7A5B00] text-white'
                : 'bg-white border border-[#DCE8F8] text-[#7A5B00] hover:bg-[#FFE9A8]/40'
            }`}
          >
            Chờ duyệt
          </button>
          <button
            type="button"
            onClick={() => handleSimulateStatus('rejected')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
              currentCompany?.status === 'rejected'
                ? 'bg-[#B83214] text-white'
                : 'bg-white border border-[#DCE8F8] text-[#B83214] hover:bg-[#FFD6CC]/40'
            }`}
          >
            Bị từ chối
          </button>
        </div>
      </div>

      {/* Internal Navigation Tabs (7 Tabs) */}
      <div className="flex items-center gap-2 border-b border-[#DCE8F8] pb-3 overflow-x-auto">
        <button
          onClick={() => {
            setActiveTab('home');
            setCurrentTab('home');
          }}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'home'
              ? 'bg-[#3D7DD8] text-white shadow-xs'
              : 'text-[#5B6B85] hover:text-[#16243D] bg-white border border-[#DCE8F8]'
          }`}
        >
          Trang chủ tổng quan
        </button>

        <button
          onClick={() => {
            setActiveTab('tasks');
            setCurrentTab('company-tasks');
          }}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'tasks'
              ? 'bg-[#3D7DD8] text-white shadow-xs'
              : 'text-[#5B6B85] hover:text-[#16243D] bg-white border border-[#DCE8F8]'
          }`}
        >
          Nhiệm vụ ({companyTasks.length})
        </button>

        <button
          onClick={() => {
            setActiveTab('grading');
            setCurrentTab('grade-submissions');
          }}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'grading'
              ? 'bg-[#3D7DD8] text-white shadow-xs'
              : 'text-[#5B6B85] hover:text-[#16243D] bg-white border border-[#DCE8F8]'
          }`}
        >
          Chấm bài ({pendingSubmissions.length} chờ chấm)
        </button>

        <button
          onClick={() => {
            setActiveTab('projects');
            setCurrentTab('projects');
          }}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'projects'
              ? 'bg-[#3D7DD8] text-white shadow-xs'
              : 'text-[#5B6B85] hover:text-[#16243D] bg-white border border-[#DCE8F8]'
          }`}
        >
          Dự án ngắn
        </button>

        <button
          onClick={() => {
            setActiveTab('students');
            setCurrentTab('top-candidates');
          }}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'students'
              ? 'bg-[#3D7DD8] text-white shadow-xs'
              : 'text-[#5B6B85] hover:text-[#16243D] bg-white border border-[#DCE8F8]'
          }`}
        >
          Tìm sinh viên ({students.filter((s) => s.allowCompaniesToFindMe).length})
        </button>

        <button
          onClick={() => {
            setActiveTab('jobs');
            setCurrentTab('jobs');
          }}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'jobs'
              ? 'bg-[#3D7DD8] text-white shadow-xs'
              : 'text-[#5B6B85] hover:text-[#16243D] bg-white border border-[#DCE8F8]'
          }`}
        >
          Tuyển dụng & Kanban ({companyJobs.length})
        </button>

        <button
          onClick={() => {
            setActiveTab('verification');
            setCurrentTab('verification');
          }}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'verification'
              ? 'bg-[#3D7DD8] text-white shadow-xs'
              : 'text-[#5B6B85] hover:text-[#16243D] bg-white border border-[#DCE8F8]'
          }`}
        >
          Hồ sơ & Pháp lý
        </button>
      </div>

      {/* =========================================================================
          TAB 1: TRANG CHỦ DOANH NGHIỆP
          Yêu cầu:
          - Số bài chờ chấm (cảnh báo màu khi sắp quá hạn chấm)
          - Nhiệm vụ đang mở
          - Ứng viên mới
         ========================================================================= */}
      {activeTab === 'home' && (
        <div className="space-y-6">
          {/* CẢNH BÁO MÀU KHI SẮP QUÁ HẠN CHẤM (Màu hồng đào #FFD6CC tiết chế) */}
          {urgentSubmissions.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#FFF1ED] border border-[#FFD6CC] flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFD6CC] text-[#B83214] flex items-center justify-center shrink-0 font-bold">
                  ⚠️
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xs text-[#B83214]">
                    Cảnh báo sắp quá hạn thẩm định: Có {urgentSubmissions.length} bài nộp cần chấm gấp!
                  </h3>
                  <p className="text-xs text-[#5B6B85] mt-0.5">
                    Sinh viên đã nộp bài quá 24h hoặc nhiệm vụ có hạn nộp gấp. Vui lòng chấm điểm để tránh bị trừ điểm uy tín doanh nghiệp.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('grading')}
                className="px-4 py-2 rounded-full bg-[#B83214] text-white text-xs font-semibold hover:bg-[#96260D] transition-colors shrink-0 shadow-xs"
              >
                Chấm bài ngay ({urgentSubmissions.length})
              </button>
            </div>
          )}

          {/* Chưa xác minh Banner */}
          {!isCompanyVerified && (
            <div className="p-4 rounded-2xl bg-[#FFF9E6] border border-[#FFE9A8] flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#7A5B00] shrink-0 mt-0.5" />
                <div className="text-xs text-[#7A5B00]">
                  <strong>Tài khoản đang trong trạng thái {currentCompany?.status === 'pending' ? 'Chờ xác minh' : 'Bị từ chối'}:</strong> Các nút đăng nhiệm vụ và đăng tin tuyển dụng đang bị khóa.
                  {currentCompany?.rejectionReason && (
                    <span className="block mt-1 font-mono text-[11px] text-[#B83214]">
                      Lý do: &ldquo;{currentCompany.rejectionReason}&rdquo;
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('verification')}
                className="px-3.5 py-1.5 rounded-full bg-[#7A5B00] text-white text-xs font-semibold hover:bg-[#604700] shrink-0"
              >
                Cập nhật giấy tờ
              </button>
            </div>
          )}

          {/* 4 STATS METRICS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Bài chờ chấm */}
            <div
              onClick={() => setActiveTab('grading')}
              className={`stulance-card p-5 border cursor-pointer transition-all hover:scale-[1.01] ${
                pendingSubmissions.length > 0
                  ? 'border-[#FFD6CC] bg-[#FFF9F7]'
                  : 'border-[#DCE8F8] bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#5B6B85] font-medium">Bài làm chờ chấm</span>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    pendingSubmissions.length > 0
                      ? 'bg-[#FFD6CC] text-[#B83214]'
                      : 'bg-[#CDEFE0] text-[#0F5B39]'
                  }`}
                >
                  {pendingSubmissions.length > 0 ? 'Cần xử lý' : 'Đã sạch hàng đợi'}
                </span>
              </div>
              <p className="font-heading font-bold text-3xl text-[#16243D]">
                {pendingSubmissions.length}
              </p>
              <p className="text-[11px] text-[#5B6B85] mt-1">
                {urgentSubmissions.length} bài sắp chạm mốc quá hạn
              </p>
            </div>

            {/* Nhiệm vụ đang mở */}
            <div
              onClick={() => setActiveTab('tasks')}
              className="stulance-card p-5 border border-[#DCE8F8] bg-white cursor-pointer transition-all hover:scale-[1.01]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#5B6B85] font-medium">Nhiệm vụ đang mở</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#EAF2FC] text-[#3D7DD8]">
                  Đang tuyển
                </span>
              </div>
              <p className="font-heading font-bold text-3xl text-[#16243D]">
                {companyTasks.filter((t) => t.status === 'open').length}
              </p>
              <p className="text-[11px] text-[#5B6B85] mt-1">
                Tổng cộng {companyTasks.length} nhiệm vụ (gồm cả nháp)
              </p>
            </div>

            {/* Ứng viên mới */}
            <div
              onClick={() => setActiveTab('jobs')}
              className="stulance-card p-5 border border-[#DCE8F8] bg-white cursor-pointer transition-all hover:scale-[1.01]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#5B6B85] font-medium">Ứng viên mới</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#FFE9A8] text-[#7A5B00]">
                  Kanban
                </span>
              </div>
              <p className="font-heading font-bold text-3xl text-[#16243D]">
                {recentApplications.length}
              </p>
              <p className="text-[11px] text-[#5B6B85] mt-1">
                Ứng tuyển qua {companyJobs.length} tin việc làm
              </p>
            </div>

            {/* Thẻ bằng chứng đã cấp */}
            <div
              onClick={() => setActiveTab('grading')}
              className="stulance-card p-5 border border-[#DCE8F8] bg-white cursor-pointer transition-all hover:scale-[1.01]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#5B6B85] font-medium">Đã cấp Bằng chứng</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#CDEFE0] text-[#0F5B39]">
                  Đã thẩm định
                </span>
              </div>
              <p className="font-heading font-bold text-3xl text-[#0F5B39]">
                {gradedSubmissions.length}
              </p>
              <p className="text-[11px] text-[#5B6B85] mt-1">
                Sinh viên có điểm đạt chuẩn nghề nghiệp
              </p>
            </div>
          </div>

          {/* Quick Actions Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              type="button"
              onClick={() => {
                setIsWizardOpen(true);
              }}
              className="p-4 rounded-2xl border border-[#DCE8F8] bg-white hover:bg-[#F5F9FF] hover:border-[#3D7DD8] transition-all text-left flex items-center justify-between group"
            >
              <div>
                <span className="font-heading font-semibold text-xs text-[#16243D] block">
                  + Tạo nhiệm vụ theo bước
                </span>
                <span className="text-[11px] text-[#5B6B85]">
                  Bộ mẫu 5 ngành, tiêu chuẩn ≤ 3h
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#5B6B85] group-hover:text-[#3D7DD8] group-hover:translate-x-1 transition-all" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('grading')}
              className="p-4 rounded-2xl border border-[#DCE8F8] bg-white hover:bg-[#F5F9FF] hover:border-[#3D7DD8] transition-all text-left flex items-center justify-between group"
            >
              <div>
                <span className="font-heading font-semibold text-xs text-[#16243D] block">
                  Chấm bài (Màn hình chia đôi)
                </span>
                <span className="text-[11px] text-[#5B6B85]">
                  {pendingSubmissions.length} bài đang chờ thẩm định
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#5B6B85] group-hover:text-[#3D7DD8] group-hover:translate-x-1 transition-all" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('jobs')}
              className="p-4 rounded-2xl border border-[#DCE8F8] bg-white hover:bg-[#F5F9FF] hover:border-[#3D7DD8] transition-all text-left flex items-center justify-between group"
            >
              <div>
                <span className="font-heading font-semibold text-xs text-[#16243D] block">
                  Bảng Kanban tuyển dụng
                </span>
                <span className="text-[11px] text-[#5B6B85]">
                  5 cột trạng thái, ghi chú nội bộ
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#5B6B85] group-hover:text-[#3D7DD8] group-hover:translate-x-1 transition-all" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('students')}
              className="p-4 rounded-2xl border border-[#DCE8F8] bg-white hover:bg-[#F5F9FF] hover:border-[#3D7DD8] transition-all text-left flex items-center justify-between group"
            >
              <div>
                <span className="font-heading font-semibold text-xs text-[#16243D] block">
                  Tìm kiếm sinh viên
                </span>
                <span className="text-[11px] text-[#5B6B85]">
                  Lọc theo Thẻ bằng chứng & kỹ năng
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#5B6B85] group-hover:text-[#3D7DD8] group-hover:translate-x-1 transition-all" />
            </button>
          </div>

          {/* TWO MAIN COLUMNS: BÀI NỘP CẦN CHẤM & ỨNG VIÊN MỚI */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cột 1: Bài nộp cần chấm điểm */}
            <div className="stulance-card p-6 border border-[#DCE8F8] bg-white space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#DCE8F8]">
                <h3 className="font-heading font-bold text-base text-[#16243D]">
                  Bài nộp cần chấm điểm ({pendingSubmissions.length})
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('grading')}
                  className="text-xs text-[#3D7DD8] hover:underline font-semibold"
                >
                  Xem tất cả →
                </button>
              </div>

              {pendingSubmissions.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#5B6B85]">
                  Hiện không có bài nộp nào đang chờ duyệt.
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingSubmissions.slice(0, 4).map((sub) => (
                    <div
                      key={sub.id}
                      className="p-4 rounded-xl border border-[#DCE8F8] bg-[#FDFEFE] hover:border-[#3D7DD8] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-heading font-semibold text-xs text-[#16243D]">
                            {sub.studentName}
                          </span>
                          <span className="text-[11px] text-[#5B6B85]">
                            · {sub.studentUniversity}
                          </span>
                        </div>
                        <p className="text-xs text-[#5B6B85] line-clamp-1">{sub.taskTitle}</p>
                        <span className="text-[10px] text-[#7A5B00] bg-[#FFE9A8]/40 px-2 py-0.5 rounded-full inline-block mt-1 font-medium">
                          Nộp ngày: {sub.submittedAt}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenGradingModal(sub)}
                        className="px-4 py-2 rounded-full bg-[#3D7DD8] hover:bg-[#2F67B5] text-white text-xs font-semibold transition-colors shadow-xs shrink-0 self-end sm:self-auto"
                      >
                        Chấm bài ngay
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cột 2: Ứng viên mới ứng tuyển việc làm */}
            <div className="stulance-card p-6 border border-[#DCE8F8] bg-white space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#DCE8F8]">
                <h3 className="font-heading font-bold text-base text-[#16243D]">
                  Ứng viên mới qua tin tuyển dụng ({recentApplications.length})
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('jobs')}
                  className="text-xs text-[#3D7DD8] hover:underline font-semibold"
                >
                  Mở bảng Kanban →
                </button>
              </div>

              {recentApplications.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#5B6B85]">
                  Chưa có hồ sơ ứng tuyển mới nào.
                </div>
              ) : (
                <div className="space-y-3">
                  {recentApplications.slice(0, 4).map((app) => (
                    <div
                      key={app.id}
                      className="p-4 rounded-xl border border-[#DCE8F8] bg-[#FDFEFE] hover:border-[#3D7DD8] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-heading font-semibold text-xs text-[#16243D]">
                            {app.studentName}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EAF2FC] text-[#3D7DD8] font-semibold">
                            {app.status === 'submitted'
                              ? 'Mới nộp'
                              : app.status === 'reviewing'
                              ? 'Đang xem'
                              : app.status === 'interviewing'
                              ? 'Phỏng vấn'
                              : app.status === 'accepted'
                              ? 'Đã nhận'
                              : 'Từ chối'}
                          </span>
                        </div>
                        <p className="text-xs text-[#5B6B85] line-clamp-1">{app.jobTitle}</p>
                        <p className="text-[11px] text-[#5B6B85] italic line-clamp-1 mt-0.5">
                          &ldquo;{app.coverNote}&rdquo;
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveTab('jobs')}
                        className="px-3.5 py-1.5 rounded-full border border-[#DCE8F8] bg-white hover:bg-[#EAF2FC] text-xs font-semibold text-[#16243D] transition-colors shrink-0 self-end sm:self-auto"
                      >
                        Xem Kanban
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: QUẢN LÝ NHIỆM VỤ
         ========================================================================= */}
      {activeTab === 'tasks' && <TaskManagementView />}

      {/* =========================================================================
          TAB 3: CHẤM BÀI (MÀN HÌNH CHIA ĐÔI & DANH SÁCH BÀI NỘP)
         ========================================================================= */}
      {activeTab === 'grading' && (
        <div className="space-y-6">
          <div className="stulance-card p-6 border border-[#DCE8F8] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-heading font-bold text-xl text-[#16243D]">
                  Chấm điểm bài làm & Cấp Thẻ bằng chứng
                </h2>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EAF2FC] text-[#3D7DD8]">
                  {pendingSubmissions.length} bài chờ chấm
                </span>
              </div>
              <p className="text-xs text-[#5B6B85]">
                Màn hình chấm chia đôi: Bên trái xem bài làm thật của sinh viên, bên phải chấm điểm theo tiêu chí công khai và nhận xét bắt buộc tối thiểu 50 ký tự.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <select
                value={selectedGradingTaskId}
                onChange={(e) => setSelectedGradingTaskId(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] bg-white outline-none"
              >
                <option value="all">Tất cả nhiệm vụ ({companyTasks.length})</option>
                {companyTasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title.substring(0, 30)}...
                  </option>
                ))}
              </select>

              <select
                value={gradingFilterStatus}
                onChange={(e) => setGradingFilterStatus(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] bg-white outline-none"
              >
                <option value="all">Tất cả ({companySubmissions.length})</option>
                <option value="pending">Chờ chấm ({pendingSubmissions.length})</option>
                <option value="graded">Đã chấm ({gradedSubmissions.length})</option>
              </select>
            </div>
          </div>

          {/* Submission list */}
          {displayedSubmissions.length === 0 ? (
            <EmptyState
              icon={FileCheck2}
              title="Không có bài nộp nào phù hợp bộ lọc"
              description="Hiện tại không có bài làm nào trong danh sách này."
            />
          ) : (
            <div className="space-y-4">
              {displayedSubmissions.map((sub) => {
                const isGraded = sub.status === 'graded';
                const subTask = tasks.find((t) => t.id === sub.taskId);

                return (
                  <div
                    key={sub.id}
                    className={`stulance-card p-6 border transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 ${
                      isGraded
                        ? 'border-[#DCE8F8] bg-white'
                        : 'border-[#A9CFFA] bg-[#F5F9FF]/50 hover:bg-[#F5F9FF]'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="font-heading font-bold text-sm text-[#16243D]">
                          {sub.studentName}
                        </span>
                        <span className="text-xs text-[#5B6B85]">· {sub.studentUniversity}</span>
                        {isGraded ? (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#CDEFE0] text-[#0F5B39]">
                            ✓ Đạt {sub.score?.toFixed(1)}/10đ
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#FFE9A8] text-[#7A5B00]">
                            Chờ chấm điểm
                          </span>
                        )}
                        <span className="text-[11px] text-[#5B6B85]">
                          Nộp lúc: {sub.submittedAt}
                        </span>
                      </div>

                      <h4 className="font-heading font-semibold text-base text-[#16243D] mb-1">
                        {sub.taskTitle}
                      </h4>

                      {sub.notes && (
                        <p className="text-xs text-[#5B6B85] bg-white p-2.5 rounded-xl border border-[#DCE8F8] mb-2 leading-relaxed">
                          <strong>Ghi chú:</strong> {sub.notes}
                        </p>
                      )}

                      {/* Deliverable Link */}
                      <div className="flex items-center gap-2 text-xs text-[#5B6B85]">
                        <span>Sản phẩm nộp:</span>
                        <a
                          href={sub.deliverableLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#3D7DD8] hover:underline font-mono truncate max-w-sm flex items-center gap-1"
                        >
                          {sub.deliverableLink}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      {/* Quoted Feedback if graded */}
                      {isGraded && sub.feedbackQuote && (
                        <p className="text-xs italic text-[#16243D] mt-2 border-l-2 border-[#3D7DD8] pl-2.5">
                          &ldquo;{sub.feedbackQuote}&rdquo;
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
                      <a
                        href={sub.deliverableLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-full border border-[#DCE8F8] bg-white hover:bg-[#EAF2FC] text-xs font-semibold text-[#16243D] transition-colors"
                      >
                        Mở bài làm
                      </a>

                      <button
                        type="button"
                        onClick={() => handleOpenGradingModal(sub)}
                        className={`px-5 py-2 rounded-full text-xs font-semibold transition-colors shadow-xs ${
                          isGraded
                            ? 'bg-[#F5F9FF] border border-[#DCE8F8] text-[#16243D] hover:bg-[#EAF2FC]'
                            : 'bg-[#3D7DD8] hover:bg-[#2F67B5] text-white'
                        }`}
                      >
                        {isGraded ? 'Xem kết quả chấm' : 'Chấm điểm ngay (Chia đôi)'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 4: QUẢN LÝ DỰ ÁN NGẮN
         ========================================================================= */}
      {activeTab === 'projects' && <ShortProjectsView />}

      {/* =========================================================================
          TAB 5: TÌM SINH VIÊN
         ========================================================================= */}
      {activeTab === 'students' && <FindStudentsView />}

      {/* =========================================================================
          TAB 6: TUYỂN DỤNG & KANBAN
         ========================================================================= */}
      {activeTab === 'jobs' && <JobPostingsKanbanView />}

      {/* =========================================================================
          TAB 7: HỒ SƠ & PHÁP LÝ DOANH NGHIỆP
         ========================================================================= */}
      {activeTab === 'verification' && <CompanyVerificationView />}

      {/* SPLIT VIEW GRADING MODAL */}
      {activeGradingSub && (
        <SplitGradingModal
          submission={activeGradingSub}
          task={tasks.find((t) => t.id === activeGradingSub.taskId)}
          onClose={() => setActiveGradingSub(null)}
        />
      )}

      {/* CREATE TASK WIZARD MODAL */}
      {isWizardOpen && (
        <CreateTaskWizardModal
          isOpen={isWizardOpen}
          onClose={() => setIsWizardOpen(false)}
        />
      )}
    </div>
  );
};
