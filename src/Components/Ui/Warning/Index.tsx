import style from './Index.module.css'

type PropsType = {
    Message: string
    MessageType: 'error' | 'success' | 'nomal'
}

export default function Message({ Message, MessageType }: PropsType) {
    return (
        <div className={style.container}>
            <span style={{
                color:
                    MessageType === 'error'
                        ?
                        'red'
                        :
                        'green'
            }}>
                {Message}
            </span>
        </div>
    )
}