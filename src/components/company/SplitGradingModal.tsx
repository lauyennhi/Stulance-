import React, { useState } from 'react';
import {
  AlertCircle,
  Award,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck2,
  FileText,
  GraduationCap,
  Lock,
  MessageSquare,
  Share2,
  User,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Submission, Task } from '../../types';

interface SplitGradingModalProps {
  submission: Submission;
  task?: Task;
  onClose: () => void;
}

export const SplitGradingModal: React.FC<SplitGradingModalProps> = ({
  submission,
  task,
  onClose,
}) => {
  const { gradeSubmissionWithCriteria, notify } = useApp();

  const isAlreadyGraded = submission.status === 'graded';

  // Criteria list from task or fallback
  const taskCriteria = task?.evaluationCriteriaList || [
    { id: 'c1', name: 'Độ chính xác kỹ thuật & Clean Architecture', maxScore: 5 },
    { id: 'c2', name: 'Khả năng ứng dụng thực tế & Xử lý ngoại lệ', maxScore: 5 },
  ];

  // Initial criterion scores
  const [criteriaScores, setCriteriaScores] = useState<
    { criterionName: string; score: number; maxScore: number }[]
  >(() => {
    if (submission.criteriaScores && submission.criteriaScores.length > 0) {
      return submission.criteriaScores;
    }
    return taskCriteria.map((tc) => ({
      criterionName: tc.name,
      score: Math.round(tc.maxScore * 0.9 * 10) / 10,
      maxScore: tc.maxScore,
    }));
  });

  const [feedbackQuote, setFeedbackQuote] = useState(
    submission.feedbackQuote || 'Cách xử lý vấn đề mạch lạc, giải pháp mang tính ứng dụng thực tiễn cao.'
  );

  const [detailedFeedback, setDetailedFeedback] = useState(
    submission.detailedFeedback ||
      'Sinh viên nắm rất vững tư duy chuyên môn, cấu trúc mã nguồn sáng tạo và giải quyết trọn vẹn các yêu cầu bài toán đề ra. Khả năng tự nghiên cứu và tư duy hệ thống rất tiềm năng.'
  );

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Compute total score dynamically
  const totalScore = Number(
    criteriaScores.reduce((sum, c) => sum + (Number(c.score) || 0), 0).toFixed(1)
  );

  const passed = totalScore >= 8.0;

  const handleScoreChange = (index: number, newScore: number) => {
    if (isAlreadyGraded) return;
    setCriteriaScores((prev) =>
      prev.map((item, idx) =>
        idx === index
          ? {
              ...item,
              score: Math.max(0, Math.min(item.maxScore, newScore)),
            }
          : item
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAlreadyGraded) {
      notify('Không thể sửa', 'Bài làm đã có kết quả chính thức và không thể sửa lại.', 'error');
      return;
    }

    if (!feedbackQuote.trim()) {
      setErrorMsg('Vui lòng nhập một câu trích nhận xét cô đọng để hiển thị trên Thẻ bằng chứng.');
      return;
    }

    // Rule: "ô nhận xét bắt buộc (tối thiểu 50 ký tự)"
    if (detailedFeedback.trim().length < 50) {
      setErrorMsg(
        `Nhận xét chi tiết bắt buộc phải đạt tối thiểu 50 ký tự (Hiện tại: ${detailedFeedback.trim().length}/50 ký tự).`
      );
      return;
    }

    const success = gradeSubmissionWithCriteria(
      submission.id,
      criteriaScores,
      feedbackQuote.trim(),
      detailedFeedback.trim()
    );

    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#16243D]/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-5xl bg-white border border-[#DCE8F8] rounded-[24px] shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#DCE8F8] bg-[#F5F9FF] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3D7DD8] text-white flex items-center justify-center shrink-0">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-heading font-bold text-lg text-[#16243D]">
                  {isAlreadyGraded ? 'Chi tiết kết quả chấm điểm' : 'Màn hình chấm bài thi thực tế'}
                </h3>
                {isAlreadyGraded ? (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#CDEFE0] text-[#0F5B39] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Đã chấm chính thức · Bất biến
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FFE9A8] text-[#7A5B00] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Chờ thẩm định điểm
                  </span>
                )}
              </div>
              <p className="text-xs text-[#5B6B85] mt-0.5">
                Nhiệm vụ: <strong>{submission.taskTitle}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#5B6B85] hover:text-[#16243D] rounded-full hover:bg-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice for Graded mode */}
        {isAlreadyGraded && (
          <div className="px-6 py-2.5 bg-[#F0FAF5] border-b border-[#CDEFE0] flex items-center gap-2 text-xs text-[#0F5B39]">
            <Lock className="w-4 h-4 shrink-0" />
            <span>
              <strong>Quy tắc Stulance:</strong> Bài làm đã chấm thì <strong>không sửa</strong> để đảm bảo sự công bằng và tính xác thực của Thẻ bằng chứng mà sinh viên mang đi xin việc.
            </span>
          </div>
        )}

        {/* SPLIT SCREEN BODY */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#DCE8F8]">
          {/* CỘT TRÁI (5 Cols): BÀI LÀM CỦA SINH VIÊN */}
          <div className="lg:col-span-6 p-6 sm:p-8 space-y-6 overflow-y-auto bg-[#FDFEFE]">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE8F8]">
              <span className="text-xs font-semibold text-[#3D7DD8] uppercase tracking-wider">
                1. Bài làm & Sản phẩm của sinh viên
              </span>
              <span className="text-xs text-[#5B6B85]">
                Nộp ngày: {submission.submittedAt}
              </span>
            </div>

            {/* Thông tin sinh viên */}
            <div className="p-4 rounded-2xl bg-[#F5F9FF] border border-[#DCE8F8] flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#DCE8F8] text-[#3D7DD8] font-heading font-bold text-lg flex items-center justify-center shrink-0">
                {submission.studentName.charAt(0)}
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-[#16243D]">
                  {submission.studentName}
                </h4>
                <p className="text-xs text-[#5B6B85] mt-0.5">
                  {submission.studentUniversity}
                </p>
              </div>
            </div>

            {/* Sản phẩm cần nộp */}
            <div>
              <label className="block text-xs font-semibold text-[#16243D] mb-1.5">
                Đường dẫn sản phẩm hoàn thiện (Deliverable Link)
              </label>
              <div className="p-3.5 rounded-xl border border-[#DCE8F8] bg-white flex items-center justify-between gap-3">
                <a
                  href={submission.deliverableLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#3D7DD8] hover:underline font-mono truncate max-w-sm flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  {submission.deliverableLink}
                </a>
                <a
                  href={submission.deliverableLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-[#3D7DD8] hover:bg-[#2F67B5] text-white text-xs font-semibold transition-colors shrink-0 shadow-xs"
                >
                  Mở bài làm
                </a>
              </div>
            </div>

            {/* Ghi chú từ sinh viên */}
            <div>
              <label className="block text-xs font-semibold text-[#16243D] mb-1.5">
                Ghi chú & Lời giải thích từ ứng viên
              </label>
              <div className="p-4 rounded-xl bg-[#F5F9FF] border border-[#DCE8F8] text-xs text-[#16243D] leading-relaxed">
                {submission.notes ? (
                  submission.notes
                ) : (
                  <span className="italic text-[#5B6B85]">
                    Sinh viên không để lại ghi chú thêm. Vui lòng kiểm tra kỹ lưỡng đường dẫn sản phẩm phía trên.
                  </span>
                )}
              </div>
            </div>

            {/* Xem trước giả lập tài liệu */}
            <div className="p-4 rounded-2xl border border-[#DCE8F8] bg-white space-y-2">
              <div className="flex items-center justify-between text-xs text-[#5B6B85]">
                <span className="font-medium">Xem trước mã nguồn / tài liệu:</span>
                <span className="font-mono text-[11px]">Preview Sandbox</span>
              </div>
              <div className="p-4 rounded-xl bg-[#16243D] text-[#A9CFFA] font-mono text-[11px] leading-relaxed overflow-x-auto">
                <p className="text-gray-400">// Stulance Work Preview</p>
                <p>Task: {submission.taskTitle}</p>
                <p>Candidate: {submission.studentName}</p>
                <p>Pledge: Cam kết 100% tự thực hiện, không sao chép</p>
                <p className="text-emerald-400 mt-1">Status: Ready for review and grading</p>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI (7 Cols): THANH ĐIỂM TIÊU CHÍ & NHẬN XÉT */}
          <div className="lg:col-span-6 p-6 sm:p-8 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE8F8]">
              <span className="text-xs font-semibold text-[#3D7DD8] uppercase tracking-wider">
                2. Bảng điểm tiêu chí & Nhận xét
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#5B6B85]">Tổng điểm:</span>
                <span
                  className={`font-heading font-bold text-lg px-2.5 py-0.5 rounded-lg ${
                    passed
                      ? 'bg-[#CDEFE0] text-[#0F5B39]'
                      : 'bg-[#FFE9A8] text-[#7A5B00]'
                  }`}
                >
                  {totalScore} / 10
                </span>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-[#FFF1ED] border border-[#FFD6CC] text-xs text-[#B83214] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* THANH ĐIỂM TỪNG TIÊU CHÍ */}
              <div className="space-y-4">
                <label className="block text-xs font-semibold text-[#16243D]">
                  Chấm điểm theo các tiêu chí đã công khai ({criteriaScores.length} tiêu chí) *
                </label>

                {criteriaScores.map((c, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-[#DCE8F8] bg-white space-y-2.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-xs text-[#16243D]">
                        {idx + 1}. {c.criterionName}
                      </span>
                      <span className="font-heading font-bold text-xs text-[#3D7DD8] shrink-0">
                        {c.score} / {c.maxScore}đ
                      </span>
                    </div>

                    {/* Range slider & Number input */}
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max={c.maxScore}
                        step="0.5"
                        disabled={isAlreadyGraded}
                        value={c.score}
                        onChange={(e) => handleScoreChange(idx, parseFloat(e.target.value) || 0)}
                        className="flex-1 accent-[#3D7DD8] cursor-pointer disabled:cursor-not-allowed"
                      />
                      <input
                        type="number"
                        min="0"
                        max={c.maxScore}
                        step="0.5"
                        disabled={isAlreadyGraded}
                        value={c.score}
                        onChange={(e) => handleScoreChange(idx, parseFloat(e.target.value) || 0)}
                        className="w-16 px-2.5 py-1.5 rounded-lg border border-[#DCE8F8] text-center font-heading font-bold text-xs text-[#16243D] outline-none disabled:bg-[#F5F9FF]"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* CÂU TRÍCH NHẬN XÉT CHO THẺ BẰNG CHỨNG */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#16243D]">
                    Câu trích nhận xét trên Thẻ bằng chứng (Ngắn gọn) *
                  </label>
                  <span className="text-[10px] text-[#5B6B85]">Hiển thị trong ngoặc kép</span>
                </div>
                <textarea
                  rows={2}
                  disabled={isAlreadyGraded}
                  value={feedbackQuote}
                  onChange={(e) => {
                    setFeedbackQuote(e.target.value);
                    setErrorMsg(null);
                  }}
                  placeholder="Ví dụ: Tư duy giải thuật sắc sảo, cấu trúc hook hoàn chỉnh không có lỗ hổng race-condition."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] focus:ring-2 focus:ring-[#3D7DD8]/30 outline-none leading-relaxed disabled:bg-[#F5F9FF]"
                />
              </div>

              {/* Ô NHẬN XÉT CHI TIẾT BẮT BUỘC (TỐI THIỂU 50 KÝ TỰ) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#16243D]">
                    Nhận xét chi tiết & Hướng dẫn sinh viên *
                  </label>
                  <span
                    className={`text-[11px] font-mono font-medium ${
                      detailedFeedback.trim().length >= 50
                        ? 'text-[#0F5B39]'
                        : 'text-[#B83214]'
                    }`}
                  >
                    {detailedFeedback.trim().length}/50 ký tự
                    {detailedFeedback.trim().length < 50 &&
                      ` (còn thiếu ${50 - detailedFeedback.trim().length})`}
                  </span>
                </div>
                <textarea
                  rows={4}
                  disabled={isAlreadyGraded}
                  value={detailedFeedback}
                  onChange={(e) => {
                    setDetailedFeedback(e.target.value);
                    setErrorMsg(null);
                  }}
                  placeholder="Nhận xét cụ thể về những điểm ứng viên làm tốt, các lỗi cần khắc phục và định hướng phát triển nghề nghiệp..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] focus:ring-2 focus:ring-[#3D7DD8]/30 outline-none leading-relaxed disabled:bg-[#F5F9FF]"
                />
                <p className="text-[11px] text-[#5B6B85] mt-1">
                  Yêu cầu bắt buộc tối thiểu 50 ký tự để đảm bảo phản hồi có giá trị sư phạm cho sinh viên.
                </p>
              </div>

              {/* Footer button */}
              <div className="pt-4 border-t border-[#DCE8F8] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-full border border-[#DCE8F8] text-xs text-[#5B6B85] hover:text-[#16243D]"
                >
                  {isAlreadyGraded ? 'Đóng cửa sổ' : 'Hủy bỏ'}
                </button>

                {!isAlreadyGraded && (
                  <button
                    type="submit"
                    disabled={detailedFeedback.trim().length < 50}
                    className={`px-6 py-2.5 rounded-full text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 ${
                      detailedFeedback.trim().length >= 50
                        ? 'bg-[#3D7DD8] hover:bg-[#2F67B5] text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Lưu điểm & Cấp Thẻ bằng chứng
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
