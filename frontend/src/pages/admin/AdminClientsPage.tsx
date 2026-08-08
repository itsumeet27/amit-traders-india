import { useEffect, useState, type FormEvent } from 'react'
import { Seo } from '@/components/Seo'
import { PageHeader, DataTable } from '@/components/admin/DataTable'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { LoadingSpinner, EmptyState } from '@/components/ui/Feedback'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { clientService } from '@/services/clientService'
import type { Client, ClientPayload } from '@/types'
import { getErrorMessage } from '@/utils'
import { useToast } from '@/context/ToastContext'

const blank: ClientPayload = {
  companyName: '',
  logoUrl: '',
  description: '',
  displayOrder: 0,
  active: true,
}

export function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<ClientPayload>(blank)
  const [editId, setEditId] = useState<number | null>(null)
  const [open, setOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const { push } = useToast()

  async function load() {
    setLoading(true)
    try {
      setClients(await clientService.getAdmin())
    } catch (error) {
      push(getErrorMessage(error), 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  function openCreate() {
    setEditId(null)
    setForm(blank)
    setOpen(true)
  }

  function openEdit(client: Client) {
    setEditId(client.id)
    setForm({
      companyName: client.companyName,
      logoUrl: client.logoUrl || '',
      description: client.description || '',
      displayOrder: client.displayOrder ?? 0,
      active: client.active !== false,
    })
    setOpen(true)
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      if (editId != null) await clientService.update(editId, form)
      else await clientService.create(form)
      push(editId != null ? 'Client updated' : 'Client created', 'success')
      setOpen(false)
      await load()
    } catch (error) {
      push(getErrorMessage(error), 'error')
    } finally {
      setSaving(false)
    }
  }

  async function confirmDelete() {
    if (deleteId == null) return
    setSaving(true)
    try {
      await clientService.remove(deleteId)
      push('Client deleted', 'success')
      setDeleteId(null)
      await load()
    } catch (error) {
      push(getErrorMessage(error), 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Seo title="Admin Clients" path="/admin/clients" noIndex />
      <PageHeader
        title="Clients"
        description="Logos shown on the public clients section."
        actions={
          <Button size="sm" onClick={openCreate}>
            Add client
          </Button>
        }
      />

      {loading ? (
        <LoadingSpinner />
      ) : clients.length ? (
        <DataTable headers={['Company', 'Order', 'Active', '']}>
          {clients.map((client) => (
            <tr key={client.id} className="hover:bg-cream/40">
              <td className="px-4 py-3 font-medium text-primary">{client.companyName}</td>
              <td className="px-4 py-3">{client.displayOrder}</td>
              <td className="px-4 py-3">{client.active === false ? 'No' : 'Yes'}</td>
              <td className="space-x-3 px-4 py-3 text-right text-sm">
                <button type="button" className="text-gold" onClick={() => openEdit(client)}>
                  Edit
                </button>
                <button type="button" className="text-red-800" onClick={() => setDeleteId(client.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </DataTable>
      ) : (
        <EmptyState title="No clients" description="Add partner logos for the public website." />
      )}

      <Modal
        open={open}
        title={editId != null ? 'Edit client' : 'New client'}
        onClose={() => setOpen(false)}
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button form="client-form" type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </>
        }
      >
        <form id="client-form" className="space-y-4" onSubmit={onSubmit}>
          <Input
            label="Company name"
            required
            value={form.companyName}
            onChange={(e) => setForm((prev) => ({ ...prev, companyName: e.target.value }))}
          />
          <Textarea
            label="Description"
            value={form.description || ''}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          />
          <Input
            label="Display order"
            type="number"
            value={form.displayOrder ?? 0}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, displayOrder: Number(e.target.value) }))
            }
          />
          <ImageUpload
            label="Logo"
            value={form.logoUrl || ''}
            onChange={(url) => setForm((prev) => ({ ...prev, logoUrl: url }))}
            folder="clients"
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.active !== false}
              onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.checked }))}
            />
            Active
          </label>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteId != null}
        title="Delete client"
        message="Remove this client from the public website?"
        confirmLabel="Delete"
        loading={saving}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => void confirmDelete()}
      />
    </>
  )
}
