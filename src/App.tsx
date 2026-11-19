
import { useEffect, useState } from 'react'
import TodoModal, { type Todo } from './components/TodoModal'
import './App.css'

// 最初に表示するサンプルデータ
const initialTodos: Todo[] = [
  {
    id: 1,
    title: 'Reactの勉強',
    priority: 3,
    dueDate: '2026-11-25T17:00',
    completed: false,
  },
  {
    id: 2,
    title: '部屋の掃除',
    priority: 2,
    dueDate: '2026-11-11T12:00',
    completed: false,
  },
  {
    id: 3,
    title: '買い物',
    priority: 1,
    dueDate: null,
    completed: true,
  },
]

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos')

    if (savedTodos) {
      try {
        return JSON.parse(savedTodos) as Todo[]
      } catch {
        console.error('Todoデータの読み込みに失敗しました。')
      }
    }

    return initialTodos
  })

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  // モーダルの表示状態
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 編集対象のTodo
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)

  const [sortType, setSortType] = useState<'priority' | 'deadline'>('priority')

  // 新規作成画面を開く
  const openNewModal = () => {
    setEditingTodo(null)
    setIsModalOpen(true)
  }

  // 編集画面を開く
  const openEditModal = (todo: Todo) => {
    setEditingTodo(todo)
    setIsModalOpen(true)
  }

  // モーダルを閉じる
  const closeModal = () => {
    setIsModalOpen(false)
    setEditingTodo(null)
  }

  const sortedTodos = [...todos].sort((a, b) => {
    if (sortType === 'priority') {
      return b.priority - a.priority
    }

    if (a.dueDate === null) return 1
    if (b.dueDate === null) return -1

    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  })

  // Todoを保存する
  const saveTodo = (data: {
    title: string
    priority: number
    dueDate: string | null
  }) => {
    if (editingTodo) {
      // 既存Todoの編集
      setTodos((currentTodos) =>
        currentTodos.map((todo) =>
          todo.id === editingTodo.id
            ? { ...todo, ...data }
            : todo
        )
      )
    } else {
      // 新しいTodoの追加
      const newTodo: Todo = {
        id: Date.now(),
        ...data,
        completed: false,
      }

      setTodos((currentTodos) => [...currentTodos, newTodo])
    }

    closeModal()
  }

  // Todoの完了状態を切り替える
  const toggleTodo = (id: number) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    )
  }

  const deleteTodo = (id: number) => {
    setTodos((currentTodos) =>
      currentTodos.filter((todo) => todo.id !== id)
    )
  }

  const deleteCompletedTodos = () => {
    setTodos((currentTodos) =>
      currentTodos.filter((todo) => !todo.completed)
    )
  }

  // 期限を表示用の文字列に変換する
  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date))
  }

  // 期限切れかどうかを判定する
  const isOverdue = (todo: Todo) => {
    return (
      todo.dueDate !== null &&
      new Date(todo.dueDate).getTime() < Date.now() &&
      !todo.completed
    )
  }

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <h1>TodoApp</h1>
          <p>日々のタスクをシンプルに管理</p>
        </div>

        <button className="add-button" onClick={openNewModal}>
          + Todo追加
        </button>
      </header>

      <section className="todo-section">
        <div className="todo-heading">
          <h2>Todo List</h2>
          <span>{todos.length}件</span>

          <select
            className="sort-select"
            value={sortType}
            onChange={(event) =>
              setSortType(event.target.value as 'priority' | 'deadline')
            }
          >
            <option value="priority">優先度順</option>
            <option value="deadline">期限順</option>
          </select>

          <button
            className="delete-completed-button"
            onClick={deleteCompletedTodos}
            disabled={!todos.some((todo) => todo.completed)}
          >
            完了済みを一括削除
          </button>
        </div>

        <div className="todo-list">
          {sortedTodos.map((todo) => (
            <div
              className={`todo-item ${todo.completed ? 'completed' : ''}`}
              key={todo.id}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                aria-label={`${todo.title}を完了にする`}
              />

              <div className="todo-content">
                <p className="todo-title">{todo.title}</p>

                <div className="todo-details">
                  <span className="priority">
                    優先度
                    <span className="stars">
                      {'★'.repeat(todo.priority)}
                      {'☆'.repeat(3 - todo.priority)}
                    </span>
                  </span>

                  {todo.dueDate ? (
                    <span
                      className={
                        isOverdue(todo) ? 'due-date overdue' : 'due-date'
                      }
                    >
                      {isOverdue(todo) ? '期限切れ：' : ''}
                      {formatDate(todo.dueDate)}
                    </span>
                  ) : (
                    <span className="no-deadline">期限なし</span>
                  )}
                </div>
              </div>

              <button
                className="edit-button"
                onClick={() => openEditModal(todo)}
              >
                編集
              </button>
              <button
                className="delete-button"
                onClick={() => deleteTodo(todo.id)}
              >
                削除
              </button>
            </div>
          ))}
        </div>
      </section>

      {isModalOpen && (
        <TodoModal
          initialTodo={editingTodo}
          onSave={saveTodo}
          onClose={closeModal}
        />
      )}
    </main>
  )
}

export default App
