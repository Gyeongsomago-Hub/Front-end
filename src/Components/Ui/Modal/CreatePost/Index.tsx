// src/Components/Ui/Modal/Index.tsx
import React, {
    Dispatch,
    SetStateAction,
    useEffect,
    useState,
    FormEvent,
    ChangeEvent,
    KeyboardEvent,
  } from 'react';
  import axios from 'axios';
  import Input from '../../Input/Index';
  import style from './Index.module.css';
  
  interface ModalProps {
    Title: '프로젝트' | '동아리' | '멘토멘티';
    setClickButton: Dispatch<SetStateAction<boolean>>;
  }
  
  export default function Modal({ Title, setClickButton }: ModalProps) {
    // ─── 공통 상태 ───
    const [openDate, setOpenDate] = useState('');
    const [closeDate, setCloseDate] = useState('');
  
    // ─── 프로젝트 & 멘토멘티 전용 ───
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [people, setPeople] = useState('');
    const [stacks, setStacks] = useState<string[]>([]);
    const [stackInput, setStackInput] = useState('');
    const [status, setStatus] = useState<'RECRUITING' | 'CLOSED'>('RECRUITING');
    const [categoryId, setCategoryId] = useState<number>(1);
  
    // ─── 동아리 전용 ───
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [target, setTarget] = useState('');
    const [clubType, setClubType] = useState('전공');
  
    // ─── 모달 애니메이션 ───
    const [viewInput, setViewInput] = useState(false);
    useEffect(() => {
      const timer = setTimeout(() => setViewInput(true), 450);
      return () => clearTimeout(timer);
    }, []);
  
    // ─── 닫기 ───
    const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setClickButton(false);
    };
  
    // ─── 스택(태그) 추가 / 삭제 ───
    const addStack = () => {
      const tag = stackInput.trim();
      if (tag && !stacks.includes(tag)) {
        setStacks(prev => [...prev, tag]);
      }
      setStackInput('');
    };
    const removeStack = (idx: number) => {
      setStacks(prev => prev.filter((_, i) => i !== idx));
    };
    const handleStacksInputKey = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addStack();
      }
    };

    const token = localStorage.getItem('accessToken');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
  
    // ─── 제출 ───
    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
  
      // 1) payload 구성
      let payload: any;
      let url: string;
  
      if (Title === '프로젝트') {
        payload = {
          title,
          content,
          people,
          stacks,
          openDate,
          closeDate,
          status,
          type: 'PROJECT',
        };
        url = 'http://localhost:8060/api/project';
      } else if (Title === '동아리') {
        payload = {
          name,
          description,
          location,
          target,
          type: clubType,
          openDate,
          closeDate,
        };
        url = 'http://localhost:8060/api/club';
      } else {
        // 멘토멘티
        payload = {
          title,
          content,
          people,
          stacks,
          openDate,
          closeDate,
          status,
          type: 'MENTORING',
          categoryId,
        };
        url = 'http://localhost:8060/api/mentoring';
      }
  
      try {
        // 2) API 호출
        const res = await axios.post(url, payload, {
          headers,
        });
        console.log('✅ 성공:', res.data);
        // 모달 닫기
        setClickButton(false);
      } catch (err: any) {
        console.error('❌ 에러 발생:', err.response?.data || err.message);
        // 필요하다면 에러 UI 처리도 추가하세요
      }
    };
  
    return (
      <div className={style.modal_wrap}>
        <button className={style.close_button} onClick={handleClose}>
          X
        </button>
  
        {viewInput && (
          <form className={style.form} onSubmit={handleSubmit}>
            <h3>{Title} 모집 작성</h3>
  
            {/* 프로젝트 & 멘토멘티 공통 필드 */}
            {(Title === '프로젝트' || Title === '멘토멘티') && (
              <>
                <Input
                  Name="제목"
                  Type="text"
                  Placeholder="제목을 입력해주세요."
                  Width="309px"
                  Height="35px"
                  onValueChange={setTitle}
                />
                <Input
                  Name="내용"
                  Type="text"
                  Placeholder="상세 내용을 입력해주세요."
                  Width="309px"
                  Height="35px"
                  onValueChange={setContent}
                />
                <Input
                  Name="모집 인원"
                  Type="text"
                  Placeholder="예: 1~2명"
                  Width="309px"
                  Height="35px"
                  onValueChange={setPeople}
                />
  
                {/* 스택 입력 (태그) */}
                <label className={style.label}>스택 입력 (Enter 또는 추가 클릭)</label>
                <div className={style.tagInputWrapper}>
                  <input
                    type="text"
                    value={stackInput}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setStackInput(e.target.value)
                    }
                    onKeyDown={handleStacksInputKey}
                    placeholder="예: frontend"
                    className={style.tagTextInput}
                  />
                  <button
                    type="button"
                    onClick={addStack}
                    className={style.tagAddButton}
                  >
                    추가
                  </button>
                </div>
                <div className={style.tagPreview}>
                  {stacks.map((tag, idx) => (
                    <div key={idx} className={style.tag}>
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeStack(idx)}
                        className={style.tagRemoveButton}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
  
                <label className={style.label}>상태</label>
                <select
                  value={status}
                  onChange={e =>
                    setStatus(e.target.value as 'RECRUITING' | 'CLOSED')
                  }
                  className={style.select}
                >
                  <option value="RECRUITING">RECRUITING</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </>
            )}
  
            {/* 동아리 전용 필드 */}
            {Title === '동아리' && (
              <>
                <Input
                  Name="동아리명"
                  Type="text"
                  Placeholder="동아리 이름을 입력해주세요."
                  Width="309px"
                  Height="35px"
                  onValueChange={setName}
                />
                <Input
                  Name="설명"
                  Type="text"
                  Placeholder="동아리 설명을 입력해주세요."
                  Width="309px"
                  Height="35px"
                  onValueChange={setDescription}
                />
                <Input
                  Name="장소"
                  Type="text"
                  Placeholder="동아리 활동 장소를 입력해주세요."
                  Width="309px"
                  Height="35px"
                  onValueChange={setLocation}
                />
                <Input
                  Name="대상"
                  Type="text"
                  Placeholder="참여 대상(예: 3학년) 입력"
                  Width="309px"
                  Height="35px"
                  onValueChange={setTarget}
                />
                <Input
                  Name="유형"
                  Type="text"
                  Placeholder="예: 전공 / 교양"
                  Width="309px"
                  Height="35px"
                  onValueChange={setClubType}
                />
              </>
            )}
  
            {/* 공통 날짜 필드 */}
            <Input
              Name="오픈 날짜"
              Type="date"
              Placeholder=""
              Width="309px"
              Height="35px"
              onValueChange={setOpenDate}
            />
            <Input
              Name="마감 날짜"
              Type="date"
              Placeholder=""
              Width="309px"
              Height="35px"
              onValueChange={setCloseDate}
            />
  
            {/* 멘토멘티 전용 카테고리 */}
            {Title === '멘토멘티' && (
              <Input
                Name="카테고리 ID"
                Type="number"
                Placeholder="숫자로 입력"
                Width="309px"
                Height="35px"
                onValueChange={val => setCategoryId(Number(val))}
              />
            )}
  
            <button type="submit" className={style.submit_button}>
              제출하기
            </button>
          </form>
        )}
      </div>
    );
  }
  