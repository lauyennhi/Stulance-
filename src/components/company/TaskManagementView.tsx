import React, { useState } from 'react';
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  Clock,
  Edit3,
  ExternalLink,
  Eye,
  FileCheck2,
  Filter,
  Plus,
  PlusCircle,
  RotateCcw,
  Search,
  Sparkles,
  StopCircle,
  Trash2,
  XCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Task, TaskStatus, TaskType } from '../../types';
import { EmptyState } from '../common/EmptyState';
import { CreateTaskWizardModal } from './CreateTaskWizardModal';

export const TaskManagementView: React.FC = () => {
  const {
    currentCompany,
    tasks,
    submissions,
    myTasks,
    deleteTask,
    closeTaskEarly,
    setCurrentTab,
    notify,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | TaskType>('all');

  // Wizard modal
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const companyTasks = tasks.filter(
    (t) => t.companyId === (currentCompany?.id || 'comp-1')
  );

  const isCompanyVerified = currentCompany?.status === 'verified';

  // Filter tasks
  const filteredTasks = companyTasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.shortBrief.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesType = typeFilter === 'all' || task.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'open':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#CDEFE0] text-[#0F5B39]">
            Đang mở nhận bài
          </span>
        );
      case 'draft':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#EAF2FC] text-[#3D7DD8]">
            Bản nháp
          </span>
        );
      case 'pending_review':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FFE9A8] text-[#7A5B00]">
            Chờ trường duyệt
          </span>
        );
      case 'closed':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-[#5B6B85]">
            Đã đóng
          </span>
        );
      case 'rejected':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FFD6CC] text-[#B83214]">
            Bị từ chối
          </span>
        );
      case 'removed':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FFD6CC] text-[#B83214]">
            Bị gỡ vi phạm
          </span>
        );
    }
  };

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsWizardOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    // Rule: "Không cho sửa khi đã có sinh viên nhận"
    const hasStudentAccepted =
      submissions.some((s) => s.taskId === task.id) ||
      myTasks.some((m) => m.taskId === task.id);

    if (hasStudentAccepted) {
      notify(
        'Không thể sửa nhiệm vụ',
        'Nhiệm vụ này đã có sinh viên nhận làm đề bài. Bạn không thể sửa đổi nội dung để đảm bảo tính minh bạch và công bằng cho sinh viên.',
        'error'
      );
      return;
    }

    // Rule: "Sửa khi là Nháp hoặc Bị từ chối"
    if (task.status !== 'draft' && task.status !== 'rejected') {
      notify(
        'Quy chế chỉnh sửa',
        'Chỉ có thể chỉnh sửa nhiệm vụ khi đang ở trạng thái Nháp hoặc Bị từ chối. Với nhiệm vụ Đang mở, bạn có thể chọn Đóng sớm.',
        'info'
      );
      return;
    }

    setEditingTask(task);
    setIsWizardOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="stulance-card p-6 border border-[#DCE8F8] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-bold text-xl text-[#16243D]">
            Quản lý nhiệm vụ tuyển dụng
          </h2>
          <p className="text-xs text-[#5B6B85] mt-0.5">
            Tổng cộng: <strong>{companyTasks.length}</strong> nhiệm vụ · Đang mở:{' '}
            <strong>{companyTasks.filter((t) => t.status === 'open').length}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 ${
              isCompanyVerified
                ? 'bg-[#3D7DD8] hover:bg-[#2F67B5] text-white'
                : 'bg-[#FFE9A8] text-[#7A5B00] border border-[#F0DC94]'
            }`}
          >
            <Plus className="w-4 h-4" />
            Tạo nhiệm vụ mới
            {!isCompanyVerified && ' (Lưu nháp)'}
          </button>
        </div>
      </div>

      {/* Verification Notice if not verified */}
      {!isCompanyVerified && (
        <div className="p-4 rounded-2xl bg-[#FFF9E6] border border-[#FFE9A8] flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#7A5B00] shrink-0 mt-0.5" />
          <div className="text-xs text-[#7A5B00]">
            <strong>Doanh nghiệp chưa xác minh:</strong> Bạn vẫn có thể soạn đề bài và <strong>Lưu bản nháp</strong>. Nút đăng tuyển công khai sẽ mở ngay khi cán bộ trường phê duyệt hồ sơ pháp lý của bạn.
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="stulance-card p-4 sm:p-5 border border-[#DCE8F8] bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#5B6B85] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên nhiệm vụ, chuyên ngành..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] outline-none focus:ring-2 focus:ring-[#3D7DD8]/30"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] bg-white outline-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="open">Đang mở (open)</option>
            <option value="draft">Bản nháp (draft)</option>
            <option value="pending_review">Chờ duyệt (pending)</option>
            <option value="closed">Đã đóng (closed)</option>
            <option value="rejected">Bị từ chối (rejected)</option>
            <option value="removed">Bị gỡ (removed)</option>
          </select>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] bg-white outline-none"
          >
            <option value="all">Tất cả loại</option>
            <option value="challenge">Thử sức (≤ 3h)</option>
            <option value="project">Dự án ngắn (5-40h)</option>
          </select>

          {(searchQuery || statusFilter !== 'all' || typeFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setTypeFilter('all');
              }}
              className="px-3 py-2 text-xs text-[#3D7DD8] hover:underline"
            >
              Đặt lại
            </button>
          )}
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="Không tìm thấy nhiệm vụ phù hợp"
          description="Thử thay đổi từ khóa tìm kiếm hoặc tạo một nhiệm vụ mới từ bộ mẫu chuẩn ngành."
          actionText="Tạo nhiệm vụ mới"
          onAction={handleOpenCreateModal}
        />
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => {
            const hasStudents =
              submissions.some((s) => s.taskId === task.id) ||
              myTasks.some((m) => m.taskId === task.id);
            const pendingSubCount = submissions.filter(
              (s) => s.taskId === task.id && s.status === 'submitted'
            ).length;

            return (
              <div
                key={task.id}
                className="stulance-card p-6 border border-[#DCE8F8] bg-white flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all hover:border-[#A9CFFA]"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EAF2FC] text-[#3D7DD8]">
                      {task.category}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FFE9A8] text-[#7A5B00]">
                      {task.type === 'challenge' ? 'Thử sức (≤ 3h)' : 'Dự án ngắn (5-40h)'}
                    </span>
                    {getStatusBadge(task.status)}
                    {task.isUrgent && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FFD6CC] text-[#B83214]">
                        Hạn gấp
                      </span>
                    )}
                  </div>

                  <h3 className="font-heading font-bold text-base text-[#16243D] mb-1">
                    {task.title}
                  </h3>
                  <p className="text-xs text-[#5B6B85] line-clamp-2 mb-3 leading-relaxed">
                    {task.shortBrief}
                  </p>

                  <div className="flex items-center gap-5 text-xs text-[#5B6B85] flex-wrap">
                    <span>
                      Thời lượng: <strong>{task.estimatedHours} giờ</strong>
                    </span>
                    <span>
                      Hạn nộp: <strong>{task.deadline}</strong>
                    </span>
                    <span>
                      Thù lao:{' '}
                      <strong className="text-[#7A5B00] font-heading font-bold">
                        {new Intl.NumberFormat('vi-VN').format(task.rewardVND)} đ
                      </strong>
                    </span>
                    <span>
                      Bài nộp: <strong>{task.submissionCount}</strong> (
                      <span className="text-[#B83214] font-semibold">
                        {pendingSubCount} chờ chấm
                      </span>
                      )
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-[#DCE8F8] flex-wrap self-end md:self-auto">
                  {/* Xem bài nộp */}
                  <button
                    onClick={() => setCurrentTab('grade-submissions')}
                    className="px-3.5 py-2 rounded-full bg-[#F5F9FF] border border-[#DCE8F8] text-xs font-semibold text-[#16243D] hover:bg-[#EAF2FC] transition-colors flex items-center gap-1.5"
                  >
                    <FileCheck2 className="w-3.5 h-3.5 text-[#3D7DD8]" />
                    Chấm bài ({pendingSubCount})
                  </button>

                  {/* Sửa nhiệm vụ: "Sửa khi là Nháp hoặc Bị từ chối. Không cho sửa khi đã có sinh viên nhận" */}
                  {(task.status === 'draft' || task.status === 'rejected') && (
                    <button
                      onClick={() => handleOpenEditModal(task)}
                      disabled={hasStudents}
                      title={hasStudents ? 'Đã có sinh viên nhận làm, không thể sửa' : 'Chỉnh sửa'}
                      className={`px-3 py-2 rounded-full border text-xs font-medium flex items-center gap-1 ${
                        hasStudents
                          ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                          : 'border-[#DCE8F8] text-[#16243D] hover:bg-[#F5F9FF]'
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Sửa
                    </button>
                  )}

                  {/* Xóa nhiệm vụ: "Xóa khi là Nháp" */}
                  {task.status === 'draft' && (
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 rounded-full text-[#B83214] hover:bg-[#FFD6CC]/30 transition-colors"
                      title="Xóa bản nháp"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  {/* Đóng sớm khi Đang mở */}
                  {task.status === 'open' && (
                    <button
                      onClick={() => closeTaskEarly(task.id)}
                      className="px-3.5 py-2 rounded-full border border-[#DCE8F8] text-xs font-medium text-[#B83214] hover:bg-[#FFD6CC]/20 transition-colors flex items-center gap-1"
                    >
                      <StopCircle className="w-3.5 h-3.5" />
                      Đóng sớm
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Wizard Modal */}
      {isWizardOpen && (
        <CreateTaskWizardModal
          isOpen={isWizardOpen}
          editingTask={editingTask}
          onClose={() => {
            setIsWizardOpen(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
};
