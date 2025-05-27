import React, { Dispatch, SetStateAction, useEffect, useState, FormEvent, ChangeEvent, KeyboardEvent } from 'react';
import axios from 'axios';
import Input from '../../Input/Index';
import style from './Index.module.css';
import { useModal } from '../../../../Hooks/useModal';
import { ProjectPayload, ClubPayload, MentoringPayload } from '../../../../API/Modal';

interface ModalProps {
  Title: '프로젝트' | '동아리' | '멘토멘티';
  setClickButton: Dispatch<SetStateAction<boolean>>;
}

export default function Modal({ Title, setClickButton }: ModalProps) {
  // 공통 state
  const [openDate, setOpenDate] = useState('');
  const [closeDate, setCloseDate] = useState('');

  // 프로젝트 & 멘토멘티 state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [people, setPeople] = useState('');
  const [stacks, setStacks] = useState<string[]>([]);
  const [stackInput, setStackInput] = useState('');
  const [status, setStatus] = useState<'RECRUITING' | 'CLOSED'>('RECRUITING');
  const [categoryId, setCategoryId] = useState<number>(1);

  // 동아리 state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [target, setTarget] = useState('');
  const [clubType, setClubType] = useState('전공');

  const [viewInput, setViewInput] = useState(false);
  const { submit } = useModal();

  useEffect(() => {
    const timer = setTimeout(() => setViewInput(true), 450);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setClickButton(false);
  };

  // 스택 태그 처리
  const addStack = () => {
    const tag = stackInput.trim();
    if (tag && !stacks.includes(tag)) setStacks(prev => [...prev, tag]);
    setStackInput('');
  };
  const removeStack = (idx: number) => setStacks(prev => prev.filter((_, i) => i !== idx));
  const handleStacksInputKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addStack();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    let payload: ProjectPayload | ClubPayload | MentoringPayload;
    switch (Title) {
      case '프로젝트':
        payload = { title, content, people, stacks, openDate, closeDate, status, type: 'PROJECT' };
        break;
      case '동아리':
        payload = { name, description, location, target, openDate, closeDate, type: clubType };
        break;
      case '멘토멘티':
        payload = { title, content, people, stacks, openDate, closeDate, status, type: 'MENTORING', categoryId };
        break;
      default:
        return;
    }

    try {
      await submit(Title, payload);
      setClickButton(false);
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Status:', error.response.status);
        console.error('Response:', error.response.data);
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div className={style.modal_wrap}>
      <button className={style.close_button} onClick={handleClose}>X</button>
      {viewInput && (
        <form className={style.form} onSubmit={handleSubmit}>
          <h3 style={{ gridColumn: '1 / -1' }}>{Title} 모집 작성</h3>

          {(Title === '프로젝트' || Title === '멘토멘티') && (
            <>
              {/* 왼쪽 컬럼 */}
              <div>
                <Input Name="제목" Type="text" Placeholder="제목을 입력해주세요." Width="309px" Height="35px" onValueChange={setTitle} />
                <Input Name="내용" Type="text" Placeholder="상세 내용을 입력해주세요." Width="309px" Height="35px" onValueChange={setContent} />
                <Input Name="모집 인원" Type="text" Placeholder="예: 1~2명" Width="309px" Height="35px" onValueChange={setPeople} />
                <div>
                  <label className={style.label}>스택 입력 (Enter 또는 추가 클릭)</label>
                  <div className={style.tagInputWrapper}>
                    <input
                      type="text"
                      value={stackInput}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setStackInput(e.target.value)}
                      onKeyDown={handleStacksInputKey}
                      placeholder="예: frontend"
                      className={style.tagTextInput}
                    />
                    <button type="button" onClick={addStack} className={style.tagAddButton}>추가</button>
                  </div>
                  <div className={style.tagPreview}>
                    {stacks.map((tag, idx) => (
                      <div key={idx} className={style.tag}>
                        {tag}
                        <button type="button" onClick={() => removeStack(idx)} className={style.tagRemoveButton}>✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* 오른쪽 컬럼 */}
              <div>
                <label className={style.label}>상태</label>
                <select value={status} onChange={e => setStatus(e.target.value as 'RECRUITING' | 'CLOSED')} className={style.select}>
                  <option value="RECRUITING">RECRUITING</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
                <Input Name="오픈 날짜" Type="date" Width="309px" Height="35px" Placeholder="오픈 날짜를 선택해주세요." onValueChange={setOpenDate} />
                <Input Name="마감 날짜" Type="date" Width="309px" Height="35px" Placeholder="마감 날짜를 선택해주세요." onValueChange={setCloseDate} />
                {Title === '멘토멘티' && (
                  <Input Name="카테고리 ID" Type="number" Width="309px" Height="35px" Placeholder="카테고리를 입력해주세요." onValueChange={val => setCategoryId(Number(val))} />
                )}
              </div>
            </>
          )}

          {Title === '동아리' && (
            <>
              {/* 왼쪽 컬럼 */}
              <div>
                <Input Name="동아리명" Type="text" Placeholder="동아리 이름을 입력해주세요." Width="309px" Height="35px" onValueChange={setName} />
                <Input Name="설명" Type="text" Placeholder="동아리 설명을 입력해주세요." Width="309px" Height="35px" onValueChange={setDescription} />
              </div>
              {/* 오른쪽 컬럼 */}
              <div>
                <Input Name="장소" Type="text" Placeholder="동아리 활동 장소를 입력해주세요." Width="309px" Height="35px" onValueChange={setLocation} />
                <Input Name="대상" Type="text" Placeholder="참여 대상(예: 3학년) 입력" Width="309px" Height="35px" onValueChange={setTarget} />
                <Input Name="유형" Type="text" Placeholder="예: 전공" Width="309px" Height="35px" onValueChange={setClubType} />
                <Input Name="오픈 날짜" Type="date" Width="309px" Height="35px" Placeholder="오픈 날짜를 선택해주세요." onValueChange={setOpenDate} />
                <Input Name="마감 날짜" Type="date" Width="309px" Height="35px" Placeholder="마감 날짜를 선택해주세요." onValueChange={setCloseDate} />
              </div>
            </>
          )}

          <button type="submit" className={style.submit_button}>제출하기</button>
        </form>
      )}
    </div>
  );
}