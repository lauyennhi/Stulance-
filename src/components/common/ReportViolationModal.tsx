import React, { useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ShieldAlert,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ViolationReason } from '../../types';

interface ReportViolationModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'task' | 'job' | 'company';
  targetId: string;
  targetTitle: string;
}

const COMMON_REASONS: ViolationReason[] = [
  'Yêu cầu đóng phí',
  'Vượt giới hạn giờ',
  'Không chấm bài',
  'Nội dung sai sự thật',
  'Sao chép bài',
  'Khác',
];

export const ReportViolationModal: React.FC<ReportViolationModalProps> = ({
  isOpen,
  onClose,
  targetType,
  targetId,
  targetTitle,
}) => {
  const { reportViolation, notify } = useApp();
  const [selectedReason, setSelectedReason] = useState<ViolationReason>('Yêu cầu đóng phí');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim() || details.trim().length < 10) {
      notify(
        'Mô tả quá ngắn',
        'Vui lòng mô tả chi tiết nội dung vi phạm tối thiểu 10 ký tự để bộ phận kiểm duyệt nhà trường xác minh.',
        'error'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      reportViolation(targetType, targetId, targetTitle, selectedReason, details.trim());
      onClose();
      setDetails('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTargetTypeLabel = () => {
    switch (targetType) {
      case 'task':
        return 'Nhiệm vụ thực tế';
      case 'job':
        return 'Tin tuyển dụng';
      case 'company':
        return 'Hồ sơ doanh nghiệp';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#16243D]/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-lg bg-white border border-[#DCE8F8] rounded-[24px] shadow-2xl p-6 sm:p-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#DCE8F8] pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF2F0] border border-[#FFD6CC] flex items-center justify-center text-[#B83214] shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-[#16243D]">
                Báo cáo nội dung vi phạm
              </h3>
              <p className="text-xs text-[#5B6B85]">
                {getTargetTypeLabel()}: <span className="font-medium text-[#16243D]">{targetTitle}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#5B6B85] hover:text-[#16243D] hover:bg-[#F5F9FF] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#16243D] mb-1.5">
              Lý do vi phạm <span className="text-[#B83214]">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {COMMON_REASONS.map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setSelectedReason(r)}
                  className={`px-3 py-2 text-xs font-medium rounded-xl border text-left transition-all ${
                    selectedReason === r
                      ? 'border-[#B83214] bg-[#FFF2F0] text-[#B83214] font-semibold'
                      : 'border-[#DCE8F8] text-[#5B6B85] hover:bg-[#F5F9FF]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#16243D]">
                Mô tả bằng chứng / chi tiết vi phạm <span className="text-[#B83214]">*</span>
              </label>
              <span className="text-[11px] text-[#5B6B85]">
                {details.length}/500 ký tự (tối thiểu 10)
              </span>
            </div>
            <textarea
              rows={4}
              maxLength={500}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Vui lòng cung cấp chi tiết vi phạm (ví dụ: nội dung bắt nộp 200k tiền hồ sơ, thời gian làm thực tế vượt 3 giờ nhưng ghi thử sức, hoặc liên hệ ngoài nền tảng để quỵt thù lao...)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] outline-none focus:ring-2 focus:ring-[#B83214]/20 resize-none bg-[#F5F9FF]"
            />
          </div>

          <div className="p-3 rounded-xl bg-[#FFF8F7] border border-[#FFD6CC] text-xs text-[#5B6B85] flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[#B83214] shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Báo cáo của bạn sẽ được chuyển thẳng tới Ban Thư ký & Khảo thí Nhà trường để kiểm tra. Mọi thông tin người báo cáo được bảo mật hoàn toàn.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#DCE8F8]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-[#DCE8F8] text-xs font-medium text-[#5B6B85] hover:text-[#16243D] transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting || details.trim().length < 10}
              className="px-5 py-2 rounded-full bg-[#B83214] hover:bg-[#99260E] disabled:bg-gray-300 text-white text-xs font-semibold transition-colors shadow-xs"
            >
              Gửi báo cáo vi phạm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
