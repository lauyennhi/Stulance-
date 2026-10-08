import React, { useState } from 'react';
import {
  AlertCircle,
  FileCheck2,
  FileUp,
  Link2,
  Lock,
  ShieldCheck,
  UploadCloud,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MyTaskRecord, Task } from '../../types';

interface SubmitWorkModalProps {
  myTask: MyTaskRecord;
  task: Task;
  isUpdating?: boolean;
  onClose: () => void;
}

export const SubmitWorkModal: React.FC<SubmitWorkModalProps> = ({
  myTask,
  task,
  isUpdating = false,
  onClose,
}) => {
  const { submitTaskWork, updateTaskSubmission } = useApp();

  const [submissionType, setSubmissionType] = useState<'link' | 'file'>(
    myTask.fileName ? 'file' : 'link'
  );
  const [deliverableLink, setDeliverableLink] = useState(myTask.deliverableLink || '');
  const [fileName, setFileName] = useState(myTask.fileName || '');
  const [notes, setNotes] = useState(myTask.notes || '');
  const [selfPledgeConfirmed, setSelfPledgeConfirmed] = useState(
    isUpdating ? true : false
  );
  const [errorMsg, setErrorMsg] = useState('');

  const isExpired = Date.now() > myTask.deadlineTimestamp;

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setErrorMsg('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (isExpired) {
      setErrorMsg('Nhiệm vụ này đã quá hạn nộp nên hệ thống đã khóa nộp bài.');
      return;
    }

    if (submissionType === 'link') {
      if (!deliverableLink.trim()) {
        setErrorMsg('Vui lòng nhập đường dẫn liên kết bài làm của bạn (GitHub, Figma, Notion, Drive...).');
        return;
      }
      if (!deliverableLink.startsWith('http://') && !deliverableLink.startsWith('https://')) {
        setErrorMsg('Đường dẫn phải bắt đầu bằng http:// hoặc https:// để doanh nghiệp mở xem.');
        return;
      }
    } else {
      if (!fileName.trim()) {
        setErrorMsg('Vui lòng chọn hoặc tải lên tệp bài làm (.zip, .pdf, .docx, .xlsx...).');
        return;
      }
    }

    if (!selfPledgeConfirmed) {
      setErrorMsg('Bạn bắt buộc phải tích cam kết "Tôi cam kết tự làm bài này" để đảm bảo tính liêm chính.');
      return;
    }

    if (isUpdating) {
      const ok = updateTaskSubmission(myTask.id, {
        deliverableLink: submissionType === 'link' ? deliverableLink : undefined,
        fileName: submissionType === 'file' ? fileName : undefined,
        notes,
      });
      if (ok) onClose();
    } else {
      const ok = submitTaskWork(myTask.id, {
        deliverableLink: submissionType === 'link' ? deliverableLink : undefined,
        fileName: submissionType === 'file' ? fileName : undefined,
        notes,
        selfPledgeConfirmed,
      });
      if (ok) onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#16243D]/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-lg bg-white border border-[#DCE8F8] rounded-[20px] shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-[#F5F9FF] border-b border-[#DCE8F8] flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-[#3D7DD8] uppercase tracking-wider">
              {isUpdating ? 'Chỉnh sửa bài làm' : 'Nộp sản phẩm hoàn thiện'}
            </span>
            <h3 className="font-heading font-bold text-lg text-[#16243D] mt-1">
              {task.title}
            </h3>
            <p className="text-xs text-[#5B6B85] mt-0.5">
              Doanh nghiệp: {task.companyName}
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

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Locked state if overdue */}
          {isExpired && (
            <div className="p-4 rounded-xl bg-[#FFF2F0] border border-[#FFD6CC] text-xs text-[#B83214] flex items-start gap-2.5">
              <Lock className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Nhiệm vụ đã quá hạn nộp</p>
                <p className="mt-0.5 text-[#B83214]/90">
                  Hạn nộp của nhiệm vụ đã kết thúc. Quyền nộp bài đã bị khóa theo quy chế đánh giá công bằng.
                </p>
              </div>
            </div>
          )}

          {/* Submission Format Switcher: Link vs File */}
          <div>
            <label className="block text-xs font-semibold text-[#16243D] mb-2">
              Hình thức gửi sản phẩm *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSubmissionType('link')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-medium transition-all ${
                  submissionType === 'link'
                    ? 'border-[#3D7DD8] bg-[#EAF2FC] text-[#3D7DD8] font-semibold'
                    : 'border-[#DCE8F8] bg-white text-[#5B6B85] hover:bg-slate-50'
                }`}
              >
                <Link2 className="w-3.5 h-3.5" />
                Đường dẫn liên kết (URL)
              </button>
              <button
                type="button"
                onClick={() => setSubmissionType('file')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-medium transition-all ${
                  submissionType === 'file'
                    ? 'border-[#3D7DD8] bg-[#EAF2FC] text-[#3D7DD8] font-semibold'
                    : 'border-[#DCE8F8] bg-white text-[#5B6B85] hover:bg-slate-50'
                }`}
              >
                <FileUp className="w-3.5 h-3.5" />
                Tải lên tệp tài liệu
              </button>
            </div>
          </div>

          {/* Input field based on type */}
          {submissionType === 'link' ? (
            <div>
              <label className="block text-xs font-semibold text-[#16243D] mb-1">
                Đường dẫn sản phẩm (GitHub, Figma, Notion, Sheets...) *
              </label>
              <input
                type="url"
                value={deliverableLink}
                onChange={(e) => {
                  setDeliverableLink(e.target.value);
                  setErrorMsg('');
                }}
                disabled={isExpired}
                placeholder="https://github.com/ban/du-an hoặc https://figma.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] bg-white focus:ring-2 focus:ring-[#3D7DD8]/30 outline-none disabled:bg-slate-100"
              />
              <p className="text-[11px] text-[#5B6B85] mt-1">
                Đảm bảo liên kết đã mở quyền truy cập công khai để ban chấm điểm mở xem.
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-[#16243D] mb-1">
                Tệp đính kèm sản phẩm (.pdf, .zip, .xlsx, .docx) *
              </label>
              <div className="border-2 border-dashed border-[#DCE8F8] rounded-xl p-5 text-center bg-[#F5F9FF] hover:bg-[#EAF2FC] transition-colors relative">
                <input
                  type="file"
                  onChange={handleSimulatedFileUpload}
                  disabled={isExpired}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <UploadCloud className="w-7 h-7 text-[#3D7DD8] mx-auto mb-1.5" />
                <p className="text-xs font-medium text-[#16243D]">
                  {fileName ? (
                    <span className="text-[#3D7DD8] font-semibold">{fileName}</span>
                  ) : (
                    'Bấm hoặc kéo thả tệp bài làm vào đây'
                  )}
                </p>
                <p className="text-[11px] text-[#5B6B85] mt-0.5">
                  Hỗ trợ tối đa 50MB (Bản demo mô phỏng tải tệp)
                </p>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#16243D] mb-1">
              Ghi chú giải trình giải pháp (Tùy chọn)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isExpired}
              placeholder="Tóm tắt cách bạn tiếp cận bài toán, các giả định đã đặt ra hoặc lưu ý khi chạy sản phẩm..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] bg-white focus:ring-2 focus:ring-[#3D7DD8]/30 outline-none disabled:bg-slate-100"
            />
          </div>

          {/* Mandatory Academic Integrity Checkbox: Bắt buộc tích "Tôi cam kết tự làm bài này" */}
          <div className="p-3.5 rounded-xl bg-[#F5F9FF] border border-[#DCE8F8]">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={selfPledgeConfirmed}
                onChange={(e) => {
                  setSelfPledgeConfirmed(e.target.checked);
                  setErrorMsg('');
                }}
                disabled={isExpired}
                className="mt-0.5 rounded border-[#DCE8F8] text-[#3D7DD8] focus:ring-[#3D7DD8]"
              />
              <span className="text-xs text-[#16243D] leading-relaxed">
                <strong>Tôi cam kết tự làm bài này.</strong> Bài làm là kết quả lao động trí tuệ của chính tôi, không sao chép nguyên mẫu từ người khác và tuân thủ chuẩn mực liêm chính học thuật của Stulance.
              </span>
            </label>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-[#FFF8F7] border border-[#FFD6CC] text-xs text-[#B83214] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Actions */}
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
              disabled={isExpired}
              className="px-6 py-2.5 bg-[#3D7DD8] hover:bg-[#2F67B5] disabled:opacity-50 text-white text-xs font-semibold rounded-full transition-colors shadow-xs"
            >
              {isUpdating ? 'Lưu chỉnh sửa bài nộp' : 'Xác nhận nộp bài làm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
