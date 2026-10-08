import React, { useState } from 'react';
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  GraduationCap,
  MessageSquare,
  Send,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StudentProfile, Task } from '../../types';

interface SendInviteModalProps {
  student: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'interview_invite' | 'project_invite' | 'internship_invite';
}

export const SendInviteModal: React.FC<SendInviteModalProps> = ({
  student,
  isOpen,
  onClose,
  defaultType = 'interview_invite',
}) => {
  const { currentCompany, tasks, sendCompanyInvitation } = useApp();

  const [inviteType, setInviteType] = useState<
    'interview_invite' | 'project_invite' | 'internship_invite'
  >(defaultType);

  const [title, setTitle] = useState(
    defaultType === 'interview_invite'
      ? `Lời mời phỏng vấn vị trí Thực tập sinh từ ${currentCompany?.name}`
      : defaultType === 'project_invite'
      ? `Mời tham gia Dự án ngắn từ ${currentCompany?.name}`
      : `Mời tham gia chương trình Thực tập từ ${currentCompany?.name}`
  );

  const [message, setMessage] = useState(
    `Chào bạn ${student.name},\nChúng tôi rất ấn tượng với kết quả bài làm và Thẻ bằng chứng năng lực thực tế của bạn trên Stulance. Doanh nghiệp muốn mời bạn tham gia trao đổi chi tiết hơn.`
  );

  const [selectedTaskId, setSelectedTaskId] = useState<string>('');

  if (!isOpen) return null;

  const companyProjects = tasks.filter(
    (t) => t.companyId === (currentCompany?.id || 'comp-1') && t.type === 'project'
  );

  const handleTypeChange = (
    type: 'interview_invite' | 'project_invite' | 'internship_invite'
  ) => {
    setInviteType(type);
    if (type === 'interview_invite') {
      setTitle(`Lời mời phỏng vấn trao đổi trực tiếp từ ${currentCompany?.name}`);
    } else if (type === 'project_invite') {
      setTitle(`Mời tham gia Dự án ngắn có thù lao từ ${currentCompany?.name}`);
    } else {
      setTitle(`Mời tham gia chương trình Thực tập từ ${currentCompany?.name}`);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    sendCompanyInvitation(
      student.id,
      inviteType,
      title.trim(),
      message.trim(),
      selectedTaskId || undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#16243D]/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-xl bg-white border border-[#DCE8F8] rounded-[24px] shadow-2xl p-6 sm:p-8 my-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-5 pb-4 border-b border-[#DCE8F8]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3D7DD8] text-white flex items-center justify-center shrink-0">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-[#16243D]">
                Gửi lời mời trực tiếp tới sinh viên
              </h3>
              <p className="text-xs text-[#5B6B85] mt-0.5">
                Ứng viên: <strong>{student.name}</strong> ({student.university})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#5B6B85] hover:text-[#16243D] rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSend} className="space-y-4">
          {/* Chọn loại lời mời */}
          <div>
            <label className="block text-xs font-semibold text-[#16243D] mb-1.5">
              Loại lời mời tuyển dụng *
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleTypeChange('interview_invite')}
                className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                  inviteType === 'interview_invite'
                    ? 'border-[#3D7DD8] bg-[#EAF2FC] text-[#3D7DD8] font-semibold'
                    : 'border-[#DCE8F8] bg-white text-[#16243D] hover:bg-[#F5F9FF]'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <User className="w-3.5 h-3.5" />
                  <span>Phỏng vấn</span>
                </div>
                <span className="text-[10px] text-[#5B6B85] block">Trao đổi trực tiếp</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('project_invite')}
                className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                  inviteType === 'project_invite'
                    ? 'border-[#3D7DD8] bg-[#EAF2FC] text-[#3D7DD8] font-semibold'
                    : 'border-[#DCE8F8] bg-white text-[#16243D] hover:bg-[#F5F9FF]'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Dự án ngắn</span>
                </div>
                <span className="text-[10px] text-[#5B6B85] block">Giao việc có thù lao</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('internship_invite')}
                className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                  inviteType === 'internship_invite'
                    ? 'border-[#3D7DD8] bg-[#EAF2FC] text-[#3D7DD8] font-semibold'
                    : 'border-[#DCE8F8] bg-white text-[#16243D] hover:bg-[#F5F9FF]'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Thực tập</span>
                </div>
                <span className="text-[10px] text-[#5B6B85] block">Thực tập sinh 3-6 tháng</span>
              </button>
            </div>
          </div>

          {/* Nếu chọn dự án ngắn: cho phép đính kèm dự án cụ thể */}
          {inviteType === 'project_invite' && companyProjects.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-[#16243D] mb-1.5">
                Đính kèm Dự án ngắn cụ thể của doanh nghiệp
              </label>
              <select
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] bg-white outline-none"
              >
                <option value="">-- Chọn dự án có sẵn (Tùy chọn) --</option>
                {companyProjects.map((proj) => (
                  <option key={proj.id} value={proj.id}>
                    {proj.title} ({new Intl.NumberFormat('vi-VN').format(proj.rewardVND)} đ)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Tiêu đề lời mời */}
          <div>
            <label className="block text-xs font-semibold text-[#16243D] mb-1.5">
              Tiêu đề lời mời *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] outline-none focus:ring-2 focus:ring-[#3D7DD8]/30"
            />
          </div>

          {/* Nội dung lời nhắn */}
          <div>
            <label className="block text-xs font-semibold text-[#16243D] mb-1.5">
              Nội dung lời nhắn gửi sinh viên *
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              placeholder="Nêu rõ lý do bạn liên hệ, cơ hội công việc, thời gian trao đổi dự kiến..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] outline-none focus:ring-2 focus:ring-[#3D7DD8]/30 leading-relaxed"
            />
          </div>

          <div className="pt-3 border-t border-[#DCE8F8] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-[#5B6B85] hover:text-[#16243D]"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#3D7DD8] hover:bg-[#2F67B5] text-white text-xs font-semibold rounded-full shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Gửi lời mời ngay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
