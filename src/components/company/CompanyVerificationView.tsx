import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Building,
  CheckCircle2,
  FileCheck2,
  FileText,
  Globe,
  HelpCircle,
  MapPin,
  RefreshCw,
  Send,
  ShieldAlert,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CompanyStatus } from '../../types';

export const CompanyVerificationView: React.FC = () => {
  const { currentCompany, updateCompanyProfile, resubmitCompanyVerification, notify } = useApp();

  const [name, setName] = useState(currentCompany?.name || '');
  const [taxCode, setTaxCode] = useState(currentCompany?.taxCode || '');
  const [industry, setIndustry] = useState(currentCompany?.industry || 'CNTT & Phần mềm');
  const [location, setLocation] = useState(currentCompany?.location || '');
  const [website, setWebsite] = useState(currentCompany?.website || '');
  const [description, setDescription] = useState(currentCompany?.description || '');
  const [logo, setLogo] = useState(currentCompany?.logo || '');
  const [legalDocumentName, setLegalDocumentName] = useState(
    currentCompany?.legalDocumentName || 'Giay_Phep_Dang_Ky_Kinh_Doanh_2025.pdf'
  );
  const [selectedFileMock, setSelectedFileMock] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'legal'>('profile');

  if (!currentCompany) {
    return (
      <div className="p-8 text-center text-[#5B6B85]">
        Không tìm thấy thông tin doanh nghiệp. Vui lòng đăng nhập lại.
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      notify('Thiếu thông tin', 'Vui lòng nhập tên doanh nghiệp.', 'error');
      return;
    }
    if (!taxCode.trim()) {
      notify('Thiếu thông tin', 'Vui lòng nhập mã số thuế doanh nghiệp.', 'error');
      return;
    }

    setIsSubmitting(true);
    const success = updateCompanyProfile({
      name: name.trim(),
      taxCode: taxCode.trim(),
      industry,
      location: location.trim(),
      website: website.trim(),
      description: description.trim(),
      logo: logo.trim() || currentCompany.logo,
      legalDocumentName: selectedFileMock || legalDocumentName,
    });
    setIsSubmitting(false);

    if (success) {
      if (selectedFileMock) {
        setLegalDocumentName(selectedFileMock);
        setSelectedFileMock('');
      }
    }
  };

  const handleResubmitVerification = () => {
    const docName = selectedFileMock || legalDocumentName || 'Giay_Phep_Kinh_Doanh_Bo_Sung.pdf';
    resubmitCompanyVerification(docName);
    setLegalDocumentName(docName);
    setSelectedFileMock('');
  };

  // Mock quick switcher to test verified / pending / rejected statuses for demonstration
  const handleSimulateStatus = (newStatus: CompanyStatus) => {
    updateCompanyProfile({
      name: currentCompany.name,
    });
    // In our context, we can set the status directly or show toast
    notify(
      'Mô phỏng trạng thái doanh nghiệp',
      `Chuyển trạng thái sang: ${
        newStatus === 'verified'
          ? 'Đã xác minh (mở toàn bộ tính năng)'
          : newStatus === 'pending'
          ? 'Chờ xác minh (khóa đăng bài)'
          : 'Bị từ chối (có lý do & nút nộp lại)'
      }`,
      'info'
    );
  };

  const getStatusBadge = (status: CompanyStatus) => {
    switch (status) {
      case 'verified':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#CDEFE0] text-[#0F5B39] font-medium text-xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>Đã xác minh pháp lý</span>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFE9A8] text-[#7A5B00] font-medium text-xs">
            <AlertCircle className="w-4 h-4" />
            <span>Chờ cán bộ nhà trường phê duyệt</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFD6CC] text-[#B83214] font-medium text-xs">
            <ShieldAlert className="w-4 h-4" />
            <span>Bị từ chối xác minh</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Overview Card */}
      <div className="stulance-card p-6 border border-[#DCE8F8] bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#DCE8F8]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#EAF2FC] border border-[#DCE8F8] overflow-hidden flex items-center justify-center shrink-0">
              {currentCompany.logo ? (
                <img
                  src={currentCompany.logo}
                  alt={currentCompany.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building className="w-8 h-8 text-[#3D7DD8]" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-heading font-bold text-xl text-[#16243D]">
                  {currentCompany.name}
                </h2>
                {getStatusBadge(currentCompany.status)}
              </div>
              <p className="text-xs text-[#5B6B85] mt-1">
                Lĩnh vực: <strong>{currentCompany.industry}</strong> · Mã số thuế: <strong>{currentCompany.taxCode || '0108923456'}</strong>
              </p>
            </div>
          </div>

          <div className="text-right sm:border-l sm:pl-6 border-[#DCE8F8]">
            <p className="text-[11px] text-[#5B6B85]">Ngày gửi hồ sơ</p>
            <p className="font-heading font-bold text-sm text-[#16243D]">
              {currentCompany.submittedAt}
            </p>
            {currentCompany.verifiedAt && (
              <p className="text-[10px] text-[#0F5B39] mt-0.5">
                Đã duyệt: {currentCompany.verifiedAt}
              </p>
            )}
          </div>
        </div>

        {/* Status Notice Banners */}
        {currentCompany.status === 'verified' && (
          <div className="mt-4 p-4 rounded-xl bg-[#F0FAF5] border border-[#CDEFE0] flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#0F5B39] shrink-0 mt-0.5" />
            <div className="text-xs text-[#0F5B39]">
              <strong className="block font-semibold mb-0.5">Doanh nghiệp đã được cán bộ nhà trường thẩm định</strong>
              Hồ sơ pháp lý hợp lệ. Bạn có đầy đủ quyền đăng nhiệm vụ Thử sức, Dự án ngắn có thù lao và mở tin tuyển dụng sinh viên.
            </div>
          </div>
        )}

        {currentCompany.status === 'pending' && (
          <div className="mt-4 p-4 rounded-xl bg-[#FFF9E6] border border-[#FFE9A8] flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#7A5B00] shrink-0 mt-0.5" />
            <div className="text-xs text-[#7A5B00]">
              <strong className="block font-semibold mb-0.5">Hồ sơ đang trong hàng đợi phê duyệt</strong>
              Ban Hợp tác Doanh nghiệp & Việc làm nhà trường đang thẩm định mã số thuế và giấy phép kinh doanh của bạn.
              <span className="block mt-1 font-medium text-[#B83214]">
                ⚠️ Lưu ý: Trong lúc chờ duyệt, các nút Đăng nhiệm vụ mới và Đăng tin tuyển dụng sẽ tạm thời bị khóa.
              </span>
            </div>
          </div>
        )}

        {currentCompany.status === 'rejected' && (
          <div className="mt-4 p-4 rounded-xl bg-[#FFF1ED] border border-[#FFD6CC] space-y-3">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-[#B83214] shrink-0 mt-0.5" />
              <div className="text-xs text-[#B83214] flex-1">
                <strong className="block font-semibold mb-1">Hồ sơ xác minh đã bị cán bộ nhà trường từ chối</strong>
                <p className="p-2.5 rounded-lg bg-white/80 border border-[#FFD6CC] text-[#16243D] font-mono text-[11px] mb-2">
                  Lý do từ chối: &ldquo;{currentCompany.rejectionReason || 'Thông tin giấy phép kinh doanh tải lên chưa rõ con dấu đỏ hoặc mã số thuế chưa khớp với đăng ký kinh doanh quốc gia.'}&rdquo;
                </p>
                <p className="text-[11px] text-[#5B6B85]">
                  Chức năng đăng nhiệm vụ và tuyển dụng đang bị khóa. Bạn có thể tải lên lại bản chụp giấy phép kinh doanh mới bên dưới để gửi duyệt lại.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#FFD6CC] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleResubmitVerification}
                className="px-4 py-2 rounded-full bg-[#B83214] text-white text-xs font-semibold hover:bg-[#96260D] transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Nộp lại hồ sơ xác minh
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Profile & Legal Document Form */}
      <div className="stulance-card p-6 sm:p-8 border border-[#DCE8F8] bg-white">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#DCE8F8]">
          <div>
            <h3 className="font-heading font-bold text-lg text-[#16243D]">
              Thông tin hồ sơ & Giấy tờ pháp lý doanh nghiệp
            </h3>
            <p className="text-xs text-[#5B6B85] mt-0.5">
              Để bảo vệ sinh viên trước các rủi ro gian lận hoặc nhiệm vụ giả mạo, mọi thông tin đều được đối soát với trường học.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                activeTab === 'profile'
                  ? 'bg-[#3D7DD8] text-white'
                  : 'bg-[#F5F9FF] text-[#5B6B85] hover:text-[#16243D]'
              }`}
            >
              Hồ sơ công ty
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('legal')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                activeTab === 'legal'
                  ? 'bg-[#3D7DD8] text-white'
                  : 'bg-[#F5F9FF] text-[#5B6B85] hover:text-[#16243D]'
              }`}
            >
              Giấy tờ pháp lý
            </button>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          {activeTab === 'profile' ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Tên doanh nghiệp */}
                <div>
                  <label className="block text-xs font-semibold text-[#16243D] mb-1.5">
                    Tên đầy đủ của doanh nghiệp *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Ví dụ: Công ty Cổ phần Công nghệ Nexus..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] bg-[#F5F9FF] focus:bg-white focus:ring-2 focus:ring-[#3D7DD8]/30 outline-none transition-all"
                  />
                </div>

                {/* Mã số thuế */}
                <div>
                  <label className="block text-xs font-semibold text-[#16243D] mb-1.5">
                    Mã số thuế doanh nghiệp (MST) *
                  </label>
                  <input
                    type="text"
                    value={taxCode}
                    onChange={(e) => setTaxCode(e.target.value)}
                    required
                    placeholder="10 hoặc 13 chữ số"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] bg-[#F5F9FF] focus:bg-white focus:ring-2 focus:ring-[#3D7DD8]/30 outline-none transition-all font-mono"
                  />
                  <p className="text-[10px] text-[#5B6B85] mt-1">
                    Cán bộ nhà trường sẽ tra cứu MST trên Cổng thông tin Đăng ký doanh nghiệp quốc gia.
                  </p>
                </div>

                {/* Lĩnh vực hoạt động */}
                <div>
                  <label className="block text-xs font-semibold text-[#16243D] mb-1.5">
                    Lĩnh vực hoạt động chính *
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] bg-[#F5F9FF] focus:bg-white focus:ring-2 focus:ring-[#3D7DD8]/30 outline-none transition-all"
                  >
                    <option value="CNTT & Phần mềm">CNTT & Phần mềm</option>
                    <option value="Marketing & Truyền thông">Marketing & Truyền thông</option>
                    <option value="Thiết kế Đồ họa & UI/UX">Thiết kế Đồ họa & UI/UX</option>
                    <option value="Kế toán & Phân tích tài chính">Kế toán & Phân tích tài chính</option>
                    <option value="Du lịch & Dịch vụ bền vững">Du lịch & Dịch vụ bền vững</option>
                    <option value="Thương mại điện tử & Bán lẻ">Thương mại điện tử & Bán lẻ</option>
                  </select>
                </div>

                {/* Địa chỉ trụ sở */}
                <div>
                  <label className="block text-xs font-semibold text-[#16243D] mb-1.5">
                    Địa chỉ văn phòng / Trụ sở làm việc *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#5B6B85] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Tầng, Tòa nhà, Quận/Huyện, Tỉnh/TP"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] bg-[#F5F9FF] focus:bg-white focus:ring-2 focus:ring-[#3D7DD8]/30 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Website */}
                <div>
                  <label className="block text-xs font-semibold text-[#16243D] mb-1.5">
                    Website chính thức hoặc Portfolio
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-[#5B6B85] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://company.vn"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] bg-[#F5F9FF] focus:bg-white focus:ring-2 focus:ring-[#3D7DD8]/30 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* URL Logo */}
                <div>
                  <label className="block text-xs font-semibold text-[#16243D] mb-1.5">
                    Đường dẫn Logo doanh nghiệp (URL hình ảnh)
                  </label>
                  <input
                    type="url"
                    value={logo}
                    onChange={(e) => setLogo(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] bg-[#F5F9FF] focus:bg-white focus:ring-2 focus:ring-[#3D7DD8]/30 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Giới thiệu doanh nghiệp */}
              <div>
                <label className="block text-xs font-semibold text-[#16243D] mb-1.5">
                  Giới thiệu doanh nghiệp và văn hóa tuyển dụng bằng nhiệm vụ thật
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả về quy mô, sản phẩm tiêu biểu, tinh thần làm việc và lý do bạn muốn tạo cơ hội cọ xát thực tế cho sinh viên..."
                  className="w-full px-4 py-3 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] bg-[#F5F9FF] focus:bg-white focus:ring-2 focus:ring-[#3D7DD8]/30 outline-none transition-all leading-relaxed"
                />
              </div>
            </div>
          ) : (
            /* TAB: GIẤY TỜ PHÁP LÝ */
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-[#F5F9FF] border border-[#DCE8F8]">
                <h4 className="font-heading font-semibold text-sm text-[#16243D] mb-1">
                  Hồ sơ pháp lý đăng ký kinh doanh
                </h4>
                <p className="text-xs text-[#5B6B85] leading-relaxed">
                  Vui lòng tải lên bản sao scan/ảnh chụp Giấy chứng nhận Đăng ký Doanh nghiệp (GPĐKKD), Giấy phép thành lập tổ chức hoặc Giấy ủy quyền tuyển dụng có mộc đỏ hợp lệ.
                </p>
              </div>

              <div className="border-2 border-dashed border-[#A9CFFA] rounded-2xl p-6 text-center bg-[#F5F9FF]/60 hover:bg-[#F5F9FF] transition-colors">
                <Upload className="w-8 h-8 text-[#3D7DD8] mx-auto mb-2" />
                <p className="font-heading font-medium text-xs text-[#16243D]">
                  Kéo thả tệp hoặc chọn giấy tờ pháp lý để tải lên
                </p>
                <p className="text-[11px] text-[#5B6B85] mt-1">
                  Định dạng hỗ trợ: PDF, PNG, JPG (Tối đa 15MB)
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedFileMock('Giay_Phep_DKKD_Nexus_2026_Moi.pdf')}
                    className="px-3 py-1.5 rounded-full bg-white border border-[#DCE8F8] text-xs font-medium text-[#3D7DD8] hover:bg-[#EAF2FC] transition-colors"
                  >
                    + Chọn tệp: Giay_Phep_DKKD_2026.pdf
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedFileMock('Chung_Nhan_Thanh_Lap_Doanh_Nghiep.pdf')}
                    className="px-3 py-1.5 rounded-full bg-white border border-[#DCE8F8] text-xs font-medium text-[#3D7DD8] hover:bg-[#EAF2FC] transition-colors"
                  >
                    + Chọn tệp: Chung_Nhan_Thanh_Lap.pdf
                  </button>
                </div>
              </div>

              {/* Hiện tệp hiện tại hoặc tệp vừa chọn */}
              <div className="p-4 rounded-xl border border-[#DCE8F8] bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EAF2FC] text-[#3D7DD8] flex items-center justify-center shrink-0">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-xs text-[#16243D] block font-mono">
                      {selectedFileMock || legalDocumentName}
                    </span>
                    <span className="text-[11px] text-[#5B6B85]">
                      {selectedFileMock ? 'Tệp mới chuẩn bị lưu' : 'Đã tải lên vào hệ thống đối soát'}
                    </span>
                  </div>
                </div>

                {selectedFileMock && (
                  <button
                    type="button"
                    onClick={() => setSelectedFileMock('')}
                    className="text-xs text-[#B83214] hover:underline font-medium"
                  >
                    Hủy chọn tệp này
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-4 border-t border-[#DCE8F8] flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-[#5B6B85]">
              * Mọi chỉnh sửa giấy tờ pháp lý sẽ chuyển trạng thái sang <strong>Chờ thẩm định lại</strong>.
            </p>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-full bg-[#3D7DD8] hover:bg-[#2F67B5] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Lưu thay đổi hồ sơ
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
