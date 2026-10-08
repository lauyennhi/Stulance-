import React, { useState } from 'react';
import {
  Award,
  Briefcase,
  CheckCircle2,
  Clock,
  DollarSign,
  MapPin,
  Send,
  ShieldAlert,
  Sparkles,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { JobPosting } from '../../types';

interface JobDetailModalProps {
  jobId: string | null;
  onClose: () => void;
  onOpenCompanyProfile?: (companyId: string) => void;
  onOpenReport?: (jobId: string) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  jobId,
  onClose,
  onOpenCompanyProfile,
  onOpenReport,
}) => {
  const {
    jobPostings,
    myTasks,
    tasks,
    jobApplications,
    applyForJob,
    withdrawJobApplication,
    currentUser,
    openAuth,
  } = useApp();

  const [coverNote, setCoverNote] = useState(
    'Chào anh/chị, em xin gửi hồ sơ năng lực và các bài làm thực tế đã được chấm điểm trên Stulance để ứng tuyển vị trí này.'
  );
  const [selectedProofIds, setSelectedProofIds] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  if (!jobId) return null;
  const job = jobPostings.find((j) => j.id === jobId);
  if (!job) return null;

  // Check if student already applied
  const existingApplication = jobApplications.find(
    (a) => a.jobId === job.id && a.studentId === currentUser?.id
  );

  // Available graded proofs for this student
  const gradedProofs = myTasks.filter((m) => m.status === 'graded');

  const toggleSelectProof = (proofId: string) => {
    setSelectedProofIds((prev) =>
      prev.includes(proofId) ? prev.filter((id) => id !== proofId) : [...prev, proofId]
    );
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onClose();
      openAuth('login');
      return;
    }

    if (!coverNote.trim()) {
      setErrorMsg('Vui lòng viết đôi lời nhắn gửi tới nhà tuyển dụng.');
      return;
    }

    const success = applyForJob(job.id, coverNote, selectedProofIds);
    if (success) {
      onClose();
    }
  };

  const handleWithdraw = () => {
    if (existingApplication) {
      const ok = withdrawJobApplication(existingApplication.id);
      if (ok) {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#16243D]/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl bg-white border border-[#DCE8F8] rounded-[20px] shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-[#F5F9FF] border-b border-[#DCE8F8] flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-semibold text-[#3D7DD8]">{job.targetCategory}</span>
              <span>·</span>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white border border-[#DCE8F8] text-[#16243D]">
                {job.type}
              </span>
              <span className="text-xs text-[#5B6B85] flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {job.location}
              </span>
            </div>
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#16243D]">
              {job.title}
            </h2>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenCompanyProfile?.(job.companyId);
              }}
              className="text-xs font-semibold text-[#16243D] hover:text-[#3D7DD8] hover:underline mt-1 inline-flex items-center gap-1"
            >
              {job.companyName}
              <CheckCircle2 className="w-3.5 h-3.5 text-[#3D7DD8]" />
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#5B6B85] hover:text-[#16243D] rounded-full"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Key Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-[#F5F9FF] border border-[#DCE8F8]">
            <div>
              <p className="text-[11px] text-[#5B6B85]">Mức lương / Phụ cấp</p>
              <p className="font-heading font-bold text-sm text-[#0F5B39]">
                {job.salaryText}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[#5B6B85]">Yêu cầu Thẻ bằng chứng</p>
              <p className="font-heading font-bold text-sm text-[#3D7DD8]">
                Điểm tối thiểu {job.requiredProofScore.toFixed(1)} / 10
              </p>
            </div>
          </div>

          {/* Existing Application Notice */}
          {existingApplication && (
            <div className="p-4 rounded-2xl bg-[#EAF2FC] border border-[#DCE8F8] flex items-center justify-between gap-3 text-xs">
              <div>
                <p className="font-semibold text-[#16243D]">
                  Bạn đã nộp đơn ứng tuyển vào ngày {existingApplication.appliedAt}
                </p>
                <p className="text-[#5B6B85] mt-0.5">
                  Trạng thái:{' '}
                  <strong>
                    {existingApplication.status === 'submitted'
                      ? 'Đã nộp (Chờ xem xét)'
                      : existingApplication.status === 'reviewing'
                      ? 'Đang xem xét hồ sơ'
                      : existingApplication.status === 'accepted'
                      ? 'Trúng tuyển / Mời phỏng vấn'
                      : 'Chưa phù hợp'}
                  </strong>
                </p>
              </div>
              {existingApplication.status === 'submitted' && (
                <button
                  type="button"
                  onClick={handleWithdraw}
                  className="px-4 py-2 rounded-full bg-[#FFF2F0] text-[#B83214] text-xs font-semibold hover:bg-[#FFE5E0] transition-colors"
                >
                  Rút đơn ứng tuyển
                </button>
              )}
            </div>
          )}

          {/* Description & Benefits */}
          <div>
            <h4 className="font-heading font-semibold text-xs text-[#5B6B85] uppercase tracking-wider mb-2">
              Mô tả công việc
            </h4>
            <p className="text-xs sm:text-sm text-[#16243D] leading-relaxed">
              {job.description}
            </p>
          </div>

          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h4 className="font-heading font-semibold text-xs text-[#5B6B85] uppercase tracking-wider mb-2">
                Yêu cầu ứng viên
              </h4>
              <ul className="space-y-1.5 text-xs text-[#16243D]">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3D7DD8] mt-1.5 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.benefits && job.benefits.length > 0 && (
            <div>
              <h4 className="font-heading font-semibold text-xs text-[#5B6B85] uppercase tracking-wider mb-2">
                Quyền lợi & Phúc lợi
              </h4>
              <ul className="space-y-1.5 text-xs text-[#16243D]">
                {job.benefits.map((ben, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0F5B39] mt-1.5 shrink-0" />
                    <span>{ben}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Application Form Section (if not applied yet) */}
          {!existingApplication && (
            <form onSubmit={handleApply} className="p-5 rounded-2xl bg-[#F5F9FF] border border-[#DCE8F8] space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#16243D]">
                <Sparkles className="w-4 h-4 text-[#3D7DD8]" />
                <span>Ứng tuyển bằng Hồ sơ năng lực Stulance</span>
              </div>

              {/* Select proof cards to attach */}
              <div>
                <label className="block text-xs font-semibold text-[#16243D] mb-1.5">
                  Đính kèm Thẻ bằng chứng của bạn (Tùy chọn)
                </label>
                {gradedProofs.length === 0 ? (
                  <p className="text-[11px] text-[#5B6B85] italic p-3 rounded-xl bg-white border border-[#DCE8F8]">
                    Bạn chưa có Thẻ bằng chứng nào được chấm điểm. Doanh nghiệp vẫn sẽ nhận hồ sơ nhưng ưu tiên các bạn có bằng chứng thực tế!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {gradedProofs.map((p) => {
                      const selected = selectedProofIds.includes(p.id);
                      const taskObj = tasks.find((t) => t.id === p.taskId);
                      return (
                        <div
                          key={p.id}
                          onClick={() => toggleSelectProof(p.id)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between gap-3 transition-all ${
                            selected
                              ? 'bg-white border-[#3D7DD8] shadow-xs'
                              : 'bg-white/60 border-[#DCE8F8] hover:bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() => {}}
                              className="rounded border-[#DCE8F8] text-[#3D7DD8]"
                            />
                            <div className="truncate">
                              <p className="font-semibold text-[#16243D] truncate">
                                {taskObj?.title || 'Nhiệm vụ'}
                              </p>
                              <p className="text-[11px] text-[#5B6B85]">
                                Điểm chấm: <strong>{p.score?.toFixed(1)}/10</strong>
                              </p>
                            </div>
                          </div>
                          <span className="font-heading font-bold text-xs text-[#0F5B39] shrink-0 bg-[#CDEFE0] px-2 py-0.5 rounded-full">
                            ✓ {p.score?.toFixed(1)}đ
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Cover note */}
              <div>
                <label className="block text-xs font-semibold text-[#16243D] mb-1">
                  Lời nhắn gửi nhà tuyển dụng *
                </label>
                <textarea
                  rows={3}
                  value={coverNote}
                  onChange={(e) => {
                    setCoverNote(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="Giới thiệu nhanh về bản thân và lý do bạn phù hợp với vị trí này..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE8F8] bg-white text-xs text-[#16243D] outline-none focus:ring-2 focus:ring-[#3D7DD8]/30"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-[#B83214] font-medium">{errorMsg}</p>
              )}

              <div className="pt-3 border-t border-[#DCE8F8] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenReport?.(job.id);
                  }}
                  className="text-xs text-[#5B6B85] hover:text-[#B83214] flex items-center gap-1.5 transition-colors"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Báo cáo vi phạm tin tuyển dụng
                </button>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs text-[#5B6B85] hover:text-[#16243D]"
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#3D7DD8] hover:bg-[#2F67B5] text-white text-xs font-semibold rounded-full shadow-xs flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Gửi hồ sơ ứng tuyển
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer (if already applied) */}
        {existingApplication && (
          <div className="p-4 bg-white border-t border-[#DCE8F8] flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenReport?.(job.id);
              }}
              className="text-xs text-[#5B6B85] hover:text-[#B83214] flex items-center gap-1.5 transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Báo cáo vi phạm tin tuyển dụng
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full bg-[#3D7DD8] text-white text-xs font-semibold"
            >
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
