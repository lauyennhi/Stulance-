import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  Clock,
  Coins,
  Edit3,
  ExternalLink,
  Eye,
  FileCheck2,
  Lock,
  MapPin,
  MessageSquare,
  MoveRight,
  Plus,
  Send,
  StopCircle,
  Trash2,
  User,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  ApplicationStatus,
  JobApplication,
  JobPosting,
  StudentProfile,
  TaskCategory,
} from '../../types';
import { EmptyState } from '../common/EmptyState';
import { ProofCard } from '../common/ProofCard';
import { StudentPublicProfileModal } from './StudentPublicProfileModal';

export const JobPostingsKanbanView: React.FC = () => {
  const {
    currentCompany,
    jobPostings,
    jobApplications,
    students,
    submissions,
    createJobPosting,
    updateJobPosting,
    closeJobPosting,
    deleteJobPosting,
    updateApplicationDetails,
    notify,
  } = useApp();

  const isCompanyVerified = currentCompany?.status === 'verified';

  // Company job postings
  const companyJobs = jobPostings.filter(
    (j) => j.companyId === (currentCompany?.id || 'comp-1')
  );

  // Selected job for Kanban view (or 'all')
  const [selectedJobId, setSelectedJobId] = useState<string>(
    companyJobs[0]?.id || 'all'
  );

  // Job creation/edit modal state
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);

  // Job form fields
  const [jobTitle, setJobTitle] = useState('');
  const [jobType, setJobType] = useState<'Thực tập sinh' | 'Bán thời gian' | 'Chính thức khởi đầu'>(
    'Thực tập sinh'
  );
  const [jobCategory, setJobCategory] = useState<TaskCategory>('CNTT');
  const [jobDescription, setJobDescription] = useState('');
  const [jobReqs, setJobReqs] = useState<string[]>([
    'Có tối thiểu 1 Thẻ bằng chứng hoàn thành nhiệm vụ thật trên Stulance.',
    'Nắm chắc kiến thức chuyên ngành và tinh thần học hỏi.',
  ]);
  const [newJobReq, setNewJobReq] = useState('');
  const [jobBenefits, setJobBenefits] = useState<string[]>([
    'Phụ cấp thực tập từ 4.000.000đ - 7.000.000đ/tháng.',
    'Được kèm cặp trực tiếp bởi Tech Lead / Senior Specialist.',
    'Cơ hội lên nhân viên chính thức sau 3 tháng.',
  ]);
  const [newJobBenefit, setNewJobBenefit] = useState('');
  const [jobLocation, setJobLocation] = useState('Hà Nội');
  const [jobSalaryText, setJobSalaryText] = useState('5.000.000 - 8.000.000 đ/tháng');
  const [jobHeadcount, setJobHeadcount] = useState<number>(2);
  const [jobDeadline, setJobDeadline] = useState('2026-10-31');
  const [jobMinScore, setJobMinScore] = useState<number>(8.5);

  // Candidate detail drawer/modal state
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [internalNoteInput, setInternalNoteInput] = useState('');
  const [candidateFeedbackInput, setCandidateFeedbackInput] = useState('');

  // View public profile of applicant
  const [viewingProfileStudent, setViewingProfileStudent] = useState<StudentProfile | null>(null);

  // Active view: 'kanban' or 'manage_jobs'
  const [subView, setSubView] = useState<'kanban' | 'manage_jobs'>('kanban');

  // Filter applications by selectedJobId
  const displayedApplications = jobApplications.filter((app) => {
    if (selectedJobId === 'all') {
      return companyJobs.some((j) => j.id === app.jobId);
    }
    return app.jobId === selectedJobId;
  });

  const KANBAN_COLUMNS: { id: ApplicationStatus; label: string; color: string; badgeBg: string }[] = [
    { id: 'submitted', label: '1. Đã nộp', color: '#16243D', badgeBg: '#EAF2FC' },
    { id: 'reviewing', label: '2. Đang xem xét', color: '#7A5B00', badgeBg: '#FFE9A8' },
    { id: 'interviewing', label: '3. Mời phỏng vấn', color: '#3D7DD8', badgeBg: '#EAF2FC' },
    { id: 'accepted', label: '4. Nhận tuyển', color: '#0F5B39', badgeBg: '#CDEFE0' },
    { id: 'rejected', label: '5. Từ chối', color: '#B83214', badgeBg: '#FFD6CC' },
  ];

  const handleOpenCreateJob = () => {
    if (!isCompanyVerified) {
      notify(
        'Yêu cầu xác minh doanh nghiệp',
        'Tài khoản của bạn đang ở trạng thái Chờ duyệt hoặc Bị từ chối. Vui lòng hoàn tất giấy tờ để được mở khóa đăng tin tuyển dụng.',
        'error'
      );
      return;
    }
    setEditingJob(null);
    setJobTitle('');
    setJobType('Thực tập sinh');
    setJobCategory('CNTT');
    setJobDescription(
      'Chúng tôi đang tìm kiếm nhân sự trẻ năng động tham gia phát triển sản phẩm. Tuyển dụng dựa trên kết quả Thẻ bằng chứng thực tế.'
    );
    setJobReqs([
      'Có tối thiểu 1 Thẻ bằng chứng bài làm đạt từ 8.5/10 điểm trên Stulance.',
      'Kỹ năng tự nghiên cứu và giải quyết vấn đề độc lập.',
    ]);
    setJobBenefits([
      'Hỗ trợ thù lao cạnh tranh theo năng lực thực chiến.',
      'Môi trường làm việc cởi mở, không quan trọng bằng cấp lý thuyết.',
    ]);
    setJobLocation('Hà Nội');
    setJobSalaryText('6.000.000 - 9.000.000 đ/tháng');
    setJobHeadcount(2);
    setJobDeadline('2026-11-15');
    setJobMinScore(8.5);
    setIsJobModalOpen(true);
  };

  const handleOpenEditJob = (job: JobPosting) => {
    setEditingJob(job);
    setJobTitle(job.title);
    setJobType(job.type);
    setJobCategory(job.targetCategory);
    setJobDescription(job.description);
    setJobReqs(job.requirements);
    setJobBenefits(job.benefits);
    setJobLocation(job.location);
    setJobSalaryText(job.salaryText);
    setJobHeadcount(job.headcount || 1);
    setJobDeadline(job.deadline || '2026-10-31');
    setJobMinScore(job.requiredProofScore);
    setIsJobModalOpen(true);
  };

  const handleSaveJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim()) {
      notify('Thiếu thông tin', 'Vui lòng nhập vị trí tuyển dụng.', 'error');
      return;
    }

    const jobData: Partial<JobPosting> = {
      title: jobTitle.trim(),
      type: jobType,
      targetCategory: jobCategory,
      description: jobDescription.trim(),
      requirements: jobReqs,
      benefits: jobBenefits,
      location: jobLocation.trim(),
      salaryText: jobSalaryText.trim(),
      headcount: jobHeadcount,
      deadline: jobDeadline,
      requiredProofScore: jobMinScore,
    };

    if (editingJob) {
      updateJobPosting(editingJob.id, jobData);
    } else {
      createJobPosting(jobData);
    }
    setIsJobModalOpen(false);
  };

  const handleOpenAppDetails = (app: JobApplication) => {
    setSelectedApplication(app);
    setInternalNoteInput(app.internalNote || '');
    setCandidateFeedbackInput(app.candidateFeedback || '');
  };

  const handleSaveAppDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApplication) return;
    updateApplicationDetails(selectedApplication.id, {
      internalNote: internalNoteInput.trim(),
      candidateFeedback: candidateFeedbackInput.trim(),
    });
    setSelectedApplication(null);
  };

  const handleMoveColumn = (appId: string, currentStatus: ApplicationStatus, direction: 'prev' | 'next') => {
    const statuses: ApplicationStatus[] = ['submitted', 'reviewing', 'interviewing', 'accepted', 'rejected'];
    const currentIndex = statuses.indexOf(currentStatus);
    const targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (targetIndex >= 0 && targetIndex < statuses.length) {
      updateApplicationDetails(appId, { status: statuses[targetIndex] });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="stulance-card p-6 border border-[#DCE8F8] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-heading font-bold text-xl text-[#16243D]">
              Tin tuyển dụng & Bảng Kanban ứng viên
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EAF2FC] text-[#3D7DD8]">
              {companyJobs.length} tin đăng
            </span>
          </div>
          <p className="text-xs text-[#5B6B85]">
            Theo dõi quy trình tuyển dụng ứng viên qua 5 cột Kanban, lưu ghi chú nội bộ và gửi phản hồi kết quả tới sinh viên.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#F5F9FF] p-1 rounded-full border border-[#DCE8F8]">
            <button
              type="button"
              onClick={() => setSubView('kanban')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                subView === 'kanban'
                  ? 'bg-[#3D7DD8] text-white shadow-xs'
                  : 'text-[#5B6B85] hover:text-[#16243D]'
              }`}
            >
              Bảng Kanban
            </button>
            <button
              type="button"
              onClick={() => setSubView('manage_jobs')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                subView === 'manage_jobs'
                  ? 'bg-[#3D7DD8] text-white shadow-xs'
                  : 'text-[#5B6B85] hover:text-[#16243D]'
              }`}
            >
              Quản lý tin ({companyJobs.length})
            </button>
          </div>

          <button
            type="button"
            disabled={!isCompanyVerified}
            onClick={handleOpenCreateJob}
            className={`px-4 py-2 rounded-full text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 ${
              isCompanyVerified
                ? 'bg-[#3D7DD8] hover:bg-[#2F67B5] text-white'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Plus className="w-4 h-4" />
            Đăng tin tuyển dụng
          </button>
        </div>
      </div>

      {/* Verification Notice if not verified */}
      {!isCompanyVerified && (
        <div className="p-4 rounded-2xl bg-[#FFF9E6] border border-[#FFE9A8] flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#7A5B00] shrink-0 mt-0.5" />
          <div className="text-xs text-[#7A5B00]">
            <strong>Doanh nghiệp chưa xác minh:</strong> Nút đăng tin tuyển dụng đang bị khóa. Vui lòng nộp giấy tờ pháp lý tại tab &ldquo;Hồ sơ & Pháp lý&rdquo; để được mở khóa.
          </div>
        </div>
      )}

      {/* SUB-VIEW 1: KANBAN BOARD */}
      {subView === 'kanban' && (
        <div className="space-y-5">
          {/* Filter Job Selector Bar */}
          <div className="stulance-card p-4 border border-[#DCE8F8] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#16243D]">Chọn vị trí tuyển dụng:</span>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] bg-white outline-none font-medium"
              >
                <option value="all">Tất cả vị trí ({companyJobs.length} tin)</option>
                {companyJobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title} ({j.type})
                  </option>
                ))}
              </select>
            </div>

            <span className="text-xs text-[#5B6B85]">
              Tổng số ứng viên: <strong>{displayedApplications.length}</strong> hồ sơ
            </span>
          </div>

          {/* Kanban Columns (5 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
            {KANBAN_COLUMNS.map((col) => {
              const colApps = displayedApplications.filter((a) => a.status === col.id);

              return (
                <div
                  key={col.id}
                  className="rounded-2xl border border-[#DCE8F8] bg-[#F5F9FF]/80 p-3.5 flex flex-col min-h-[500px]"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#DCE8F8]">
                    <div className="flex items-center gap-1.5">
                      <span className="font-heading font-bold text-xs text-[#16243D]">
                        {col.label}
                      </span>
                    </div>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: col.badgeBg, color: col.color }}
                    >
                      {colApps.length}
                    </span>
                  </div>

                  {/* Cards inside column */}
                  <div className="space-y-3 flex-1 overflow-y-auto">
                    {colApps.length === 0 ? (
                      <div className="h-28 rounded-xl border border-dashed border-[#DCE8F8] flex items-center justify-center text-[11px] text-[#5B6B85] text-center p-2">
                        Chưa có ứng viên
                      </div>
                    ) : (
                      colApps.map((app) => {
                        const studentObj = students.find((s) => s.id === app.studentId);

                        return (
                          <div
                            key={app.id}
                            className="p-3.5 rounded-xl border border-[#DCE8F8] bg-white shadow-2xs hover:border-[#3D7DD8] transition-all space-y-2.5 cursor-pointer"
                            onClick={() => handleOpenAppDetails(app)}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="font-heading font-semibold text-xs text-[#16243D]">
                                  {app.studentName}
                                </h4>
                                <p className="text-[10px] text-[#5B6B85] truncate max-w-[150px]">
                                  {studentObj?.university}
                                </p>
                              </div>

                              {studentObj && (
                                <span className="font-heading font-bold text-[11px] text-[#3D7DD8] px-1.5 py-0.5 rounded-md bg-[#EAF2FC]">
                                  {studentObj.averageScore.toFixed(1)}đ
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] text-[#5B6B85] line-clamp-2 italic bg-[#F5F9FF] p-2 rounded-lg">
                              &ldquo;{app.coverNote}&rdquo;
                            </p>

                            <div className="flex items-center justify-between text-[10px] text-[#5B6B85]">
                              <span>
                                {app.attachedProofIds.length} Thẻ bằng chứng
                              </span>
                              <span>{app.appliedAt}</span>
                            </div>

                            {/* Internal Note indicator */}
                            {app.internalNote && (
                              <div className="text-[10px] text-[#7A5B00] bg-[#FFE9A8]/40 px-2 py-1 rounded-md flex items-center gap-1">
                                <Lock className="w-2.5 h-2.5" />
                                <span className="truncate">Ghi chú: {app.internalNote}</span>
                              </div>
                            )}

                            {/* Move buttons */}
                            <div
                              className="pt-2 border-t border-[#DCE8F8] flex items-center justify-between"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                disabled={col.id === 'submitted'}
                                onClick={() => handleMoveColumn(app.id, col.id, 'prev')}
                                className="p-1 text-[#5B6B85] hover:text-[#16243D] disabled:text-gray-300 disabled:cursor-not-allowed"
                                title="Chuyển cột trước"
                              >
                                <ArrowLeft className="w-3.5 h-3.5" />
                              </button>

                              <span className="text-[10px] text-[#3D7DD8] font-medium">
                                Chi tiết
                              </span>

                              <button
                                type="button"
                                disabled={col.id === 'rejected'}
                                onClick={() => handleMoveColumn(app.id, col.id, 'next')}
                                className="p-1 text-[#5B6B85] hover:text-[#16243D] disabled:text-gray-300 disabled:cursor-not-allowed"
                                title="Chuyển cột tiếp"
                              >
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: MANAGE JOB POSTINGS LIST */}
      {subView === 'manage_jobs' && (
        <div className="space-y-4">
          {companyJobs.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="Chưa có tin tuyển dụng nào"
              description="Đăng tin tuyển dụng thực tập sinh hoặc việc làm bán thời gian để thu hút sinh viên có bài làm xuất sắc."
              actionText="Đăng tin ngay"
              onAction={handleOpenCreateJob}
            />
          ) : (
            companyJobs.map((job) => {
              const appsCount = jobApplications.filter((a) => a.jobId === job.id).length;

              return (
                <div
                  key={job.id}
                  className="stulance-card p-6 border border-[#DCE8F8] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EAF2FC] text-[#3D7DD8]">
                        {job.type}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FFE9A8] text-[#7A5B00]">
                        Yêu cầu điểm bài làm: ≥ {job.requiredProofScore}/10
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          job.status === 'open'
                            ? 'bg-[#CDEFE0] text-[#0F5B39]'
                            : 'bg-gray-100 text-[#5B6B85]'
                        }`}
                      >
                        {job.status === 'open' ? 'Đang mở tuyển' : 'Đã đóng'}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-base text-[#16243D] mb-1">
                      {job.title}
                    </h3>
                    <p className="text-xs text-[#5B6B85] line-clamp-2 mb-2">
                      {job.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-[#5B6B85] flex-wrap">
                      <span>Địa điểm: <strong>{job.location}</strong></span>
                      <span>Mức lương: <strong>{job.salaryText}</strong></span>
                      <span>Hạn nộp: <strong>{job.deadline}</strong></span>
                      <span>Đơn ứng tuyển: <strong>{appsCount} hồ sơ</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto flex-wrap">
                    {/* Chuyển xem Kanban của tin này */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedJobId(job.id);
                        setSubView('kanban');
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-[#F5F9FF] border border-[#DCE8F8] text-xs font-semibold text-[#3D7DD8] hover:bg-[#EAF2FC]"
                    >
                      Xem Kanban ({appsCount})
                    </button>

                    {/* Sửa tin */}
                    <button
                      type="button"
                      onClick={() => handleOpenEditJob(job)}
                      className="p-2 rounded-full border border-[#DCE8F8] text-[#5B6B85] hover:text-[#16243D] hover:bg-[#F5F9FF]"
                      title="Sửa tin tuyển dụng"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Đóng tin */}
                    {job.status === 'open' && (
                      <button
                        type="button"
                        onClick={() => closeJobPosting(job.id)}
                        className="px-3 py-1.5 rounded-full border border-[#DCE8F8] text-xs font-medium text-[#B83214] hover:bg-[#FFD6CC]/20"
                      >
                        Đóng tin
                      </button>
                    )}

                    {/* Xóa tin: Rule: "Xóa khi chưa có đơn" */}
                    <button
                      type="button"
                      onClick={() => deleteJobPosting(job.id)}
                      className={`p-2 rounded-full transition-colors ${
                        appsCount > 0
                          ? 'text-gray-300 hover:text-gray-400 cursor-not-allowed'
                          : 'text-[#B83214] hover:bg-[#FFD6CC]/30'
                      }`}
                      title={appsCount > 0 ? 'Đã có đơn ứng tuyển, không thể xóa' : 'Xóa tin này'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* APPLICANT DETAIL DRAWER / MODAL */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#16243D]/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className="relative w-full max-w-2xl bg-white border border-[#DCE8F8] rounded-[24px] shadow-2xl p-6 sm:p-8 my-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-[#DCE8F8]">
              <div>
                <span className="text-xs font-semibold text-[#3D7DD8] uppercase tracking-wider">
                  Chi tiết hồ sơ ứng tuyển
                </span>
                <h3 className="font-heading font-bold text-lg text-[#16243D] mt-0.5">
                  {selectedApplication.studentName}
                </h3>
                <p className="text-xs text-[#5B6B85]">
                  Ứng tuyển vị trí: <strong>{selectedApplication.jobTitle}</strong> · Ngày nộp: {selectedApplication.appliedAt}
                </p>
              </div>

              <button
                onClick={() => setSelectedApplication(null)}
                className="p-1.5 text-[#5B6B85] hover:text-[#16243D] rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAppDetails} className="space-y-5">
              {/* Cover note */}
              <div>
                <label className="block text-xs font-semibold text-[#16243D] mb-1">
                  Thư ngỏ / Lời giới thiệu của ứng viên:
                </label>
                <div className="p-3.5 rounded-xl bg-[#F5F9FF] border border-[#DCE8F8] text-xs text-[#16243D] leading-relaxed">
                  {selectedApplication.coverNote || 'Không có ghi chú thêm.'}
                </div>
              </div>

              {/* Status Changer */}
              <div>
                <label className="block text-xs font-semibold text-[#16243D] mb-1.5">
                  Trạng thái xử lý trên Kanban:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {KANBAN_COLUMNS.map((col) => (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() =>
                        updateApplicationDetails(selectedApplication.id, { status: col.id })
                      }
                      className={`p-2 rounded-xl border text-xs font-medium transition-all ${
                        selectedApplication.status === col.id
                          ? 'border-[#3D7DD8] bg-[#3D7DD8] text-white font-semibold'
                          : 'border-[#DCE8F8] bg-white text-[#16243D] hover:bg-[#F5F9FF]'
                      }`}
                    >
                      {col.label.split('. ')[1]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Internal Note (Chỉ nội bộ doanh nghiệp thấy) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-[#16243D]">
                    Ghi chú nội bộ doanh nghiệp (Internal Note)
                  </label>
                  <span className="text-[10px] text-[#7A5B00] flex items-center gap-1 font-medium">
                    <Lock className="w-3 h-3" /> Chỉ người tuyển dụng thấy
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={internalNoteInput}
                  onChange={(e) => setInternalNoteInput(e.target.value)}
                  placeholder="Ví dụ: Đã xem mã nguồn, phong cách code rất tốt. Dự kiến hẹn phỏng vấn thứ 3 tuần tới..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] outline-none focus:ring-2 focus:ring-[#3D7DD8]/30"
                />
              </div>

              {/* Candidate Feedback (Gửi phản hồi cho sinh viên) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-[#16243D]">
                    Phản hồi gửi trực tiếp cho sinh viên (Candidate Feedback)
                  </label>
                  <span className="text-[10px] text-[#0F5B39] flex items-center gap-1 font-medium">
                    <Send className="w-3 h-3" /> Sinh viên sẽ nhận được thông báo
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={candidateFeedbackInput}
                  onChange={(e) => setCandidateFeedbackInput(e.target.value)}
                  placeholder="Ví dụ: Chào bạn, doanh nghiệp rất ấn tượng với Thẻ bằng chứng của bạn và trân trọng mời bạn tham gia vòng phỏng vấn chuyên môn..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] outline-none focus:ring-2 focus:ring-[#3D7DD8]/30"
                />
              </div>

              {/* Attached Proof Cards */}
              {selectedApplication.attachedProofIds.length > 0 && (
                <div>
                  <h4 className="font-heading font-semibold text-xs text-[#16243D] mb-2">
                    Thẻ bằng chứng đính kèm ({selectedApplication.attachedProofIds.length}):
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedApplication.attachedProofIds.map((proofId) => {
                      const sub = submissions.find((s) => s.id === proofId);
                      if (!sub) return null;
                      return <ProofCard key={sub.id} submission={sub} />;
                    })}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="pt-3 border-t border-[#DCE8F8] flex items-center justify-between">
                {/* Xem hồ sơ đầy đủ */}
                <button
                  type="button"
                  onClick={() => {
                    const st = students.find((s) => s.id === selectedApplication.studentId);
                    if (st) setViewingProfileStudent(st);
                  }}
                  className="text-xs text-[#3D7DD8] hover:underline font-medium"
                >
                  Xem toàn bộ hồ sơ năng lực sinh viên →
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedApplication(null)}
                    className="px-4 py-2 text-xs text-[#5B6B85] hover:text-[#16243D]"
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#3D7DD8] hover:bg-[#2F67B5] text-white text-xs font-semibold rounded-full shadow-xs transition-colors"
                  >
                    Lưu ghi chú & Gửi phản hồi
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE / EDIT JOB POSTING MODAL */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#16243D]/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className="relative w-full max-w-2xl bg-white border border-[#DCE8F8] rounded-[24px] shadow-2xl p-6 sm:p-8 my-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-[#DCE8F8]">
              <div>
                <h3 className="font-heading font-bold text-lg text-[#16243D]">
                  {editingJob ? 'Chỉnh sửa tin tuyển dụng' : 'Đăng tin tuyển dụng mới'}
                </h3>
                <p className="text-xs text-[#5B6B85]">
                  Tuyển chọn ứng viên dựa trên Thẻ bằng chứng bài làm thực tế.
                </p>
              </div>
              <button
                onClick={() => setIsJobModalOpen(false)}
                className="p-1.5 text-[#5B6B85] hover:text-[#16243D] rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Vị trí */}
                <div>
                  <label className="block text-xs font-semibold text-[#16243D] mb-1">
                    Vị trí tuyển dụng *
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    required
                    placeholder="Ví dụ: Thực tập sinh Frontend React"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] outline-none"
                  />
                </div>

                {/* Loại hình */}
                <div>
                  <label className="block text-xs font-semibold text-[#16243D] mb-1">
                    Loại hình công việc *
                  </label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] outline-none bg-white"
                  >
                    <option value="Thực tập sinh">Thực tập sinh</option>
                    <option value="Bán thời gian">Bán thời gian (Part-time)</option>
                    <option value="Chính thức khởi đầu">Chính thức khởi đầu (Junior/Fresher)</option>
                  </select>
                </div>

                {/* Ngành */}
                <div>
                  <label className="block text-xs font-semibold text-[#16243D] mb-1">
                    Ngành nghề phù hợp *
                  </label>
                  <select
                    value={jobCategory}
                    onChange={(e) => setJobCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] outline-none bg-white"
                  >
                    <option value="CNTT">CNTT & Phần mềm</option>
                    <option value="Marketing">Marketing & Truyền thông</option>
                    <option value="Thiết kế">Thiết kế Đồ họa & UI/UX</option>
                    <option value="Kế toán">Kế toán & Tài chính</option>
                    <option value="Du lịch">Du lịch & Dịch vụ</option>
                  </select>
                </div>

                {/* Điểm Thẻ bằng chứng tối thiểu */}
                <div>
                  <label className="block text-xs font-semibold text-[#16243D] mb-1">
                    Điểm Thẻ bằng chứng yêu cầu tối thiểu *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    value={jobMinScore}
                    onChange={(e) => setJobMinScore(parseFloat(e.target.value) || 8.0)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] outline-none font-bold"
                  />
                </div>

                {/* Mức lương / Phụ cấp */}
                <div>
                  <label className="block text-xs font-semibold text-[#16243D] mb-1">
                    Mức lương / Phụ cấp hàng tháng *
                  </label>
                  <input
                    type="text"
                    value={jobSalaryText}
                    onChange={(e) => setJobSalaryText(e.target.value)}
                    placeholder="Ví dụ: 5.000.000 - 8.000.000 đ/tháng"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] outline-none"
                  />
                </div>

                {/* Địa điểm */}
                <div>
                  <label className="block text-xs font-semibold text-[#16243D] mb-1">
                    Địa điểm làm việc *
                  </label>
                  <input
                    type="text"
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    placeholder="Ví dụ: Cầu Giấy, Hà Nội hoặc Hybrid"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] outline-none"
                  />
                </div>

                {/* Số lượng */}
                <div>
                  <label className="block text-xs font-semibold text-[#16243D] mb-1">
                    Số lượng cần tuyển *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={jobHeadcount}
                    onChange={(e) => setJobHeadcount(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] outline-none"
                  />
                </div>

                {/* Hạn nộp hồ sơ */}
                <div>
                  <label className="block text-xs font-semibold text-[#16243D] mb-1">
                    Hạn nộp hồ sơ *
                  </label>
                  <input
                    type="date"
                    value={jobDeadline}
                    onChange={(e) => setJobDeadline(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] outline-none"
                  />
                </div>
              </div>

              {/* Mô tả */}
              <div>
                <label className="block text-xs font-semibold text-[#16243D] mb-1">
                  Mô tả công việc và trách nhiệm chính *
                </label>
                <textarea
                  rows={3}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] outline-none leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-[#DCE8F8] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsJobModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#5B6B85] hover:text-[#16243D]"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#3D7DD8] hover:bg-[#2F67B5] text-white text-xs font-semibold rounded-full shadow-xs"
                >
                  {editingJob ? 'Lưu thay đổi' : 'Đăng tin tuyển dụng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Public Profile Modal */}
      {viewingProfileStudent && (
        <StudentPublicProfileModal
          student={viewingProfileStudent}
          onClose={() => setViewingProfileStudent(null)}
        />
      )}
    </div>
  );
};
