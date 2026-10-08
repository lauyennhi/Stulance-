import React, { useState } from 'react';
import {
  AlertTriangle,
  Award,
  Building,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck2,
  HelpCircle,
  ShieldAlert,
  Sparkles,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Task } from '../../types';

interface TaskDetailModalProps {
  taskId: string | null;
  onClose: () => void;
  onOpenReport?: (taskId: string) => void;
  onOpenCompanyProfile?: (companyId: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  taskId,
  onClose,
  onOpenReport,
  onOpenCompanyProfile,
}) => {
  const { tasks, companies, myTasks, claimTask, currentUser, openAuth, setCurrentTab } = useApp();

  if (!taskId) return null;

  const task = tasks.find((t) => t.id === taskId);
  if (!task) return null;

  const company = companies.find((c) => c.id === task.companyId) || {
    id: task.companyId,
    name: task.companyName,
    status: 'verified',
    industry: task.category,
    location: 'Hà Nội & TP.HCM',
    description: 'Doanh nghiệp đối tác tuyển dụng trên Stulance.',
  };

  // Check if currently logged in student has claimed this task
  const existingClaim = myTasks.find(
    (m) => m.taskId === task.id && m.studentId === currentUser?.id && m.status !== 'cancelled'
  );

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num) + ' đ';
  };

  const handleAction = () => {
    if (!currentUser) {
      onClose();
      openAuth('login');
      return;
    }

    if (existingClaim) {
      onClose();
      setCurrentTab('my-tasks');
      return;
    }

    const success = claimTask(task.id);
    if (success) {
      onClose();
      setCurrentTab('my-tasks');
    }
  };

  const isChallenge = task.type === 'challenge';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#16243D]/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl bg-white border border-[#DCE8F8] rounded-[20px] shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-[#F5F9FF] border-b border-[#DCE8F8]">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-[#3D7DD8]">{task.category}</span>
                <span>·</span>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                    isChallenge
                      ? 'bg-[#EAF2FC] text-[#3D7DD8]'
                      : 'bg-[#FFE9A8] text-[#7A5B00]'
                  }`}
                >
                  {isChallenge ? '⚡ Thử sức (Tối đa 3h)' : '📋 Dự án ngắn'}
                </span>
                {task.isUrgent && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#FFD6CC] text-[#B83214]">
                    Hạn gấp
                  </span>
                )}
              </div>

              <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#16243D] leading-snug">
                {task.title}
              </h2>

              {/* Company Info Button */}
              <div className="flex items-center gap-2 pt-1 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCompanyProfile?.(task.companyId);
                  }}
                  className="font-medium text-[#16243D] hover:text-[#3D7DD8] hover:underline flex items-center gap-1.5 transition-colors"
                >
                  <Building className="w-3.5 h-3.5 text-[#3D7DD8]" />
                  <span>{task.companyName}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3D7DD8]" />
                </button>
                <span className="text-[#5B6B85]">· {company.location}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-[#5B6B85] hover:text-[#16243D] hover:bg-white rounded-full transition-colors shrink-0"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[68vh] overflow-y-auto">
          {/* Key Parameters Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#F5F9FF] border border-[#DCE8F8]">
            <div>
              <p className="text-[11px] text-[#5B6B85]">Thù lao nhận được</p>
              <p className="font-heading font-bold text-base text-[#7A5B00]">
                {formatVND(task.rewardVND)}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[#5B6B85]">Thời lượng ước tính</p>
              <p className="font-heading font-bold text-base text-[#16243D]">
                {task.estimatedHours} giờ làm
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-[11px] text-[#5B6B85]">Hạn chót mở đề</p>
              <p className="font-heading font-bold text-base text-[#16243D]">
                {task.deadline}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-heading font-semibold text-sm text-[#16243D] uppercase tracking-wider mb-2">
              Mô tả nhiệm vụ thực tế
            </h3>
            <p className="text-xs sm:text-sm text-[#16243D] leading-relaxed">
              {task.description}
            </p>
          </div>

          {/* Deliverable Format */}
          <div className="p-4 rounded-xl border border-[#DCE8F8] bg-white">
            <h4 className="font-heading font-semibold text-xs text-[#3D7DD8] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4" />
              Sản phẩm bạn cần nộp
            </h4>
            <p className="text-xs text-[#16243D] leading-relaxed">
              {task.deliverableFormat}
            </p>
          </div>

          {/* Technical Requirements */}
          <div>
            <h3 className="font-heading font-semibold text-sm text-[#16243D] uppercase tracking-wider mb-2">
              Yêu cầu chi tiết
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#16243D]">
              {task.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3D7DD8] mt-2 shrink-0" />
                  <span className="leading-relaxed">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* PUBLIC EVALUATION CRITERIA (Tiêu chí chấm công khai: 2-5 tiêu chí kèm điểm tối đa) */}
          <div className="p-5 rounded-2xl bg-[#F5F9FF] border border-[#DCE8F8]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#3D7DD8]" />
                <h3 className="font-heading font-semibold text-sm text-[#16243D]">
                  Tiêu chí chấm điểm công khai
                </h3>
              </div>
              <span className="text-xs font-semibold text-[#3D7DD8] font-numbers">
                Thang điểm 10.0
              </span>
            </div>
            <p className="text-[11px] text-[#5B6B85] mb-3 leading-relaxed">
              Doanh nghiệp bắt buộc phải chấm điểm theo đúng các tiêu chí này và ghi nhận xét cụ thể cho từng phần.
            </p>

            <div className="space-y-2.5">
              {task.evaluationCriteriaList.map((crit, idx) => (
                <div
                  key={crit.id || idx}
                  className="p-3 rounded-xl bg-white border border-[#DCE8F8] flex items-start justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-[#16243D]">
                      {idx + 1}. {crit.name}
                    </p>
                    {crit.description && (
                      <p className="text-[#5B6B85] text-[11px] mt-0.5 leading-relaxed">
                        {crit.description}
                      </p>
                    )}
                  </div>
                  <span className="font-heading font-bold text-xs text-[#3D7DD8] shrink-0 bg-[#EAF2FC] px-2 py-0.5 rounded-full">
                    Tối đa {crit.maxScore}đ
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* About Company snippet */}
          <div className="pt-2 border-t border-[#DCE8F8] flex items-center justify-between text-xs text-[#5B6B85]">
            <p className="truncate max-w-sm">
              Đăng bởi {task.companyName} · Đã xác minh bởi Ban Hợp tác Doanh nghiệp
            </p>
            <button
              onClick={() => {
                onClose();
                onOpenCompanyProfile?.(task.companyId);
              }}
              className="text-[#3D7DD8] font-semibold hover:underline flex items-center gap-1 shrink-0"
            >
              Xem trang doanh nghiệp
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-white border-t border-[#DCE8F8] flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenReport?.(task.id);
            }}
            className="text-xs text-[#5B6B85] hover:text-[#B83214] flex items-center gap-1.5 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Báo cáo vi phạm nhiệm vụ
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-[#DCE8F8] text-xs font-medium text-[#16243D] hover:bg-slate-50 transition-colors"
            >
              Đóng
            </button>

            {existingClaim ? (
              <button
                type="button"
                onClick={handleAction}
                className="px-6 py-2.5 rounded-full bg-[#EAF2FC] text-[#3D7DD8] text-xs font-semibold hover:bg-[#3D7DD8] hover:text-white transition-colors"
              >
                Đến bài làm của bạn →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAction}
                className="px-7 py-2.5 rounded-full bg-[#3D7DD8] hover:bg-[#2F67B5] text-white text-xs font-semibold transition-colors shadow-xs"
              >
                {isChallenge ? 'Nhận nhiệm vụ ngay' : 'Ứng tuyển dự án ngắn'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
