import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, ShieldAlert, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ViolationReason } from '../../types';

interface ViolationReportModalProps {
  taskId?: string | null;
  jobId?: string | null;
  targetTitle?: string;
  onClose: () => void;
}

export const ViolationReportModal: React.FC<ViolationReportModalProps> = ({
  taskId,
  jobId,
  targetTitle,
  onClose,
}) => {
  const { tasks, jobPostings, reportViolation } = useApp();

  const [reason, setReason] = useState<ViolationReason>('Yêu cầu đóng phí');
  const [details, setDetails] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const targetTask = taskId ? tasks.find((t) => t.id === taskId) : null;
  const targetJob = jobId ? jobPostings.find((j) => j.id === jobId) : null;

  const displayTitle =
    targetTitle ||
    targetTask?.title ||
    targetJob?.title ||
    'Đối tượng trên hệ thống Stulance';

  const targetType = jobId ? 'job' : 'task';
  const targetId = (taskId || jobId || 'unknown') as string;

  const REASONS: { label: ViolationReason; hint: string }[] = [
    { label: 'Yêu cầu đóng phí', hint: 'Yêu cầu đặt cọc tiền, mua khóa học, mua tài khoản hoặc thu phí bất hợp pháp' },
    { label: 'Vượt giới hạn giờ', hint: 'Nhiệm vụ Thử sức vượt quá 3 giờ hoặc khối lượng vượt xa mô tả ban đầu' },
    { label: 'Không chấm bài', hint: 'Bài làm đã nộp quá hạn cam kết nhưng doanh nghiệp không phản hồi' },
    { label: 'Nội dung sai sự thật', hint: 'Thông tin giả mạo về đối tác, mức lương hoặc mô tả công việc' },
    { label: 'Sao chép bài', hint: 'Đề bài hoặc sản phẩm có dấu hiệu vi phạm bản quyền trí tuệ' },
    { label: 'Khác', hint: 'Các hành vi vi phạm chuẩn mực văn hóa ứng xử hoặc quy chế sinh viên' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) {
      setErrorMsg('Vui lòng nhập mô tả chi tiết bằng chứng vi phạm (bắt buộc theo quy định kiểm tra).');
      return;
    }

    reportViolation(targetType, targetId, displayTitle, reason, details.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#16243D]/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-lg bg-white border border-[#DCE8F8] rounded-[24px] shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 bg-[#FFF1ED] border-b border-[#FFD6CC] flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFD6CC] text-[#B83214] flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-[#16243D]">
                Báo cáo vi phạm quy chế
              </h3>
              <p className="text-xs text-[#5B6B85] mt-0.5 line-clamp-1">
                {displayTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#5B6B85] hover:text-[#16243D] rounded-full hover:bg-white"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#16243D] mb-1.5">
              Lý do báo cáo vi phạm *
            </label>
            <div className="space-y-2">
              {REASONS.map((r) => (
                <label
                  key={r.label}
                  className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    reason === r.label
                      ? 'border-[#B83214] bg-[#FFF1ED]/40 text-[#16243D]'
                      : 'border-[#DCE8F8] bg-white hover:bg-[#F5F9FF]'
                  }`}
                >
                  <input
                    type="radio"
                    name="violation_reason"
                    checked={reason === r.label}
                    onChange={() => setReason(r.label)}
                    className="mt-0.5 text-[#B83214] focus:ring-[#B83214]"
                  />
                  <div>
                    <span className="font-semibold text-xs block text-[#16243D]">{r.label}</span>
                    <span className="text-[11px] text-[#5B6B85]">{r.hint}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#16243D] mb-1">
              Chi tiết bằng chứng & mô tả cụ thể vi phạm (Bắt buộc) *
            </label>
            <textarea
              rows={4}
              value={details}
              onChange={(e) => {
                setDetails(e.target.value);
                setErrorMsg('');
              }}
              required
              placeholder="Vui lòng cung cấp chi tiết: thời gian xảy ra, tin nhắn hoặc hành vi bất thường của đối tác để cán bộ nhà trường thẩm định..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] outline-none focus:ring-2 focus:ring-[#B83214]/30 leading-relaxed"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-[#FFF1ED] text-xs text-[#B83214] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="pt-2 border-t border-[#DCE8F8] flex items-center justify-between">
            <span className="text-[11px] text-[#5B6B85]">
              Báo cáo được bảo mật thông tin người gửi.
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs text-[#5B6B85] hover:text-[#16243D]"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#B83214] hover:bg-[#99260E] text-white font-semibold rounded-full shadow-xs transition-colors"
              >
                Gửi báo cáo vi phạm
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
