import React, { useState } from 'react';
import {
  AlertTriangle,
  Briefcase,
  Building,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  History,
  Lock,
  Search,
  ShieldAlert,
  ShieldCheck,
  StopCircle,
  Unlock,
  User,
  XCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AuditLog } from '../../types';
import { EmptyState } from '../common/EmptyState';

export const AdminAuditLogView: React.FC = () => {
  const { auditLogs } = useApp();

  const [actionFilter, setActionFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesAction =
      actionFilter === 'all'
        ? true
        : actionFilter === 'company'
        ? log.action.includes('company')
        : actionFilter === 'task'
        ? log.action.includes('task')
        : actionFilter === 'account'
        ? log.action.includes('account')
        : actionFilter === 'report'
        ? log.action.includes('report')
        : true;

    const matchesSearch =
      log.actionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.reason && log.reason.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesAction && matchesSearch;
  });

  const getActionBadge = (action: AuditLog['action']) => {
    switch (action) {
      case 'verify_company':
        return (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#CDEFE0] text-[#0F5B39] inline-flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" />
            Duyệt DN
          </span>
        );
      case 'reject_company':
        return (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#FFF2F0] text-[#B83214] inline-flex items-center gap-1">
            <XCircle className="w-2.5 h-2.5" />
            Từ chối DN
          </span>
        );
      case 'approve_task':
        return (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#CDEFE0] text-[#0F5B39] inline-flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" />
            Duyệt nhiệm vụ
          </span>
        );
      case 'reject_task':
        return (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#FFF2F0] text-[#B83214] inline-flex items-center gap-1">
            <XCircle className="w-2.5 h-2.5" />
            Từ chối NV
          </span>
        );
      case 'remove_task':
        return (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#16243D] text-white inline-flex items-center gap-1">
            <StopCircle className="w-2.5 h-2.5" />
            Gỡ nhiệm vụ
          </span>
        );
      case 'remove_job':
        return (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#16243D] text-white inline-flex items-center gap-1">
            <StopCircle className="w-2.5 h-2.5" />
            Gỡ tin tuyển dụng
          </span>
        );
      case 'lock_account':
        return (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#B83214] text-white inline-flex items-center gap-1">
            <Lock className="w-2.5 h-2.5" />
            Khóa tài khoản
          </span>
        );
      case 'unlock_account':
        return (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#0F5B39] text-white inline-flex items-center gap-1">
            <Unlock className="w-2.5 h-2.5" />
            Mở khóa tài khoản
          </span>
        );
      case 'resolve_report':
        return (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#FFE9A8] text-[#7A5B00] inline-flex items-center gap-1">
            <ShieldAlert className="w-2.5 h-2.5" />
            Kết luận vi phạm
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
            Nhật ký kiểm định hệ thống (Audit Trail)
          </h3>
          <p className="text-xs text-[#5B6B85] mt-1">
            Minh bạch toàn bộ quyết định phê duyệt, từ chối, gỡ bài và chế tài kỷ luật tài khoản theo thời gian thực.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#F5F9FF] border border-[#DCE8F8] text-[#3D7DD8] flex items-center gap-1.5">
            <History className="w-3.5 h-3.5" />
            {auditLogs.length} bản ghi nhật ký
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="stulance-card p-4 border border-[#DCE8F8] bg-white flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: `Tất cả (${auditLogs.length})` },
            { id: 'company', label: 'Doanh nghiệp' },
            { id: 'task', label: 'Nhiệm vụ & Tin' },
            { id: 'account', label: 'Tài khoản' },
            { id: 'report', label: 'Báo cáo vi phạm' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActionFilter(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                actionFilter === tab.id
                  ? 'bg-[#3D7DD8] text-white shadow-xs'
                  : 'bg-[#F5F9FF] text-[#5B6B85] hover:text-[#16243D] border border-[#DCE8F8]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-3.5 h-3.5 text-[#5B6B85] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo đối tượng, cán bộ, lý do..."
            className="w-full pl-8 pr-3.5 py-1.5 rounded-full border border-[#DCE8F8] bg-[#F5F9FF] text-xs text-[#16243D] outline-none focus:ring-2 focus:ring-[#3D7DD8]/20"
          />
        </div>
      </div>

      {/* Table of logs */}
      {filteredLogs.length === 0 ? (
        <EmptyState
          icon={History}
          title="Không tìm thấy nhật ký phù hợp"
          description="Chưa có thao tác nào tương ứng với bộ lọc hoặc từ khóa tìm kiếm của bạn."
        />
      ) : (
        <div className="stulance-card border border-[#DCE8F8] bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F5F9FF] border-b border-[#DCE8F8] text-[#5B6B85] font-semibold">
                  <th className="py-3 px-4 w-40">Thời điểm</th>
                  <th className="py-3 px-4 w-36">Hành động</th>
                  <th className="py-3 px-4">Đối tượng tác động</th>
                  <th className="py-3 px-4">Lý do / Căn cứ quyết định</th>
                  <th className="py-3 px-4 w-44">Người thực hiện</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE8F8]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F9FBFD] transition-colors">
                    <td className="py-3 px-4 text-[#5B6B85] whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#3D7DD8] shrink-0" />
                        <span>{log.timestamp}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {getActionBadge(log.action)}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#16243D] max-w-xs truncate">
                        {log.targetName}
                      </div>
                      <span className="text-[10px] text-[#5B6B85] uppercase">
                        Loại: {log.targetType} · Mã: {log.targetId}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {log.reason ? (
                        <p className="text-xs text-[#16243D] font-medium leading-relaxed">
                          {log.reason}
                        </p>
                      ) : (
                        <span className="text-[#5B6B85] italic">Phê duyệt tự động / Chuẩn hóa</span>
                      )}
                      {log.details && (
                        <p className="text-[11px] text-[#5B6B85] mt-0.5">{log.details}</p>
                      )}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#EAF2FC] text-[#3D7DD8] font-bold text-[10px] flex items-center justify-center">
                          {log.actorName.charAt(0)}
                        </div>
                        <span className="font-medium text-[#16243D]">{log.actorName}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
