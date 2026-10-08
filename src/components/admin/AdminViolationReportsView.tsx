import React, { useState } from 'react';
import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  Briefcase,
  Building,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  FileCheck2,
  FileText,
  Filter,
  Lock,
  Search,
  ShieldAlert,
  ShieldCheck,
  StopCircle,
  User,
  X,
  XCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ViolationReport, ViolationReportStatus } from '../../types';
import { EmptyState } from '../common/EmptyState';

export const AdminViolationReportsView: React.FC = () => {
  const {
    violationReports,
    resolveViolationReport,
    tasks,
    jobPostings,
    companies,
    notify,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'resolved'>('pending');
  const [targetTypeFilter, setTargetTypeFilter] = useState<'all' | 'task' | 'job' | 'company'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Resolution modal
  const [selectedReport, setSelectedReport] = useState<ViolationReport | null>(null);
  const [conclusion, setConclusion] = useState<'violation' | 'no_violation'>('violation');
  const [resolutionNote, setResolutionNote] = useState('');
  const [actionChoice, setActionChoice] = useState<
    'removed_task' | 'removed_job' | 'locked_account' | 'warning' | 'dismissed'
  >('removed_task');

  const pendingCount = violationReports.filter((r) => r.status === 'pending').length;

  const filteredReports = violationReports.filter((r) => {
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'pending'
        ? r.status === 'pending'
        : r.status !== 'pending';

    const matchesType = targetTypeFilter === 'all' || r.targetType === targetTypeFilter;

    const matchesSearch =
      r.targetTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.studentName && r.studentName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesType && matchesSearch;
  });

  const handleOpenResolveModal = (report: ViolationReport) => {
    setSelectedReport(report);
    setConclusion('violation');
    setResolutionNote('');
    if (report.targetType === 'task') {
      setActionChoice('removed_task');
    } else if (report.targetType === 'job') {
      setActionChoice('removed_job');
    } else {
      setActionChoice('warning');
    }
  };

  const handleConfirmResolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;
    if (!resolutionNote.trim()) {
      notify('Thiếu ghi chú', 'Vui lòng nhập ghi chú kết luận xử lý vi phạm.', 'error');
      return;
    }

    const finalAction = conclusion === 'no_violation' ? 'dismissed' : actionChoice;
    resolveViolationReport(selectedReport.id, conclusion, resolutionNote.trim(), finalAction);
    setSelectedReport(null);
    setResolutionNote('');
  };

  const getStatusBadge = (status: ViolationReportStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FFE9A8] text-[#7A5B00] flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Chờ xử lý
          </span>
        );
      case 'resolved_violation':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FFF2F0] text-[#B83214] flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" />
            Kết luận vi phạm
          </span>
        );
      case 'resolved_no_violation':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#CDEFE0] text-[#0F5B39] flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Bác đơn (Không vi phạm)
          </span>
        );
    }
  };

  const getTargetTypeBadge = (type: 'task' | 'job' | 'company') => {
    switch (type) {
      case 'task':
        return <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#F5F9FF] text-[#3D7DD8] border border-[#DCE8F8]">Nhiệm vụ</span>;
      case 'job':
        return <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#FFF9E6] text-[#7A5B00] border border-[#F0D582]">Tin tuyển dụng</span>;
      case 'company':
        return <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#F0F8FF] text-[#1E56A0] border border-[#DCE8F8]">Doanh nghiệp</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading font-bold text-xl text-[#16243D]">
            Xử lý báo cáo vi phạm từ người dùng
          </h3>
          <p className="text-xs text-[#5B6B85] mt-1">
            Thẩm tra các phản ánh vi phạm quy chế: thu phí sinh viên, ép giờ làm, quỵt thù lao, sai sự thật hoặc sao chép bài.
          </p>
        </div>
        <div>
          {pendingCount > 0 && (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#FFF2F0] text-[#B83214] border border-[#FFD6CC] flex items-center gap-1.5 shadow-xs">
              <AlertTriangle className="w-3.5 h-3.5" />
              {pendingCount} báo cáo chờ kết luận
            </span>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="stulance-card p-4 border border-[#DCE8F8] bg-white flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter tabs */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                statusFilter === 'pending'
                  ? 'bg-[#B83214] text-white shadow-xs'
                  : 'bg-[#F5F9FF] text-[#5B6B85] hover:text-[#16243D] border border-[#DCE8F8]'
              }`}
            >
              Chờ xử lý ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter('resolved')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                statusFilter === 'resolved'
                  ? 'bg-[#3D7DD8] text-white shadow-xs'
                  : 'bg-[#F5F9FF] text-[#5B6B85] hover:text-[#16243D] border border-[#DCE8F8]'
              }`}
            >
              Đã giải quyết ({violationReports.length - pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                statusFilter === 'all'
                  ? 'bg-[#16243D] text-white shadow-xs'
                  : 'bg-[#F5F9FF] text-[#5B6B85] hover:text-[#16243D] border border-[#DCE8F8]'
              }`}
            >
              Tất cả ({violationReports.length})
            </button>
          </div>

          <span className="text-[#DCE8F8]">|</span>

          {/* Type filter */}
          <select
            value={targetTypeFilter}
            onChange={(e) => setTargetTypeFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-full border border-[#DCE8F8] bg-[#F5F9FF] text-xs text-[#16243D] outline-none"
          >
            <option value="all">Mọi loại đối tượng</option>
            <option value="task">Chỉ Nhiệm vụ</option>
            <option value="job">Chỉ Tin tuyển dụng</option>
            <option value="company">Chỉ Doanh nghiệp</option>
          </select>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-[#5B6B85] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên bài, lý do, người báo cáo..."
            className="w-full pl-8 pr-3.5 py-1.5 rounded-full border border-[#DCE8F8] bg-[#F5F9FF] text-xs text-[#16243D] outline-none focus:ring-2 focus:ring-[#3D7DD8]/20"
          />
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="Không có báo cáo vi phạm nào"
          description="Hệ thống chưa ghi nhận vi phạm nào phù hợp với bộ lọc hiện tại. Môi trường thực tập và làm bài của sinh viên đang an toàn."
          actionText={statusFilter !== 'all' ? 'Xem tất cả báo cáo' : undefined}
          onAction={statusFilter !== 'all' ? () => setStatusFilter('all') : undefined}
        />
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="stulance-card p-5 sm:p-6 border border-[#DCE8F8] bg-white flex flex-col md:flex-row md:items-start justify-between gap-4 hover:border-[#A9CFFA] transition-all"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {getStatusBadge(report.status)}
                  {getTargetTypeBadge(report.targetType)}
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#FFF2F0] text-[#B83214] border border-[#FFD6CC]">
                    Lý do: {report.reason}
                  </span>
                  <span className="text-[#5B6B85]">·</span>
                  <span className="text-xs text-[#5B6B85]">
                    Gửi lúc {report.createdAt}
                  </span>
                </div>

                <h4 className="font-heading font-bold text-base text-[#16243D] mb-1">
                  {report.targetTitle}
                </h4>

                <p className="text-xs text-[#5B6B85] mb-3">
                  Người báo cáo:{' '}
                  <strong className="text-[#16243D]">
                    {report.studentName || report.studentId}
                  </strong>
                </p>

                {/* Evidence / details box */}
                <div className="p-3.5 rounded-xl bg-[#F5F9FF] border border-[#DCE8F8] text-xs text-[#16243D] leading-relaxed mb-3">
                  <span className="font-semibold text-[#5B6B85] block text-[11px] uppercase mb-1">
                    Nội dung phản ánh từ người dùng:
                  </span>
                  &ldquo;{report.details}&rdquo;
                </div>

                {/* If resolved */}
                {report.adminConclusion && (
                  <div className="p-3.5 rounded-xl bg-[#F9FBFD] border border-[#DCE8F8] text-xs text-[#16243D]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-[11px] text-[#3D7DD8] uppercase">
                        Kết luận của cán bộ kiểm định:
                      </span>
                      <span className="text-[11px] text-[#5B6B85]">
                        (Xử lý ngày {report.resolvedAt || 'Hôm nay'})
                      </span>
                    </div>
                    <p className="text-xs font-medium text-[#16243D]">
                      {report.adminConclusion}
                    </p>
                    {report.actionTaken && (
                      <p className="text-[11px] text-[#5B6B85] mt-1">
                        Biện pháp đã thi hành:{' '}
                        <strong>
                          {report.actionTaken === 'removed_task'
                            ? 'Đã gỡ bỏ nhiệm vụ khỏi hệ thống'
                            : report.actionTaken === 'removed_job'
                            ? 'Đã gỡ bỏ tin tuyển dụng'
                            : report.actionTaken === 'locked_account'
                            ? 'Đã khóa tài khoản vi phạm'
                            : report.actionTaken === 'warning'
                            ? 'Gửi cảnh cáo chính thức'
                            : 'Bác đơn (Không áp dụng chế tài)'}
                        </strong>
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="shrink-0 flex items-center gap-2 self-end md:self-start">
                {report.status === 'pending' ? (
                  <button
                    onClick={() => handleOpenResolveModal(report)}
                    className="px-5 py-2.5 rounded-full bg-[#B83214] hover:bg-[#99260E] text-white text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Thẩm tra & Kết luận
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenResolveModal(report)}
                    className="px-4 py-2 rounded-full border border-[#DCE8F8] bg-[#F5F9FF] text-xs font-medium text-[#5B6B85] hover:text-[#16243D] transition-colors"
                  >
                    Xem lại biên bản
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RESOLUTION MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#16243D]/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className="relative w-full max-w-lg bg-white border border-[#DCE8F8] rounded-[24px] shadow-2xl p-6 sm:p-8 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#DCE8F8] pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF2F0] text-[#B83214] flex items-center justify-center border border-[#FFD6CC] shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-[#16243D]">
                    Kết luận xử lý báo cáo vi phạm
                  </h3>
                  <p className="text-xs text-[#5B6B85]">
                    Mục: <strong>{selectedReport.targetTitle}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1.5 text-[#5B6B85] hover:text-[#16243D] rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmResolution} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#16243D] mb-2">
                  Kết luận của cán bộ kiểm định <span className="text-[#B83214]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setConclusion('violation')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      conclusion === 'violation'
                        ? 'border-[#B83214] bg-[#FFF2F0] text-[#B83214] font-semibold'
                        : 'border-[#DCE8F8] text-[#5B6B85] hover:bg-[#F5F9FF]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Xác nhận Vi phạm</span>
                    </div>
                    <p className="text-[10px] text-[#5B6B85] mt-1 font-normal">
                      Nội dung vi phạm quy chế đào tạo
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConclusion('no_violation')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      conclusion === 'no_violation'
                        ? 'border-[#0F5B39] bg-[#CDEFE0]/40 text-[#0F5B39] font-semibold'
                        : 'border-[#DCE8F8] text-[#5B6B85] hover:bg-[#F5F9FF]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Không vi phạm</span>
                    </div>
                    <p className="text-[10px] text-[#5B6B85] mt-1 font-normal">
                      Bác đơn / Phản ánh không có căn cứ
                    </p>
                  </button>
                </div>
              </div>

              {conclusion === 'violation' && (
                <div>
                  <label className="block text-xs font-semibold text-[#16243D] mb-1.5">
                    Biện pháp chế tài áp dụng
                  </label>
                  <select
                    value={actionChoice}
                    onChange={(e) => setActionChoice(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] bg-[#F5F9FF] outline-none"
                  >
                    {selectedReport.targetType === 'task' && (
                      <option value="removed_task">Gỡ bỏ nhiệm vụ khỏi hệ thống</option>
                    )}
                    {selectedReport.targetType === 'job' && (
                      <option value="removed_job">Gỡ bỏ tin tuyển dụng</option>
                    )}
                    <option value="warning">Gửi cảnh cáo vi phạm</option>
                    <option value="locked_account">Khóa tài khoản bên vi phạm</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#16243D] mb-1.5">
                  Ghi chú kết luận & Căn cứ xử lý <span className="text-[#B83214]">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Ghi rõ lý do căn cứ theo điều khoản quy chế, ví dụ: 'Phát hiện yêu cầu đóng tiền học phí phụ, tiến hành gỡ bài và cảnh báo doanh nghiệp theo điều 14 quy chế'."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] outline-none focus:ring-2 focus:ring-[#B83214]/20 resize-none bg-[#F5F9FF]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#DCE8F8]">
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 text-xs text-[#5B6B85] hover:text-[#16243D]"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!resolutionNote.trim()}
                  className={`px-5 py-2.5 text-white text-xs font-semibold rounded-full shadow-xs transition-colors ${
                    conclusion === 'violation'
                      ? 'bg-[#B83214] hover:bg-[#99260E]'
                      : 'bg-[#0F5B39] hover:bg-[#0A442A]'
                  }`}
                >
                  Lưu & Áp dụng kết luận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
