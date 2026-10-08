import React, { useState } from 'react';
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  GraduationCap,
  KeyRound,
  ShieldCheck,
  UserCheck,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';

export const AuthModal: React.FC = () => {
  const {
    isAuthOpen,
    authMode,
    openAuth,
    closeAuth,
    quickLoginAs,
    loginWithEmail,
    registerStudent,
    registerCompany,
    notify,
  } = useApp();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>({});

  // Student register state
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    university: 'Đại học Bách Khoa Hà Nội',
    major: 'Khoa học Máy tính',
    cohort: 'K66',
    password: '',
  });
  const [studentErrors, setStudentErrors] = useState<Record<string, string>>({});

  // Company register state
  const [companyForm, setCompanyForm] = useState({
    companyName: '',
    contactName: '',
    email: '',
    industry: 'CNTT & Phần mềm',
    location: '',
    description: '',
    password: '',
  });
  const [companyErrors, setCompanyErrors] = useState<Record<string, string>>({});

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState('');

  if (!isAuthOpen) return null;

  // Handlers
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { email?: string; password?: string } = {};

    if (!loginEmail.trim()) {
      errors.email = 'Vui lòng nhập địa chỉ email của bạn (ví dụ: khang.nm.bk@stulance.edu.vn)';
    } else if (!loginEmail.includes('@')) {
      errors.email = 'Email chưa đúng định dạng. Hãy kiểm tra lại ký tự @ và tên miền.';
    }

    if (!loginPassword) {
      errors.password = 'Vui lòng nhập mật khẩu đăng nhập tối thiểu 6 ký tự.';
    } else if (loginPassword.length < 4) {
      errors.password = 'Mật khẩu quá ngắn. Vui lòng nhập từ 4 ký tự trở lên.';
    }

    setLoginErrors(errors);
    if (Object.keys(errors).length > 0) return;

    loginWithEmail(loginEmail, loginPassword);
  };

  const handleStudentRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!studentForm.name.trim()) {
      errs.name = 'Vui lòng nhập họ và tên đầy đủ của bạn.';
    }
    if (!studentForm.email.trim() || !studentForm.email.includes('@')) {
      errs.email = 'Vui lòng nhập email sinh viên hoặc cá nhân hợp lệ để nhận thông báo nộp bài.';
    }
    if (!studentForm.university.trim()) {
      errs.university = 'Vui lòng chọn hoặc nhập tên trường đại học bạn đang theo học.';
    }
    if (!studentForm.major.trim()) {
      errs.major = 'Vui lòng nhập chuyên ngành đào tạo.';
    }
    if (!studentForm.password || studentForm.password.length < 6) {
      errs.password = 'Mật khẩu bảo vệ tài khoản cần có ít nhất 6 ký tự.';
    }

    setStudentErrors(errs);
    if (Object.keys(errs).length > 0) return;

    registerStudent(studentForm);
  };

  const handleCompanyRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!companyForm.companyName.trim()) {
      errs.companyName = 'Vui lòng nhập tên công ty hoặc doanh nghiệp.';
    }
    if (!companyForm.contactName.trim()) {
      errs.contactName = 'Vui lòng nhập tên người phụ trách tuyển dụng / đại diện.';
    }
    if (!companyForm.email.trim() || !companyForm.email.includes('@')) {
      errs.email = 'Vui lòng nhập email doanh nghiệp chính thức (ví dụ: hr@congty.vn).';
    }
    if (!companyForm.location.trim()) {
      errs.location = 'Vui lòng nhập địa chỉ trụ sở (ví dụ: Q. 1, TP. Hồ Chí Minh).';
    }
    if (!companyForm.description.trim()) {
      errs.description = 'Vui lòng mô tả ngắn gọn về lĩnh vực hoạt động và quy mô doanh nghiệp.';
    }
    if (!companyForm.password || companyForm.password.length < 6) {
      errs.password = 'Mật khẩu cần tối thiểu 6 ký tự.';
    }

    setCompanyErrors(errs);
    if (Object.keys(errs).length > 0) return;

    registerCompany(companyForm);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setForgotError('Vui lòng nhập email hợp lệ mà bạn đã đăng ký tài khoản.');
      return;
    }
    setForgotError('');
    setForgotSent(true);
    notify('Đã gửi mã đặt lại mật khẩu', `Hướng dẫn khôi phục mật khẩu đã được gửi đến hộp thư ${forgotEmail}.`, 'info');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#16243D]/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl bg-white border border-[#DCE8F8] rounded-[20px] shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between p-6 border-b border-[#DCE8F8] bg-[#F5F9FF]">
          <div>
            <h2 className="font-heading font-bold text-xl text-[#16243D]">
              {authMode === 'login' && 'Đăng nhập vào Stulance'}
              {authMode === 'register_student' && 'Đăng ký tài khoản Sinh viên'}
              {authMode === 'register_company' && 'Đăng ký tài khoản Doanh nghiệp'}
              {authMode === 'forgot_password' && 'Khôi phục mật khẩu'}
            </h2>
            <p className="text-xs text-[#5B6B85] mt-1">
              {authMode === 'login' && 'Cổng kết nối việc làm qua nhiệm vụ thật. Đừng nộp CV. Hãy nộp bài làm.'}
              {authMode === 'register_student' && 'Tạo hồ sơ năng lực bằng chứng chỉ bài làm thật từ doanh nghiệp.'}
              {authMode === 'register_company' && 'Tuyển dụng nhân sự dựa trên bài làm thực tế thay cho hồ sơ CV.'}
              {authMode === 'forgot_password' && 'Nhập email để nhận liên kết tạo mật khẩu mới an toàn.'}
            </p>
          </div>
          <button
            onClick={closeAuth}
            className="p-2 text-[#5B6B85] hover:text-[#16243D] hover:bg-white rounded-full transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* TAB: LOGIN */}
          {authMode === 'login' && (
            <div className="space-y-6">
              {/* PHẦN 4 NÚT VÀO NHANH VỚI VAI TRÒ (YÊU CẦU ĐẶC BIỆT CỦA BẢN DEMO) */}
              <div className="p-4 rounded-2xl bg-[#F5F9FF] border border-[#DCE8F8]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-[#16243D] uppercase tracking-wider">
                    ⚡ Vào nhanh với vai trò (Dành cho Demo)
                  </span>
                  <span className="text-[11px] text-[#5B6B85]">Bấm để vào ngay không cần nhập</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Role 1: Sinh viên */}
                  <button
                    type="button"
                    onClick={() => quickLoginAs('student')}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#DCE8F8] hover:border-[#3D7DD8] hover:shadow-xs text-left transition-all group"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#EAF2FC] text-[#3D7DD8] flex items-center justify-center shrink-0 group-hover:bg-[#3D7DD8] group-hover:text-white transition-colors">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#16243D] group-hover:text-[#3D7DD8] flex items-center gap-1">
                        Sinh viên
                        <span className="text-[10px] font-normal text-[#5B6B85]">· K66 BK</span>
                      </div>
                      <div className="text-[11px] text-[#5B6B85] truncate">
                        Nguyễn Minh Khang
                      </div>
                    </div>
                  </button>

                  {/* Role 2: Doanh nghiệp */}
                  <button
                    type="button"
                    onClick={() => quickLoginAs('company')}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#DCE8F8] hover:border-[#3D7DD8] hover:shadow-xs text-left transition-all group"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#FFE9A8] text-[#7A5B00] flex items-center justify-center shrink-0 group-hover:bg-[#3D7DD8] group-hover:text-white transition-colors">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#16243D] group-hover:text-[#3D7DD8] flex items-center gap-1">
                        Doanh nghiệp
                        <span className="text-[10px] font-normal text-[#3D7DD8]">✓ Đã duyệt</span>
                      </div>
                      <div className="text-[11px] text-[#5B6B85] truncate">
                        Nexus Software Studio
                      </div>
                    </div>
                  </button>

                  {/* Role 3: Admin cán bộ nhà trường */}
                  <button
                    type="button"
                    onClick={() => quickLoginAs('admin')}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#DCE8F8] hover:border-[#3D7DD8] hover:shadow-xs text-left transition-all group"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#CDEFE0] text-[#0F5B39] flex items-center justify-center shrink-0 group-hover:bg-[#3D7DD8] group-hover:text-white transition-colors">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#16243D] group-hover:text-[#3D7DD8] flex items-center gap-1">
                        Admin trường
                        <span className="text-[10px] font-normal text-[#5B6B85]">· Duyệt DN</span>
                      </div>
                      <div className="text-[11px] text-[#5B6B85] truncate">
                        Thầy Trần Quốc Tuấn
                      </div>
                    </div>
                  </button>

                  {/* Role 4: Nhà trường xem báo cáo */}
                  <button
                    type="button"
                    onClick={() => quickLoginAs('school')}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#DCE8F8] hover:border-[#3D7DD8] hover:shadow-xs text-left transition-all group"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#FFD6CC] text-[#B83214] flex items-center justify-center shrink-0 group-hover:bg-[#3D7DD8] group-hover:text-white transition-colors">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#16243D] group-hover:text-[#3D7DD8] flex items-center gap-1">
                        Nhà trường
                        <span className="text-[10px] font-normal text-[#5B6B85]">· Báo cáo</span>
                      </div>
                      <div className="text-[11px] text-[#5B6B85] truncate">
                        TS. Vũ Mai Lan (Khảo thí)
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Đường phân cách */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-[#DCE8F8] w-full" />
                <span className="bg-white px-3 text-xs text-[#5B6B85] font-medium absolute">
                  hoặc đăng nhập bằng tài khoản
                </span>
              </div>

              {/* FORM EMAIL + MẬT KHẨU */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#16243D] mb-1">
                    Địa chỉ Email
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      if (loginErrors.email) setLoginErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    placeholder="vidu: khang.nm.bk@stulance.edu.vn"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#16243D] bg-white focus:outline-none focus:ring-2 focus:ring-[#3D7DD8]/30 transition-all ${
                      loginErrors.email ? 'border-[#B83214] bg-[#FFF8F7]' : 'border-[#DCE8F8]'
                    }`}
                  />
                  {loginErrors.email && (
                    <p className="flex items-center gap-1.5 text-xs text-[#B83214] mt-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {loginErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-[#16243D]">
                      Mật khẩu
                    </label>
                    <button
                      type="button"
                      onClick={() => openAuth('forgot_password')}
                      className="text-xs text-[#3D7DD8] hover:underline"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      if (loginErrors.password) setLoginErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    placeholder="Nhập mật khẩu của bạn"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#16243D] bg-white focus:outline-none focus:ring-2 focus:ring-[#3D7DD8]/30 transition-all ${
                      loginErrors.password ? 'border-[#B83214] bg-[#FFF8F7]' : 'border-[#DCE8F8]'
                    }`}
                  />
                  {loginErrors.password && (
                    <p className="flex items-center gap-1.5 text-xs text-[#B83214] mt-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {loginErrors.password}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#3D7DD8] hover:bg-[#2F67B5] text-white font-semibold text-sm rounded-full transition-colors shadow-xs mt-2"
                >
                  Đăng nhập vào hệ thống
                </button>
              </form>

              {/* Chuyển qua đăng ký */}
              <div className="pt-2 border-t border-[#DCE8F8] flex flex-wrap items-center justify-between text-xs text-[#5B6B85] gap-2">
                <span>Bạn chưa có tài khoản?</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openAuth('register_student')}
                    className="text-[#3D7DD8] font-semibold hover:underline"
                  >
                    Đăng ký Sinh viên
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => openAuth('register_company')}
                    className="text-[#3D7DD8] font-semibold hover:underline"
                  >
                    Đăng ký Doanh nghiệp
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: REGISTER STUDENT */}
          {authMode === 'register_student' && (
            <form onSubmit={handleStudentRegister} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#16243D] mb-1">
                    Họ và tên sinh viên *
                  </label>
                  <input
                    type="text"
                    value={studentForm.name}
                    onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE8F8] text-sm text-[#16243D] focus:ring-2 focus:ring-[#3D7DD8]/30 outline-none"
                  />
                  {studentErrors.name && (
                    <p className="text-xs text-[#B83214] mt-1">{studentErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#16243D] mb-1">
                    Email liên hệ *
                  </label>
                  <input
                    type="email"
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                    placeholder="sinhvien@edu.vn"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE8F8] text-sm text-[#16243D] focus:ring-2 focus:ring-[#3D7DD8]/30 outline-none"
                  />
                  {studentErrors.email && (
                    <p className="text-xs text-[#B83214] mt-1">{studentErrors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#16243D] mb-1">
                    Trường Đại học *
                  </label>
                  <input
                    type="text"
                    value={studentForm.university}
                    onChange={(e) => setStudentForm({ ...studentForm, university: e.target.value })}
                    placeholder="Đại học Bách Khoa, Kinh tế Quốc dân..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE8F8] text-sm text-[#16243D] focus:ring-2 focus:ring-[#3D7DD8]/30 outline-none"
                  />
                  {studentErrors.university && (
                    <p className="text-xs text-[#B83214] mt-1">{studentErrors.university}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#16243D] mb-1">
                    Khóa / Khóa học
                  </label>
                  <input
                    type="text"
                    value={studentForm.cohort}
                    onChange={(e) => setStudentForm({ ...studentForm, cohort: e.target.value })}
                    placeholder="K66, Khóa 2023..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE8F8] text-sm text-[#16243D] focus:ring-2 focus:ring-[#3D7DD8]/30 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#16243D] mb-1">
                    Ngành học chính *
                  </label>
                  <input
                    type="text"
                    value={studentForm.major}
                    onChange={(e) => setStudentForm({ ...studentForm, major: e.target.value })}
                    placeholder="Khoa học máy tính, Marketing..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE8F8] text-sm text-[#16243D] focus:ring-2 focus:ring-[#3D7DD8]/30 outline-none"
                  />
                  {studentErrors.major && (
                    <p className="text-xs text-[#B83214] mt-1">{studentErrors.major}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#16243D] mb-1">
                    Mật khẩu khởi tạo *
                  </label>
                  <input
                    type="password"
                    value={studentForm.password}
                    onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                    placeholder="Tối thiểu 6 ký tự"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE8F8] text-sm text-[#16243D] focus:ring-2 focus:ring-[#3D7DD8]/30 outline-none"
                  />
                  {studentErrors.password && (
                    <p className="text-xs text-[#B83214] mt-1">{studentErrors.password}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#3D7DD8] hover:bg-[#2F67B5] text-white font-semibold text-sm rounded-full transition-colors shadow-xs mt-2"
              >
                Hoàn tất đăng ký Sinh viên
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => openAuth('login')}
                  className="text-xs text-[#5B6B85] hover:text-[#3D7DD8]"
                >
                  Đã có tài khoản? Quay lại đăng nhập
                </button>
              </div>
            </form>
          )}

          {/* TAB: REGISTER COMPANY */}
          {authMode === 'register_company' && (
            <form onSubmit={handleCompanyRegister} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#16243D] mb-1">
                    Tên doanh nghiệp / Công ty *
                  </label>
                  <input
                    type="text"
                    value={companyForm.companyName}
                    onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })}
                    placeholder="Công ty TNHH Giải pháp..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE8F8] text-sm text-[#16243D] focus:ring-2 focus:ring-[#3D7DD8]/30 outline-none"
                  />
                  {companyErrors.companyName && (
                    <p className="text-xs text-[#B83214] mt-1">{companyErrors.companyName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#16243D] mb-1">
                    Lĩnh vực hoạt động *
                  </label>
                  <select
                    value={companyForm.industry}
                    onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE8F8] text-sm text-[#16243D] bg-white focus:ring-2 focus:ring-[#3D7DD8]/30 outline-none"
                  >
                    <option value="CNTT & Phần mềm">CNTT & Phần mềm</option>
                    <option value="Marketing & Truyền thông">Marketing & Truyền thông</option>
                    <option value="Thiết kế sáng tạo">Thiết kế sáng tạo</option>
                    <option value="Kế toán & Tài chính">Kế toán & Tài chính</option>
                    <option value="Du lịch & Khách sạn">Du lịch & Khách sạn</option>
                    <option value="Khác">Lĩnh vực khác</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#16243D] mb-1">
                    Người phụ trách tuyển dụng *
                  </label>
                  <input
                    type="text"
                    value={companyForm.contactName}
                    onChange={(e) => setCompanyForm({ ...companyForm, contactName: e.target.value })}
                    placeholder="Nguyễn Thị B (Trưởng phòng Tuyển dụng)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE8F8] text-sm text-[#16243D] focus:ring-2 focus:ring-[#3D7DD8]/30 outline-none"
                  />
                  {companyErrors.contactName && (
                    <p className="text-xs text-[#B83214] mt-1">{companyErrors.contactName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#16243D] mb-1">
                    Email nhận bài nộp *
                  </label>
                  <input
                    type="email"
                    value={companyForm.email}
                    onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                    placeholder="tuyendung@congty.vn"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE8F8] text-sm text-[#16243D] focus:ring-2 focus:ring-[#3D7DD8]/30 outline-none"
                  />
                  {companyErrors.email && (
                    <p className="text-xs text-[#B83214] mt-1">{companyErrors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#16243D] mb-1">
                  Địa chỉ trụ sở / Chi nhánh làm việc *
                </label>
                <input
                  type="text"
                  value={companyForm.location}
                  onChange={(e) => setCompanyForm({ ...companyForm, location: e.target.value })}
                  placeholder="Quận Cầu Giấy, Hà Nội hoặc Quận 1, TP.HCM..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE8F8] text-sm text-[#16243D] focus:ring-2 focus:ring-[#3D7DD8]/30 outline-none"
                />
                {companyErrors.location && (
                  <p className="text-xs text-[#B83214] mt-1">{companyErrors.location}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#16243D] mb-1">
                  Giới thiệu ngắn về doanh nghiệp và văn hóa làm việc *
                </label>
                <textarea
                  rows={2}
                  value={companyForm.description}
                  onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                  placeholder="Mô tả sản phẩm, dịch vụ và định hướng tuyển dụng sinh viên..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE8F8] text-sm text-[#16243D] focus:ring-2 focus:ring-[#3D7DD8]/30 outline-none"
                />
                {companyErrors.description && (
                  <p className="text-xs text-[#B83214] mt-1">{companyErrors.description}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#16243D] mb-1">
                  Mật khẩu tài khoản *
                </label>
                <input
                  type="password"
                  value={companyForm.password}
                  onChange={(e) => setCompanyForm({ ...companyForm, password: e.target.value })}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE8F8] text-sm text-[#16243D] focus:ring-2 focus:ring-[#3D7DD8]/30 outline-none"
                />
                {companyErrors.password && (
                  <p className="text-xs text-[#B83214] mt-1">{companyErrors.password}</p>
                )}
              </div>

              <div className="p-3 bg-[#F5F9FF] rounded-xl border border-[#DCE8F8] text-xs text-[#5B6B85] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#3D7DD8] shrink-0 mt-0.5" />
                <span>
                  Hồ sơ doanh nghiệp sau khi gửi sẽ ở trạng thái <strong>Chờ xác minh</strong> và được cán bộ nhà trường kiểm duyệt trước khi hiển thị công khai.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#3D7DD8] hover:bg-[#2F67B5] text-white font-semibold text-sm rounded-full transition-colors shadow-xs mt-2"
              >
                Gửi hồ sơ đăng ký doanh nghiệp
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => openAuth('login')}
                  className="text-xs text-[#5B6B85] hover:text-[#3D7DD8]"
                >
                  Đã có tài khoản? Quay lại đăng nhập
                </button>
              </div>
            </form>
          )}

          {/* TAB: FORGOT PASSWORD */}
          {authMode === 'forgot_password' && (
            <div className="space-y-4">
              {!forgotSent ? (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#F5F9FF] border border-[#DCE8F8] flex items-start gap-3 text-xs text-[#16243D]">
                    <KeyRound className="w-5 h-5 text-[#3D7DD8] shrink-0 mt-0.5" />
                    <p className="leading-relaxed text-[#5B6B85]">
                      Nhập địa chỉ email tài khoản của bạn. Hệ thống sẽ tạo liên kết mô phỏng đặt lại mật khẩu và gửi tức thì vào hộp thư.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#16243D] mb-1">
                      Email đã đăng ký
                    </label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => {
                        setForgotEmail(e.target.value);
                        setForgotError('');
                      }}
                      placeholder="vidu: khang.nm.bk@stulance.edu.vn"
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#16243D] bg-white outline-none focus:ring-2 focus:ring-[#3D7DD8]/30 ${
                        forgotError ? 'border-[#B83214]' : 'border-[#DCE8F8]'
                      }`}
                    />
                    {forgotError && (
                      <p className="text-xs text-[#B83214] mt-1">{forgotError}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#3D7DD8] hover:bg-[#2F67B5] text-white font-semibold text-sm rounded-full transition-colors shadow-xs"
                  >
                    Gửi yêu cầu khôi phục
                  </button>
                </form>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#CDEFE0] text-[#0F5B39] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-heading font-semibold text-base text-[#16243D]">
                    Đã gửi thư khôi phục mật khẩu
                  </h4>
                  <p className="text-xs text-[#5B6B85] max-w-sm mx-auto leading-relaxed">
                    Vui lòng kiểm tra hộp thư đến của <strong>{forgotEmail}</strong> để hoàn tất các bước đổi mật khẩu mới.
                  </p>
                  <button
                    onClick={() => {
                      setForgotSent(false);
                      openAuth('login');
                    }}
                    className="px-5 py-2 bg-[#3D7DD8] text-white text-xs font-semibold rounded-full hover:bg-[#2F67B5] transition-colors mt-2"
                  >
                    Quay lại màn hình Đăng nhập
                  </button>
                </div>
              )}

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => openAuth('login')}
                  className="text-xs text-[#5B6B85] hover:text-[#3D7DD8]"
                >
                  Quay lại đăng nhập
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
