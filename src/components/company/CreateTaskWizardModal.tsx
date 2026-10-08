import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Check,
  CheckCircle2,
  Clock,
  Coins,
  FileCheck2,
  FileText,
  HelpCircle,
  Plus,
  Sparkles,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TASK_TEMPLATES, TaskTemplate } from '../../data/mockData';
import { Task, TaskCategory, TaskEvaluationCriterion, TaskType } from '../../types';

interface CreateTaskWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTask?: Task | null;
}

export const CreateTaskWizardModal: React.FC<CreateTaskWizardModalProps> = ({
  isOpen,
  onClose,
  editingTask,
}) => {
  const { currentCompany, createTask, updateTask, notify } = useApp();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form states
  const [taskType, setTaskType] = useState<TaskType>(editingTask?.type || 'challenge');
  const [title, setTitle] = useState(editingTask?.title || '');
  const [category, setCategory] = useState<TaskCategory>(editingTask?.category || 'CNTT');
  const [shortBrief, setShortBrief] = useState(editingTask?.shortBrief || '');
  const [description, setDescription] = useState(editingTask?.description || '');
  const [requirements, setRequirements] = useState<string[]>(
    editingTask?.requirements || [
      'Ngôn ngữ TypeScript, định kiểu chặt chẽ.',
      'Đính kèm file kiểm thử tự động (Unit Test).',
      'Tuân thủ tiêu chuẩn Clean Code và kiến trúc hướng module.',
    ]
  );
  const [newReqInput, setNewReqInput] = useState('');
  const [deliverableFormat, setDeliverableFormat] = useState(
    editingTask?.deliverableFormat || 'Link GitHub Repository công khai kèm README'
  );
  const [attachmentName, setAttachmentName] = useState(editingTask?.attachmentName || '');

  // Step 3: Evaluation Criteria (2-5 criteria)
  const [criteria, setCriteria] = useState<TaskEvaluationCriterion[]>(
    editingTask?.evaluationCriteriaList || [
      { id: 'c1', name: 'Chất lượng chuyên môn & Kỹ thuật', maxScore: 5, description: 'Độ chính xác nghiệp vụ và cấu trúc code' },
      { id: 'c2', name: 'Tính ứng dụng & Trải nghiệm', maxScore: 5, description: 'Khả năng vận hành thực tế không lỗi' },
    ]
  );
  const [newCritName, setNewCritName] = useState('');
  const [newCritScore, setNewCritScore] = useState<number>(3);
  const [newCritDesc, setNewCritDesc] = useState('');

  // Step 4: Duration, Deadline, Reward, Max participants
  const [estimatedHours, setEstimatedHours] = useState<number>(
    editingTask?.estimatedHours || (taskType === 'challenge' ? 3 : 10)
  );
  const [rewardVND, setRewardVND] = useState<number>(
    editingTask?.rewardVND || (taskType === 'challenge' ? 500000 : 2000000)
  );
  const [deadline, setDeadline] = useState<string>(
    editingTask?.deadline || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [maxParticipants, setMaxParticipants] = useState<number>(editingTask?.maxParticipants || 10);
  const [isUrgent, setIsUrgent] = useState<boolean>(editingTask?.isUrgent || false);

  // Template dropdown modal state
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);

  // Validation error message
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isCompanyVerified = currentCompany?.status === 'verified';

  // Apply template
  const handleApplyTemplate = (tpl: TaskTemplate) => {
    setTaskType(tpl.type);
    setTitle(tpl.title);
    setCategory(tpl.category);
    setShortBrief(tpl.shortBrief);
    setDescription(tpl.description);
    setRequirements(tpl.requirements);
    setDeliverableFormat(tpl.deliverableFormat);
    setEstimatedHours(tpl.estimatedHours);
    setRewardVND(tpl.rewardVND);
    setCriteria(
      tpl.evaluationCriteriaList.map((c) => ({
        id: c.id,
        name: c.name,
        maxScore: c.maxScore,
        description: c.description,
      }))
    );
    setShowTemplatesModal(false);
    notify('Đã áp dụng mẫu nhiệm vụ', `Đã tự động điền thông tin mẫu "${tpl.name}".`, 'info');
  };

  // Add requirement
  const handleAddRequirement = () => {
    if (newReqInput.trim()) {
      setRequirements([...requirements, newReqInput.trim()]);
      setNewReqInput('');
    }
  };

  const handleRemoveRequirement = (idx: number) => {
    setRequirements(requirements.filter((_, i) => i !== idx));
  };

  // Add criterion
  const handleAddCriterion = () => {
    if (!newCritName.trim()) return;
    if (criteria.length >= 5) {
      notify('Giới hạn tiêu chí', 'Nhiệm vụ chỉ có tối đa 5 tiêu chí chấm để sinh viên dễ tập trung.', 'error');
      return;
    }
    const newCrit: TaskEvaluationCriterion = {
      id: `c-${Date.now()}`,
      name: newCritName.trim(),
      maxScore: Number(newCritScore) || 2,
      description: newCritDesc.trim() || undefined,
    };
    setCriteria([...criteria, newCrit]);
    setNewCritName('');
    setNewCritDesc('');
  };

  const handleRemoveCriterion = (id: string) => {
    if (criteria.length <= 2) {
      notify('Giới hạn tối thiểu', 'Nhiệm vụ bắt buộc có từ 2 đến 5 tiêu chí chấm công khai.', 'error');
      return;
    }
    setCriteria(criteria.filter((c) => c.id !== id));
  };

  const totalCriteriaScore = criteria.reduce((sum, c) => sum + c.maxScore, 0);

  // Validate Step 1
  const validateStep1 = (): boolean => {
    setValidationError(null);
    return true;
  };

  // Validate Step 2
  const validateStep2 = (): boolean => {
    setValidationError(null);
    if (!title.trim()) {
      setValidationError('Vui lòng nhập tên nhiệm vụ.');
      return false;
    }
    if (!shortBrief.trim()) {
      setValidationError('Vui lòng nhập tóm tắt ngắn đề bài (1-2 câu).');
      return false;
    }
    if (!description.trim()) {
      setValidationError('Vui lòng nhập mô tả chi tiết nhiệm vụ.');
      return false;
    }
    if (requirements.length === 0) {
      setValidationError('Vui lòng thêm ít nhất 1 yêu cầu kỹ thuật.');
      return false;
    }
    if (!deliverableFormat.trim()) {
      setValidationError('Vui lòng nêu rõ sản phẩm cần nộp (link github, figma, file pdf...).');
      return false;
    }
    return true;
  };

  // Validate Step 3
  const validateStep3 = (): boolean => {
    setValidationError(null);
    if (criteria.length < 2 || criteria.length > 5) {
      setValidationError('Yêu cầu bắt buộc: Đề bài phải có từ 2 đến 5 tiêu chí chấm điểm công khai.');
      return false;
    }
    return true;
  };

  // Validate Step 4
  const validateStep4 = (): boolean => {
    setValidationError(null);
    // Rule: Thử sức <= 3h
    if (taskType === 'challenge') {
      if (estimatedHours <= 0 || estimatedHours > 3) {
        setValidationError('Quy định Stulance: Nhiệm vụ "Thử sức" chỉ được có thời lượng tối đa 3 giờ.');
        return false;
      }
    }
    // Rule: Dự án ngắn 5 - 40h & bắt buộc có thù lao
    if (taskType === 'project') {
      if (estimatedHours < 5 || estimatedHours > 40) {
        setValidationError('Quy định Stulance: "Dự án ngắn" phải có thời lượng từ 5 đến 40 giờ.');
        return false;
      }
      if (rewardVND <= 0) {
        setValidationError('Quy định bắt buộc: "Dự án ngắn" (5-40h) BẮT BUỘC phải có thù lao chi trả cho sinh viên.');
        return false;
      }
    }
    if (!deadline) {
      setValidationError('Vui lòng chọn hạn chót nộp bài.');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) setCurrentStep(2);
    else if (currentStep === 2 && validateStep2()) setCurrentStep(3);
    else if (currentStep === 3 && validateStep3()) setCurrentStep(4);
    else if (currentStep === 4 && validateStep4()) setCurrentStep(5);
  };

  const handlePrev = () => {
    setValidationError(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as any);
    }
  };

  // Submit task (Draft or Submit for approval / Open)
  const handleSubmitTask = (isDraft: boolean) => {
    if (!validateStep2() || !validateStep3() || !validateStep4()) {
      return;
    }

    // Check verification status if attempting to publish
    if (!isDraft && !isCompanyVerified) {
      notify(
        'Tài khoản chưa xác minh',
        'Doanh nghiệp của bạn đang ở trạng thái ' +
          (currentCompany?.status === 'pending' ? 'Chờ xác minh' : 'Bị từ chối') +
          '. Hệ thống chỉ cho phép Lưu nháp cho đến khi được duyệt hồ sơ pháp lý.',
        'error'
      );
      return;
    }

    const taskData: Partial<Task> = {
      type: taskType,
      title: title.trim(),
      category,
      shortBrief: shortBrief.trim(),
      description: description.trim(),
      requirements,
      deliverableFormat: deliverableFormat.trim(),
      attachmentName: attachmentName.trim() || undefined,
      evaluationCriteriaList: criteria,
      estimatedHours,
      rewardVND: rewardVND || 0,
      deadline,
      maxParticipants,
      isUrgent,
    };

    if (editingTask) {
      const res = updateTask(editingTask.id, taskData);
      if (res.success) {
        onClose();
      }
    } else {
      const statusToSet = isDraft ? 'draft' : 'open';
      const res = createTask(taskData, statusToSet);
      if (res.success) {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#16243D]/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-3xl bg-white border border-[#DCE8F8] rounded-[24px] shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#DCE8F8] bg-[#F5F9FF] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3D7DD8] text-white flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-lg text-[#16243D]">
                  {editingTask ? 'Chỉnh sửa nhiệm vụ' : 'Tạo nhiệm vụ tuyển dụng mới'}
                </h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#EAF2FC] text-[#3D7DD8]">
                  Bước {currentStep}/5
                </span>
              </div>
              <p className="text-xs text-[#5B6B85] mt-0.5">
                {currentStep === 1 && 'Chọn loại nhiệm vụ hoặc áp dụng từ 5 mẫu chuẩn ngành'}
                {currentStep === 2 && 'Mô tả chi tiết đề bài, sản phẩm cần nộp và tài liệu đính kèm'}
                {currentStep === 3 && 'Thiết lập từ 2 đến 5 tiêu chí chấm điểm công khai'}
                {currentStep === 4 && 'Thời lượng, thù lao, hạn nộp và số lượng sinh viên'}
                {currentStep === 5 && 'Xem trước đề bài hoàn chỉnh trước khi đăng tải'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!editingTask && (
              <button
                type="button"
                onClick={() => setShowTemplatesModal(true)}
                className="px-3 py-1.5 rounded-full bg-white border border-[#DCE8F8] text-xs font-semibold text-[#3D7DD8] hover:bg-[#EAF2FC] transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#3D7DD8]" />
                Chọn từ mẫu (5 mẫu)
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-[#5B6B85] hover:text-[#16243D] rounded-full hover:bg-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-5 border-b border-[#DCE8F8] bg-white text-center text-[11px] font-medium text-[#5B6B85]">
          <div
            className={`py-2.5 border-r border-[#DCE8F8] ${
              currentStep === 1
                ? 'bg-[#3D7DD8] text-white font-semibold'
                : currentStep > 1
                ? 'text-[#0F5B39] bg-[#F0FAF5]'
                : ''
            }`}
          >
            1. Loại nhiệm vụ
          </div>
          <div
            className={`py-2.5 border-r border-[#DCE8F8] ${
              currentStep === 2
                ? 'bg-[#3D7DD8] text-white font-semibold'
                : currentStep > 2
                ? 'text-[#0F5B39] bg-[#F0FAF5]'
                : ''
            }`}
          >
            2. Nội dung đề bài
          </div>
          <div
            className={`py-2.5 border-r border-[#DCE8F8] ${
              currentStep === 3
                ? 'bg-[#3D7DD8] text-white font-semibold'
                : currentStep > 3
                ? 'text-[#0F5B39] bg-[#F0FAF5]'
                : ''
            }`}
          >
            3. Tiêu chí chấm
          </div>
          <div
            className={`py-2.5 border-r border-[#DCE8F8] ${
              currentStep === 4
                ? 'bg-[#3D7DD8] text-white font-semibold'
                : currentStep > 4
                ? 'text-[#0F5B39] bg-[#F0FAF5]'
                : ''
            }`}
          >
            4. Thời lượng & Hạn
          </div>
          <div
            className={`py-2.5 ${
              currentStep === 5 ? 'bg-[#3D7DD8] text-white font-semibold' : ''
            }`}
          >
            5. Xem trước
          </div>
        </div>

        {/* Wizard Body (Scrollable) */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* Validation Alert */}
          {validationError && (
            <div className="p-3.5 rounded-xl bg-[#FFF1ED] border border-[#FFD6CC] text-xs text-[#B83214] flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* STEP 1: CHỌN LOẠI NHIỆM VỤ */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h4 className="font-heading font-semibold text-base text-[#16243D] mb-1">
                  Chọn loại hình nhiệm vụ
                </h4>
                <p className="text-xs text-[#5B6B85]">
                  Stulance phân định rõ ràng giữa bài tập cọ xát nhanh và dự án thực tế trả thù lao để bảo vệ quyền lợi sinh viên.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Challenge Type */}
                <div
                  onClick={() => {
                    setTaskType('challenge');
                    if (estimatedHours > 3) setEstimatedHours(3);
                  }}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    taskType === 'challenge'
                      ? 'border-[#3D7DD8] bg-[#F5F9FF] shadow-xs'
                      : 'border-[#DCE8F8] hover:border-[#A9CFFA] bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-heading font-bold text-sm text-[#16243D]">
                      Thử sức (Skill Challenge)
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#EAF2FC] text-[#3D7DD8]">
                      ≤ 3 giờ
                    </span>
                  </div>
                  <p className="text-xs text-[#5B6B85] leading-relaxed mb-3">
                    Bài tập nhanh kiểm tra năng lực cơ bản. Sinh viên nhận đề và nộp bài ngay để lấy Thẻ bằng chứng năng lực.
                  </p>
                  <div className="text-[11px] text-[#5B6B85] space-y-1">
                    <p>✓ Tối đa 3 giờ làm bài</p>
                    <p>✓ Sinh viên tự do nhận làm không cần xét duyệt</p>
                    <p>✓ Tự động cấp Thẻ bằng chứng sau khi chấm</p>
                  </div>
                </div>

                {/* Project Type */}
                <div
                  onClick={() => {
                    setTaskType('project');
                    if (estimatedHours < 5) setEstimatedHours(10);
                    if (rewardVND <= 0) setRewardVND(2000000);
                  }}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    taskType === 'project'
                      ? 'border-[#3D7DD8] bg-[#F5F9FF] shadow-xs'
                      : 'border-[#DCE8F8] hover:border-[#A9CFFA] bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-heading font-bold text-sm text-[#16243D]">
                      Dự án ngắn (Short Project)
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#FFE9A8] text-[#7A5B00]">
                      5 – 40 giờ · Có thù lao
                    </span>
                  </div>
                  <p className="text-xs text-[#5B6B85] leading-relaxed mb-3">
                    Dự án có phạm vi lớn hơn phục vụ công việc thực tế. <strong>Bắt buộc có thù lao</strong> cho sinh viên.
                  </p>
                  <div className="text-[11px] text-[#5B6B85] space-y-1">
                    <p>✓ Thời lượng từ 5 đến 40 giờ</p>
                    <p>✓ Bắt buộc trả thù lao (VND)</p>
                    <p>✓ Doanh nghiệp xét duyệt chọn sinh viên làm việc</p>
                  </div>
                </div>
              </div>

              {/* Ngành tuyển dụng */}
              <div>
                <label className="block text-xs font-semibold text-[#16243D] mb-1.5">
                  Lĩnh vực / Chuyên ngành phù hợp *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {(['CNTT', 'Marketing', 'Thiết kế', 'Kế toán', 'Du lịch'] as TaskCategory[]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                        category === cat
                          ? 'border-[#3D7DD8] bg-[#3D7DD8] text-white font-semibold'
                          : 'border-[#DCE8F8] bg-white text-[#16243D] hover:bg-[#F5F9FF]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: NỘI DUNG ĐỀ BÀI */}
          {currentStep === 2 && (
            <div className="space-y-5">
              {/* Tên nhiệm vụ */}
              <div>
                <label className="block text-xs font-semibold text-[#16243D] mb-1">
                  Tên nhiệm vụ rõ ràng và hành động *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Xây dựng Custom Hook React tối ưu hóa debounce và cache API..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] focus:ring-2 focus:ring-[#3D7DD8]/30 outline-none"
                />
              </div>

              {/* Tóm tắt ngắn gọn */}
              <div>
                <label className="block text-xs font-semibold text-[#16243D] mb-1">
                  Tóm tắt ngắn (1-2 câu hiển thị trên thẻ) *
                </label>
                <input
                  type="text"
                  value={shortBrief}
                  onChange={(e) => setShortBrief(e.target.value)}
                  placeholder="Ví dụ: Viết hook useDebouncedSearch bằng TypeScript kèm file test Jest/Vitest đầy đủ..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] focus:ring-2 focus:ring-[#3D7DD8]/30 outline-none"
                />
              </div>

              {/* Mô tả chi tiết */}
              <div>
                <label className="block text-xs font-semibold text-[#16243D] mb-1">
                  Mô tả chi tiết bối cảnh và mục tiêu nghiệp vụ *
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả cụ thể bài toán doanh nghiệp đang gặp phải và kỳ vọng sinh viên sẽ giải quyết như thế nào..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] focus:ring-2 focus:ring-[#3D7DD8]/30 outline-none leading-relaxed"
                />
              </div>

              {/* Yêu cầu cụ thể */}
              <div>
                <label className="block text-xs font-semibold text-[#16243D] mb-1">
                  Yêu cầu kỹ thuật bắt buộc ({requirements.length}) *
                </label>
                <div className="space-y-2 mb-3">
                  {requirements.map((req, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-[#F5F9FF] border border-[#DCE8F8] text-xs text-[#16243D] flex items-center justify-between gap-3"
                    >
                      <span>• {req}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRequirement(idx)}
                        className="text-[#B83214] hover:text-[#96260D] p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newReqInput}
                    onChange={(e) => setNewReqInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddRequirement();
                      }
                    }}
                    placeholder="Nhập yêu cầu mới và nhấn Thêm..."
                    className="flex-1 px-3.5 py-2 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddRequirement}
                    className="px-4 py-2 rounded-full bg-[#EAF2FC] text-[#3D7DD8] hover:bg-[#3D7DD8] hover:text-white text-xs font-semibold transition-colors"
                  >
                    Thêm yêu cầu
                  </button>
                </div>
              </div>

              {/* Sản phẩm cần nộp */}
              <div>
                <label className="block text-xs font-semibold text-[#16243D] mb-1">
                  Sản phẩm cần nộp (Deliverable format) *
                </label>
                <input
                  type="text"
                  value={deliverableFormat}
                  onChange={(e) => setDeliverableFormat(e.target.value)}
                  placeholder="Ví dụ: Link GitHub công khai kèm README; hoặc File Figma; hoặc Bản tính Excel..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] focus:ring-2 focus:ring-[#3D7DD8]/30 outline-none"
                />
              </div>

              {/* Tệp đính kèm tài liệu đề bài */}
              <div>
                <label className="block text-xs font-semibold text-[#16243D] mb-1">
                  Tệp đính kèm đề bài / Tài liệu mẫu (Tùy chọn)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={attachmentName}
                    onChange={(e) => setAttachmentName(e.target.value)}
                    placeholder="Ví dụ: Dataset_KhachHang_Mau.csv hoặc Design_Brief_v1.pdf"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] focus:ring-2 focus:ring-[#3D7DD8]/30 outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setAttachmentName('Tai_Lieu_De_Bai_Stulance.pdf')}
                    className="px-3.5 py-2 rounded-full bg-[#F5F9FF] border border-[#DCE8F8] text-xs text-[#5B6B85] hover:text-[#16243D]"
                  >
                    + Đính kèm mẫu
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: TIÊU CHÍ CHẤM CÔNG KHAI (2 - 5 TIÊU CHÍ) */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-[#F0FAF5] border border-[#CDEFE0] flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-semibold text-xs text-[#0F5B39]">
                    Tiêu chí chấm điểm công khai ({criteria.length}/5 tiêu chí)
                  </h4>
                  <p className="text-[11px] text-[#0F5B39]">
                    Quy định: Phải có từ 2 đến 5 tiêu chí. Sinh viên nhìn thấy tiêu chí này trước khi làm bài.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-[#0F5B39] block">Tổng điểm tối đa:</span>
                  <span className="font-heading font-bold text-base text-[#0F5B39]">
                    {totalCriteriaScore} điểm
                  </span>
                </div>
              </div>

              {/* List criteria */}
              <div className="space-y-3">
                {criteria.map((c, idx) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-2xl border border-[#DCE8F8] bg-white flex items-start justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#EAF2FC] text-[#3D7DD8] text-[11px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <h5 className="font-semibold text-xs text-[#16243D]">{c.name}</h5>
                      </div>
                      {c.description && (
                        <p className="text-xs text-[#5B6B85] mt-1 pl-7">{c.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="px-3 py-1 rounded-full bg-[#FFE9A8] text-[#7A5B00] font-heading font-bold text-xs">
                        Tối đa: {c.maxScore}đ
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCriterion(c.id)}
                        disabled={criteria.length <= 2}
                        className={`p-1.5 rounded-full transition-colors ${
                          criteria.length <= 2
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-[#B83214] hover:bg-[#FFD6CC]/30'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add criterion form */}
              {criteria.length < 5 && (
                <div className="p-4 rounded-2xl bg-[#F5F9FF] border border-[#DCE8F8] space-y-3">
                  <h5 className="font-heading font-semibold text-xs text-[#16243D]">
                    Thêm tiêu chí chấm mới
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={newCritName}
                        onChange={(e) => setNewCritName(e.target.value)}
                        placeholder="Tên tiêu chí (ví dụ: Tối ưu hóa hiệu năng)..."
                        className="w-full px-3.5 py-2 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] bg-white outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        step="0.5"
                        min="1"
                        max="10"
                        value={newCritScore}
                        onChange={(e) => setNewCritScore(parseFloat(e.target.value) || 1)}
                        placeholder="Điểm tối đa"
                        className="w-full px-3.5 py-2 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] bg-white outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={newCritDesc}
                      onChange={(e) => setNewCritDesc(e.target.value)}
                      placeholder="Gợi ý/mô tả cách chấm tiêu chí này..."
                      className="w-full px-3.5 py-2 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] bg-white outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCriterion}
                    className="px-4 py-2 rounded-full bg-[#3D7DD8] text-white text-xs font-semibold hover:bg-[#2F67B5] transition-colors"
                  >
                    + Lưu tiêu chí này
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: THỜI LƯỢNG, HẠN NỘP, THÙ LAO */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Thời lượng dự kiến */}
                <div>
                  <label className="block text-xs font-semibold text-[#16243D] mb-1.5">
                    Thời lượng ước tính (Giờ) *
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-[#5B6B85] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      step="0.5"
                      min={taskType === 'challenge' ? 0.5 : 5}
                      max={taskType === 'challenge' ? 3 : 40}
                      value={estimatedHours}
                      onChange={(e) => setEstimatedHours(parseFloat(e.target.value) || 0)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] font-mono focus:ring-2 focus:ring-[#3D7DD8]/30 outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-[#5B6B85] mt-1">
                    {taskType === 'challenge'
                      ? '⚠️ Giới hạn Thử sức: Tối đa 3 giờ.'
                      : '⚠️ Giới hạn Dự án ngắn: Từ 5 đến 40 giờ.'}
                  </p>
                </div>

                {/* Thù lao (VND) */}
                <div>
                  <label className="block text-xs font-semibold text-[#16243D] mb-1.5">
                    Thù lao chi trả cho sinh viên (VND) *
                  </label>
                  <div className="relative">
                    <Coins className="w-4 h-4 text-[#7A5B00] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      step="100000"
                      min={taskType === 'project' ? 100000 : 0}
                      value={rewardVND}
                      onChange={(e) => setRewardVND(parseInt(e.target.value, 10) || 0)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] font-mono focus:ring-2 focus:ring-[#3D7DD8]/30 outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-[#5B6B85] mt-1">
                    {taskType === 'project'
                      ? '⚠️ Bắt buộc với Dự án ngắn (Cổng ghi nhận xác nhận, không xử lý tiền).'
                      : 'Nhiệm vụ Thử sức có thể có hoặc không có thù lao.'}
                  </p>
                </div>

                {/* Hạn nộp bài */}
                <div>
                  <label className="block text-xs font-semibold text-[#16243D] mb-1.5">
                    Hạn chót nộp bài (Deadline) *
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] focus:ring-2 focus:ring-[#3D7DD8]/30 outline-none"
                  />
                </div>

                {/* Số lượng nhận tối đa */}
                <div>
                  <label className="block text-xs font-semibold text-[#16243D] mb-1.5">
                    Số lượng sinh viên nhận tối đa *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(parseInt(e.target.value, 10) || 5)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DCE8F8] text-xs text-[#16243D] focus:ring-2 focus:ring-[#3D7DD8]/30 outline-none"
                  />
                  <p className="text-[11px] text-[#5B6B85] mt-1">
                    Khi đạt đủ số lượng, hệ thống sẽ tự động đóng nhận thêm bài.
                  </p>
                </div>
              </div>

              {/* Tùy chọn đánh dấu gấp */}
              <div className="p-4 rounded-xl bg-[#FFF1ED] border border-[#FFD6CC] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-xs text-[#B83214] block">
                    Đánh dấu Hạn nộp gấp (Urgent)
                  </span>
                  <span className="text-[11px] text-[#5B6B85]">
                    Gắn huy hiệu màu hồng đào trên trang tìm kiếm để ưu tiên hiển thị tới sinh viên.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="w-5 h-5 rounded text-[#B83214] focus:ring-[#B83214]"
                />
              </div>
            </div>
          )}

          {/* STEP 5: XEM TRƯỚC (PREVIEW) */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[#F5F9FF] border border-[#DCE8F8]">
                <span className="text-xs font-semibold text-[#3D7DD8] block uppercase tracking-wider mb-1">
                  Xem trước giao diện đề bài sinh viên sẽ nhìn thấy
                </span>
                <p className="text-xs text-[#5B6B85]">
                  Kiểm tra lại toàn bộ tiêu chuẩn trước khi đăng tuyển hoặc lưu nháp.
                </p>
              </div>

              {/* Preview Card */}
              <div className="stulance-card p-6 border border-[#DCE8F8] bg-white space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#EAF2FC] text-[#3D7DD8]">
                      {category}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FFE9A8] text-[#7A5B00]">
                      {taskType === 'challenge' ? 'Thử sức (≤ 3h)' : 'Dự án ngắn (5-40h)'}
                    </span>
                    {isUrgent && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FFD6CC] text-[#B83214]">
                        Hạn gấp
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#5B6B85]">
                    Doanh nghiệp: <strong>{currentCompany?.name}</strong>
                  </span>
                </div>

                <h4 className="font-heading font-bold text-lg text-[#16243D]">
                  {title || 'Tên nhiệm vụ chưa nhập'}
                </h4>
                <p className="text-xs text-[#5B6B85] leading-relaxed italic">
                  &ldquo;{shortBrief}&rdquo;
                </p>

                <div className="p-3.5 rounded-xl bg-[#F5F9FF] text-xs text-[#16243D] leading-relaxed">
                  <strong>Mô tả chi tiết:</strong> {description}
                </div>

                <div>
                  <strong className="text-xs text-[#16243D] block mb-2">Yêu cầu thực hiện:</strong>
                  <ul className="text-xs text-[#5B6B85] space-y-1 list-disc list-inside">
                    {requirements.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <strong className="text-xs text-[#16243D] block mb-2">Tiêu chí chấm công khai:</strong>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {criteria.map((c, i) => (
                      <div key={i} className="p-2.5 rounded-xl border border-[#DCE8F8] text-xs flex justify-between">
                        <span className="font-medium text-[#16243D]">{c.name}</span>
                        <span className="font-bold text-[#3D7DD8]">{c.maxScore}đ</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#DCE8F8] flex items-center justify-between text-xs text-[#5B6B85]">
                  <div>
                    Thời lượng ước tính: <strong>{estimatedHours} giờ</strong> · Hạn chót: <strong>{deadline}</strong>
                  </div>
                  <div>
                    Thù lao: <strong className="font-heading font-bold text-sm text-[#7A5B00]">{new Intl.NumberFormat('vi-VN').format(rewardVND)} đ</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-6 border-t border-[#DCE8F8] bg-[#F5F9FF] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2 rounded-full border border-[#DCE8F8] bg-white text-xs font-semibold text-[#16243D] hover:bg-[#EAF2FC] transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Quay lại
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Always allow saving draft */}
            <button
              type="button"
              onClick={() => handleSubmitTask(true)}
              className="px-5 py-2.5 rounded-full border border-[#DCE8F8] bg-white hover:bg-[#EAF2FC] text-xs font-semibold text-[#16243D] transition-colors"
            >
              Lưu bản nháp
            </button>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-full bg-[#3D7DD8] hover:bg-[#2F67B5] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
              >
                Tiếp tục
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="relative group">
                <button
                  type="button"
                  disabled={!isCompanyVerified}
                  onClick={() => handleSubmitTask(false)}
                  className={`px-6 py-2.5 rounded-full text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 ${
                    isCompanyVerified
                      ? 'bg-[#3D7DD8] hover:bg-[#2F67B5] text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Đăng tuyển nhiệm vụ ngay
                </button>

                {!isCompanyVerified && (
                  <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block w-64 p-2.5 bg-[#16243D] text-white text-[11px] rounded-xl shadow-lg z-50">
                    ⚠️ Doanh nghiệp chưa xác minh (Đang ở trạng thái Chờ duyệt hoặc Bị từ chối). Vui lòng gửi giấy tờ pháp lý để được mở khóa đăng tuyển.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Templates Selection Modal */}
        {showTemplatesModal && (
          <div className="fixed inset-0 z-60 bg-[#16243D]/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div
              className="relative w-full max-w-2xl bg-white border border-[#DCE8F8] rounded-[20px] shadow-2xl p-6 my-6 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#DCE8F8]">
                <div>
                  <h4 className="font-heading font-bold text-base text-[#16243D]">
                    5 Mẫu nhiệm vụ chuẩn hóa theo ngành
                  </h4>
                  <p className="text-xs text-[#5B6B85] mt-0.5">
                    Chọn một mẫu để tự động điền các trường nội dung, yêu cầu và tiêu chí chấm điểm.
                  </p>
                </div>
                <button
                  onClick={() => setShowTemplatesModal(false)}
                  className="p-1.5 text-[#5B6B85] hover:text-[#16243D]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {TASK_TEMPLATES.map((tpl) => (
                  <div
                    key={tpl.id}
                    className="p-4 rounded-xl border border-[#DCE8F8] hover:border-[#3D7DD8] bg-white hover:bg-[#F5F9FF] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-xs text-[#3D7DD8]">{tpl.category}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EAF2FC] text-[#3D7DD8]">
                          {tpl.type === 'challenge' ? 'Thử sức (≤ 3h)' : 'Dự án ngắn'}
                        </span>
                        <span className="text-xs text-[#7A5B00] font-semibold">
                          {new Intl.NumberFormat('vi-VN').format(tpl.rewardVND)} đ
                        </span>
                      </div>
                      <h5 className="font-semibold text-xs text-[#16243D]">{tpl.title}</h5>
                      <p className="text-[11px] text-[#5B6B85] line-clamp-2 mt-1">{tpl.shortBrief}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleApplyTemplate(tpl)}
                      className="px-4 py-2 rounded-full bg-[#3D7DD8] text-white text-xs font-semibold hover:bg-[#2F67B5] transition-colors shrink-0"
                    >
                      Áp dụng mẫu này
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
