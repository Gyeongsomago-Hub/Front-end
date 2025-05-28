import style from './Index.module.css';

interface propsType {
  Status: string;
  Title: string;
  DetailText: string;
  WriteUser: string;
  WriteDate: string;
  Stack: string;
  MinRecruimentPersonnel: number;
  MaxRecruimentPersonnel: number;
  onClick: () => void;
}

export default function NormarCard({
  Status,
  Title,
  DetailText,
  WriteUser,
  WriteDate,
  MinRecruimentPersonnel,
  MaxRecruimentPersonnel,
  Stack,
  onClick,
}: propsType) {
  return (
    <div className={style.main_container} onClick={onClick}>
      <div
        className={
          Status === "END"
            ? style.end
            : Status === "IMMINENT"
            ? style.imminent
            : style.recruitment
        }
      >
        {Status === "RECRUITING"
          ? "모집중"
          : Status === "IMMINENT"
          ? "마감 임박"
          : "모집 마감"}
      </div>
      <div>
        <h2>{Title}</h2>
        <span>{DetailText}</span>
        <div>
          <div>
            <span>모집 스택</span>
            <span> {Stack}</span>
          </div>
          <div>
            <span>모집 인원: {MinRecruimentPersonnel} ~ {MaxRecruimentPersonnel} 명</span>
          </div>
        </div>
      </div>
      <span>{WriteUser} · {WriteDate}</span>
    </div>
  );
}