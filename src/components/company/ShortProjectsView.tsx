import React, { useState } from 'react';
import {
  AlertCircle,
  Award,
  CheckCircle2,
  Clock,
  Coins,
  DollarSign,
  ExternalLink,
  Eye,
  FileCheck2,
  Filter,
  GraduationCap,
  PlusCircle,
  Search,
  Star,
  UserCheck,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StudentProfile, Task } from '../../types';
import { EmptyState } from '../common/EmptyState';
import { StudentPublicProfileModal } from './StudentPublicProfileModal';

export const ShortProjectsView: React.FC = () => {
  const {
    currentCompany,
    tasks,
    myTasks,
    students,
    assignStudentToProject,
    confirmProjectCompletionAndPayment,
    submitStudentEvaluation,
    setCurrentTab,
    notify,
  } = useApp();

  const [selectedTaskId, setSelectedTaskId] = useState<string>('all');
  const [profileViewingStudent, setProfileViewingStudent] = useState<StudentProfile | null>(null);

  // Evaluation modal state
  const [evalModalData, setEvalModalData] = useState<{
    studentId: string;
    studentName: string;
    taskId: string;
    taskTitle: string;
  } | null>(null);
  const [evalRating, setEvalRating] = useState<number>(5);
  const [evalComment, setEvalComment] = useState<string>('');

  // Company's short projects (type === 'project')
  const companyProjects = tasks.filter(
    (t) => t.companyId === (currentCompany?.id || 'comp-1') && t.type === 'project'
  );

  // Filter tasks
  const displayedProjects =
    selectedTaskId === 'all'
      ? companyProjects
      : companyProjects.filter((p) => p.id === selectedTaskId);

  const handleOpenEvaluation = (studentId: string, studentName: string, taskId: string, taskTitle: string) => {
    setEvalModalData({ studentId, studentName, taskId, taskTitle });
    setEvalRating(5);
    setEvalComment('Sinh viên chủ động, hoàn thành công việc đúng tiến độ và cam kết chất lượng.');
  };

  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evalModalData) return;
    submitStudentEvaluation(
      evalModalData.studentId,
      evalModalData.taskId,
      evalRating,
      evalComment.trim()
    );
    setEvalModalData(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="stulance-card p-6 border border-[#DCE8F8] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-heading font-bold text-xl text-[#16243D]">
              Quản lý Dự án ngắn & Thù lao sinh viên
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FFE9A8] text-[#7A5B00]">
              5 – 40 giờ
            </span>
          </div>
          <p className="text-xs text-[#5B6B85]">
            Xem danh sách sinh viên ứng tuyển, phê duyệt người thực hiện và xác nhận hoàn tất chi trả thù lao.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] bg-white outline-none"
          >
            <option value="all">Tất cả dự án ({companyProjects.length})</option>
            {companyProjects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title.substring(0, 32)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Banner lưu ý quan trọng: "Cổng chỉ ghi nhận, không xử lý tiền" */}
      <div className="p-4 rounded-2xl bg-[#F0FAF5] border border-[#CDEFE0] flex items-start gap-3">
        <DollarSign className="w-5 h-5 text-[#0F5B39] shrink-0 mt-0.5" />
        <div className="text-xs text-[#0F5B39]">
          <strong className="block font-semibold mb-0.5">
            Cơ chế xác nhận thù lao trên Stulance:
          </strong>
          Cổng Stulance đóng vai trò <strong>chứng thực hoàn thành dự án và bảo vệ quyền lợi sinh viên</strong>. Doanh nghiệp và sinh viên thanh toán thù lao trực tiếp theo thỏa thuận (chuyển khoản ngân hàng hoặc tiền mặt). Khi bạn bấm nút &ldquo;Xác nhận hoàn thành & đã chi trả&rdquo;, hệ thống sẽ ghi nhận cột mốc tín nhiệm vào hồ sơ năng lực của cả hai bên.
        </div>
      </div>

      {/* Danh sách các dự án ngắn */}
      {displayedProjects.length === 0 ? (
        <EmptyState
          icon={Coins}
          title="Chưa có Dự án ngắn nào"
          description="Doanh nghiệp của bạn chưa đăng tải nhiệm vụ loại 'Dự án ngắn' (5-40 giờ có thù lao)."
          actionText="Tạo dự án mới"
          onAction={() => setCurrentTab('company-tasks')}
        />
      ) : (
        <div className="space-y-6">
          {displayedProjects.map((project) => {
            // Find student applications/records for this project
            const candidates = myTasks.filter((m) => m.taskId === project.id);
            const assignedCandidate = candidates.find((m) => m.isAssigned);

            return (
              <div
                key={project.id}
                className="stulance-card p-6 border border-[#DCE8F8] bg-white space-y-6"
              >
                {/* Project Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#DCE8F8]">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#EAF2FC] text-[#3D7DD8]">
                        {project.category}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FFE9A8] text-[#7A5B00]">
                        Thù lao: {new Intl.NumberFormat('vi-VN').format(project.rewardVND)} đ
                      </span>
                      <span className="text-xs text-[#5B6B85]">
                        Thời lượng: {project.estimatedHours} giờ
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-base text-[#16243D]">
                      {project.title}
                    </h3>
                  </div>

                  <div className="text-right sm:border-l sm:pl-4 border-[#DCE8F8] shrink-0">
                    <span className="text-[11px] text-[#5B6B85] block">Ứng viên đã nhận đề</span>
                    <span className="font-heading font-bold text-base text-[#3D7DD8]">
                      {candidates.length} sinh viên
                    </span>
                  </div>
                </div>

                {/* Candidate List */}
                <div>
                  <h4 className="font-heading font-semibold text-xs text-[#16243D] uppercase tracking-wider mb-3">
                    Danh sách sinh viên ứng tuyển & thực hiện ({candidates.length})
                  </h4>

                  {candidates.length === 0 ? (
                    <div className="p-4 rounded-xl bg-[#F5F9FF] border border-[#DCE8F8] text-center text-xs text-[#5B6B85]">
                      Chưa có sinh viên nào nhận dự án này. Bạn có thể sang tab &ldquo;Tìm sinh viên&rdquo; để chủ động gửi lời mời ứng tuyển!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {candidates.map((cand) => {
                        const studentObj = students.find((s) => s.id === cand.studentId);
                        const isSelected = cand.isAssigned;
                        const isCompletedAndPaid = cand.isCompleted && cand.isPaidConfirmed;

                        return (
                          <div
                            key={cand.id}
                            className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                              isSelected
                                ? 'border-[#3D7DD8] bg-[#F5F9FF]/70'
                                : 'border-[#DCE8F8] bg-white'
                            }`}
                          >
                            <div className="flex items-center gap-3.5">
                              <div className="w-11 h-11 rounded-xl bg-white border border-[#DCE8F8] text-[#3D7DD8] font-heading font-bold text-base flex items-center justify-center shrink-0">
                                {studentObj?.name.charAt(0) || 'S'}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h5 className="font-heading font-semibold text-xs text-[#16243D]">
                                    {studentObj?.name || 'Sinh viên'}
                                  </h5>
                                  {isSelected && (
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#3D7DD8] text-white">
                                      Đã chọn giao dự án
                                    </span>
                                  )}
                                  {isCompletedAndPaid && (
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#CDEFE0] text-[#0F5B39]">
                                      ✓ Đã hoàn thành & Chi trả
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-[#5B6B85] mt-0.5">
                                  {studentObj?.major} · {studentObj?.university} · Điểm TB: <strong>{studentObj?.averageScore.toFixed(1)}/10</strong>
                                </p>
                              </div>
                            </div>

                            {/* Actions for this candidate */}
                            <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
                              {/* Xem hồ sơ năng lực */}
                              {studentObj && (
                                <button
                                  type="button"
                                  onClick={() => setProfileViewingStudent(studentObj)}
                                  className="px-3 py-1.5 rounded-full bg-white border border-[#DCE8F8] text-xs font-medium text-[#16243D] hover:bg-[#EAF2FC] transition-colors flex items-center gap-1"
                                >
                                  <Eye className="w-3.5 h-3.5 text-[#3D7DD8]" />
                                  Hồ sơ năng lực
                                </button>
                              )}

                              {/* Chọn sinh viên */}
                              {!isSelected && !assignedCandidate && (
                                <button
                                  type="button"
                                  onClick={() => assignStudentToProject(project.id, cand.studentId)}
                                  className="px-4 py-1.5 rounded-full bg-[#3D7DD8] hover:bg-[#2F67B5] text-white text-xs font-semibold transition-colors shadow-xs"
                                >
                                  Chọn sinh viên này
                                </button>
                              )}

                              {/* Xác nhận hoàn thành & chi trả thù lao */}
                              {isSelected && !isCompletedAndPaid && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    confirmProjectCompletionAndPayment(project.id, cand.studentId)
                                  }
                                  className="px-4 py-1.5 rounded-full bg-[#0F5B39] hover:bg-[#094127] text-white text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Xác nhận hoàn thành & Đã chi trả thù lao
                                </button>
                              )}

                              {/* Đánh giá sau khi hoàn thành */}
                              {isCompletedAndPaid && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleOpenEvaluation(
                                      cand.studentId,
                                      studentObj?.name || 'Sinh viên',
                                      project.id,
                                      project.title
                                    )
                                  }
                                  className="px-3.5 py-1.5 rounded-full bg-[#FFE9A8] hover:bg-[#F0DC94] text-[#7A5B00] text-xs font-semibold transition-colors flex items-center gap-1"
                                >
                                  <Star className="w-3.5 h-3.5 fill-[#7A5B00]" />
                                  Đánh giá sinh viên
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Public Profile Modal */}
      {profileViewingStudent && (
        <StudentPublicProfileModal
          student={profileViewingStudent}
          onClose={() => setProfileViewingStudent(null)}
        />
      )}

      {/* Evaluation Modal */}
      {evalModalData && (
        <div className="fixed inset-0 z-50 bg-[#16243D]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="w-full max-w-md bg-white border border-[#DCE8F8] rounded-[24px] shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="font-heading font-bold text-base text-[#16243D] mb-1">
              Đánh giá sinh viên sau dự án
            </h4>
            <p className="text-xs text-[#5B6B85] mb-4">
              Sinh viên: <strong>{evalModalData.studentName}</strong>
            </p>

            <form onSubmit={handleSaveEvaluation} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#16243D] mb-1.5">
                  Đánh giá sao (1 - 5 sao)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEvalRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= evalRating
                            ? 'text-[#7A5B00] fill-[#FFE9A8]'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-heading font-bold text-sm text-[#16243D] ml-2">
                    {evalRating} / 5 sao
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#16243D] mb-1.5">
                  Nhận xét về thái độ và chất lượng công việc *
                </label>
                <textarea
                  rows={3}
                  value={evalComment}
                  onChange={(e) => setEvalComment(e.target.value)}
                  required
                  placeholder="Nhận xét ngắn về quá trình hợp tác..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] outline-none focus:ring-2 focus:ring-[#3D7DD8]/30"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEvalModalData(null)}
                  className="px-4 py-2 text-xs text-[#5B6B85] hover:text-[#16243D]"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#3D7DD8] hover:bg-[#2F67B5] text-white text-xs font-semibold rounded-full shadow-xs"
                >
                  Lưu đánh giá
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
