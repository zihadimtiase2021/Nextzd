'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Trash2, Edit2, Plus, X, Check, Upload, Image, ExternalLink,
  Code, Loader2, Star, TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Project {
  id: string
  title: string
  description: string
  category: string
  image?: string
  tech: string[]
  results: Record<string, string>
  link?: string
  github?: string
  featured: boolean
}

const EMPTY: Omit<Project, 'id'> = {
  title: '',
  description: '',
  category: 'development',
  image: '',
  tech: [],
  results: { result: '' },
  link: '',
  github: '',
  featured: false,
}

const CATEGORIES = ['development', 'webflow', 'design', 'marketing']

type Toast = { id: number; msg: string; ok: boolean }

export function PortfolioManager() {
  const [projects, setProjects] = useState<Project[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<Project, 'id'>>(EMPTY)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [techInput, setTechInput] = useState('')
  const [resultKey, setResultKey] = useState('')
  const [resultVal, setResultVal] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => { fetchProjects() }, [])

  function addToast(msg: string, ok = true) {
    const id = Date.now()
    setToasts((t) => [...t, { id, msg, ok }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000)
  }

  async function fetchProjects() {
    try {
      const res = await fetch('/api/portfolio')
      const data = await res.json()
      setProjects(data.projects || [])
    } catch {
      addToast('Failed to load projects', false)
    } finally {
      setLoading(false)
    }
  }

  function set(key: string, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function openNew() {
    setEditingId(null)
    setForm(EMPTY)
    setTechInput('')
    setResultKey('')
    setResultVal('')
    setShowForm(true)
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
  }

  function openEdit(project: Project) {
    setEditingId(project.id)
    setForm({ ...project })
    setTechInput(Array.isArray(project.tech) ? project.tech.join(', ') : '')
    const firstEntry = Object.entries(project.results ?? {})[0]
    setResultKey(firstEntry?.[0] ?? '')
    setResultVal(firstEntry?.[1] ?? '')
    setShowForm(true)
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
  }

  async function handleUpload(file: File) {
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.success) {
        set('image', data.url)
        addToast('Image uploaded')
      } else {
        addToast('Upload failed', false)
      }
    } catch {
      addToast('Upload failed', false)
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const techArray = techInput.split(',').map((t) => t.trim()).filter(Boolean)
    const results = resultKey.trim() ? { [resultKey.trim()]: resultVal.trim() } : {}
    const payload = { ...form, tech: techArray, results }

    try {
      const method = editingId ? 'PUT' : 'POST'
      const body = editingId ? { id: editingId, updates: payload } : payload
      const res = await fetch('/api/portfolio', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        addToast(editingId ? 'Project updated' : 'Project added')
        fetchProjects()
        closeForm()
      } else {
        addToast('Save failed', false)
      }
    } catch {
      addToast('Save failed', false)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch('/api/portfolio', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        addToast('Project deleted')
        setProjects((prev) => prev.filter((p) => p.id !== id))
      } else {
        addToast('Delete failed', false)
      }
    } catch {
      addToast('Delete failed', false)
    } finally {
      setDeleteConfirm(null)
    }
  }

  return (
    <div className="relative">
      {/* Toast stack */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg pointer-events-auto',
              t.ok ? 'bg-foreground text-background' : 'bg-destructive text-white'
            )}
          >
            {t.msg}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Portfolio Projects</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {projects.length} {projects.length === 1 ? 'project' : 'projects'} total
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
          style={{ backgroundColor: '#f4a295', color: '#1a1a1a' }}
        >
          <Plus size={16} />
          Add Project
        </button>
      </div>

      {/* Form panel */}
      {showForm && (
        <div
          ref={formRef}
          className="mb-6 rounded-2xl border border-border bg-card overflow-hidden"
        >
          <div
            className="flex items-center justify-between px-5 py-4 border-b border-border"
            style={{ background: '#f4a29510' }}
          >
            <h3 className="font-semibold text-foreground text-sm">
              {editingId ? 'Edit Project' : 'Add New Project'}
            </h3>
            <button
              onClick={closeForm}
              className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X size={15} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Category + Featured */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={form.category}
                    onChange={(e) => set('category', e.target.value)}
                    className="w-full appearance-none px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand pr-8"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                  <Code size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col justify-end pb-0.5">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Featured
                </label>
                <button
                  type="button"
                  onClick={() => set('featured', !form.featured)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all',
                    form.featured
                      ? 'border-transparent'
                      : 'border-border text-muted-foreground'
                  )}
                  style={form.featured ? { backgroundColor: '#f4a29520', color: '#f4a295', borderColor: '#f4a29540' } : {}}
                >
                  <Star size={13} fill={form.featured ? '#f4a295' : 'none'} style={{ color: form.featured ? '#f4a295' : undefined }} />
                  Featured
                </button>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Project Title <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="e.g. SaaS Landing Page for TechStart"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="What did you build and what problem did it solve?"
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand resize-none"
              />
            </div>

            {/* Technologies */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Technologies <span className="text-xs font-normal normal-case text-muted-foreground">(comma-separated)</span>
              </label>
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="React, Webflow, TailwindCSS, Stripe"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
              />
              {/* Live tag preview */}
              {techInput.trim() && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {techInput.split(',').map((t) => t.trim()).filter(Boolean).map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-full text-[11px] bg-muted text-muted-foreground">{t}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Key result */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Key Result <span className="text-xs font-normal normal-case text-muted-foreground">(shown as metric badge)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={resultKey}
                  onChange={(e) => setResultKey(e.target.value)}
                  placeholder="Conversions"
                  className="w-2/5 px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                />
                <input
                  type="text"
                  value={resultVal}
                  onChange={(e) => setResultVal(e.target.value)}
                  placeholder="+40% increase"
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                />
              </div>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Live URL
                </label>
                <div className="relative">
                  <ExternalLink size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="url"
                    value={form.link || ''}
                    onChange={(e) => set('link', e.target.value)}
                    placeholder="https://example.com"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  GitHub URL
                </label>
                <div className="relative">
                  <Code size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="url"
                    value={form.github || ''}
                    onChange={(e) => set('github', e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                  />
                </div>
              </div>
            </div>

            {/* Image upload */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Project Screenshot
              </label>
              <div
                className={cn(
                  'relative border-2 border-dashed rounded-xl transition-colors cursor-pointer',
                  uploading ? 'border-brand/40 bg-brand/5' : 'border-border hover:border-brand/40 hover:bg-muted/40'
                )}
                onClick={() => !uploading && !form.image && fileRef.current?.click()}
              >
                {form.image ? (
                  <div className="relative">
                    <img src={form.image} alt="Preview" className="w-full max-h-40 rounded-xl object-cover" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); set('image', '') }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                    >
                      <X size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); fileRef.current?.click() }}
                      className="absolute bottom-2 right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 text-white text-xs hover:bg-black/80 transition-colors"
                    >
                      <Upload size={12} />
                      Replace
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 py-7 text-muted-foreground">
                    {uploading ? (
                      <Loader2 size={24} className="animate-spin" style={{ color: '#f4a295' }} />
                    ) : (
                      <>
                        <Image size={24} />
                        <span className="text-xs">Click to upload screenshot</span>
                      </>
                    )}
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
                style={{ backgroundColor: '#f4a295', color: '#1a1a1a' }}
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                {editingId ? 'Save changes' : 'Add project'}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="px-5 py-2.5 rounded-xl text-sm font-medium border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects list */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-16 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3 rounded-2xl border border-dashed border-border">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <Plus size={20} className="text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No projects yet. Add your first one!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map((project) => {
            const isDeleting = deleteConfirm === project.id
            return (
              <div
                key={project.id}
                className={cn(
                  'group flex items-center gap-3 px-4 py-3 rounded-xl border transition-all',
                  isDeleting
                    ? 'border-destructive/40 bg-destructive/5'
                    : 'border-border bg-card hover:border-border/80 hover:bg-muted/30'
                )}
              >
                {/* Thumbnail or placeholder */}
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-10 h-10 rounded-lg object-cover shrink-0 border border-border"
                  />
                ) : (
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border border-border"
                    style={{ backgroundColor: '#f4a29515' }}
                  >
                    <TrendingUp size={16} style={{ color: '#f4a295' }} />
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground truncate">{project.title}</p>
                    {project.featured && (
                      <Star size={11} fill="#f4a295" style={{ color: '#f4a295' }} className="shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground capitalize">
                    {project.category}
                    {project.tech?.length > 0 && ` · ${project.tech.slice(0, 2).join(', ')}`}
                  </p>
                </div>

                {/* Actions */}
                {isDeleting ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground">Delete?</span>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="px-3 py-1.5 rounded-lg bg-destructive text-white text-xs font-semibold hover:opacity-90"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(project)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      aria-label="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(project.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      aria-label="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
