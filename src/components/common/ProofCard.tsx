import React from 'react';
import { Award, CheckCircle2, ExternalLink, Share2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Submission } from '../../types';

interface ProofCardProps {
  submission: Submission;
  showStudent?: boolean;
  onOpenDetails?: (submission: Submission) => void;
}

export const ProofCard: React.FC<ProofCardProps> = ({
  submission,
  showStudent = true,
  onOpenDetails,
}) => {
  const { companies, notify } = useApp();
  const company = companies.find((c) => c.id === submission.gradedByCompanyId) || {
    name: 'Doanh nghiệp đối tác',
    status: 'verified',
  };

  const scoreFormatted = submission.score ? submission.score.toFixed(1) : '9.0';
  const isPassed = submission.passed !== false && (submission.score || 0) >= 8.0;

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText?.(window.location.origin + `#proof-${submission.id}`);
    notify('Đã sao chép liên kết Thẻ bằng chứng', 'Bạn có thể gửi liên kết này cho nhà tuyển dụng để chứng thực năng lực thực tế.', 'success');
  };

  return (
    <div
      onClick={() => onOpenDetails?.(submission)}
      className="stulance-card stulance-card-hover p-6 flex flex-col justify-between relative group cursor-pointer border border-[#DCE8F8] bg-white text-[#16243D]"
    >
      {/* Top Header: Company name + Verified badge & Score circle */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-sm text-[#16243D] truncate max-w-[200px]">
                {company.name}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#3D7DD8] bg-[#EAF2FC] px-2 py-0.5 rounded-full shrink-0">
                <CheckCircle2 className="w-3 h-3 text-[#3D7DD8]" />
                Đã xác minh
              </span>
            </div>
            <p className="text-xs text-[#5B6B85] mt-0.5 truncate">
              Chấm ngày {submission.gradedAt || '25/03/2026'}
            </p>
          </div>

          {/* Vòng tròn điểm Space Grotesk */}
          <div className="flex flex-col items-center shrink-0">
            <div className="w-14 h-14 rounded-full border-2 border-[#3D7DD8] bg-[#F5F9FF] flex flex-col items-center justify-center shadow-xs">
              <span className="font-heading font-bold text-lg text-[#16243D] leading-none">
                {scoreFormatted}
              </span>
              <span className="text-[10px] text-[#5B6B85] font-medium leading-none mt-0.5">
                / 10
              </span>
            </div>
          </div>
        </div>

        {/* Trạng thái đạt (xanh bạc hà) */}
        {isPassed && (
          <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#CDEFE0] text-[#0F5B39]">
            <Award className="w-3.5 h-3.5" />
            Đạt chuẩn nghiệp vụ doanh nghiệp
          </div>
        )}

        {/* Task Title */}
        <h4 className="font-heading font-semibold text-base text-[#16243D] line-clamp-2 mb-3 leading-snug">
          {submission.taskTitle}
        </h4>

        {/* Quote trích dẫn nhận xét trong ngoặc kép */}
        <blockquote className="my-3 p-3.5 rounded-2xl bg-[#F5F9FF] border-l-3 border-[#3D7DD8] text-sm italic text-[#16243D] leading-relaxed">
          &ldquo;{submission.feedbackQuote || 'Bài làm đạt yêu cầu thực tế, phương pháp triển khai khoa học và giải quyết trọn vẹn đề bài.'}&rdquo;
        </blockquote>
      </div>

      {/* Footer: Student Info and Action */}
      <div className="pt-4 border-t border-[#DCE8F8] mt-2 flex items-center justify-between text-xs text-[#5B6B85]">
        {showStudent ? (
          <div className="min-w-0 pr-2">
            <span className="font-medium text-[#16243D] block truncate">
              {submission.studentName}
            </span>
            <span className="truncate block text-[11px] text-[#5B6B85]">
              {submission.studentUniversity}
            </span>
          </div>
        ) : (
          <div className="text-[11px] text-[#5B6B85]">
            Bài nộp được bảo lưu xác thực
          </div>
        )}

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleShare}
            title="Sao chép liên kết chứng thực"
            className="p-1.5 text-[#5B6B85] hover:text-[#3D7DD8] hover:bg-[#EAF2FC] rounded-full transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          {submission.deliverableLink && (
            <a
              href={submission.deliverableLink}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              title="Xem sản phẩm nộp thực tế"
              className="p-1.5 text-[#5B6B85] hover:text-[#3D7DD8] hover:bg-[#EAF2FC] rounded-full transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
