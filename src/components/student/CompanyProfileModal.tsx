import React from 'react';
import {
  Award,
  Building,
  CheckCircle2,
  Clock,
  ExternalLink,
  Globe,
  MapPin,
  MessageSquare,
  Star,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Company } from '../../types';

interface CompanyProfileModalProps {
  companyId: string | null;
  onClose: () => void;
  onSelectTask?: (taskId: string) => void;
}

export const CompanyProfileModal: React.FC<CompanyProfileModalProps> = ({
  companyId,
  onClose,
  onSelectTask,
}) => {
  const { companies, tasks, companyReviews } = useApp();

  if (!companyId) return null;

  const company = companies.find((c) => c.id === companyId);
  if (!company) return null;

  // Open tasks from this company
  const openTasks = tasks.filter((t) => t.companyId === company.id);

  // Reviews from students for this company
  const reviews = companyReviews.filter((r) => r.companyId === company.id);
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0';

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num) + ' đ';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#16243D]/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl bg-white border border-[#DCE8F8] rounded-[20px] shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cover / Header */}
        <div className="p-6 bg-[#F5F9FF] border-b border-[#DCE8F8]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white border border-[#DCE8F8] shadow-xs flex items-center justify-center text-xl font-heading font-bold text-[#3D7DD8] shrink-0">
                {company.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-heading font-bold text-xl text-[#16243D]">
                    {company.name}
                  </h2>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#EAF2FC] text-[#3D7DD8]">
                    <CheckCircle2 className="w-3 h-3 text-[#3D7DD8]" />
                    Đã xác minh
                  </span>
                </div>
                <p className="text-xs text-[#5B6B85] mt-1 flex items-center gap-2 flex-wrap">
                  <span>{company.industry}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {company.location}
                  </span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[#5B6B85] hover:text-[#16243D] rounded-full"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Quick Stats Bar */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#F5F9FF] border border-[#DCE8F8] text-center">
            <div>
              <p className="text-[11px] text-[#5B6B85]">Nhiệm vụ đang mở</p>
              <p className="font-heading font-bold text-lg text-[#16243D]">
                {openTasks.length}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[#5B6B85]">Đánh giá từ sinh viên</p>
              <p className="font-heading font-bold text-lg text-[#E5A800] flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-[#E5A800]" />
                {averageRating}
                <span className="text-xs text-[#5B6B85] font-normal">({reviews.length})</span>
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[#5B6B85]">Trạng thái liên kết</p>
              <p className="font-heading font-bold text-xs text-[#0F5B39] mt-1">
                Chính thức
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-heading font-semibold text-xs text-[#5B6B85] uppercase tracking-wider mb-2">
              Giới thiệu doanh nghiệp
            </h3>
            <p className="text-xs sm:text-sm text-[#16243D] leading-relaxed">
              {company.description}
            </p>
            <div className="mt-3 flex items-center gap-4 text-xs text-[#5B6B85]">
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="text-[#3D7DD8] hover:underline flex items-center gap-1 font-medium"
              >
                <Globe className="w-3.5 h-3.5" />
                {company.website}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Open Tasks from this company */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading font-semibold text-xs text-[#5B6B85] uppercase tracking-wider">
                Nhiệm vụ đang mở tuyển ({openTasks.length})
              </h3>
            </div>

            {openTasks.length === 0 ? (
              <p className="text-xs text-[#5B6B85] italic p-4 rounded-xl bg-slate-50 text-center">
                Hiện tại doanh nghiệp này chưa mở thêm nhiệm vụ mới.
              </p>
            ) : (
              <div className="space-y-3">
                {openTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => {
                      onClose();
                      onSelectTask?.(task.id);
                    }}
                    className="p-4 rounded-2xl bg-white border border-[#DCE8F8] hover:border-[#3D7DD8] hover:shadow-xs transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-semibold text-[#3D7DD8]">
                          {task.category}
                        </span>
                        <span>·</span>
                        <span className="text-[11px] text-[#5B6B85]">
                          {task.type === 'challenge' ? 'Thử sức (3h)' : 'Dự án ngắn'}
                        </span>
                      </div>
                      <h4 className="font-heading font-semibold text-sm text-[#16243D] group-hover:text-[#3D7DD8] transition-colors line-clamp-1">
                        {task.title}
                      </h4>
                      <p className="text-xs text-[#5B6B85] line-clamp-1 mt-0.5">
                        {task.shortBrief}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                      <span className="font-heading font-bold text-xs text-[#7A5B00] bg-[#FFE9A8] px-2.5 py-1 rounded-full">
                        {formatVND(task.rewardVND)}
                      </span>
                      <span className="text-xs font-semibold text-[#3D7DD8]">
                        Xem đề →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Student Reviews for this company (Đánh giá của sinh viên) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading font-semibold text-xs text-[#5B6B85] uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                Đánh giá của sinh viên ({reviews.length})
              </h3>
            </div>

            {reviews.length === 0 ? (
              <p className="text-xs text-[#5B6B85] italic p-4 rounded-xl bg-slate-50 text-center">
                Chưa có đánh giá nào. Hãy hoàn thành nhiệm vụ và là người đầu tiên đánh giá doanh nghiệp này!
              </p>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-xl bg-[#F5F9FF] border border-[#DCE8F8] text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#16243D]">{rev.studentName}</span>
                        <span className="text-[#5B6B85]">· Ngày {rev.createdAt}</span>
                      </div>
                      {/* Star rating */}
                      <div className="flex items-center gap-0.5 text-[#E5A800]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-[#E5A800]' : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-[#16243D] leading-relaxed italic">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                    <p className="text-[11px] text-[#5B6B85]">
                      Nhiệm vụ: {rev.taskTitle}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-[#DCE8F8] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full bg-[#3D7DD8] hover:bg-[#2F67B5] text-white text-xs font-semibold"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
