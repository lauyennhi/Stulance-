import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  Globe,
  Lock,
  MessageSquare,
  Share2,
  Star,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MyTaskRecord, Task } from '../../types';

interface GradingDetailModalProps {
  myTask: MyTaskRecord;
  task?: Task;
  onClose: () => void;
  onOpenReviewCompany?: (companyId: string, taskId: string) => void;
}

export const GradingDetailModal: React.FC<GradingDetailModalProps> = ({
  myTask,
  task,
  onClose,
  onOpenReviewCompany,
}) => {
  const { toggleProofPublicInPortfolio, notify, companies } = useApp();

  const company = companies.find((c) => c.id === task?.companyId) || {
    name: task?.companyName || 'Doanh nghiệp đối tác',
    id: task?.companyId || 'comp-1',
  };

  const scoreFormatted = (myTask.score || 9.0).toFixed(1);
  const isPassed = (myTask.score || 0) >= 8.0;
  const isPublic = !!myTask.isPublicInPortfolio;

  // Criteria scores breakdown
  const criteriaScores = myTask.criteriaScores || [
    { criterionName: 'Chất lượng chuyên môn & Kỹ thuật', score: 3.8, maxScore: 4.0 },
    { criterionName: 'Tính ứng dụng thực tế', score: 2.8, maxScore: 3.0 },
    { criterionName: 'Hoàn thiện theo đúng yêu cầu', score: 2.9, maxScore: 3.0 },
  ];

  const handleTogglePublic = () => {
    toggleProofPublicInPortfolio(myTask.id);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.origin + `#proof-${myTask.id}`);
    notify(
      'Đã sao chép liên kết Thẻ bằng chứng',
      'Bạn có thể gửi liên kết này trong hồ sơ xin việc hoặc mạng xã hội.',
      'success'
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#16243D]/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-xl bg-white border border-[#DCE8F8] rounded-[20px] shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-[#F5F9FF] border-b border-[#DCE8F8] flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-[#3D7DD8] uppercase tracking-wider">
              Kết quả chấm điểm & Chứng thực năng lực
            </span>
            <h3 className="font-heading font-bold text-lg sm:text-xl text-[#16243D] mt-1">
              {task?.title || 'Nhiệm vụ thực tế'}
            </h3>
            <p className="text-xs text-[#5B6B85] mt-0.5">
              Đơn vị thẩm định: <strong>{company.name}</strong> (Đã xác minh)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#5B6B85] hover:text-[#16243D] rounded-full"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Main Score Banner */}
          <div className="p-5 rounded-2xl bg-white border border-[#DCE8F8] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              {/* Score circle */}
              <div className="w-16 h-16 rounded-full border-2 border-[#3D7DD8] bg-[#F5F9FF] flex flex-col items-center justify-center shrink-0">
                <span className="font-heading font-bold text-2xl text-[#16243D] leading-none">
                  {scoreFormatted}
                </span>
                <span className="text-[10px] text-[#5B6B85] mt-0.5">/ 10</span>
              </div>
              <div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <span className="font-heading font-bold text-base text-[#16243D]">
                    {isPassed ? 'Đạt chuẩn nghiệp vụ xuất sắc' : 'Chưa đạt mức tiêu chuẩn'}
                  </span>
                </div>
                <p className="text-xs text-[#5B6B85] mt-0.5">
                  Chấm ngày {myTask.gradedAt || '25/03/2026'} bởi hội đồng chuyên môn
                </p>
              </div>
            </div>

            {/* Public status switcher */}
            <div className="flex flex-col items-center sm:items-end gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleTogglePublic}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isPublic
                    ? 'bg-[#CDEFE0] text-[#0F5B39]'
                    : 'bg-[#F5F9FF] border border-[#DCE8F8] text-[#5B6B85]'
                }`}
              >
                {isPublic ? (
                  <>
                    <Globe className="w-3.5 h-3.5" />
                    Đang Công khai
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    Đang Riêng tư
                  </>
                )}
              </button>
              <span className="text-[10px] text-[#5B6B85]">Bấm để đổi chế độ</span>
            </div>
          </div>

          {/* Criteria Breakdown (Điểm từng tiêu chí) */}
          <div>
            <h4 className="font-heading font-semibold text-xs text-[#5B6B85] uppercase tracking-wider mb-2.5">
              Chi tiết điểm theo từng tiêu chí công khai
            </h4>
            <div className="space-y-2">
              {criteriaScores.map((item, idx) => {
                const pct = Math.min(100, Math.round((item.score / item.maxScore) * 100));
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#F5F9FF] border border-[#DCE8F8] text-xs flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#16243D]">
                        {idx + 1}. {item.criterionName}
                      </span>
                      <span className="font-heading font-bold text-xs text-[#3D7DD8] font-numbers">
                        {item.score.toFixed(1)} / {item.maxScore.toFixed(1)}đ
                      </span>
                    </div>
                    {/* Visual Progress bar */}
                    <div className="w-full h-1.5 bg-[#DCE8F8] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#3D7DD8] rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Company Quote Feedback (Nhận xét của doanh nghiệp) */}
          <div>
            <h4 className="font-heading font-semibold text-xs text-[#5B6B85] uppercase tracking-wider mb-2">
              Trích dẫn nhận xét trên Thẻ bằng chứng
            </h4>
            <blockquote className="p-4 rounded-2xl bg-[#F5F9FF] border-l-4 border-[#3D7DD8] text-xs sm:text-sm italic text-[#16243D] leading-relaxed">
              &ldquo;{myTask.feedbackQuote || 'Bài làm đạt yêu cầu thực tế, phương pháp triển khai khoa học.'}&rdquo;
            </blockquote>
          </div>

          {myTask.detailedFeedback && (
            <div>
              <h4 className="font-heading font-semibold text-xs text-[#5B6B85] uppercase tracking-wider mb-2">
                Nhận xét chi tiết & Lời khuyên phát triển
              </h4>
              <p className="text-xs sm:text-sm text-[#16243D] leading-relaxed p-3.5 rounded-xl border border-[#DCE8F8] bg-white">
                {myTask.detailedFeedback}
              </p>
            </div>
          )}

          {/* Review Company CTA (Đánh giá doanh nghiệp sau khi bài làm được chấm) */}
          <div className="p-4 rounded-xl border border-[#DCE8F8] bg-[#F5F9FF] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="font-heading font-semibold text-xs text-[#16243D]">
                Đánh giá trải nghiệm với {company.name}
              </p>
              <p className="text-[11px] text-[#5B6B85] mt-0.5">
                Chia sẻ cảm nhận về đề bài và quá trình chấm điểm để giúp các bạn sinh viên khác.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenReviewCompany?.(company.id, myTask.taskId);
              }}
              className="px-4 py-2 rounded-full bg-white border border-[#DCE8F8] hover:border-[#3D7DD8] text-xs font-semibold text-[#16243D] hover:text-[#3D7DD8] flex items-center gap-1.5 transition-colors shrink-0"
            >
              <Star className="w-3.5 h-3.5 text-[#E5A800]" />
              {myTask.hasReviewedCompany ? 'Xem lại đánh giá' : 'Đánh giá 1–5 sao'}
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 bg-white border-t border-[#DCE8F8] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="text-xs font-medium text-[#5B6B85] hover:text-[#3D7DD8] flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Sao chép liên kết chứng thực
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTogglePublic}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                isPublic
                  ? 'bg-white border border-[#DCE8F8] text-[#16243D] hover:bg-slate-50'
                  : 'bg-[#3D7DD8] text-white hover:bg-[#2F67B5]'
              }`}
            >
              {isPublic ? 'Gỡ khỏi hồ sơ công khai' : 'Thêm vào hồ sơ công khai'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-[#DCE8F8] text-xs text-[#16243D] hover:bg-slate-50"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
