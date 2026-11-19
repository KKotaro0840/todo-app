
import { useState } from 'react'

// Todoのデータ型
export type Todo = {
  id: number
  title: string
  priority: number
  dueDate: string | null
  completed: boolean
}

// モーダルに渡すデータ
type TodoModalProps = {
  initialTodo: Todo | null
  onSave: (data: {
    title: string
    priority: number
    dueDate: string | null
  }) => void
  onClose: () => void
}

function TodoModal({
  initialTodo,
  onSave,
  onClose,
}: TodoModalProps) {
  // 入力フォームの状態
  const [title, setTitle] = useState(initialTodo?.title ?? '')
  const [priority, setPriority] = useState(initialTodo?.priority ?? 2)
  const [dueDate, setDueDate] = useState(initialTodo?.dueDate ?? '')

  // 入力内容を保存する
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedTitle = title.trim()

    if (trimmedTitle.length < 3) {
      alert('タイトルは3文字以上入力してください。')
      return
    }

    onSave({
      title: trimmedTitle,
      priority,
      dueDate: dueDate || null,
    })
  }

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className="modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2>{initialTodo ? 'Todoの編集' : 'Todoの追加'}</h2>

        <form onSubmit={handleSubmit}>
          {/* タイトル */}
          <div className="form-group">
            <label htmlFor="todo-title">タイトル</label>
            <input
              id="todo-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Todoを入力してください"
              minLength={3}
              required
              autoFocus
            />
          </div>

          {/* 優先度 */}
          <div className="form-group">
            <label>優先度</label>

            <div className="priority-select">
              {[1, 2, 3].map((value) => (
                <button
                  key={value}
                  type="button"
                  className={priority === value ? 'selected' : ''}
                  onClick={() => setPriority(value)}
                  aria-label={`優先度${value}`}
                  aria-pressed={priority === value}
                >
                  {'★'.repeat(value)}
                </button>
              ))}
            </div>
          </div>

          {/* 期限 */}
          <div className="form-group">
            <label htmlFor="todo-deadline">期限</label>

            <input
              id="todo-deadline"
              type="datetime-local"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
            />

            <button
              type="button"
              className="reset-button"
              onClick={() => setDueDate('')}
            >
              期限をリセット
            </button>
          </div>

          {/* 操作ボタン */}
          <div className="modal-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              キャンセル
            </button>

            <button type="submit" className="save-button">
              OK
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TodoModal
