import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CompanyReviewModalProps {
  companyId: string;
  taskId: string;
  onClose: () => void;
}

export const CompanyReviewModal: React.FC<CompanyReviewModalProps> = ({
  companyId,
  taskId,
  onClose,
}) => {
  const { companies, tasks, submitCompanyReview } = useApp();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const company = companies.find((c) => c.id === companyId);
  const task = tasks.find((t) => t.id === taskId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMsg('Vui lòng chia sẻ đôi dòng nhận xét về trải nghiệm làm nhiệm vụ và nhận phản hồi từ doanh nghiệp.');
      return;
    }

    const success = submitCompanyReview(companyId, taskId, rating, comment);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#16243D]/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-md bg-white border border-[#DCE8F8] rounded-[20px] shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 bg-[#F5F9FF] border-b border-[#DCE8F8] flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-[#3D7DD8] uppercase tracking-wider">
              Đánh giá doanh nghiệp
            </span>
            <h3 className="font-heading font-bold text-lg text-[#16243D] mt-1">
              {company?.name || 'Doanh nghiệp đối tác'}
            </h3>
            <p className="text-xs text-[#5B6B85] mt-0.5">
              Nhiệm vụ: {task?.title || 'Nhiệm vụ đã chấm'}
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Star selector */}
          <div className="text-center py-2">
            <label className="block text-xs font-semibold text-[#16243D] mb-2">
              Bạn đánh giá trải nghiệm tổng thể mấy sao? *
            </label>
            <div className="flex items-center justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 text-2xl transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        active ? 'text-[#E5A800] fill-[#E5A800]' : 'text-slate-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-[#5B6B85] mt-2">
              {rating === 5 && 'Rất hài lòng · Đề bài thực tế, chấm kỹ lưỡng'}
              {rating === 4 && 'Hài lòng · Phản hồi tốt và bổ ích'}
              {rating === 3 && 'Bình thường · Có thể cải thiện thêm'}
              {rating === 2 && 'Chưa hài lòng · Tiêu chí chưa rõ ràng'}
              {rating === 1 && 'Không hài lòng · Cần hỗ trợ từ ban quản trị'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#16243D] mb-1">
              Nhận xét chi tiết *
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                setErrorMsg('');
              }}
              placeholder="Chia sẻ về độ thực tế của đề bài, thời gian phản hồi, sự rõ ràng của tiêu chí chấm..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] outline-none focus:ring-2 focus:ring-[#3D7DD8]/30"
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-[#B83214] font-medium">{errorMsg}</p>
          )}

          <div className="pt-2 border-t border-[#DCE8F8] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-[#5B6B85] hover:text-[#16243D]"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#3D7DD8] hover:bg-[#2F67B5] text-white text-xs font-semibold rounded-full shadow-xs"
            >
              Gửi đánh giá
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
