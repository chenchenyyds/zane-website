'use client'

import { useState, useRef, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

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
    const beforeCursor = content.substring(0, selectionStart)
    const afterCursor = content.substring(selectionEnd)
    const lineStart = content.lastIndexOf('\n', selectionStart - 1) + 1
    const currentLine = content.substring(lineStart, selectionStart)

    // Ctrl+B 加粗
    if (e.ctrlKey && e.key === 'b') {
      e.preventDefault()
      const selectedText = content.substring(selectionStart, selectionEnd)
      const newText = `**${selectedText || '粗体文本'}**`
      setContent(beforeCursor + newText + afterCursor)
      return
    }

    // Ctrl+I 斜体
    if (e.ctrlKey && e.key === 'i') {
      e.preventDefault()
      const selectedText = content.substring(selectionStart, selectionEnd)
      const newText = `*${selectedText || '斜体文本'}*`
      setContent(beforeCursor + newText + afterCursor)
      return
    }

    // Ctrl+K 链接
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault()
      const selectedText = content.substring(selectionStart, selectionEnd)
      const newText = `[${selectedText || '链接文本'}](url)`
      setContent(beforeCursor + newText + afterCursor)
      return
    }

    // Tab 缩进
    if (e.key === 'Tab') {
      e.preventDefault()
      const newContent = beforeCursor + '  ' + afterCursor
      setContent(newContent)
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 2
      }, 0)
      return
    }

    // Enter - 智能处理
    if (e.key === 'Enter') {
      // 无序列表续行
      const unorderedMatch = currentLine.match(/^(\s*)([-*+])\s/)
      if (unorderedMatch) {
        e.preventDefault()
        const indent = unorderedMatch[1]
        const marker = unorderedMatch[2]
        const lineContent = currentLine.substring(unorderedMatch[0].length)
        
        if (!lineContent.trim()) {
          setContent(beforeCursor.slice(0, lineStart) + '\n' + afterCursor)
          setTimeout(() => { textarea.selectionStart = textarea.selectionEnd = lineStart + 1 }, 0)
        } else {
          const newContent = beforeCursor + '\n' + indent + marker + ' ' + afterCursor
          setContent(newContent)
          setTimeout(() => { textarea.selectionStart = textarea.selectionEnd = selectionStart + indent.length + marker.length + 2 }, 0)
        }
        return
      }

      // 有序列表续行
      const orderedMatch = currentLine.match(/^(\s*)(\d+)\.\s/)
      if (orderedMatch) {
        e.preventDefault()
        const indent = orderedMatch[1]
        const num = parseInt(orderedMatch[2]) + 1
        const lineContent = currentLine.substring(orderedMatch[0].length)
        
        if (!lineContent.trim()) {
          setContent(beforeCursor.slice(0, lineStart) + '\n' + afterCursor)
          setTimeout(() => { textarea.selectionStart = textarea.selectionEnd = lineStart + 1 }, 0)
        } else {
          const newContent = beforeCursor + '\n' + indent + num + '. ' + afterCursor
          setContent(newContent)
          setTimeout(() => { textarea.selectionStart = textarea.selectionEnd = selectionStart + indent.length + num.toString().length + 3 }, 0)
        }
        return
      }

      // 代码块内换行
      const codeBlockStart = beforeCursor.lastIndexOf('```')
      const lastNewline = beforeCursor.lastIndexOf('\n')
      if (codeBlockStart > lastNewline && codeBlockStart !== -1) {
        e.preventDefault()
        const newContent = beforeCursor + '\n' + afterCursor
        setContent(newContent)
        setTimeout(() => { textarea.selectionStart = textarea.selectionEnd = selectionStart + 1 }, 0)
        return
      }
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

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert('请输入标题')
      return
    }
    await onSave({ title, content, tags, is_public: isPublic })
  }

  const CodeBlock = ({ children, className, ...props }: any) => {
    const [copied, setCopied] = useState(false)
    const code = String(children).replace(/\n$/, '')
    
    const handleCopy = async () => {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }

    return (
      <div className='relative group'>
        <pre className='!bg-gray-900 !text-gray-100 p-4 rounded-lg overflow-x-auto text-sm' {...props}>
          {children}
        </pre>
        <button
          onClick={handleCopy}
          className='absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity'
        >
          {copied ? '已复制!' : '复制'}
        </button>
      </div>
    )
  }

  return (
    <div className='min-h-screen flex flex-col' style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {/* 顶部导航 */}
      <div className='border-b flex-shrink-0' style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
        <div className='max-w-7xl mx-auto px-4 py-3 flex items-center justify-end gap-3'>
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
              className='w-full min-h-[500px] border-0 focus:ring-0 p-0 resize-none text-base leading-relaxed bg-transparent font-mono'
              style={{ color: 'var(--foreground)' }}
              placeholder='开始写作...'
            />
          </div>
        </div>

        {/* 右侧预览 */}
        {showPreview && (
          <div className='flex-1 p-6 overflow-auto' style={{ backgroundColor: 'var(--background)' }}>
            <div className='max-w-3xl mx-auto'>
              <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>{title || '无标题'}</h1>
              <div className='prose-content'>
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]} 
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    pre: CodeBlock,
                    code: ({ className, children, ...props }: any) => {
                      if (className) {
                        return <code className={className} {...props}>{children}</code>
                      }
                      return <code style={{ backgroundColor: 'var(--muted)', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', fontSize: '0.875rem', fontFamily: 'monospace' }}>{children}</code>
                    }
                  }}
                >
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
                <button type='button' onClick={() => setTags(tags.filter(t => t !== tag))} className='hover:opacity-70'>×</button>
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
            <input type='checkbox' checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className='rounded' />
            公开
          </label>
        </div>
      </div>
    </div>
  )
}
