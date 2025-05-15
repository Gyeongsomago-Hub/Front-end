import style from './Index.module.css'

interface propsType {
    Status: "End" | "imminent" | "recruitment"
    Title: string
    DetailText: string
    WriteUser: string
    WriteDate: string
    Stack: string
    MinRecruimentPersonnel: number
    MaxRecruimentPersonnel: number
}

export default function ClubCard({ Status, Title, DetailText, WriteUser, WriteDate, MinRecruimentPersonnel, MaxRecruimentPersonnel, Stack }: propsType) {
    return (
        <div className={style.main_container}>
            <div className={
                Status === "End"
                    ?
                    style.end
                    :
                    Status === "imminent"
                        ?
                        style.imminent
                        :
                        style.recruitment
            }
            >
                {
                    Status === "recruitment"
                        ?
                        "모집중"
                        :
                        Status === "imminent"
                            ?
                            "마감 임박"
                            :
                            "모집 마감"
                }
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
            <button className={style.button}>신청 하기</button>
        </div>
    )
}