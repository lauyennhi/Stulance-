import React, { useState } from 'react';
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Clock,
  Compass,
  FileCheck2,
  GraduationCap,
  Layers,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Submission, Task, TaskCategory } from '../../types';
import { ProofCard } from '../common/ProofCard';

export const LandingPage: React.FC = () => {
  const { openAuth, tasks, submissions, companies } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [detailModalTask, setDetailModalTask] = useState<Task | null>(null);

  const categories: string[] = ['Tất cả', 'Marketing', 'CNTT', 'Thiết kế', 'Kế toán', 'Du lịch'];

  // Filter tasks for preview
  const filteredTasks = tasks.filter((t) => {
    if (selectedCategory === 'Tất cả') return true;
    return t.category === selectedCategory;
  });

  // Sample proof submissions for landing showcase
  const sampleProofs = submissions.filter((s) => s.status === 'graded').slice(0, 3);

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num) + ' đ';
  };

  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      {/* 1. HERO SECTION */}
      <section id="hero" className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        {/* Subtle background ambient circles without purple gradient */}
        <div
          aria-hidden="true"
          className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[350px] bg-[#A9CFFA]/25 rounded-full blur-3xl pointer-events-none -z-10"
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Top Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#DCE8F8] text-xs font-medium text-[#16243D] shadow-xs mb-8">
            <span className="w-2 h-2 rounded-full bg-[#3D7DD8]" />
            <span>Nền tảng tuyển dụng sinh viên thế hệ mới</span>
          </div>

          {/* Core Positioning Statement */}
          <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl text-[#16243D] tracking-tight max-w-4xl mx-auto leading-[1.12]">
            Đừng nộp CV. <br className="hidden sm:inline" />
            <span className="text-[#3D7DD8]">Hãy nộp bài làm.</span>
          </h1>

          {/* Subtitle with direct, friendly, confident tone */}
          <p className="mt-6 text-base sm:text-lg text-[#5B6B85] max-w-2xl mx-auto leading-relaxed">
            Doanh nghiệp tuyển bạn bằng những <strong>nhiệm vụ thực tế</strong> thay vì những dòng chữ tự khen trong bản CV. Bạn giải quyết thử thách, nhận thù lao và sở hữu <strong>Thẻ bằng chứng</strong> được công nhận khắp thị trường.
          </p>

          {/* Two Distinct CTA Buttons as requested */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 max-w-md mx-auto">
            <button
              onClick={() => openAuth('register_student')}
              className="w-full sm:w-auto px-7 py-3.5 bg-[#3D7DD8] hover:bg-[#2F67B5] text-white text-sm font-semibold rounded-full transition-all shadow-xs flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Tôi là sinh viên</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => openAuth('register_company')}
              className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-[#EAF2FC] text-[#16243D] border border-[#DCE8F8] text-sm font-semibold rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Briefcase className="w-4 h-4 text-[#3D7DD8]" />
              <span>Tôi là doanh nghiệp</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="mt-14 pt-8 border-t border-[#DCE8F8]/80 max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <p className="font-heading font-bold text-2xl text-[#16243D]">{tasks.length}+</p>
              <p className="text-xs text-[#5B6B85] mt-0.5">Nhiệm vụ thực tế mở</p>
            </div>
            <div>
              <p className="font-heading font-bold text-2xl text-[#16243D]">
                {companies.filter((c) => c.status === 'verified').length}
              </p>
              <p className="text-xs text-[#5B6B85] mt-0.5">Doanh nghiệp đã xác minh</p>
            </div>
            <div>
              <p className="font-heading font-bold text-2xl text-[#16243D]">100%</p>
              <p className="text-xs text-[#5B6B85] mt-0.5">Chấm điểm có nhận xét</p>
            </div>
            <div>
              <p className="font-heading font-bold text-2xl text-[#16243D]">0 đồng</p>
              <p className="text-xs text-[#5B6B85] mt-0.5">Phí trung gian sinh viên</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE STEPS: "Nhận nhiệm vụ → Nộp bài → Có hồ sơ năng lực" */}
      <section id="steps" className="py-16 sm:py-24 bg-white border-y border-[#DCE8F8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#16243D] tracking-tight">
              3 bước biến năng lực thành việc làm thật
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#5B6B85]">
              Không còn loay hoay viết CV khi chưa có kinh nghiệm. Hãy chứng minh bằng chính những gì bạn làm được.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
            {/* Step 1 */}
            <div className="stulance-card p-8 border border-[#DCE8F8] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#EAF2FC] text-[#3D7DD8] font-heading font-bold text-lg flex items-center justify-center mb-6">
                  01
                </div>
                <h3 className="font-heading font-semibold text-xl text-[#16243D] mb-3">
                  Nhận nhiệm vụ thật
                </h3>
                <p className="text-sm text-[#5B6B85] leading-relaxed">
                  Lựa chọn đề bài kinh doanh do các công ty uy tín trực tiếp đăng tải. Mỗi nhiệm vụ đều có mô tả rõ ràng, tiêu chí chấm minh bạch và mức thù lao xứng đáng.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#DCE8F8] text-xs font-semibold text-[#3D7DD8] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Đúng ngành, đúng việc công sở
              </div>
            </div>

            {/* Step 2 */}
            <div className="stulance-card p-8 border border-[#DCE8F8] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FFE9A8] text-[#7A5B00] font-heading font-bold text-lg flex items-center justify-center mb-6">
                  02
                </div>
                <h3 className="font-heading font-semibold text-xl text-[#16243D] mb-3">
                  Nộp bài làm thực tế
                </h3>
                <p className="text-sm text-[#5B6B85] leading-relaxed">
                  Bạn nộp sản phẩm hoàn chỉnh: liên kết mã nguồn GitHub, file thiết kế Figma, bảng tính tài chính Excel hoặc kế hoạch nội dung. Không nộp những lời hứa hẹn suông.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#DCE8F8] text-xs font-semibold text-[#7A5B00] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Doanh nghiệp chấm trong 48h
              </div>
            </div>

            {/* Step 3 */}
            <div className="stulance-card p-8 border border-[#DCE8F8] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#CDEFE0] text-[#0F5B39] font-heading font-bold text-lg flex items-center justify-center mb-6">
                  03
                </div>
                <h3 className="font-heading font-semibold text-xl text-[#16243D] mb-3">
                  Có hồ sơ năng lực
                </h3>
                <p className="text-sm text-[#5B6B85] leading-relaxed">
                  Nhận ngay <strong>Thẻ bằng chứng</strong> có điểm số và nhận xét từ quản lý bộ phận. Doanh nghiệp khác nhìn vào sẽ muốn tuyển dụng bạn ngay lập tức.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#DCE8F8] text-xs font-semibold text-[#0F5B39] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Bằng chứng không thể làm giả
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROOF CARDS SHOWCASE (Điểm nhận diện riêng: Thẻ bằng chứng) */}
      <section id="proofs" className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF2FC] text-[#3D7DD8] mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Điểm nhận diện riêng của Stulance
              </div>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#16243D] tracking-tight">
                Thẻ bằng chứng: Giá trị hơn 100 trang CV
              </h2>
              <p className="mt-2 text-sm sm:text-base text-[#5B6B85] max-w-xl">
                Mỗi bài làm đã chấm tạo ra một Thẻ bằng chứng chứa điểm số thực, dấu xác minh doanh nghiệp và lời nhận xét trích dẫn trực tiếp từ nhà tuyển dụng.
              </p>
            </div>
            <button
              onClick={() => openAuth('login')}
              className="px-5 py-2.5 bg-white hover:bg-[#EAF2FC] border border-[#DCE8F8] text-[#16243D] text-xs font-semibold rounded-full transition-colors self-start md:self-auto"
            >
              Xem toàn bộ hồ sơ năng lực mẫu →
            </button>
          </div>

          {/* Grid of sample Proof Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleProofs.map((sub) => (
              <ProofCard key={sub.id} submission={sub} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. TASKS PREVIEW SECTION (5 Ngành: Marketing, CNTT, Thiết kế, Kế toán, Du lịch) */}
      <section id="tasks-preview" className="py-16 sm:py-24 bg-white border-t border-[#DCE8F8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#16243D] tracking-tight">
              Nhiệm vụ đang mở tuyển hôm nay
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#5B6B85]">
              Thử thách thật từ các công ty thật. Hoàn thành để nhận thù lao và xây dựng thương hiệu cá nhân.
            </p>

            {/* Filter buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs font-medium rounded-full transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#3D7DD8] text-white shadow-xs'
                      : 'bg-[#F5F9FF] text-[#5B6B85] hover:text-[#16243D] border border-[#DCE8F8]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Task Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.slice(0, 6).map((task) => (
              <div
                key={task.id}
                onClick={() => setDetailModalTask(task)}
                className="stulance-card stulance-card-hover p-6 flex flex-col justify-between cursor-pointer border border-[#DCE8F8] bg-white group"
              >
                <div>
                  {/* Top metadata line without pill sandwiches */}
                  <div className="flex items-center justify-between text-xs text-[#5B6B85] mb-3">
                    <span className="font-medium text-[#3D7DD8]">{task.category}</span>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{task.estimatedHours}h làm</span>
                    </div>
                  </div>

                  <h3 className="font-heading font-semibold text-base text-[#16243D] group-hover:text-[#3D7DD8] transition-colors line-clamp-2 mb-2 leading-snug">
                    {task.title}
                  </h3>

                  <p className="text-xs text-[#5B6B85] line-clamp-3 leading-relaxed mb-4">
                    {task.shortBrief}
                  </p>
                </div>

                <div>
                  {/* Badges: Thù lao (Vàng bơ) & Hạn nộp (Hồng đào nếu gấp) */}
                  <div className="flex items-center gap-2 flex-wrap mb-4">
                    {/* Thù lao màu vàng bơ #FFE9A8 */}
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FFE9A8] text-[#7A5B00]">
                      Thù lao: {formatVND(task.rewardVND)}
                    </span>

                    {/* Hạn nộp gấp màu hồng đào #FFD6CC */}
                    {task.isUrgent && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FFD6CC] text-[#B83214]">
                        Hạn gấp: {task.deadline}
                      </span>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#DCE8F8] flex items-center justify-between text-xs text-[#5B6B85]">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="font-medium text-[#16243D] truncate">{task.companyName}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3D7DD8] shrink-0" />
                    </div>
                    <span className="text-[#3D7DD8] font-semibold shrink-0">Xem chi tiết →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => openAuth('register_student')}
              className="px-6 py-3 bg-[#3D7DD8] hover:bg-[#2F67B5] text-white text-xs font-semibold rounded-full transition-colors shadow-xs"
            >
              Khám phá tất cả {tasks.length} nhiệm vụ và bắt đầu làm bài →
            </button>
          </div>
        </div>
      </section>

      {/* 5. WHY TASK-BASED HIRING BEATS CVs */}
      <section className="py-16 sm:py-24 bg-[#F5F9FF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="stulance-card p-8 sm:p-12 border border-[#DCE8F8] bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#3D7DD8]">
                  Cách tiếp cận đột phá
                </span>
                <h3 className="font-heading font-bold text-2xl sm:text-3xl text-[#16243D] mt-2 mb-4 leading-snug">
                  Tại sao tuyển dụng bằng nhiệm vụ thật vượt trội hơn lọc CV?
                </h3>
                <p className="text-sm text-[#5B6B85] leading-relaxed mb-6">
                  CV sinh viên thường giống hệt nhau: cùng mẫu template, cùng các hoạt động phong trào và rất khó để đánh giá xem bạn có thật sự làm được việc văn phòng hay không.
                </p>

                <div className="space-y-3.5 text-sm text-[#16243D]">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#CDEFE0] text-[#0F5B39] flex items-center justify-center shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <strong>Đánh giá thực chiến:</strong> Nhìn thấy dòng code, bảng tính hay ấn phẩm thiết kế trước khi mời phỏng vấn.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#CDEFE0] text-[#0F5B39] flex items-center justify-center shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <strong>Công bằng cho sinh viên:</strong> Bất kể bạn học trường nào hay chưa có kinh nghiệm, bài làm tốt là có điểm cao.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#CDEFE0] text-[#0F5B39] flex items-center justify-center shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <strong>Nhà trường dễ theo dõi:</strong> Báo cáo minh bạch năng lực thật của sinh viên theo chuẩn đầu ra doanh nghiệp.
                    </div>
                  </div>
                </div>
              </div>

              {/* Callout Box */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#F5F9FF] border border-[#DCE8F8] flex flex-col justify-between">
                <div>
                  <h4 className="font-heading font-bold text-lg text-[#16243D] mb-3">
                    Bắt đầu hành trình cùng Stulance ngay hôm nay
                  </h4>
                  <p className="text-xs text-[#5B6B85] leading-relaxed mb-6">
                    Hơn 85% sinh viên có từ 2 Thẻ bằng chứng đạt điểm 9.0 trở lên nhận được lời mời thực tập chính thức ngay trong tháng đầu tiên.
                  </p>
                </div>

                <div className="space-y-2.5">
                  <button
                    onClick={() => openAuth('register_student')}
                    className="w-full py-3 bg-[#3D7DD8] hover:bg-[#2F67B5] text-white text-xs font-semibold rounded-full transition-colors text-center"
                  >
                    Tạo tài khoản sinh viên miễn phí
                  </button>
                  <button
                    onClick={() => openAuth('login')}
                    className="w-full py-3 bg-white hover:bg-slate-50 border border-[#DCE8F8] text-[#16243D] text-xs font-medium rounded-full transition-colors text-center"
                  >
                    Trải nghiệm nhanh với 4 vai trò demo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-white border-t border-[#DCE8F8] text-xs text-[#5B6B85]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-sm text-[#16243D]">Stulance</span>
            <span>·</span>
            <span>Cổng kết nối việc làm sinh viên qua nhiệm vụ thật</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span>Phiên bản demo lưu trữ dữ liệu bằng LocalStorage</span>
            <span>·</span>
            <span>Hỗ trợ thiết bị từ 360px</span>
          </div>
        </div>
      </footer>

      {/* TASK DETAIL MODAL ON LANDING */}
      {detailModalTask && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#16243D]/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
          <div
            className="relative w-full max-w-xl bg-white border border-[#DCE8F8] rounded-[20px] shadow-2xl p-6 sm:p-8 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-medium text-[#3D7DD8]">{detailModalTask.category}</span>
                <h3 className="font-heading font-bold text-xl text-[#16243D] mt-1">
                  {detailModalTask.title}
                </h3>
                <p className="text-xs text-[#5B6B85] mt-1">
                  Đăng bởi <strong>{detailModalTask.companyName}</strong> (Đã xác minh)
                </p>
              </div>
              <button
                onClick={() => setDetailModalTask(null)}
                className="p-1.5 text-[#5B6B85] hover:text-[#16243D] rounded-full"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 my-6 text-xs text-[#16243D] max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <h4 className="font-semibold text-xs text-[#5B6B85] uppercase tracking-wider mb-1">
                  Mô tả đề bài
                </h4>
                <p className="text-xs text-[#16243D] leading-relaxed">
                  {detailModalTask.description}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-xs text-[#5B6B85] uppercase tracking-wider mb-1">
                  Yêu cầu nộp bài
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-[#16243D]">
                  {detailModalTask.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-xs text-[#5B6B85] uppercase tracking-wider mb-1">
                  Tiêu chí chấm điểm công khai
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-[#5B6B85]">
                  {detailModalTask.evaluationCriteriaList?.map((cri, i) => (
                    <li key={i}>
                      <strong>{cri.name}:</strong> Tối đa {cri.maxScore}đ {cri.description ? `(${cri.description})` : ''}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#F5F9FF] border border-[#DCE8F8] flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-[#5B6B85]">Thù lao nhận được</p>
                  <p className="font-heading font-bold text-sm text-[#16243D]">
                    {formatVND(detailModalTask.rewardVND)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-[#5B6B85]">Hạn chót</p>
                  <p className="font-heading font-bold text-sm text-[#B83214]">
                    {detailModalTask.deadline}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#DCE8F8]">
              <button
                onClick={() => setDetailModalTask(null)}
                className="px-4 py-2 text-xs text-[#5B6B85] hover:text-[#16243D]"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  setDetailModalTask(null);
                  openAuth('register_student');
                }}
                className="px-5 py-2.5 bg-[#3D7DD8] hover:bg-[#2F67B5] text-white text-xs font-semibold rounded-full"
              >
                Đăng nhập để nhận nhiệm vụ này
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
