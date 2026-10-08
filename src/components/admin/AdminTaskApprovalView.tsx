import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Briefcase,
  CheckCircle2,
  Clock,
  Coins,
  ExternalLink,
  Eye,
  FileCheck2,
  FileText,
  Filter,
  Layers,
  Search,
  ShieldAlert,
  ShieldCheck,
  StopCircle,
  Trash2,
  X,
  XCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Task, TaskStatus } from '../../types';
import { EmptyState } from '../common/EmptyState';

export const AdminTaskApprovalView: React.FC = () => {
  const { tasks, approveTask, rejectTask, removeTaskByAdmin, notify } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('pending_review');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectingTask, setInspectingTask] = useState<Task | null>(null);

  // Reject / Remove modal
  const [actionModal, setActionModal] = useState<{
    type: 'reject' | 'remove';
    task: Task;
  } | null>(null);
  const [reasonInput, setReasonInput] = useState('');

  const pendingCount = tasks.filter((t) => t.status === 'pending_review').length;

  const filteredTasks = tasks.filter((t) => {
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Automated Checklist Analysis
  const runAutoChecklist = (task: Task) => {
    // 1. Giới hạn giờ: Thử sức <= 3h, Dự án ngắn 5-40h
    const isChallenge = task.type === 'challenge';
    const hoursValid = isChallenge ? task.estimatedHours <= 3 : task.estimatedHours >= 5 && task.estimatedHours <= 40;
    const hoursMsg = isChallenge
      ? task.estimatedHours <= 3
        ? `Đạt (${task.estimatedHours}h ≤ 3h quy định)`
        : `Vi phạm (${task.estimatedHours}h vượt quá 3h quy định cho Thử sức)`
      : task.estimatedHours >= 5 && task.estimatedHours <= 40
      ? `Đạt (${task.estimatedHours}h nằm trong khoảng 5–40h)`
      : `Vi phạm (${task.estimatedHours}h ngoài khung 5–40h của Dự án ngắn)`;

    // 2. Tiêu chí chấm: 2 - 5 tiêu chí kèm điểm tối đa
    const criteriaCount = task.evaluationCriteriaList?.length || 0;
    const criteriaValid = criteriaCount >= 2 && criteriaCount <= 5;
    const totalMax = (task.evaluationCriteriaList || []).reduce((sum: number, c) => sum + (c.maxScore || 0), 0);
    const criteriaMsg = criteriaValid
      ? `Đạt (${criteriaCount} tiêu chí, tổng thang ${totalMax} điểm)`
      : `Vi phạm (Có ${criteriaCount} tiêu chí; quy định từ 2–5 tiêu chí)`;

    // 3. Thù lao với dự án ngắn
    const rewardValid = task.type === 'project' ? task.rewardVND > 0 : true;
    const rewardMsg =
      task.type === 'project'
        ? task.rewardVND > 0
          ? `Đạt (${new Intl.NumberFormat('vi-VN').format(task.rewardVND)} đ)`
          : `Vi phạm (Dự án ngắn bắt buộc có thù lao chi trả cho sinh viên)`
        : task.rewardVND > 0
        ? `Tự nguyện (${new Intl.NumberFormat('vi-VN').format(task.rewardVND)} đ)`
        : `Tự nguyện (Không thù lao)`;

    // 4. Không yêu cầu đóng phí (phát hiện từ khóa nghi vấn)
    const textToCheck = `${task.title} ${task.description} ${task.deliverableFormat || ''} ${task.shortBrief}`.toLowerCase();
    const feeKeywords = ['đóng phí', 'nộp phí', 'đặt cọc', 'phí tài liệu', 'phí đào tạo', 'phí tham gia', 'chuyển khoản trước'];
    const detectedKeyword = feeKeywords.find((kw) => textToCheck.includes(kw));
    const noFeeValid = !detectedKeyword;
    const noFeeMsg = noFeeValid
      ? 'Đạt an toàn (Không phát hiện từ khóa thu phí hoặc giữ cọc)'
      : `Cảnh báo vi phạm nghiêm trọng (Phát hiện từ khóa: "${detectedKeyword}")`;

    const allPassed = hoursValid && criteriaValid && rewardValid && noFeeValid;

    return {
      hoursValid,
      hoursMsg,
      criteriaValid,
      criteriaMsg,
      rewardValid,
      rewardMsg,
      noFeeValid,
      noFeeMsg,
      allPassed,
    };
  };

  const handleApprove = (task: Task) => {
    approveTask(task.id);
    if (inspectingTask?.id === task.id) {
      setInspectingTask(null);
    }
  };

  const handleConfirmAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionModal) return;
    if (!reasonInput.trim()) {
      notify('Thiếu lý do', 'Vui lòng nhập lý do cụ thể gửi về cho doanh nghiệp.', 'error');
      return;
    }

    if (actionModal.type === 'reject') {
      rejectTask(actionModal.task.id, reasonInput.trim());
    } else {
      removeTaskByAdmin(actionModal.task.id, reasonInput.trim());
    }

    if (inspectingTask?.id === actionModal.task.id) {
      setInspectingTask(null);
    }
    setActionModal(null);
    setReasonInput('');
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'pending_review':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FFE9A8] text-[#7A5B00] flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Chờ duyệt
          </span>
        );
      case 'open':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#CDEFE0] text-[#0F5B39] flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Đang mở
          </span>
        );
      case 'rejected':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FFF2F0] text-[#B83214] flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Bị từ chối
          </span>
        );
      case 'removed':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#16243D] text-white flex items-center gap-1">
            <StopCircle className="w-3 h-3" />
            Bị gỡ
          </span>
        );
      case 'closed':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#E5E9F0] text-[#5B6B85] flex items-center gap-1">
            Đã đóng
          </span>
        );
      case 'draft':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F5F9FF] border border-[#DCE8F8] text-[#5B6B85] flex items-center gap-1">
            Bản nháp
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading font-bold text-xl text-[#16243D]">
            Duyệt & Kiểm định chất lượng nhiệm vụ
          </h3>
          <p className="text-xs text-[#5B6B85] mt-1">
            Bảng kiểm tự động thẩm định: thời lượng (≤3h hoặc 5–40h), 2–5 tiêu chí chấm, thù lao bắt buộc với dự án ngắn, và ngăn chặn thu phí sinh viên.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#FFE9A8] text-[#7A5B00] border border-[#F0D582] flex items-center gap-1.5 shadow-xs">
              <Clock className="w-3.5 h-3.5 animate-spin" />
              {pendingCount} nhiệm vụ chờ duyệt
            </span>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="stulance-card p-4 border border-[#DCE8F8] bg-white flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'pending_review', label: `Chờ duyệt (${pendingCount})` },
            { id: 'open', label: 'Đang mở' },
            { id: 'rejected', label: 'Bị từ chối' },
            { id: 'removed', label: 'Bị gỡ vi phạm' },
            { id: 'closed', label: 'Đã đóng' },
            { id: 'all', label: `Tất cả (${tasks.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === tab.id
                  ? 'bg-[#3D7DD8] text-white shadow-xs'
                  : 'bg-[#F5F9FF] text-[#5B6B85] hover:text-[#16243D] border border-[#DCE8F8]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-[#5B6B85] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm tên nhiệm vụ, doanh nghiệp, ngành..."
            className="w-full pl-8 pr-3.5 py-1.5 rounded-full border border-[#DCE8F8] bg-[#F5F9FF] text-xs text-[#16243D] outline-none focus:ring-2 focus:ring-[#3D7DD8]/20"
          />
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title={
            statusFilter === 'pending_review'
              ? 'Không có nhiệm vụ nào đang chờ duyệt'
              : 'Không tìm thấy nhiệm vụ phù hợp'
          }
          description="Tất cả nhiệm vụ đề xuất từ phía doanh nghiệp đã được kiểm định đầy đủ theo tiêu chuẩn của Nhà trường."
          actionText={statusFilter !== 'all' ? 'Xem tất cả nhiệm vụ' : undefined}
          onAction={statusFilter !== 'all' ? () => setStatusFilter('all') : undefined}
        />
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => {
            const checklist = runAutoChecklist(task);
            return (
              <div
                key={task.id}
                className="stulance-card p-5 sm:p-6 border border-[#DCE8F8] bg-white flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-[#A9CFFA] transition-all"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {getStatusBadge(task.status)}
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#F5F9FF] border border-[#DCE8F8] text-[#3D7DD8]">
                      {task.type === 'challenge' ? 'Thử sức (≤ 3h)' : 'Dự án ngắn (5–40h)'}
                    </span>
                    <span className="text-[11px] font-medium text-[#5B6B85]">
                      {task.category}
                    </span>
                    <span className="text-[#5B6B85]">·</span>
                    <span className="text-xs font-semibold text-[#16243D]">
                      {task.companyName}
                    </span>
                  </div>

                  <h4 className="font-heading font-bold text-base text-[#16243D] mb-1">
                    {task.title}
                  </h4>
                  <p className="text-xs text-[#5B6B85] line-clamp-2 leading-relaxed mb-3">
                    {task.description || task.shortBrief}
                  </p>

                  {/* Checklist Summary Tag */}
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                        checklist.allPassed
                          ? 'bg-[#CDEFE0]/60 text-[#0F5B39]'
                          : 'bg-[#FFF2F0] text-[#B83214]'
                      }`}
                    >
                      {checklist.allPassed ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Bảng kiểm: Đạt chuẩn 4/4 tiêu chí
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Bảng kiểm: Có tiêu chí chưa đạt
                        </>
                      )}
                    </span>

                    <span className="text-[11px] text-[#5B6B85]">
                      Thời lượng: <strong>{task.estimatedHours}h</strong>
                    </span>
                    <span className="text-[11px] text-[#5B6B85]">
                      Thù lao:{' '}
                      <strong className="text-[#B27B00]">
                        {task.rewardVND > 0
                          ? `${new Intl.NumberFormat('vi-VN').format(task.rewardVND)} đ`
                          : 'Không'}
                      </strong>
                    </span>
                    <span className="text-[11px] text-[#5B6B85]">
                      Tiêu chí: <strong>{task.evaluationCriteriaList?.length || 0} mục</strong>
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2.5 shrink-0 self-end lg:self-center border-t lg:border-t-0 pt-3 lg:pt-0 w-full lg:w-auto justify-end">
                  <button
                    onClick={() => setInspectingTask(task)}
                    className="px-4 py-2 rounded-full border border-[#DCE8F8] bg-[#F5F9FF] text-xs font-medium text-[#16243D] hover:bg-[#EAF2FC] transition-colors flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Xem bảng kiểm & chi tiết
                  </button>

                  {task.status === 'pending_review' && (
                    <>
                      <button
                        onClick={() => {
                          setActionModal({ type: 'reject', task });
                          setReasonInput('');
                        }}
                        className="px-4 py-2 rounded-full bg-[#FFF2F0] text-[#B83214] text-xs font-semibold hover:bg-[#FFE5E0] transition-colors"
                      >
                        Từ chối
                      </button>
                      <button
                        onClick={() => handleApprove(task)}
                        className="px-5 py-2 rounded-full bg-[#3D7DD8] hover:bg-[#2F67B5] text-white text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Duyệt mở
                      </button>
                    </>
                  )}

                  {task.status === 'open' && (
                    <button
                      onClick={() => {
                        setActionModal({ type: 'remove', task });
                        setReasonInput('');
                      }}
                      className="px-4 py-2 rounded-full bg-[#FFF2F0] text-[#B83214] text-xs font-semibold hover:bg-[#FFE5E0] transition-colors flex items-center gap-1"
                    >
                      <StopCircle className="w-3.5 h-3.5" />
                      Gỡ nhiệm vụ
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* INSPECT TASK MODAL WITH AUTOMATED CHECKLIST */}
      {inspectingTask && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#16243D]/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className="relative w-full max-w-3xl bg-white border border-[#DCE8F8] rounded-[24px] shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#DCE8F8] pb-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  {getStatusBadge(inspectingTask.status)}
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#F5F9FF] text-[#3D7DD8]">
                    {inspectingTask.type === 'challenge' ? 'Thử sức (≤3h)' : 'Dự án ngắn (5–40h)'}
                  </span>
                  <span className="text-xs text-[#5B6B85]">{inspectingTask.category}</span>
                </div>
                <h3 className="font-heading font-bold text-xl text-[#16243D]">
                  {inspectingTask.title}
                </h3>
                <p className="text-xs text-[#5B6B85] mt-0.5">
                  Đăng bởi <strong>{inspectingTask.companyName}</strong> · Hạn nộp: {inspectingTask.deadline}
                </p>
              </div>
              <button
                onClick={() => setInspectingTask(null)}
                className="p-1.5 text-[#5B6B85] hover:text-[#16243D] hover:bg-[#F5F9FF] rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AUTOMATED CHECKLIST SECTION */}
            {(() => {
              const chk = runAutoChecklist(inspectingTask);
              return (
                <div className="mb-6 p-5 rounded-2xl bg-[#F5F9FF] border border-[#DCE8F8]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#3D7DD8] text-white flex items-center justify-center font-bold">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-sm text-[#16243D]">
                          Bảng kiểm tự động của Nhà trường
                        </h4>
                        <p className="text-[11px] text-[#5B6B85]">
                          Hệ thống tự quét 4 điều kiện an toàn & quy chế đào tạo thực hành
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        chk.allPassed
                          ? 'bg-[#CDEFE0] text-[#0F5B39]'
                          : 'bg-[#FFF2F0] text-[#B83214]'
                      }`}
                    >
                      {chk.allPassed ? '✓ ĐỦ ĐIỀU KIỆN PHÊ DUYỆT' : '⚠ CẦN XEM XÉT LẠI'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Item 1: Hours */}
                    <div
                      className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                        chk.hoursValid
                          ? 'bg-white border-[#CDEFE0]'
                          : 'bg-[#FFF8F7] border-[#FFD6CC]'
                      }`}
                    >
                      {chk.hoursValid ? (
                        <CheckCircle2 className="w-4 h-4 text-[#0F5B39] shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-[#B83214] shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-semibold text-[#16243D]">1. Khung giờ thực tế</p>
                        <p className="text-[11px] text-[#5B6B85] mt-0.5">{chk.hoursMsg}</p>
                      </div>
                    </div>

                    {/* Item 2: Rubric */}
                    <div
                      className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                        chk.criteriaValid
                          ? 'bg-white border-[#CDEFE0]'
                          : 'bg-[#FFF8F7] border-[#FFD6CC]'
                      }`}
                    >
                      {chk.criteriaValid ? (
                        <CheckCircle2 className="w-4 h-4 text-[#0F5B39] shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-[#B83214] shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-semibold text-[#16243D]">2. Tiêu chí chấm công khai</p>
                        <p className="text-[11px] text-[#5B6B85] mt-0.5">{chk.criteriaMsg}</p>
                      </div>
                    </div>

                    {/* Item 3: Reward */}
                    <div
                      className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                        chk.rewardValid
                          ? 'bg-white border-[#CDEFE0]'
                          : 'bg-[#FFF8F7] border-[#FFD6CC]'
                      }`}
                    >
                      {chk.rewardValid ? (
                        <CheckCircle2 className="w-4 h-4 text-[#0F5B39] shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-[#B83214] shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-semibold text-[#16243D]">3. Thù lao dự án ngắn</p>
                        <p className="text-[11px] text-[#5B6B85] mt-0.5">{chk.rewardMsg}</p>
                      </div>
                    </div>

                    {/* Item 4: No fee */}
                    <div
                      className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                        chk.noFeeValid
                          ? 'bg-white border-[#CDEFE0]'
                          : 'bg-[#FFF8F7] border-[#FFD6CC]'
                      }`}
                    >
                      {chk.noFeeValid ? (
                        <CheckCircle2 className="w-4 h-4 text-[#0F5B39] shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-[#B83214] shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-semibold text-[#16243D]">4. Không thu phí sinh viên</p>
                        <p className="text-[11px] text-[#5B6B85] mt-0.5">{chk.noFeeMsg}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Task Details Content */}
            <div className="space-y-5 text-xs text-[#16243D]">
              <div>
                <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-[#5B6B85] mb-1.5">
                  Mô tả nhiệm vụ
                </h5>
                <p className="p-4 rounded-xl bg-[#F5F9FF] border border-[#DCE8F8] leading-relaxed whitespace-pre-line">
                  {inspectingTask.description}
                </p>
              </div>

              <div>
                <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-[#5B6B85] mb-1.5">
                  Sản phẩm cụ thể sinh viên cần nộp
                </h5>
                <p className="p-4 rounded-xl bg-white border border-[#DCE8F8] leading-relaxed">
                  {inspectingTask.deliverableFormat}
                </p>
              </div>

              {/* Rubric criteria */}
              <div>
                <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-[#5B6B85] mb-2">
                  Bộ tiêu chí chấm ({inspectingTask.evaluationCriteriaList?.length || 0} tiêu chí)
                </h5>
                <div className="space-y-2">
                  {(inspectingTask.evaluationCriteriaList || []).map((crit) => (
                    <div
                      key={crit.id}
                      className="p-3 rounded-xl border border-[#DCE8F8] bg-white flex items-center justify-between"
                    >
                      <div>
                        <p className="font-semibold text-[#16243D]">{crit.name}</p>
                        <p className="text-[11px] text-[#5B6B85] mt-0.5">{crit.description}</p>
                      </div>
                      <span className="font-heading font-bold text-xs text-[#3D7DD8] bg-[#EAF2FC] px-3 py-1 rounded-full shrink-0">
                        Tối đa {crit.maxScore}đ
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Param Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[#F5F9FF] border border-[#DCE8F8]">
                <div>
                  <span className="text-[#5B6B85] text-[11px] block">Thời lượng</span>
                  <strong className="text-xs">{inspectingTask.estimatedHours} giờ</strong>
                </div>
                <div>
                  <span className="text-[#5B6B85] text-[11px] block">Hạn nộp</span>
                  <strong className="text-xs">{inspectingTask.deadline}</strong>
                </div>
                <div>
                  <span className="text-[#5B6B85] text-[11px] block">Thù lao</span>
                  <strong className="text-xs text-[#7A5B00]">
                    {inspectingTask.rewardVND > 0
                      ? `${new Intl.NumberFormat('vi-VN').format(inspectingTask.rewardVND)} đ`
                      : 'Không có'}
                  </strong>
                </div>
                <div>
                  <span className="text-[#5B6B85] text-[11px] block">Số lượng tối đa</span>
                  <strong className="text-xs">{inspectingTask.maxParticipants || 50} bạn</strong>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-3 pt-6 border-t border-[#DCE8F8] mt-6">
              <button
                type="button"
                onClick={() => setInspectingTask(null)}
                className="px-4 py-2 rounded-full border border-[#DCE8F8] text-xs font-medium text-[#5B6B85] hover:text-[#16243D]"
              >
                Đóng
              </button>

              <div className="flex items-center gap-2.5">
                {inspectingTask.status === 'pending_review' && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setActionModal({ type: 'reject', task: inspectingTask });
                        setReasonInput('');
                      }}
                      className="px-4 py-2.5 rounded-full bg-[#FFF2F0] hover:bg-[#FFE5E0] text-[#B83214] text-xs font-semibold transition-colors"
                    >
                      Từ chối (Nêu lý do)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApprove(inspectingTask)}
                      className="px-5 py-2.5 rounded-full bg-[#3D7DD8] hover:bg-[#2F67B5] text-white text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Phê duyệt nhiệm vụ
                    </button>
                  </>
                )}

                {inspectingTask.status === 'open' && (
                  <button
                    type="button"
                    onClick={() => {
                      setActionModal({ type: 'remove', task: inspectingTask });
                      setReasonInput('');
                    }}
                    className="px-4 py-2.5 rounded-full bg-[#FFF2F0] hover:bg-[#FFE5E0] text-[#B83214] text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <StopCircle className="w-4 h-4" />
                    Gỡ nhiệm vụ vi phạm
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ACTION MODAL (REJECT OR REMOVE) */}
      {actionModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#16243D]/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className="relative w-full max-w-md bg-white border border-[#DCE8F8] rounded-[24px] shadow-2xl p-6 sm:p-8 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF2F0] text-[#B83214] flex items-center justify-center shrink-0 border border-[#FFD6CC]">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-[#16243D]">
                  {actionModal.type === 'reject'
                    ? 'Từ chối duyệt nhiệm vụ'
                    : 'Gỡ nhiệm vụ khỏi hệ thống'}
                </h3>
                <p className="text-xs text-[#5B6B85]">
                  Nhiệm vụ: <strong>{actionModal.task.title}</strong>
                </p>
              </div>
            </div>

            <p className="text-xs text-[#5B6B85] mb-4">
              Bắt buộc nhập lý do cụ thể. Hệ thống sẽ ghi nhận vào nhật ký kiểm duyệt và gửi thông báo trực tiếp đến tài khoản doanh nghiệp.
            </p>

            <form onSubmit={handleConfirmAction} className="space-y-4">
              <textarea
                rows={4}
                required
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                placeholder="Ví dụ: Nhiệm vụ dự án ngắn 20 giờ nhưng không có thù lao; hoặc mô tả công việc có dấu hiệu thu tiền đặt cọc tài liệu trái quy chế..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] outline-none focus:ring-2 focus:ring-[#B83214]/20 resize-none bg-[#F5F9FF]"
              />

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setActionModal(null);
                    setReasonInput('');
                  }}
                  className="px-4 py-2 text-xs text-[#5B6B85] hover:text-[#16243D]"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!reasonInput.trim()}
                  className="px-5 py-2.5 bg-[#B83214] text-white text-xs font-semibold rounded-full hover:bg-[#99260E] disabled:bg-gray-300 transition-colors shadow-xs"
                >
                  {actionModal.type === 'reject' ? 'Xác nhận từ chối' : 'Xác nhận gỡ nhiệm vụ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
