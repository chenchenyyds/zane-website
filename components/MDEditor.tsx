'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MDEditorProps {
  initialTitle?: string
  initialContent?: string
  initialTags?: string[]
  initialIsPublic?: boolean
  onSave: (data: { title: string; content: string; tags: string[]; is_public: boolean }) => Promise<void>
  saving?: boolean
}

export default function MDEditor({ 
  initialTitle = '', 
  initialContent = '', 
  initialTags = [], 
  initialIsPublic = true,
  onSave,
  saving = false 
}: MDEditorProps) {
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [tags, setTags] = useState<string[]>(initialTags)
  const [tagInput, setTagInput] = useState('')
  const [isPublic, setIsPublic] = useState(initialIsPublic)
  const [showPreview, setShowPreview] = useState(true)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 快捷键处理
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const { selectionStart, selectionEnd } = textarea
    const lineStart = content.lastIndexOf('\n', selectionStart - 1) + 1
    const currentLine = content.substring(lineStart, selectionStart)

    // Ctrl+B 加粗
    if (e.ctrlKey && e.key === 'b') {
      e.preventDefault()
      const selectedText = content.substring(selectionStart, selectionEnd)
      const newText = `**${selectedText || '粗体文本'}**`
      const newContent = content.substring(0, selectionStart) + newText + content.substring(selectionEnd)
      setContent(newContent)
      return
    }

    // Ctrl+I 斜体
    if (e.ctrlKey && e.key === 'i') {
      e.preventDefault()
      const selectedText = content.substring(selectionStart, selectionEnd)
      const newText = `*${selectedText || '斜体文本'}*`
      const newContent = content.substring(0, selectionStart) + newText + content.substring(selectionEnd)
      setContent(newContent)
      return
    }

    // Ctrl+K 链接
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault()
      const selectedText = content.substring(selectionStart, selectionEnd)
      const newText = `[${selectedText || '链接文本'}](url)`
      const newContent = content.substring(0, selectionStart) + newText + content.substring(selectionEnd)
      setContent(newContent)
      return
    }

    // Tab 缩进
    if (e.key === 'Tab') {
      e.preventDefault()
      e.preventDefault()
      const newContent = content.substring(0, selectionStart) + '  ' + content.substring(selectionEnd)
      setContent(newContent)
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 2
      }, 0)
      return
    }

    // Enter - 智能列表续行
    if (e.key === 'Enter') {
      const unorderedMatch = currentLine.match(/^(\s*)([-*+])\s/)
      const orderedMatch = currentLine.match(/^(\s*)(\d+)\.\s/)

      if (unorderedMatch) {
        e.preventDefault()
        const indent = unorderedMatch[1]
        const marker = unorderedMatch[2]
        // 如果当前行只有列表标记，内容为空，则取消列表
        const lineContent = currentLine.substring(unorderedMatch[0].length)
        if (!lineContent.trim()) {
          const newContent = content.substring(0, lineStart) + '\n' + content.substring(selectionStart)
          setContent(newContent)
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = lineStart + 1
          }, 0)
        } else {
          const newContent = content.substring(0, selectionStart) + '\n' + indent + marker + ' ' + content.substring(selectionStart)
          setContent(newContent)
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = selectionStart + indent.length + marker.length + 2
          }, 0)
        }
        return
      }

      if (orderedMatch) {
        e.preventDefault()
        const indent = orderedMatch[1]
        const num = parseInt(orderedMatch[2]) + 1
        // 如果当前行只有列表标记，内容为空，则取消列表
        const lineContent = currentLine.substring(orderedMatch[0].length)
        if (!lineContent.trim()) {
          const newContent = content.substring(0, lineStart) + '\n' + content.substring(selectionStart)
          setContent(newContent)
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = lineStart + 1
          }, 0)
        } else {
          const newContent = content.substring(0, selectionStart) + '\n' + indent + num + '. ' + content.substring(selectionStart)
          setContent(newContent)
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = selectionStart + indent.length + num.toString().length + 3
          }, 0)
        }
        return
      }

      // 普通回车 - 正常换行，不保存
      return
    }
  }, [content])

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const newTag = tagInput.trim()
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag])
        setTagInput('')
      }
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert('请输入标题')
      return
    }
    await onSave({ title, content, tags, is_public: isPublic })
  }

  const components = {
    h1: (props: any) => <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem' }} {...props} />,
    h2: (props: any) => <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '1rem', marginBottom: '0.5rem' }} {...props} />,
    h3: (props: any) => <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '0.75rem', marginBottom: '0.5rem' }} {...props} />,
    p: (props: any) => <p style={{ marginBottom: '0.5rem', lineHeight: 1.7 }} {...props} />,
    ul: (props: any) => <ul style={{ marginBottom: '0.5rem', paddingLeft: '1.5rem', listStyle: 'disc' }} {...props} />,
    ol: (props: any) => <ol style={{ marginBottom: '0.5rem', paddingLeft: '1.5rem', listStyle: 'decimal' }} {...props} />,
    li: (props: any) => <li style={{ marginBottom: '0.25rem' }} {...props} />,
    blockquote: (props: any) => <blockquote style={{ borderLeft: '3px solid #d1d5db', paddingLeft: '1rem', margin: '0.5rem 0', color: '#6b7280' }} {...props} />,
    code: ({ className, children, ...props }: any) => !className ? <code style={{ backgroundColor: 'var(--muted)', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', fontSize: '0.875rem', fontFamily: 'monospace' }}>{children}</code> : <code style={{ fontFamily: 'monospace', fontSize: '0.875rem' }} {...props}>{children}</code>,
    pre: (props: any) => <pre style={{ backgroundColor: '#1f2937', color: '#f3f4f6', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto', margin: '0.5rem 0' }} {...props} />,
  }

  return (
    <div className='min-h-screen flex flex-col' style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {/* 顶部导航 */}
      <div className='border-b flex-shrink-0' style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
        <div className='max-w-7xl mx-auto px-4 py-3 flex items-center justify-between'>
          <span className='text-sm' style={{ color: 'var(--foreground)' }}>Markdown 编辑器</span>
          <div className='flex items-center gap-3'>
            <span className='text-xs px-2 py-1 rounded' style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>
              Ctrl+B 加粗 | Ctrl+I 斜体 | Ctrl+K 链接
            </span>
            <button 
              type='button' 
              onClick={() => setShowPreview(!showPreview)} 
              className='px-3 py-1.5 text-sm border rounded-md hover:opacity-80'
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
            >
              {showPreview ? '隐藏预览' : '显示预览'}
            </button>
            <button 
              onClick={handleSubmit} 
              disabled={saving}
              className='px-4 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50'
            >
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        </div>
      </div>

      {/* 编辑区域 */}
      <div className='flex-1 flex overflow-hidden'>
        {/* 左侧编辑 */}
        <div className={`flex-1 p-6 overflow-auto ${showPreview ? 'border-r' : ''}`} style={{ borderColor: 'var(--border)' }}>
          <div className='max-w-3xl mx-auto'>
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='w-full text-3xl font-bold border-0 focus:ring-0 p-0 mb-6 bg-transparent'
              style={{ backgroundColor: 'transparent', color: 'var(--foreground)' }}
              placeholder='标题'
            />
            
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className='w-full min-h-[500px] border-0 focus:ring-0 p-0 resize-none text-base leading-relaxed bg-transparent'
              style={{ color: 'var(--foreground)' }}
              placeholder='开始写作...

支持 Markdown 语法：
- **加粗** Ctrl+B
- *斜体* Ctrl+I
- [链接](url) Ctrl+K
- 列表自动续行'
            />
          </div>
        </div>

        {/* 右侧预览 */}
        {showPreview && (
          <div className='flex-1 p-6 overflow-auto' style={{ backgroundColor: 'var(--background)' }}>
            <div className='max-w-3xl mx-auto'>
              <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>{title || '无标题'}</h1>
              <div className='prose-content'>
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
                  {content || '*暂无内容*'}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 底部工具栏 */}
      <div className='border-t flex-shrink-0 px-4 py-3' style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
        <div className='max-w-7xl mx-auto flex items-center gap-4'>
          <div className='flex items-center gap-2 flex-wrap'>
            <span className='text-xs' style={{ color: 'var(--foreground)' }}>标签：</span>
            {tags.map(tag => (
              <span key={tag} className='inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs' style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>
                {tag}
                <button type='button' onClick={() => removeTag(tag)} className='hover:opacity-70'>×</button>
              </span>
            ))}
            <input
              type='text'
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
              className='w-24 text-xs border-0 focus:ring-0 p-0 bg-transparent'
              style={{ color: 'var(--foreground)' }}
              placeholder='添加标签'
            />
          </div>
          <div className='w-px h-4' style={{ backgroundColor: 'var(--border)' }} />
          <label className='flex items-center gap-2 text-xs cursor-pointer' style={{ color: 'var(--foreground)' }}>
            <input
              type='checkbox'
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className='rounded'
            />
            公开
          </label>
        </div>
      </div>
    </div>
  )
}
