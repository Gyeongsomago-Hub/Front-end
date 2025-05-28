// src/components/Club.ts
import { useEffect, useState } from "react";
import { BigCard, Card, Navbar, CreateButton } from "../../Components";
import style from './Index.module.css';
import { useNavigate } from "react-router-dom";
import { useClub } from "../../Hooks/useClub";

interface Club {
  id: number;
  name: string;
  description: string;
  location: string;
  target: string;
  type: string;
  openDate: string; // ISO 8601 형식 또는 YYYY-MM-DD (시간 정보 가정)
  closeDate: string;
}

export default function Club() {
  const navigate = useNavigate();
  const { clubs, error, loading, formatTimeDifference } = useClub();

  return (
    <div className={style.container}>
      <Navbar />
      <div className={style.main_contaienr}>
        <div className={style.all_club_container}>
          <h3>전체 동아리 목록</h3>
          <div className={style.all_club_card_container}>
            {error ? (
              <p style={{ color: 'red' }}>{error}</p>
            ) : clubs.length > 0 ? (
              clubs.map((club) => (
                <div key={club.id}>
                  <Card
                    Status={club.type} // type을 Status로 매핑 (임시)
                    Title={club.name}
                    DetailText={club.description}
                    WriteUser={club.name}
                    WriteDate={formatTimeDifference(club.openDate)}
                    MinRecruimentPersonnel={3} // API에 없으므로 임시 값
                    MaxRecruimentPersonnel={5} // API에 없으므로 임시 값
                    Stack={club.target} // target을 Stack으로 매핑 (임시)
                  />
                </div>
              ))
            ) : (
              <p>데이터가 없습니다!</p>
            )}
          </div>
        </div>
        <div className={style.populer_club_container}>
          <h3>인기 동아리</h3>
          <div className={style.populer_club_card_container}>
            {error ? (
              <p style={{ color: 'red' }}>{error}</p>
            ) : clubs.length > 0 ? (
              clubs.slice(0, 3).map((club) => (
                <BigCard
                  key={club.id}
                  Status={club.type} // type을 Status로 매핑 (임시)
                  Title={club.name}
                  DetailText={club.description}
                  WriteUser="김신우" // API에 없으므로 임시 값
                  WriteDate={formatTimeDifference(club.openDate)}
                  MinRecruimentPersonnel={3} // API에 없으므로 임시 값
                  MaxRecruimentPersonnel={5} // API에 없으므로 임시 값
                  Stack={club.target} // target을 Stack으로 매핑 (임시)
                />
              ))
            ) : (
              <p>데이터가 없습니다!</p>
            )}
          </div>
        </div>
      </div>
      <CreateButton Title="동아리" />
    </div>
  );
}