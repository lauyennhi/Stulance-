import React, { useState } from 'react';
import {
  AlertCircle,
  Building,
  CheckCircle2,
  Clock,
  Eye,
  FileCheck2,
  FileText,
  Filter,
  Globe,
  MapPin,
  Search,
  ShieldAlert,
  ShieldCheck,
  X,
  XCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Company, CompanyStatus } from '../../types';
import { EmptyState } from '../common/EmptyState';

export const AdminCompanyVerificationView: React.FC = () => {
  const { companies, verifyCompany, rejectCompany, notify } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | CompanyStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected company modal
  const [inspectingCompany, setInspectingCompany] = useState<Company | null>(null);

  // Reject modal state
  const [rejectingCompany, setRejectingCompany] = useState<Company | null>(null);
  const [rejectReasonInput, setRejectReasonInput] = useState('');

  const filteredCompanies = companies.filter((c) => {
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.taxCode && c.taxCode.includes(searchQuery));
    return matchesStatus && matchesSearch;
  });

  const pendingCount = companies.filter((c) => c.status === 'pending').length;

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReasonInput.trim()) {
      notify('Thiếu lý do', 'Bắt buộc phải nhập lý do từ chối để hướng dẫn doanh nghiệp hoàn thiện hồ sơ.', 'error');
      return;
    }
    if (rejectingCompany) {
      rejectCompany(rejectingCompany.id, rejectReasonInput.trim());
      setRejectingCompany(null);
      setRejectReasonInput('');
      setInspectingCompany(null);
    }
  };

  const getStatusBadge = (status: CompanyStatus) => {
    switch (status) {
      case 'verified':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#CDEFE0] text-[#0F5B39] flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Đã xác minh
          </span>
        );
      case 'pending':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FFE9A8] text-[#7A5B00] flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Chờ thẩm định
          </span>
        );
      case 'rejected':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FFD6CC] text-[#B83214] flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Bị từ chối
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Actions */}
      <div className="stulance-card p-4 sm:p-5 border border-[#DCE8F8] bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#5B6B85] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên doanh nghiệp, ngành nghề, mã số thuế..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] outline-none focus:ring-2 focus:ring-[#3D7DD8]/30"
          />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap text-xs">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-full font-medium transition-all ${
              statusFilter === 'all'
                ? 'bg-[#3D7DD8] text-white'
                : 'bg-[#F5F9FF] text-[#5B6B85] hover:text-[#16243D]'
            }`}
          >
            Tất cả ({companies.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-full font-medium transition-all ${
              statusFilter === 'pending'
                ? 'bg-[#7A5B00] text-white'
                : 'bg-[#FFE9A8]/40 text-[#7A5B00] hover:bg-[#FFE9A8]'
            }`}
          >
            Chờ duyệt ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('verified')}
            className={`px-3 py-1.5 rounded-full font-medium transition-all ${
              statusFilter === 'verified'
                ? 'bg-[#0F5B39] text-white'
                : 'bg-[#CDEFE0]/40 text-[#0F5B39] hover:bg-[#CDEFE0]'
            }`}
          >
            Đã duyệt ({companies.filter((c) => c.status === 'verified').length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('rejected')}
            className={`px-3 py-1.5 rounded-full font-medium transition-all ${
              statusFilter === 'rejected'
                ? 'bg-[#B83214] text-white'
                : 'bg-[#FFD6CC]/40 text-[#B83214] hover:bg-[#FFD6CC]'
            }`}
          >
            Bị từ chối ({companies.filter((c) => c.status === 'rejected').length})
          </button>
        </div>
      </div>

      {/* Companies Table (Desktop priority) */}
      {filteredCompanies.length === 0 ? (
        <EmptyState
          icon={Building}
          title="Không tìm thấy doanh nghiệp nào"
          description="Thử thay đổi bộ lọc trạng thái hoặc từ khóa tìm kiếm."
        />
      ) : (
        <div className="stulance-card border border-[#DCE8F8] bg-white overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F5F9FF] border-b border-[#DCE8F8] text-[#5B6B85] font-heading font-semibold">
                  <th className="py-3 px-4">Doanh nghiệp</th>
                  <th className="py-3 px-4">Mã số thuế</th>
                  <th className="py-3 px-4">Lĩnh vực</th>
                  <th className="py-3 px-4">Ngày nộp</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Thao tác xử lý</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE8F8]">
                {filteredCompanies.map((comp) => (
                  <tr key={comp.id} className="hover:bg-[#F5F9FF]/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#EAF2FC] border border-[#DCE8F8] overflow-hidden flex items-center justify-center shrink-0 font-bold text-[#3D7DD8]">
                          {comp.logo ? (
                            <img src={comp.logo} alt={comp.name} className="w-full h-full object-cover" />
                          ) : (
                            comp.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <span className="font-heading font-bold text-xs text-[#16243D] block">
                            {comp.name}
                          </span>
                          <span className="text-[11px] text-[#5B6B85]">{comp.location}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-medium text-[#16243D]">
                      {comp.taxCode || 'Chưa cập nhật'}
                    </td>

                    <td className="py-3.5 px-4 text-[#5B6B85]">
                      {comp.industry}
                    </td>

                    <td className="py-3.5 px-4 text-[#5B6B85] font-mono">
                      {comp.submittedAt}
                    </td>

                    <td className="py-3.5 px-4">
                      {getStatusBadge(comp.status)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Xem chi tiết */}
                        <button
                          type="button"
                          onClick={() => setInspectingCompany(comp)}
                          className="px-3 py-1.5 rounded-full border border-[#DCE8F8] bg-white text-xs font-medium text-[#16243D] hover:bg-[#EAF2FC] transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#3D7DD8]" />
                          Hồ sơ
                        </button>

                        {/* Nếu đang chờ duyệt thì hiện Duyệt / Từ chối nhanh */}
                        {comp.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              onClick={() => verifyCompany(comp.id)}
                              className="px-3 py-1.5 rounded-full bg-[#0F5B39] hover:bg-[#094127] text-white text-xs font-semibold shadow-xs transition-colors"
                            >
                              Duyệt
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setRejectingCompany(comp);
                                setRejectReasonInput('');
                              }}
                              className="px-3 py-1.5 rounded-full bg-[#FFD6CC] hover:bg-[#FFB8A8] text-[#B83214] text-xs font-semibold transition-colors"
                            >
                              Từ chối
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* INSPECT COMPANY MODAL */}
      {inspectingCompany && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#16243D]/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className="relative w-full max-w-2xl bg-white border border-[#DCE8F8] rounded-[24px] shadow-2xl p-6 sm:p-8 my-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-[#DCE8F8]">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#EAF2FC] border border-[#DCE8F8] overflow-hidden flex items-center justify-center shrink-0">
                  {inspectingCompany.logo ? (
                    <img src={inspectingCompany.logo} alt={inspectingCompany.name} className="w-full h-full object-cover" />
                  ) : (
                    <Building className="w-6 h-6 text-[#3D7DD8]" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-lg text-[#16243D]">
                      {inspectingCompany.name}
                    </h3>
                    {getStatusBadge(inspectingCompany.status)}
                  </div>
                  <p className="text-xs text-[#5B6B85] mt-0.5">
                    Lĩnh vực: {inspectingCompany.industry}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setInspectingCompany(null)}
                className="p-1.5 text-[#5B6B85] hover:text-[#16243D] rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#F5F9FF] border border-[#DCE8F8]">
                <div>
                  <span className="text-[#5B6B85] block mb-0.5 font-medium">Mã số thuế:</span>
                  <span className="font-mono font-bold text-sm text-[#16243D]">
                    {inspectingCompany.taxCode || '0108923456'}
                  </span>
                </div>
                <div>
                  <span className="text-[#5B6B85] block mb-0.5 font-medium">Địa chỉ trụ sở:</span>
                  <span className="text-[#16243D] font-medium">{inspectingCompany.location}</span>
                </div>
                <div>
                  <span className="text-[#5B6B85] block mb-0.5 font-medium">Website:</span>
                  <a
                    href={inspectingCompany.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#3D7DD8] hover:underline font-mono"
                  >
                    {inspectingCompany.website}
                  </a>
                </div>
                <div>
                  <span className="text-[#5B6B85] block mb-0.5 font-medium">Ngày nộp hồ sơ:</span>
                  <span className="font-mono text-[#16243D]">{inspectingCompany.submittedAt}</span>
                </div>
              </div>

              {/* Giới thiệu */}
              <div>
                <h4 className="font-heading font-semibold text-xs text-[#16243D] mb-1">
                  Giới thiệu doanh nghiệp
                </h4>
                <p className="text-[#5B6B85] leading-relaxed p-3 rounded-xl border border-[#DCE8F8] bg-white">
                  {inspectingCompany.description}
                </p>
              </div>

              {/* Giấy tờ pháp lý đính kèm */}
              <div>
                <h4 className="font-heading font-semibold text-xs text-[#16243D] mb-1">
                  Giấy phép ĐKKD & Giấy tờ pháp lý thẩm định
                </h4>
                <div className="p-4 rounded-xl border border-[#DCE8F8] bg-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileCheck2 className="w-6 h-6 text-[#3D7DD8]" />
                    <div>
                      <span className="font-mono font-semibold text-[#16243D] block">
                        {inspectingCompany.legalDocumentName || 'Giay_Phep_DKKD_Nexus_2025.pdf'}
                      </span>
                      <span className="text-[11px] text-[#0F5B39]">
                        Đã tải lên vào hệ thống đối soát
                      </span>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-[#EAF2FC] text-[#3D7DD8] font-medium text-[11px]">
                    Bản sao hợp lệ
                  </span>
                </div>
              </div>

              {/* Lý do từ chối nếu có */}
              {inspectingCompany.status === 'rejected' && inspectingCompany.rejectionReason && (
                <div className="p-4 rounded-xl bg-[#FFF1ED] border border-[#FFD6CC] text-xs text-[#B83214]">
                  <strong>Lý do từ chối trước đó:</strong> {inspectingCompany.rejectionReason}
                </div>
              )}

              {/* Bottom Decision Actions */}
              <div className="pt-4 border-t border-[#DCE8F8] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setInspectingCompany(null)}
                  className="px-4 py-2 text-xs text-[#5B6B85] hover:text-[#16243D]"
                >
                  Đóng
                </button>

                {inspectingCompany.status !== 'verified' && (
                  <button
                    type="button"
                    onClick={() => {
                      verifyCompany(inspectingCompany.id);
                      setInspectingCompany(null);
                    }}
                    className="px-5 py-2.5 rounded-full bg-[#0F5B39] hover:bg-[#094127] text-white font-semibold text-xs transition-colors shadow-xs"
                  >
                    Phê duyệt xác minh
                  </button>
                )}

                {inspectingCompany.status !== 'rejected' && (
                  <button
                    type="button"
                    onClick={() => {
                      setRejectingCompany(inspectingCompany);
                      setRejectReasonInput('');
                    }}
                    className="px-5 py-2.5 rounded-full bg-[#B83214] hover:bg-[#96260D] text-white font-semibold text-xs transition-colors shadow-xs"
                  >
                    Từ chối hồ sơ
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL (MANDATORY REASON) */}
      {rejectingCompany && (
        <div className="fixed inset-0 z-60 overflow-y-auto bg-[#16243D]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="w-full max-w-md bg-white border border-[#DCE8F8] rounded-[24px] shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 mb-2 text-[#B83214]">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h4 className="font-heading font-bold text-base text-[#16243D]">
                Từ chối xác minh doanh nghiệp
              </h4>
            </div>
            <p className="text-xs text-[#5B6B85] mb-4">
              Doanh nghiệp: <strong>{rejectingCompany.name}</strong>. Vui lòng nêu rõ lý do để doanh nghiệp cập nhật lại giấy tờ.
            </p>

            <form onSubmit={handleConfirmReject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#16243D] mb-1">
                  Lý do từ chối (Bắt buộc) *
                </label>
                <textarea
                  rows={3}
                  value={rejectReasonInput}
                  onChange={(e) => setRejectReasonInput(e.target.value)}
                  required
                  placeholder="Ví dụ: Giấy phép kinh doanh tải lên chưa rõ con dấu đỏ; hoặc mã số thuế chưa khớp trên Cổng Đăng ký doanh nghiệp..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] outline-none focus:ring-2 focus:ring-[#B83214]/30"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingCompany(null)}
                  className="px-4 py-2 text-xs text-[#5B6B85] hover:text-[#16243D]"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#B83214] hover:bg-[#96260D] text-white text-xs font-semibold rounded-full shadow-xs"
                >
                  Xác nhận từ chối
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
